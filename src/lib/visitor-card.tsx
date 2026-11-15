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

// Advance widths (em) of Poppins-Medium.ttf for ASCII 32–126, read from its hmtx table.
// A flat per-character average let m/w-heavy names wrap onto a second line and push the
// profession down onto "VISITOR".
const POPPINS_MEDIUM_WIDTHS = [
  0.26, 0.321, 0.323, 0.872, 0.65, 0.794, 0.761, 0.172, 0.492, 0.492, 0.504, 0.714, 0.225, 0.585, 0.241, 0.514,
  0.641, 0.35, 0.577, 0.594, 0.647, 0.639, 0.642, 0.56, 0.638, 0.635, 0.245, 0.304, 0.612, 0.774, 0.59, 0.538,
  1.025, 0.697, 0.63, 0.773, 0.709, 0.524, 0.515, 0.773, 0.705, 0.264, 0.564, 0.633, 0.444, 0.882, 0.721, 0.784,
  0.595, 0.787, 0.632, 0.604, 0.564, 0.69, 0.694, 0.999, 0.66, 0.605, 0.558, 0.485, 0.717, 0.484, 0.654, 0.798,
  0.254, 0.678, 0.678, 0.6, 0.678, 0.617, 0.332, 0.678, 0.649, 0.264, 0.264, 0.554, 0.264, 1.039, 0.649, 0.638,
  0.678, 0.678, 0.384, 0.534, 0.372, 0.649, 0.576, 0.825, 0.499, 0.582, 0.471, 0.516, 0.324, 0.516, 0.553,
];

function textWidthEm(text: string): number {
  let w = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    w += code >= 32 && code < 127 ? POPPINS_MEDIUM_WIDTHS[code - 32] : 0.7; // non-ASCII: assume wide
  }
  return Math.max(w, 0.1);
}

// Largest size at which the text fits the box on one line (with a little slack), clamped to [min, max].
function fitFontSize(text: string, max: number, min: number): number {
  const fit = Math.floor((TEXT_WIDTH * 0.97) / textWidthEm(text));
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
