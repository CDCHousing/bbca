import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { newsSchema, slugify } from "@/lib/validation/news";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const news = await prisma.news.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const news = await prisma.news.create({
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

    return NextResponse.json(news, { status: 201 });
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
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}
