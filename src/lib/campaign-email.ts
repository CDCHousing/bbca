import { prisma } from "@/lib/prisma";
import {
  FROM,
  getResendClient,
  renderEmailShell,
  renderTokens,
  renderTokensPlain,
} from "@/lib/email";
import { sanitizeHtml } from "@/lib/sanitize";

/** Resend's batch endpoint accepts at most 100 emails per call. */
export const BATCH_SIZE = 100;

/**
 * Resend's default rate limit is 2 requests/second, so chunks are spaced just
 * over 500ms apart. The published limit is per-second rather than a burst
 * allowance — going faster earns 429s that would mark healthy recipients FAILED.
 */
export const BATCH_DELAY_MS = 550;

/**
 * Stop issuing new chunks past this point and leave the campaign in SENDING.
 * The route's maxDuration is 300s; the gap covers the final DB writes.
 */
const SEND_BUDGET_MS = 240_000;

export interface CampaignSendResult {
  /** True when RESEND_API_KEY is blank — nothing was sent and nothing was marked. */
  skipped: boolean;
  processed: number;
  sent: number;
  failed: number;
  /** Recipients still PENDING — non-zero means the run hit the time budget. */
  remaining: number;
  status: "DRAFT" | "SENDING" | "SENT" | "FAILED";
}

interface RecipientRow {
  id: string;
  email: string;
  name: string;
  organization: string;
}

export function recipientTokens(r: {
  email: string;
  name: string;
  organization: string;
}): Record<string, string> {
  return {
    name: r.name,
    email: r.email,
    businessName: r.organization,
    organization: r.organization,
  };
}

/** Subject and full branded HTML for one recipient, with {{tokens}} resolved. */
export function renderForRecipient(
  subject: string,
  body: string,
  recipient: { email: string; name: string; organization: string }
): { subject: string; html: string } {
  const tokens = recipientTokens(recipient);
  const renderedSubject = renderTokensPlain(subject, tokens);
  // Sanitise the admin's TipTap HTML first; token values are escaped as they
  // are substituted, so nothing user-supplied can inject markup afterwards.
  const renderedBody = renderTokens(sanitizeHtml(body), tokens);
  return {
    subject: renderedSubject,
    html: renderEmailShell(renderedBody, renderedSubject),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorText(error: unknown): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error.slice(0, 500);
  if (error instanceof Error) return error.message.slice(0, 500);
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message).slice(0, 500);
  }
  return JSON.stringify(error).slice(0, 500);
}

/** Recomputes campaign counters from the recipient rows — accurate after a resume. */
async function syncCounters(campaignId: string): Promise<{
  sent: number;
  failed: number;
  pending: number;
}> {
  const grouped = await prisma.emailRecipient.groupBy({
    by: ["status"],
    where: { campaignId },
    _count: { _all: true },
  });
  const count = (status: string) =>
    grouped.find((g) => g.status === status)?._count._all ?? 0;

  const sent = count("SENT");
  const failed = count("FAILED");

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { sentCount: sent, failedCount: failed },
  });

  return { sent, failed, pending: count("PENDING") };
}

/** Marks every recipient in a chunk FAILED — used when the whole call blows up. */
async function failChunk(rows: RecipientRow[], message: string): Promise<void> {
  await prisma.emailRecipient.updateMany({
    where: { id: { in: rows.map((r) => r.id) } },
    data: { status: "FAILED", error: message },
  });
}

/**
 * Sends (or resumes sending) a campaign, one 100-email batch at a time.
 *
 * Never throws: a provider failure is recorded on the affected recipients and
 * the run continues. Only PENDING recipients are picked up, so calling this
 * again after a timeout resumes rather than double-sending.
 */
