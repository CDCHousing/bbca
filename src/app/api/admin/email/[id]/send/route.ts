import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { sendCampaign } from "@/lib/campaign-email";

// Batching plus the inter-chunk delay needs far longer than the default budget.
export const maxDuration = 300;

/**
 * A campaign left in SENDING keeps its updatedAt fresh while a run is alive
 * (counters are written after every chunk). If it has gone stale, the previous
 * run died — a timeout, a redeploy — and the campaign is safe to resume.
 */
const STALE_SENDING_MS = 5 * 60 * 1000;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id },
    select: { id: true, status: true, updatedAt: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    campaign.status === "SENDING" &&
    Date.now() - campaign.updatedAt.getTime() < STALE_SENDING_MS
  ) {
    return NextResponse.json(
      {
        error:
          "This campaign is already sending. Wait for the current run to finish before sending again.",
      },
      { status: 409 }
    );
  }

  const pending = await prisma.emailRecipient.count({
    where: { campaignId: id, status: "PENDING" },
  });
  if (pending === 0) {
    return NextResponse.json(
      {
        error:
          "Every recipient has already been processed. Use Retry failed to re-send failures.",
      },
      { status: 409 }
    );
  }

  const result = await sendCampaign(id);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (result.skipped) {
    return NextResponse.json(
      {
        ...result,
        message:
          "RESEND_API_KEY is not set, so nothing was sent. The campaign is unchanged.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(result);
}
