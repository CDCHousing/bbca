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

  const registrations = await prisma.visitorRegistration.findMany({
    orderBy: { createdAt: "asc" },
  });

  const headers = ["S/N", "Name", "Phone", "Email", "Profession", "Submitted At"];

  const rows = registrations.map((r, i) => [
    String(i + 1),
    escapeCSV(r.name),
    escapeCSV(r.phone),
    escapeCSV(r.email),
    escapeCSV(r.profession),
    escapeCSV(r.createdAt.toISOString()),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="visitor-registrations.csv"',
    },
  });
}
