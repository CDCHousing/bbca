import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import {
  isRecipientSource,
  resolvePool,
  SOURCE_LABELS,
} from "@/lib/campaign-recipients";

/** Feeds the recipient picker on the compose screen. */
export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") ?? "members";

  if (!isRecipientSource(source)) {
    return NextResponse.json(
      { error: "Unknown recipient source" },
      { status: 400 }
    );
  }

  const recipients = await resolvePool([source]);

  return NextResponse.json({
    source,
    label: SOURCE_LABELS[source],
    count: recipients.length,
    recipients,
  });
}
