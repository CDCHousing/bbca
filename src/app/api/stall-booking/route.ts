import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stallBookingSchema } from "@/lib/validation/stallBooking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot — bots fill hidden fields, real users never see it.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = stallBookingSchema.safeParse({
      name: body.name,
      phone: body.phone,
      email: body.email,
      organization: body.organization,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const booking = await prisma.stallBooking.create({
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Error submitting stall booking:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
