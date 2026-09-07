import { NextRequest, NextResponse } from "next/server";
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

function slugifyForFilename(subject: string): string {
  return (
    subject
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "campaign"
  );
}

/** Per-recipient delivery status for one campaign. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id },
    select: { subject: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const recipients = await prisma.emailRecipient.findMany({
    where: { campaignId: id },
    orderBy: [{ status: "desc" }, { email: "asc" }],
  });

  const headers = [
    "Email",
    "Name",
    "Organisation",
    "Status",
    "Error",
    "Provider Message ID",
    "Sent At",
  ];

  const rows = recipients.map((r) => [
    escapeCSV(r.email),
    escapeCSV(r.name),
    escapeCSV(r.organization),
    escapeCSV(r.status),
    escapeCSV(r.error),
    escapeCSV(r.providerId),
    escapeCSV(r.sentAt ? r.sentAt.toISOString() : ""),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${slugifyForFilename(
        campaign.subject
      )}-recipients.csv"`,
    },
  });
}
