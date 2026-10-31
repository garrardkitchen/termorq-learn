// Termorq Learn capstone: Code file (TypeScript).
// Place at <workflow folder>/scripts/stamp.ts. Uses erasable syntax only (Node 22.6+ native).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Input = { steps: { format: { markdown: string } } };

const inputPath = process.env.TERMORQ_INPUT;
const outputDir = process.env.TERMORQ_OUTPUT;
if (!inputPath || !outputDir) throw new Error("TERMORQ_INPUT and TERMORQ_OUTPUT are required");

const data = JSON.parse(readFileSync(inputPath, "utf8")) as Input;
const markdown = data.steps.format.markdown;
if (typeof markdown !== "string") throw new Error("steps.format.markdown must be a string");

const run = process.env.TERMORQ_RUN ?? "unknown";
const stamped = `${markdown}\n\n_Run ${run} · ${new Date().toISOString()}_`;
const file = "digest.md";
writeFileSync(join(outputDir, file), stamped, "utf8");

console.log(JSON.stringify({ stamped, file }));
