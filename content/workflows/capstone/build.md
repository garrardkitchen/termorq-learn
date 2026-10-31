---
title: 'Build it'
description: 'The complete release-digest workflow YAML, explained block by block.'
weight: 2
---

{{% callout style="goal" %}}
Paste, read, and save the complete capstone workflow. **Time:** 30 minutes.
{{% /callout %}}

## Steps

1. Create a new workflow and open **YAML**.
2. Paste the file below ([download release-digest.yml](/capstone/release-digest.yml)).
3. Change `server:`, `tool:`, and `connection:` to match your saved connections, or disable those blocks.
4. Click **Save**. If the panel says **Not saved**, fix each line it reports. Use [Stage 6](/workflows/yaml/) for help.
5. Click **Arrange**, then **Fit**, to lay out the canvas.

```yaml
schema: 1
name: Release notes digest
id: release-digest
description: |
  Termorq Learn capstone. Every runnable block type and all seven languages,
  started by an HTTP request with `{"changes": ["feat: ...", "fix: ..."]}`.
folder: ~/src/release-digest
timeout_secs: 300
inputs:
  changes:
    type: array
    items:
      type: string
env:
  DIGEST_TITLE: Release notes digest
triggers:
  enabled: true
  manual: true
  selected: http
  http: true
blocks:
  # 1 · Python: validate the request body
  - id: validate
    name: Validate input
    kind: code
    language: python
    uses: [inputs.changes]
    input_sample: |-
      {"inputs":{"changes":["feat: dark mode","fix: crash on save","feat!: drop v1 API"]}}
    body: |
      import json, os, sys
      with open(os.environ["TERMORQ_INPUT"], encoding="utf-8") as f:
          data = json.load(f)
      changes = data["inputs"]["changes"]
      if not isinstance(changes, list) or not changes:
          raise ValueError("inputs.changes must be a non-empty list")
      if not all(isinstance(c, str) and c.strip() for c in changes):
          raise ValueError("every change must be a non-empty string")
      items = [c.strip() for c in changes][:50]
      print(f"validated {len(items)} changes", file=sys.stderr)
      print(json.dumps({"items": items, "total": len(items)}))
    outputs:
      type: object
      properties:
        items:
          type: array
          items:
            type: string
        total:
          type: number

  # 2 · Loop: classify (Bash) and score (PowerShell) every change
  - id: each_change
    name: Each change
    kind: loop
    for_each: steps.validate.items
    max: 50
    body:
      - id: classify
        name: Classify
        kind: code
        language: bash
        uses: [loop.item]
        body: |
          set -euo pipefail
          jq -c '
            .loop.item as $t
            | {title: $t,
               kind: (if ($t | test("^(breaking|[a-z]+!:)"; "i")) then "breaking"
                      elif ($t | test("^feat"; "i")) then "feature"
                      elif ($t | test("^fix"; "i")) then "fix"
                      else "other" end)}' "$TERMORQ_INPUT"
        outputs:
          type: object
          properties:
            title:
              type: string
            kind:
              type: string
              enum: [breaking, feature, fix, other]
      - id: score
        name: Score
        kind: code
        language: powershell
        uses: [steps.classify.kind, loop.index]
        body: |
          $ErrorActionPreference = 'Stop'
          $d = Get-Content -Raw -LiteralPath $env:TERMORQ_INPUT | ConvertFrom-Json
          $weights = @{ breaking = 5; feature = 3; fix = 2; other = 1 }
          $kind = [string]$d.steps.classify.kind
          @{ weight = $weights[$kind]; position = [int]$d.loop.index } | ConvertTo-Json -Compress
        outputs:
          type: object
          properties:
            weight:
              type: number
            position:
              type: number

  # 3 · C#: tally the loop results
  - id: tally
    name: Tally
    kind: code
    language: csharp
    uses: [steps.each_change.results]
    body: |
      using System;
      using System.IO;
      using System.Text.Json;
      using System.Text.Json.Nodes;

      var path = Environment.GetEnvironmentVariable("TERMORQ_INPUT")
          ?? throw new InvalidOperationException("TERMORQ_INPUT is missing");
      using var doc = JsonDocument.Parse(File.ReadAllText(path));
      var results = doc.RootElement.GetProperty("steps").GetProperty("each_change").GetProperty("results");
      int breaking = 0, features = 0, fixes = 0;
      double score = 0;
      foreach (var pass in results.EnumerateArray())
      {
          var kind = pass.GetProperty("classify").GetProperty("kind").GetString();
          if (kind == "breaking") breaking++;
          else if (kind == "feature") features++;
          else if (kind == "fix") fixes++;
          score += pass.GetProperty("score").GetProperty("weight").GetDouble();
      }
      Console.WriteLine(new JsonObject
      {
          ["breaking"] = breaking,
          ["features"] = features,
          ["fixes"] = fixes,
          ["score"] = score,
      }.ToJsonString());
    outputs:
      type: object
      properties:
        breaking:
          type: number
        features:
          type: number
        fixes:
          type: number
        score:
          type: number

  # 4 · Rust: checksum of the validated items (std only, no Cargo)
  - id: checksum
    name: Checksum
    kind: code
    language: rust
    uses: [steps.validate.items]
    body: |
      use std::{env, error::Error, fs};

      fn main() -> Result<(), Box<dyn Error>> {
          let bytes = fs::read(env::var("TERMORQ_INPUT")?)?;
          // FNV-1a, 64-bit
          let mut hash: u64 = 0xcbf29ce484222325;
          for b in &bytes {
              hash ^= *b as u64;
              hash = hash.wrapping_mul(0x100000001b3);
          }
          println!("{{\"checksum\":\"{:016x}\",\"bytes\":{}}}", hash, bytes.len());
          Ok(())
      }
    outputs:
      type: object
      properties:
        checksum:
          type: string
        bytes:
          type: number

  # 5 · JavaScript: format Markdown and a JSON-safe request body
  - id: format
    name: Format Markdown
    kind: code
    language: javascript
    uses:
      - steps.each_change.results
      - steps.tally.breaking
      - steps.tally.score
      - steps.checksum.checksum
    body: |
      import { readFileSync } from "node:fs";

      const { steps } = JSON.parse(readFileSync(process.env.TERMORQ_INPUT, "utf8"));
      const icons = { breaking: "💥", feature: "✨", fix: "🐛", other: "•" };
      const lines = steps.each_change.results.map(
        (pass) => `- ${icons[pass.classify.kind]} ${pass.classify.title} (weight ${pass.score.weight})`
      );
      const markdown = [
        `## ${process.env.DIGEST_TITLE}`,
        "",
        ...lines,
        "",
        `Breaking: ${steps.tally.breaking} · Score: ${steps.tally.score} · Checksum: ${steps.checksum.checksum}`,
      ].join("\n");
      console.log(JSON.stringify({ markdown, request_json: JSON.stringify({ message: markdown }) }));
    outputs:
      type: object
      properties:
        markdown:
          type: string
        request_json:
          type: string

  # 6 · Code file (TypeScript): stamp the digest and save it as an artifact
  - id: stamp
    name: Stamp digest
    kind: code_file
    path: scripts/stamp.ts
    uses: [steps.format.markdown]
    outputs:
      type: object
      properties:
        stamped:
          type: string
        file:
          type: string

  # 7 · HTTP (offline mock): "publish" the digest
  - id: publish
    name: Publish
    kind: http
    method: POST
    url: mock://digest
    body: "{{ steps.format.request_json }}"
    outputs:
      type: object
      properties:
        path:
          type: string
        mock:
          type: boolean

  # 8 · MCP: post the digest through a saved tool
  - id: post
    name: Post via MCP
    kind: mcp
    server: Demo tools
    tool: echo
    arguments: "{{ steps.format.request_json }}"
    outputs:
      type: object
      properties:
        content:
          type: array

  # 9 · Decision: warn only when something is breaking
  - id: gate
    name: Breaking?
    kind: decision
    branches:
      - when: steps.tally.breaking > 0
        goto: ai_warn
      - else: true
        goto: quiet

  # 10 · AI: write an upgrade warning
  - id: ai_warn
    name: Upgrade warning
    kind: ai
    connection: Summary model
    system: 'Return a single JSON object with a string property named "summary".'
    prompt: |
      These release notes contain breaking changes. Write a two-sentence upgrade warning.

      {{ steps.stamp.stamped }}
    max_tokens: 200
    outputs:
      type: object
      properties:
        summary:
          type: string
    then: done

  # 11 · Python: the quiet route
  - id: quiet
    name: All clear
    kind: code
    language: python
    uses: [steps.validate.total]
    body: |
      import json, os
      with open(os.environ["TERMORQ_INPUT"], encoding="utf-8") as f:
          total = json.load(f)["steps"]["validate"]["total"]
      print(json.dumps({"summary": f"No breaking changes in {total} items."}))
    outputs:
      type: object
      properties:
        summary:
          type: string
    then: done

  # 12 · Join
  - id: done
    name: Done
    kind: http
    method: GET
    url: mock://done
