import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import {
  renderVisitorCardPng,
  visitorCardFilename,
  VISITOR_CARD_WIDTH,
  VISITOR_CARD_HEIGHT,
} from "@/lib/visitor-card";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const visitor = await prisma.visitorRegistration.findUnique({
    where: { id },
    select: { name: true, profession: true },
  });
  if (!visitor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pngBuffer = await renderVisitorCardPng(visitor.name, visitor.profession);

  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBuffer);
  const page = pdfDoc.addPage([VISITOR_CARD_WIDTH, VISITOR_CARD_HEIGHT]);
  page.drawImage(pngImage, { x: 0, y: 0, width: VISITOR_CARD_WIDTH, height: VISITOR_CARD_HEIGHT });
  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${visitorCardFilename(visitor.name, "pdf")}"`,
    },
  });
}
