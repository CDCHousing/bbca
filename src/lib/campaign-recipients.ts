import { prisma } from "@/lib/prisma";
import { SERIAL_ORDER_BY } from "@/lib/membership-serial";

/**
 * Audiences a bulk email can be addressed to.
 *
 * There is deliberately no Member model — a "member" is a MembershipApplication
 * row with status = APPROVED, so approving an application is what adds someone
 * to the mailing list.
 *
 * REJECTED applications are not a source and can never be resolved here, so a
 * crafted request cannot reach them.
 */
export const RECIPIENT_SOURCES = [
  "members",
  "pending",
  "seat-bookings",
  "stall-bookings",
  "visitors",
] as const;

export type RecipientSource = (typeof RECIPIENT_SOURCES)[number];

export const SOURCE_LABELS: Record<RecipientSource, string> = {
  members: "Approved members",
  pending: "Pending applicants",
  "seat-bookings": "Seat bookings",
  "stall-bookings": "Stall bookings",
  visitors: "Visitor registrations",
};

export function isRecipientSource(value: string): value is RecipientSource {
  return (RECIPIENT_SOURCES as readonly string[]).includes(value);
}

export interface ResolvedRecipient {
  email: string;
  name: string;
  organization: string;
}

/** Basic shape check — the stored values came from public forms. */
function isPlausibleEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Drops blank/malformed addresses and collapses duplicates on the lowercased
 * email, keeping the first occurrence (sources are queried in a stable order).
 */
export function dedupe(recipients: ResolvedRecipient[]): ResolvedRecipient[] {
  const seen = new Map<string, ResolvedRecipient>();
  for (const r of recipients) {
    const email = r.email.trim().toLowerCase();
    if (!isPlausibleEmail(email) || seen.has(email)) continue;
    seen.set(email, {
      email,
      name: r.name.trim(),
      organization: r.organization.trim(),
    });
  }
  return [...seen.values()];
}

async function loadSource(source: RecipientSource): Promise<ResolvedRecipient[]> {
  switch (source) {
    case "members":
    case "pending": {
      const rows = await prisma.membershipApplication.findMany({
        where: { status: source === "members" ? "APPROVED" : "PENDING" },
        orderBy: SERIAL_ORDER_BY,
        select: { email: true, contactName: true, businessName: true },
      });
      return rows.map((r) => ({
        email: r.email,
        name: r.contactName,
        organization: r.businessName,
      }));
    }
    case "seat-bookings": {
      const rows = await prisma.seatBooking.findMany({
        orderBy: { createdAt: "asc" },
        select: { email: true, name: true, organization: true },
      });
      return rows;
    }
    case "stall-bookings": {
      const rows = await prisma.stallBooking.findMany({
        orderBy: { createdAt: "asc" },
        select: { email: true, name: true, organization: true },
      });
      return rows;
    }
    case "visitors": {
      const rows = await prisma.visitorRegistration.findMany({
        orderBy: { createdAt: "asc" },
        select: { email: true, name: true, profession: true },
      });
      return rows.map((r) => ({
        email: r.email,
        name: r.name,
        organization: r.profession,
      }));
    }
  }
}

/** Every deduped address reachable through the given sources. */
export async function resolvePool(
  sources: RecipientSource[]
): Promise<ResolvedRecipient[]> {
  const unique = [...new Set(sources)];
  const lists = await Promise.all(unique.map(loadSource));
  return dedupe(lists.flat());
}

/**
 * The pool narrowed to the addresses the admin actually ticked. Selection is
 * intersected with the pool rather than trusted, so the name/organisation
 * snapshot always comes from the database and off-pool addresses are dropped.
 */
export async function resolveSelection(
  sources: RecipientSource[],
  emails: string[]
): Promise<ResolvedRecipient[]> {
  const pool = await resolvePool(sources);
  const wanted = new Set(emails.map((e) => e.trim().toLowerCase()));
  return pool.filter((r) => wanted.has(r.email));
}

/** e.g. "Approved members, Visitor registrations (142 recipients)" */
export function buildAudienceLabel(
  sources: RecipientSource[],
  count: number
): string {
  const names = [...new Set(sources)].map((s) => SOURCE_LABELS[s]).join(", ");
  return `${names} (${count} recipient${count === 1 ? "" : "s"})`;
}
