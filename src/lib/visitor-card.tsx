import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const VISITOR_CARD_SIZE = 1254;

const NAME_TOP = 610;
const NAME_LEFT = 330;
const NAME_RIGHT = 60;

function nameFontSize(name: string): number {
  const len = name.length;
  if (len <= 8) return 78;
  if (len <= 12) return 68;
  if (len <= 16) return 58;
  if (len <= 22) return 48;
  return 40;
}

function professionFontSize(profession: string): number {
  const len = profession.length;
  if (len <= 10) return 38;
  if (len <= 16) return 34;
  if (len <= 22) return 30;
  return 26;
}

export async function renderVisitorCardPng(name: string, profession?: string): Promise<Buffer> {
  const bgPath = path.join(process.cwd(), "public", "visitor-card-bg.jpg");
  const bgBuffer = await readFile(bgPath);
  const bgDataUri = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

  const nameSize = nameFontSize(name);
  const professionTop = NAME_TOP + nameSize * 1.15 + 20;

  const image = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: VISITOR_CARD_SIZE,
          height: VISITOR_CARD_SIZE,
        }}
      >
        <img
          src={bgDataUri}
          width={VISITOR_CARD_SIZE}
          height={VISITOR_CARD_SIZE}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: NAME_TOP,
            left: NAME_LEFT,
            right: NAME_RIGHT,
            display: "flex",
            fontSize: nameSize,
            fontWeight: 700,
            color: "#0a0a0a",
            lineHeight: 1,
          }}
        >
          {name}
        </div>
        {profession && (
          <div
            style={{
              position: "absolute",
              top: professionTop,
              left: NAME_LEFT,
              right: NAME_RIGHT,
              display: "flex",
              fontSize: professionFontSize(profession),
              fontWeight: 600,
              color: "#1B2A52",
              lineHeight: 1,
            }}
          >
            {profession}
          </div>
        )}
      </div>
    ),
    { width: VISITOR_CARD_SIZE, height: VISITOR_CARD_SIZE }
  );

  return Buffer.from(await image.arrayBuffer());
}

export function visitorCardFilename(name: string, ext: string): string {
  return `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-visitor-card.${ext}`;
}
