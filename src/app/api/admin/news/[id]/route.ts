import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { newsSchema, slugify } from "@/lib/validation/news";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(news);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const parsed = newsSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const finalSlug = data.slug?.trim() ? data.slug.trim() : slugify(data.title);

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        slug: finalSlug,
        category: data.category ?? null,
        excerpt: data.excerpt ?? null,
        body: data.body,
        coverImageUrl: data.coverImageUrl ?? null,
        imageFit: data.imageFit,
        status: data.status,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        order: data.order,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A news article with this slug already exists." },
        { status: 409 }
      );
    }
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news article" },
      { status: 500 }
    );
  }
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
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}