```

## Block by block

| # | Block | Kind · language | Concept practised |
| --- | --- | --- | --- |
| 1 | `validate` | code · Python | `inputs.*` in `uses`, validation, stderr diagnostics, `input_sample` |
| 2 | `each_change` | loop | `for_each`, `max`, nested body |
| 2a | `classify` | code · Bash | `loop.item`, safe `jq` JSON, `enum` output |
| 2b | `score` | code · PowerShell | Reading a **sibling's** output in the same pass, plus `loop.index` |
| 3 | `tally` | code · C# | Iterating `steps.<loop>.results` keyed by child ID |
| 4 | `checksum` | code · Rust | Std-only byte processing, no Cargo |
| 5 | `format` | code · JavaScript | ES module, `env` (`DIGEST_TITLE`), producing a **serialised** `request_json` |
| 6 | `stamp` | code_file · TypeScript | Language inferred from `.ts`, artifact in `TERMORQ_OUTPUT`, `TERMORQ_RUN` |
| 7 | `publish` | http (`mock://`) | Templated `body` from a JSON-safe string |
| 8 | `post` | mcp | `arguments` resolving to a JSON object |
| 9 | `gate` | decision | First-true branch, `else` fallback |
| 10 | `ai_warn` | ai | Templated prompt, a declared `summary`, `then: done` |
| 11 | `quiet` | code · Python | The alternative route, rejoining with `then: done` |
| 12 | `done` | http (`mock://`) | The join point, which doesn't require outputs from either branch |

