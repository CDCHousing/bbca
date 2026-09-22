import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { PDFDocument } from "pdf-lib";

const VISITOR_CARD_SIZE = 1254;
const NAME_LEFT = 90;
const NAME_RIGHT = 60;

function nameFontSize(name) {
  const len = name.length;
  if (len <= 8) return 90;
  if (len <= 12) return 80;
  if (len <= 16) return 68;
  if (len <= 22) return 56;
  return 46;
}

async function renderPng(name) {
  const bgBuffer = await readFile(path.join(process.cwd(), "public", "visitor-card-bg.jpg"));
  const bgDataUri = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;
  const image = new ImageResponse(
    {
      type: "div",
      props: {
        style: { display: "flex", position: "relative", width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE },
        children: [
          { type: "img", props: { src: bgDataUri, width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE, style: { position: "absolute", top: 0, left: 0 } } },
          { type: "div", props: {
              style: { position: "absolute", top: 610, left: NAME_LEFT, right: NAME_RIGHT, display: "flex", fontSize: nameFontSize(name), fontWeight: 700, color: "#0a0a0a", lineHeight: 1 },
              children: name,
          }},
        ],
      },
    },
    { width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE }
  );
  return Buffer.from(await image.arrayBuffer());
}

const pngBuffer = await renderPng("Audree");
const pdfDoc = await PDFDocument.create();
const pngImage = await pdfDoc.embedPng(pngBuffer);
const page = pdfDoc.addPage([VISITOR_CARD_SIZE, VISITOR_CARD_SIZE]);
page.drawImage(pngImage, { x: 0, y: 0, width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE });
const pdfBytes = await pdfDoc.save();
await writeFile("verify-visitor-card.pdf", pdfBytes);
console.log("wrote verify-visitor-card.pdf,", pdfBytes.length, "bytes");
