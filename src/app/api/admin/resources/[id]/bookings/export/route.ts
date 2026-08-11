import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { slugify } from "@/lib/validation/resource";

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { title: true },
  });
  if (!resource) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bookings = await prisma.seatBooking.findMany({
    where: { resourceId: id },
    orderBy: { createdAt: "asc" },
  });

  const headers = ["S/N", "Name", "Email", "Phone", "Organization", "Booked At"];

  const rows = bookings.map((b, i) => [
    String(i + 1),
    escapeCSV(b.name),
    escapeCSV(b.email),
    escapeCSV(b.phone),
    escapeCSV(b.organization),
    escapeCSV(b.createdAt.toISOString()),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const filename = `${slugify(resource.title) || "resource"}-bookings.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
