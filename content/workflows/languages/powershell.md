---
title: 'PowerShell'
description: 'Raw reads, ConvertFrom-Json, and compact ConvertTo-Json output.'
weight: 2
---

{{% callout style="goal" %}}
Write a PowerShell block that reads nested JSON and publishes one compact line. **Time:** 10 minutes. **Needs:** `pwsh`.
{{% /callout %}}

```yaml
language: powershell
```

```powershell
$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($env:TERMORQ_INPUT)) {
    throw 'TERMORQ_INPUT is missing'
}
$data = Get-Content -Raw -LiteralPath $env:TERMORQ_INPUT | ConvertFrom-Json
$text = $data.trigger.text
if ($text -isnot [string]) {
    throw 'trigger.text must be a string'
}
@{ message = $text } | ConvertTo-Json -Compress -Depth 10
```

## Things to know

- Files run with `-NoProfile -NonInteractive -ExecutionPolicy Bypass`, so your profile isn't loaded.
- `-Raw` reads the whole file. `-LiteralPath` stops PowerShell treating `[` and `*` in the path as wildcards.
- Always use `-Compress`. Without it, `ConvertTo-Json` prints several lines and breaks the last-line rule. Add `-Depth` for nested objects.
- `$ErrorActionPreference = 'Stop'` turns non-terminating errors into failures.
- Captured Command Prompt commands become PowerShell blocks that call `cmd.exe` through `%ComSpec%`.

{{% callout style="checkrun" %}}
Execute step prints `{"message":"Hello from curl"}`.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `upper` (the text in upper case) and `length` (number) in the same object.
{{% /callout %}}

{{% details title="Solution" %}}
```powershell
$data = Get-Content -Raw -LiteralPath $env:TERMORQ_INPUT | ConvertFrom-Json
$t = [string]$data.trigger.text
@{ upper = $t.ToUpperInvariant(); length = $t.Length } | ConvertTo-Json -Compress
```
{{% /details %}}
