---
title: 'Prepare'
description: 'Runtimes, the project folder, a saved MCP server, and a saved model connection.'
weight: 1
---

{{% callout style="goal" %}}
Get everything in place for the capstone. **Time:** 15 minutes.
{{% /callout %}}

## Checklist

| Need | Why | Check |
| --- | --- | --- |
| Bash + `jq`, `pwsh`, Python 3, .NET 10 SDK, `rustc`, Node 22.6+ | All seven languages run in this workflow | [Stage 0 runtime check](/workflows/orientation/enable-workflows/) |
| A project folder `~/src/release-digest` | The workflow's `folder` and Code file base | `mkdir -p ~/src/release-digest/scripts` |
| `scripts/stamp.ts` in that folder | The **Code file** block | See below |
| A saved MCP server **Demo tools** with an `echo` tool | The **MCP** block | Use any saved tool that accepts `{"message": "..."}`, and rename it in the YAML |
| A saved model connection **Summary model** | The **AI** block | Save rejects an unknown connection with *connection '…' is not saved.* |

{{% callout style="tip" %}}
No MCP server or model to hand? You can still finish the capstone. Turn **Node execution** off for `post` and/or `ai_warn` (`enabled: false`). They show as **Skipped**, and every other block still runs.
{{% /callout %}}

## The Code file

Save this as `~/src/release-digest/scripts/stamp.ts` ([download](/capstone/scripts/stamp.ts)):

```typescript
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
```

{{% callout style="checkrun" %}}
`ls ~/src/release-digest/scripts` shows `stamp.ts`, and every runtime check prints a version.
{{% /callout %}}

{{% callout style="exercise" %}}
Before you look at the next lesson, list which block in the diagram will use which **kind** and which **language**. You should have seven kinds and seven languages.
{{% /callout %}}

{{% details title="Solution" %}}
Kinds: `code`, `loop`, `code_file`, `http`, `mcp`, `decision`, `ai`. Languages: Python (`validate`, `quiet`), Bash (`classify`), PowerShell (`score`), C# (`tally`), Rust (`checksum`), JavaScript (`format`), TypeScript (`stamp`, as a Code file).
{{% /details %}}
