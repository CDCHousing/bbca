import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import {
  membershipFormSchema,
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
} from "@/lib/validation/membership";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Honeypot — bots fill hidden fields, real users never see it.
    const honeypot = formData.get("website");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = membershipFormSchema.safeParse({
      businessName: formData.get("businessName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      businessType: formData.get("businessType"),
      address: formData.get("address"),
      message: formData.get("message") ?? "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const file = formData.get("document");
    let documentUrl: string | null = null;

    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Validation failed", fieldErrors: { document: ["Only PDF, JPG or PNG files are allowed"] } },
          { status: 400 }
        );
      }
      if (file.size > MAX_DOCUMENT_SIZE) {
        return NextResponse.json(
          { error: "Validation failed", fieldErrors: { document: ["File must be 10MB or smaller"] } },
          { status: 400 }
        );
      }

      const blob = await put(`membership/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      documentUrl = blob.url;
    }

    const { businessName, contactName, email, phone, businessType, address, message } =
      parsed.data;

    const application = await prisma.membershipApplication.create({
      data: {
        businessName,
        contactName,
        email,
        phone,
        businessType,
        address,
        message: message || null,
        documentUrl,
      },
    });

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (error) {
    console.error("Error submitting membership application:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
