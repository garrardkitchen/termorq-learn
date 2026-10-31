---
title: 'Export, import, and team workspaces'
description: 'Single YAML, .aitwf bundles with optional encryption, imports as paused copies, and workspace files.'
weight: 2
---

{{% callout style="goal" %}}
Share a workflow with a colleague safely. **Time:** 10 minutes.
{{% /callout %}}

## Export

- **Export** on a row saves a single workflow as readable `.yml`.
- To export several, tick the rows, or use **Select shown** to tick everything matching the current search and filters. Then choose **Export selected** to save a versioned **`.aitwf`** bundle of up to **50** workflows.
- Optionally turn on **Encrypt the export with a password**. Encrypted exports use Argon2id and AES-256-GCM. **The password can't be recovered.**
- Exports contain **definitions only**: no run history and no local credentials.

## Import

1. Choose **Import workflows** and pick `.yml`/`.yaml` files or an `.aitwf` bundle (Termorq asks for the password if it's encrypted).
2. Termorq validates every workflow before it saves any of them.
3. Each one becomes a **new copy with a new ID**, saved under **Yours**, with its automatic **triggers paused**.
4. Check the connections and secret names on this computer before you arm a trigger.

## Team workspace

When a team workspace is open, its workflows live in `.ai-terminal/workflows/<id>.yml`, and the list's **Workspace** chip shows them. Commit them with git yourself; **Termorq never commits or pushes them**. Raw tokens are refused, so refer to credentials by `secrets:` names.

{{% callout style="checkrun" %}}
Export two workflows as an encrypted bundle, then import it. Two new copies appear under **Yours**, with new IDs and paused triggers.
{{% /callout %}}

{{% callout style="exercise" %}}
A colleague's imported workflow fails at its HTTP block on your computer. Before anything else, what should you check?
{{% /callout %}}

{{% details title="Solution" %}}
Check that you have a saved endpoint with the **same name** as the block's `endpoint:` (and any secret names it uses). Exports don't include connections or credentials.
{{% /details %}}
