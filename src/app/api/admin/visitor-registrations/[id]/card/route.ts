import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { renderVisitorCardPng, visitorCardFilename } from "@/lib/visitor-card";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const visitor = await prisma.visitorRegistration.findUnique({
    where: { id },
    select: { name: true, profession: true },
  });
  if (!visitor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderVisitorCardPng(visitor.name, visitor.profession);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${visitorCardFilename(visitor.name, "png")}"`,
    },
  });
}
