/** Badge colours shared by the campaign list and the campaign detail screen. */
export const CAMPAIGN_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENDING: "bg-blue-100 text-blue-800",
  SENT: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export const RECIPIENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SENT: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export const SOURCE_TABS = [
  { value: "members", label: "Members" },
  { value: "pending", label: "Pending applicants" },
  { value: "seat-bookings", label: "Seat bookings" },
  { value: "stall-bookings", label: "Stall bookings" },
  { value: "visitors", label: "Visitors" },
] as const;

export type SourceTab = (typeof SOURCE_TABS)[number]["value"];
