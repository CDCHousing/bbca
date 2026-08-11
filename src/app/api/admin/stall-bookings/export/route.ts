import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.stallBooking.findMany({
    orderBy: { createdAt: "asc" },
  });

  const headers = ["S/N", "Name", "Phone", "Email", "Organization", "Submitted At"];

  const rows = bookings.map((b, i) => [
    String(i + 1),
    escapeCSV(b.name),
    escapeCSV(b.phone),
    escapeCSV(b.email),
    escapeCSV(b.organization),
    escapeCSV(b.createdAt.toISOString()),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="stall-bookings.csv"',
    },
  });
}
