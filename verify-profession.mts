import { writeFile } from "node:fs/promises";
import { renderVisitorCardPng } from "./src/lib/visitor-card.tsx";

async function main() {
  await writeFile("demo-card-with-profession-audree.png", await renderVisitorCardPng("Audree", "Student"));
  await writeFile("demo-card-with-profession-long.png", await renderVisitorCardPng("Mohammad Rahman", "Civil Engineer"));
}
main();
