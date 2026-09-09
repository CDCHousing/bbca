import { Resend } from "resend";

// Lazily constructed so a missing key never breaks the build or unrelated routes.
let client: Resend | null = null;

/** Null whenever RESEND_API_KEY is blank — callers must treat that as "skip sending". */
export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export const FROM = process.env.RESEND_FROM_EMAIL ?? "BBCA <onboarding@resend.dev>";

/** Token values come from the public booking form, so they must not carry HTML. */
export function escapeHtml(value: string): string {
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

/**
 * Same substitution as renderTokens but without HTML escaping — for plain-text
 * contexts such as a subject line, where "&amp;" would show up literally.
 */
export function renderTokensPlain(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? values[key] : match
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

/** Contact block shown in the campaign footer. Mirrors the site footer. */
export const CONTACT = {
  org: "British Bangladeshi Construction Association",
  phone: "020 8004 3327",
  email: "contact@bbcauk.org",
  address: "Cranbrook Road, London, IG2 6JZ",
};

/**
 * Letter-style shell for bulk campaigns: no coloured masthead, no card chrome,
 * just text on white with a small contact footer.
 *
 * Gmail scores layout when it picks a tab, and a full-width branded header reads
 * as a newsletter. This is deliberately plain so member mail looks like
 * correspondence. Booking confirmations keep renderEmailShell below.
 */
export function renderPlainEmailShell(innerHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#ffffff;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:600px;margin:0 auto;color:#1f2937;font-size:15px;line-height:1.6">
      ${innerHtml}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #E3E7ED;color:#6E7A8C;font-size:12px;line-height:1.5">
        ${escapeHtml(CONTACT.org)}<br />
        ${escapeHtml(CONTACT.address)}<br />
        ${escapeHtml(CONTACT.phone)} &middot;
        <a href="mailto:${CONTACT.email}" style="color:#6E7A8C">${escapeHtml(
          CONTACT.email
        )}</a>
      </div>
    </div>
  </body>
</html>`;
}

/** Plain-text twin of the footer in renderPlainEmailShell. */
function plainFooter(): string {
  return [
    CONTACT.org,
    CONTACT.address,
    `${CONTACT.phone} · ${CONTACT.email}`,
  ].join("\n");
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&middot;": "·",
  "&mdash;": "—",
  "&ndash;": "–",
};

/**
 * Turns the campaign's sanitised HTML into a plain-text alternative.
 *
 * Sending multipart instead of HTML-only improves spam scoring and stops
 * text-only clients showing markup. Input is already through sanitizeHtml(), so
 * the tag set is the small known list from src/lib/sanitize.ts.
 */
export function htmlToPlainText(html: string): string {
  const text = html
    // Keep link targets — they are invisible once the tags are stripped.
    .replace(
      // [\s\S] rather than the /s flag — the tsconfig target predates es2018.
      /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      (_m, href: string, label: string) => {
        const clean = label.replace(/<[^>]+>/g, "").trim();
        // A mailto:/tel: href carries nothing the label doesn't already show,
        // so print the label alone rather than repeating the address.
        if (/^(mailto|tel):/i.test(href)) {
          return clean || href.replace(/^(mailto|tel):/i, "");
        }
        return clean && clean !== href ? `${clean} (${href})` : href;
      }
    )
    .replace(/<li\b[^>]*>/gi, "\n- ")
    // Bullets stay single-spaced: each <li> already opens with its own newline,
    // so the closing tag must not add a second one. Other blocks get a blank line.
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-4]|blockquote|tr)>/gi, "\n\n")
    .replace(/<\/(ul|ol)>/gi, "\n\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    // Collapse the blank lines the block replacements leave behind.
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return `${text}\n\n--\n${plainFooter()}`;
}

/** Branded HTML shell with a navy masthead — used by booking confirmations. */
export function renderEmailShell(
  innerHtml: string,
  heading: string,
  meta: string[] = []
): string {
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
  const resend = getResendClient();
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
      html: renderEmailShell(body, resource.title, meta),
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