{{% callout style="important" %}}
Notice that `done` reads **nothing** from `ai_warn` or `quiet`. Only one of those two runs, so a join block that needed both would fail.
{{% /callout %}}

## Test before the full run

- **validate**: open the code editor and choose **Execute step**. The saved `input_sample` supplies three changes.
- **ai_warn**: its prompt reads `steps.stamp.stamped`, which only exists during a full run. To try the wording in **Open AI editor**, temporarily replace that chip with `{{ trigger.text }}`, enter some sample notes as plain text in Step input, and choose **Execute step**. Put the chip back before you save.

{{% callout style="checkrun" %}}
**Save** succeeds, the canvas shows 12 top-level blocks, with `classify` and `score` inside the loop frame (14 blocks in total, within the 40-block limit), and **validate → Execute step** publishes `total: 3`.
{{% /callout %}}

{{% callout style="exercise" %}}
Add a `docs` category to `classify` (titles starting with `docs`) with a weight of 1 in `score`. Which **three** places do you need to change?
{{% /callout %}}

{{% details title="Solution" %}}
1. In `classify`'s `jq`, add `elif ($t | test("^docs"; "i")) then "docs"`.
2. Add `docs` to `classify`'s output `enum`.
3. Add `docs = 1` to `$weights` in `score`. (Optionally also add a `docs` icon in `format`. Without one, the line shows `undefined`.)
{{% /details %}}
