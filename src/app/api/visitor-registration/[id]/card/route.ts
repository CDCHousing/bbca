import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { renderVisitorCardPng, visitorCardFilename, VISITOR_CARD_SIZE } from "@/lib/visitor-card";

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
  const page = pdfDoc.addPage([VISITOR_CARD_SIZE, VISITOR_CARD_SIZE]);
  page.drawImage(pngImage, { x: 0, y: 0, width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE });
  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${visitorCardFilename(visitor.name, "pdf")}"`,
    },
  });
}
