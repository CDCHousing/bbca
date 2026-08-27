import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { formatSerial, SERIAL_ORDER_BY } from "@/lib/membership-serial";

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

  const applications = await prisma.membershipApplication.findMany({
    orderBy: SERIAL_ORDER_BY,
  });

  const headers = [
    "S/N",
    "Business Name",
    "Contact Name",
    "Email",
    "Phone",
    "Business Type",
    "Address",
    "Message",
    "Document URL",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = applications.map((app, i) => [
    formatSerial(i + 1),
    escapeCSV(app.businessName),
    escapeCSV(app.contactName),
    escapeCSV(app.email),
    escapeCSV(app.phone),
    escapeCSV(app.businessType),
    escapeCSV(app.address),
    escapeCSV(app.message),
    escapeCSV(app.documentUrl),
    escapeCSV(app.status),
    escapeCSV(app.createdAt.toISOString()),
    escapeCSV(app.updatedAt.toISOString()),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="applications.csv"',
    },
  });
}
