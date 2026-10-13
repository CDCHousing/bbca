import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { showInCarousel, order } = await request.json();
  if (showInCarousel !== undefined && typeof showInCarousel !== "boolean") {
    return NextResponse.json({ error: "showInCarousel must be a boolean" }, { status: 400 });
  }
  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    return NextResponse.json({ error: "order must be a non-negative integer" }, { status: 400 });
  }

  try {
    const image = await prisma.galleryImage.update({
      where: { id },
      data: { showInCarousel, order },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
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
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
