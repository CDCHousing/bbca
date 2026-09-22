import { ImageResponse } from "next/og";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CARD_SIZE = 1254;
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

const bgBuffer = await readFile(path.join(process.cwd(), "public", "visitor-card-bg.jpg"));
const bgDataUri = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

async function render(name, outFile) {
  const image = new ImageResponse(
    {
      type: "div",
      props: {
        style: { display: "flex", position: "relative", width: CARD_SIZE, height: CARD_SIZE },
        children: [
          { type: "img", props: { src: bgDataUri, width: CARD_SIZE, height: CARD_SIZE, style: { position: "absolute", top: 0, left: 0 } } },
          { type: "div", props: {
              style: { position: "absolute", top: 610, left: NAME_LEFT, right: NAME_RIGHT, display: "flex", fontSize: nameFontSize(name), fontWeight: 700, color: "#0a0a0a", lineHeight: 1 },
              children: name,
          }},
        ],
      },
    },
    { width: CARD_SIZE, height: CARD_SIZE }
  );
  await writeFile(outFile, Buffer.from(await image.arrayBuffer()));
  console.log("wrote", outFile);
}

await render("Audree", "demo-card-audree.png");
await render("Mohammad Rahman", "demo-card-mohammad-rahman.png");
