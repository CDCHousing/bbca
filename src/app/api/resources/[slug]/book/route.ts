import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seatBookingSchema } from "@/lib/validation/resource";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();

    // Honeypot — bots fill hidden fields, real users never see it.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = seatBookingSchema.safeParse({
      name: body.name,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({ where: { slug } });

    if (!resource || resource.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    if (!resource.bookingEnabled) {
      return NextResponse.json(
        { error: "Booking is not open for this item." },
        { status: 400 }
      );
    }
    if (resource.eventDate && resource.eventDate.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Booking has closed for this event." },
        { status: 400 }
      );
    }

    const booking = await prisma.seatBooking.create({
      data: { ...parsed.data, resourceId: resource.id },
    });

    // A failed email must not undo a seat that is already saved.
    const emailed = await sendBookingConfirmation({
      to: booking.email,
      resource,
      booking: { name: booking.name, organization: booking.organization },
    });

    return NextResponse.json({ ok: true, id: booking.id, emailed }, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email address has already booked a seat for this event." },
        { status: 409 }
      );
    }
    console.error("Error creating seat booking:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
