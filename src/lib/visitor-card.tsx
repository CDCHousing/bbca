import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Portrait card from "Registration Card 02.ai" (504.526 x 717.116 pt), rendered at 1200px wide.
// visitor-card-bg.jpg is that artwork with the sample name/profession removed.
export const VISITOR_CARD_WIDTH = 1200;
export const VISITOR_CARD_HEIGHT = 1706;

// Text box: left edge of the artwork's text column, stopping short of Big Ben.
const TEXT_TOP = 518;
const TEXT_LEFT = 70;
const TEXT_WIDTH = 740;

const NAME_MAX = 83; // 35pt in the artwork
const NAME_MIN = 46;
const PROFESSION_MAX = 38; // 15.8pt in the artwork
const PROFESSION_MIN = 26;

// Poppins Medium averages ~0.62em per character; shrink until the line fits the box.
function fitFontSize(text: string, max: number, min: number): number {
  const fit = Math.floor(TEXT_WIDTH / (Math.max(text.length, 1) * 0.62));
  return Math.max(min, Math.min(max, fit));
}

export async function renderVisitorCardPng(name: string, profession?: string): Promise<Buffer> {
  const [bgBuffer, fontData] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "visitor-card-bg.jpg")),
    readFile(path.join(process.cwd(), "public", "fonts", "Poppins-Medium.ttf")),
  ]);
  const bgDataUri = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

  const image = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: VISITOR_CARD_WIDTH,
          height: VISITOR_CARD_HEIGHT,
          fontFamily: "Poppins",
        }}
      >
        <img
          src={bgDataUri}
          width={VISITOR_CARD_WIDTH}
          height={VISITOR_CARD_HEIGHT}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: TEXT_TOP,
            left: TEXT_LEFT,
            width: TEXT_WIDTH,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: fitFontSize(name, NAME_MAX, NAME_MIN),
              color: "#283279",
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          {profession && (
            <div
              style={{
                display: "flex",
                marginTop: 4,
                fontSize: fitFontSize(profession, PROFESSION_MAX, PROFESSION_MIN),
                color: "#231F20",
                lineHeight: 1.15,
              }}
            >
              {profession}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: VISITOR_CARD_WIDTH,
      height: VISITOR_CARD_HEIGHT,
      fonts: [{ name: "Poppins", data: fontData, weight: 500, style: "normal" }],
    }
  );

  return Buffer.from(await image.arrayBuffer());
}

export function visitorCardFilename(name: string, ext: string): string {
  return `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-visitor-card.${ext}`;
}
