import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { resetFailedRecipients, sendCampaign } from "@/lib/campaign-email";

export const maxDuration = 300;

/** Same stale-run heuristic as the send route — see its comment. */
const STALE_SENDING_MS = 5 * 60 * 1000;

/** Puts FAILED recipients back to PENDING, then runs the send again for them. */
export async function POST(
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
    select: { status: true, updatedAt: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Retrying mid-run would re-queue recipients the live run is still working
  // through, so it waits for that run the same way a second send does.
  if (
    campaign.status === "SENDING" &&
    Date.now() - campaign.updatedAt.getTime() < STALE_SENDING_MS
  ) {
    return NextResponse.json(
      {
        error:
          "This campaign is currently sending. Wait for the run to finish before retrying failures.",
      },
      { status: 409 }
    );
  }

  const reset = await resetFailedRecipients(id);
  if (reset === 0) {
    return NextResponse.json(
      { error: "There are no failed recipients to retry." },
      { status: 409 }
    );
  }

  const result = await sendCampaign(id);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (result.skipped) {
    return NextResponse.json(
      {
        ...result,
        retried: reset,
        message:
          "RESEND_API_KEY is not set, so nothing was sent. The failed recipients are back to pending.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ...result, retried: reset });
}
