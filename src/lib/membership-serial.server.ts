import { prisma } from "@/lib/prisma";
import { SERIAL_ORDER_BY } from "@/lib/membership-serial";

/** id -> 1-based position across every application (not just the current page). */
export async function getSerialMap(): Promise<Map<string, number>> {
  const all = await prisma.membershipApplication.findMany({
    orderBy: SERIAL_ORDER_BY,
    select: { id: true },
  });
  return new Map(all.map((app, i) => [app.id, i + 1]));
}
