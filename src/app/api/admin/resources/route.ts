import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import { resourceSchema, slugify } from "@/lib/validation/resource";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const where: Prisma.ResourceWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const resources = await prisma.resource.findMany({
    where,
    orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { bookings: true } } },
  });

  return NextResponse.json(resources);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = resourceSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const finalSlug = data.slug?.trim() ? data.slug.trim() : slugify(data.title);

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt ?? null,
        body: data.body,
        coverImageUrl: data.coverImageUrl ?? null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        location: data.location ?? null,
        bookingEnabled: data.bookingEnabled,
        emailSubject: data.emailSubject ?? null,
        emailBody: data.emailBody ?? null,
        status: data.status,
        order: data.order,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A resource with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
