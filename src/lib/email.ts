import { Resend } from "resend";

// Lazily constructed so a missing key never breaks the build or unrelated routes.
let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "BBCA <onboarding@resend.dev>";

/** Token values come from the public booking form, so they must not carry HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatEventDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Replaces {{token}} placeholders. Unknown tokens are left untouched so typos stay visible. */
export function renderTokens(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? escapeHtml(values[key]) : match
  );
}

interface BookingConfirmationInput {
  to: string;
  resource: {
    title: string;
    location: string | null;
    eventDate: Date | null;
    emailSubject: string | null;
    emailBody: string | null;
  };
  booking: { name: string; organization: string };
}

function defaultBody(): string {
  return `
    <p>Hi {{name}},</p>
    <p>Your seat for <strong>{{title}}</strong> is confirmed. Thank you for registering.</p>
    <p>We look forward to seeing you there.</p>
    <p>— BBCA</p>
  `;
}

function wrap(innerHtml: string, heading: string, meta: string[]): string {
  const metaRows = meta.length
    ? `<table style="margin:0 0 24px;border-collapse:collapse;font-size:14px;color:#414C60">
         ${meta
           .map(
             (row) =>
               `<tr><td style="padding:4px 0;color:#6E7A8C">${row}</td></tr>`
           )
           .join("")}
       </table>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F5F7FA;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden">
      <div style="background:#1B2A52;padding:24px 32px">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">${escapeHtml(
          heading
        )}</h1>
      </div>
      <div style="padding:32px;color:#414C60;font-size:15px;line-height:1.6">
        ${metaRows}
        ${innerHtml}
      </div>
      <div style="padding:16px 32px;background:#F5F7FA;color:#6E7A8C;font-size:12px">
        British Bangladeshi Construction Association
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Sends the applicant's seat confirmation. Never throws — a failed email must not
 * roll back a booking that is already saved. Returns false when nothing was sent.
 */
export async function sendBookingConfirmation({
  to,
  resource,
  booking,
}: BookingConfirmationInput): Promise<boolean> {
  const resend = getClient();
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping booking confirmation email.");
    return false;
  }

  const tokens = {
    name: booking.name,
    organization: booking.organization,
    title: resource.title,
    eventDate: formatEventDate(resource.eventDate),
    location: resource.location ?? "",
  };

  const subject = renderTokens(
    resource.emailSubject?.trim() || "Your seat is confirmed — {{title}}",
    tokens
  );
  const body = renderTokens(resource.emailBody?.trim() || defaultBody(), tokens);

  const meta: string[] = [];
  if (tokens.eventDate) meta.push(`<strong>Date:</strong> ${escapeHtml(tokens.eventDate)}`);
  if (tokens.location) meta.push(`<strong>Location:</strong> ${escapeHtml(tokens.location)}`);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: wrap(body, resource.title, meta),
    });
    if (error) {
      console.error("Resend rejected the booking confirmation:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send booking confirmation:", err);
    return false;
  }
}
