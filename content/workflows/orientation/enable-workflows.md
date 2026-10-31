---
title: 'Enable Workflows and install runtimes'
description: 'Turn on the experimental flag and check which language runtimes the code runner can find.'
weight: 2
---

{{% callout style="goal" %}}
Switch Workflows on and confirm that the runtimes you plan to use are on `PATH`. **Time:** 10 minutes. **Needs:** Termorq Pro (or Trial).
{{% /callout %}}

{{% callout style="pro" %}}
Free builds don't offer the experimental flag or the Workflows page. The edition pill (**FREE**, **TRIAL**, or **PRO**) is at the right of the header.
{{% /callout %}}

## Steps

1. Open **Settings → Experimental**.
2. Turn on **Workflows**. It is off by default.
3. Open the page with **Cmd+Shift+G** (macOS) or **Ctrl+Shift+G** (Windows/Linux). You can also open the jump list with **Ctrl+J** and choose **Workflows**, or type `@flow`.

If you later turn the flag off, Termorq hides the page's entry points and workflow settings. A workflow that is already open stays open until you leave it.

## Check your runtimes

Termorq doesn't bundle language runtimes. The code runner uses whatever is installed on your computer. Run these commands in a Termorq terminal tab:

{{< tabs groupid="os" >}}
{{% tab title="macOS / Linux" %}}
```bash
bash --version | head -1
jq --version            # used by Bash JSON examples
pwsh --version          # PowerShell
python3 --version
dotnet --version        # needs 10.0 or later for C#
rustc --version         # needs Rust 2024 edition support
node --version          # 22.6+ runs TypeScript natively
```
{{% /tab %}}
{{% tab title="Windows" %}}
```powershell
bash --version          # Git Bash or WSL exposed on PATH
jq --version
pwsh --version
python --version
dotnet --version
rustc --version
node --version
```
{{% /tab %}}
{{< /tabs >}}

| Language | Needs |
| --- | --- |
| Bash | `bash` on `PATH`. Workflow Bash is always Bash, even if your terminal tab runs another shell. |
| PowerShell | `pwsh` (runs with `-NoProfile -NonInteractive -ExecutionPolicy Bypass`) |
| Python | Python 3 as `python3` or `python` (runs unbuffered with `-u`) |
| C# | .NET SDK 10+ (single-file app via `dotnet run`) |
| Rust | `rustc` with edition 2024 (`--edition 2024 -O`), without Cargo |
| JavaScript | Node.js (runs as an ES module, `snippet.mjs`) |
| TypeScript | Node.js 22.6+ native type stripping, or a `tsx` executable |

{{% callout style="warning" %}}
If you install a runtime while Termorq is open, **restart Termorq** so it can find the runtime.
{{% /callout %}}

{{% callout style="checkrun" %}}
The Workflows page opens and lists at least the **Included** workflows, such as *Refresh Acme users* and *Probe mock*. Each runtime you plan to use prints a version.
{{% /callout %}}

{{% callout style="exercise" %}}
Find out which Node.js version you have. Will TypeScript blocks run natively, or will they need `tsx`?
{{% /callout %}}

{{% details title="Solution" %}}
`node --version` 22.6 or newer: native type stripping is used, even if `tsx` is also installed. Older: install `tsx` (`npm i -g tsx`) and restart Termorq.
{{% /details %}}

**Reference:** [Node types and code languages](https://termorq-docs.garrardkitchen.com/docs/workflows/node-types/)
