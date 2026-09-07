import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const recipients = await prisma.emailRecipient.findMany({
    where: {
      campaignId: id,
      ...(statusFilter === "SENT" ||
      statusFilter === "FAILED" ||
      statusFilter === "PENDING"
        ? { status: statusFilter }
        : {}),
    },
    // Enum order is PENDING, SENT, FAILED, so desc puts failures first — that is
    // what the admin opens this screen to look at.
    orderBy: [{ status: "desc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      organization: true,
      status: true,
      error: true,
      providerId: true,
      sentAt: true,
    },
  });

  return NextResponse.json({ campaign, recipients });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Recipients cascade with the campaign.
    await prisma.emailCampaign.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Error deleting email campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
