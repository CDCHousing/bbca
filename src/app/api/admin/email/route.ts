import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { buildAudienceLabel, resolveSelection } from "@/lib/campaign-recipients";
import { campaignSchema } from "@/lib/validation/campaign";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [campaigns, total] = await Promise.all([
    prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        subject: true,
        audienceLabel: true,
        status: true,
        totalCount: true,
        sentCount: true,
        failedCount: true,
        sentAt: true,
        createdAt: true,
      },
    }),
    prisma.emailCampaign.count(),
  ]);

  return NextResponse.json({
    campaigns,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
}

/**
 * Creates a DRAFT campaign and snapshots its recipients. The snapshot is what
 * later sends read from, so campaign history stays accurate even after the
 * source application or booking is edited or deleted.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = campaignSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { subject, body, sources, emails } = parsed.data;

    // Rejected applications are not a source, so they can never surface here
    // no matter what the request asks for.
    const recipients = await resolveSelection(sources, emails);
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "None of the selected addresses are still in the chosen audience." },
        { status: 400 }
      );
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        subject,
        body,
        audienceLabel: buildAudienceLabel(sources, recipients.length),
        totalCount: recipients.length,
        recipients: {
          createMany: {
            data: recipients.map((r) => ({
              email: r.email,
              name: r.name,
              organization: r.organization,
            })),
          },
        },
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
