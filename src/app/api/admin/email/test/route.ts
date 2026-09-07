import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { sendTestEmail } from "@/lib/campaign-email";
import { testEmailSchema } from "@/lib/validation/campaign";

/**
 * Sends one copy of the draft to the logged-in admin. It takes the composed
 * subject/body rather than a campaign id so a test can be fired before the
 * draft is saved, and it never touches campaign counters.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const to = session.user?.email;
  if (!to) {
    return NextResponse.json(
      { error: "Your admin account has no email address to send the test to." },
      { status: 400 }
    );
  }

  const json = await request.json();
  const parsed = testEmailSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const result = await sendTestEmail({ to, ...parsed.data });

  if (result.skipped) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not set, so no test email was sent." },
      { status: 503 }
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Failed to send the test email." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, to });
}
