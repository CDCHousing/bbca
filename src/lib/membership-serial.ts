/**
 * Serial numbers are positional, not stored: the oldest application is 00001
 * and every later one counts up from there. Deleting a record renumbers the
 * ones after it, which keeps the sequence gap-free.
 *
 * Pure module — safe to import from client components.
 */
export const SERIAL_ORDER_BY = [
  { createdAt: "asc" as const },
  { id: "asc" as const },
];

export function formatSerial(n: number): string {
  return String(n).padStart(5, "0");
}
