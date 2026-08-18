import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { homeVideoSchema } from "@/lib/validation/news";
import { parseYouTubeId } from "@/lib/youtube";

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
    const parsed = homeVideoSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const videoId = parseYouTubeId(data.videoUrl)!;

    const updated = await prisma.homeVideo.update({
      where: { id },
      data: {
        videoId,
        title: data.title,
        order: data.order,
        published: data.published,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating home video:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
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
    await prisma.homeVideo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting home video:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
