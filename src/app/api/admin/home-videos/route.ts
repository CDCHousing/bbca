import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { homeVideoSchema } from "@/lib/validation/news";
import { parseYouTubeId } from "@/lib/youtube";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await prisma.homeVideo.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = homeVideoSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    // Already validated by the schema's refine, so this cannot be null here.
    const videoId = parseYouTubeId(data.videoUrl)!;

    const video = await prisma.homeVideo.create({
      data: {
        videoId,
        title: data.title,
        order: data.order,
        published: data.published,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating home video:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
