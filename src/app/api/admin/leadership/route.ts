import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const executives = await prisma.executive.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(executives);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, title, photoUrl, order, category } = body;

    if (!name || !title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      );
    }

    const executive = await prisma.executive.create({
      data: {
        name,
        title,
        photoUrl: photoUrl || null,
        order: order !== undefined ? Number(order) : 0,
        category: category || "EXECUTIVE",
      },
    });

    return NextResponse.json(executive, { status: 201 });
  } catch (error) {
    console.error("Error creating leadership profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