export async function sendCampaign(
  campaignId: string
): Promise<CampaignSendResult | null> {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
  });
  if (!campaign) return null;

  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping campaign send.");
    const totals = await syncCounters(campaignId);
    return {
      skipped: true,
      processed: 0,
      sent: totals.sent,
      failed: totals.failed,
      remaining: totals.pending,
      status: campaign.status,
    };
  }

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { status: "SENDING" },
  });

  const startedAt = Date.now();
  let processed = 0;

  for (;;) {
    const rows: RecipientRow[] = await prisma.emailRecipient.findMany({
      where: { campaignId, status: "PENDING" },
      orderBy: { id: "asc" },
      take: BATCH_SIZE,
      select: { id: true, email: true, name: true, organization: true },
    });
    if (rows.length === 0) break;

    const payload = rows.map((row) => {
      const rendered = renderForRecipient(campaign.subject, campaign.body, row);
      return {
        from: FROM,
        to: row.email,
        subject: rendered.subject,
        html: rendered.html,
      };
    });

    try {
      // 'permissive' reports per-email problems instead of rejecting the whole
      // batch, so one bad address cannot take the other 99 down with it.
      const { data, error } = await resend.batch.send(payload, {
        batchValidation: "permissive",
      });

      if (error || !data) {
        await failChunk(rows, errorText(error));
      } else {
        const errors = (data as { errors?: { index: number; message: string }[] })
          .errors;
        const failures = new Map<number, string>(
          (errors ?? []).map((e) => [e.index, e.message])
        );

        const succeededIdx = rows
          .map((_, i) => i)
          .filter((i) => !failures.has(i));
        // Resend returns ids for the accepted emails in input order. Only trust
        // the positional mapping when the counts line up.
        const idsAlign = data.data.length === succeededIdx.length;
        const now = new Date();

        await prisma.$transaction(
          rows.map((row, i) => {
            const failure = failures.get(i);
            if (failure) {
              return prisma.emailRecipient.update({
                where: { id: row.id },
                data: { status: "FAILED", error: failure.slice(0, 500) },
              });
            }
            const providerId = idsAlign
              ? data.data[succeededIdx.indexOf(i)]?.id ?? null
              : null;
            return prisma.emailRecipient.update({
              where: { id: row.id },
              data: {
                status: "SENT",
                error: null,
                providerId,
                sentAt: now,
              },
            });
          })
        );
      }
    } catch (err) {
      console.error("Campaign batch send failed:", err);
      await failChunk(rows, errorText(err));
    }

    processed += rows.length;
    await syncCounters(campaignId);

    // Out of time: leave the campaign SENDING so a later call resumes from the
    // remaining PENDING rows instead of losing the run.
    if (Date.now() - startedAt > SEND_BUDGET_MS) break;
    if (rows.length === BATCH_SIZE) await sleep(BATCH_DELAY_MS);
  }

  const totals = await syncCounters(campaignId);

  let status: CampaignSendResult["status"] = "SENDING";
  if (totals.pending === 0) status = totals.sent > 0 ? "SENT" : "FAILED";

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      status,
      sentAt:
        totals.pending === 0 ? campaign.sentAt ?? new Date() : campaign.sentAt,
    },
  });

  return {
    skipped: false,
    processed,
    sent: totals.sent,
    failed: totals.failed,
    remaining: totals.pending,
    status,
  };
}

/**
 * Puts FAILED recipients back to PENDING so the next send picks them up.
 * Returns how many were reset.
 */
export async function resetFailedRecipients(campaignId: string): Promise<number> {
  const result = await prisma.emailRecipient.updateMany({
    where: { campaignId, status: "FAILED" },
    data: { status: "PENDING", error: null },
  });
  return result.count;
}

/** One-off send used by "Send test to me". Never throws. */
export async function sendTestEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ ok: boolean; skipped: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping test email.");
    return { ok: false, skipped: true };
  }

  // Tokens resolve against placeholder values so the admin can see how the
  // personalised copy reads before committing to a real send.
  const sample = {
    email: to,
    name: "Sample Recipient",
    organization: "Sample Organisation",
  };
  const rendered = renderForRecipient(subject, body, sample);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
    });
    if (error) return { ok: false, skipped: false, error: errorText(error) };
    return { ok: true, skipped: false };
  } catch (err) {
    console.error("Test email failed:", err);
    return { ok: false, skipped: false, error: errorText(err) };
  }
}
