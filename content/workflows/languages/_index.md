---
title: 'Stage 3 · Seven languages'
linkTitle: '3 · Seven languages'
description: 'The same input/output contract in Bash, PowerShell, Python, C#, Rust, JavaScript, and TypeScript.'
weight: 40
---

Code and Code file blocks accept seven `language` values. Every lesson in this stage builds the **same block**: it reads `trigger.text` and publishes it as `message`. That way you can compare the languages side by side.

## Starter workflow

Paste this once, then swap in each lesson's `language` and `body`:

```yaml
schema: 1
name: Seven languages
id: seven-languages
blocks:
  - id: echo
    name: Echo
    kind: code
    language: python
    uses: [trigger.text]
    input_sample: |-
      {"trigger":{"text":"Hello from curl"}}
    body: |
      # replace with the lesson's source
    outputs:
      type: object
      properties:
        message:
          type: string
```

Test each one with **Open code editor → Execute step**.

## At a glance

| Language | `language` | Runner | JSON in the standard library? |
| --- | --- | --- | --- |
| Bash | `bash` | `bash` | No. Use `jq` |
| PowerShell | `powershell` | `pwsh -NoProfile -NonInteractive -ExecutionPolicy Bypass` | Yes (`ConvertFrom-Json`) |
| Python | `python` | `python3 -u` | Yes (`json`) |
| C# | `csharp` | `dotnet run snippet.cs` (.NET 10+) | Yes (`System.Text.Json`) |
| Rust | `rust` | `rustc --edition 2024 -O` | **No**, and there's no Cargo |
| JavaScript | `javascript` | `node snippet.mjs` (ES module) | Yes (`JSON`) |
| TypeScript | `typescript` | Node 22.6+ native, or `tsx` | Yes (`JSON`) |

{{< tabs groupid="lang" title="Read trigger.text → publish message" >}}
{{% tab title="Bash" %}}
```bash
set -euo pipefail
jq -ce '{message: .trigger.text}' "$TERMORQ_INPUT"
```
{{% /tab %}}
{{% tab title="PowerShell" %}}
```powershell
$data = Get-Content -Raw -LiteralPath $env:TERMORQ_INPUT | ConvertFrom-Json
@{ message = $data.trigger.text } | ConvertTo-Json -Compress
```
{{% /tab %}}
{{% tab title="Python" %}}
```python
import json, os
data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
print(json.dumps({"message": data["trigger"]["text"]}))
```
{{% /tab %}}
{{% tab title="C#" %}}
```csharp
using System.Text.Json;
using System.Text.Json.Nodes;
using var doc = JsonDocument.Parse(File.ReadAllText(Environment.GetEnvironmentVariable("TERMORQ_INPUT")!));
var text = doc.RootElement.GetProperty("trigger").GetProperty("text").GetString();
Console.WriteLine(new JsonObject { ["message"] = text }.ToJsonString());
```
{{% /tab %}}
{{% tab title="Rust" %}}
```rust
use std::{env, fs};
fn main() {
    let input = fs::read(env::var("TERMORQ_INPUT").unwrap()).unwrap();
    println!("{{\"input_bytes\":{}}}", input.len()); // declare input_bytes: number
}
```
{{% /tab %}}
{{% tab title="JavaScript" %}}
```javascript
import { readFileSync } from "node:fs";
const data = JSON.parse(readFileSync(process.env.TERMORQ_INPUT, "utf8"));
console.log(JSON.stringify({ message: data.trigger.text }));
```
{{% /tab %}}
{{% tab title="TypeScript" %}}
```typescript
import { readFileSync } from "node:fs";
type Input = { trigger: { text: string } };
const data = JSON.parse(readFileSync(process.env.TERMORQ_INPUT!, "utf8")) as Input;
console.log(JSON.stringify({ message: data.trigger.text }));
```
{{% /tab %}}
{{< /tabs >}}

The short versions above leave out validation. Each lesson shows the production version, which validates its input.

{{% pages description="true" display="tree" %}}
