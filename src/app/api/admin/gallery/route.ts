import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const caption = formData.get("caption") as string | null;
    const orderRaw = formData.get("order") as string | null;
    const order = orderRaw ? parseInt(orderRaw, 10) : 0;

    if (!file) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`gallery/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: blob.url,
        caption: caption || null,
        order,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
