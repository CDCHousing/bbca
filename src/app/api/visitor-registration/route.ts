import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { visitorRegistrationSchema } from "@/lib/validation/visitorRegistration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot — bots fill hidden fields, real users never see it.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = visitorRegistrationSchema.safeParse({
      name: body.name,
      phone: body.phone,
      email: body.email,
      profession: body.profession,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const registration = await prisma.visitorRegistration.create({
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("Error submitting visitor registration:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
