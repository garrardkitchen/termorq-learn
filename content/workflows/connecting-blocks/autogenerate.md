---
title: '✦ Autogenerate'
description: 'Generate language-correct code that reads an earlier node, and add missing fields to its schema.'
weight: 5
---

{{% callout style="goal" %}}
Let Termorq write the input-reading code and the `uses` list for you. **Time:** 10 minutes.
{{% /callout %}}

![Autogenerate panel with an HTTP source node selected](/images/app/workflows-code-autogenerate.png "Autogenerate with an HTTP source with no output schema: status is always present, body will be added to the schema, and a Python preview. Browser preview with sample data.")

## Steps

1. Open a Code block's code editor and **click where you want the code to go**. The panel remembers the cursor position. If you never clicked in the editor, the code is appended at the end.
2. Choose **✦ Autogenerate** on the **Snippet** row.
3. Choose the **Source node**. The node wired into this block is selected first. The list shows how many steps back each node is, and shows **input** if the workflow declares inputs.
4. Review the fields:
   - **AI**, and nodes with a complete schema: lists their declared outputs and says *Schema complete — nothing to add*.
   - **HTTP**: `status` (number) is always included. `body` and any top-level JSON keys from the last run are marked *Will add to this node's output schema*.
   - **MCP**, and code without a schema: shows an inferred checklist (`text`, tool-result fields, or keys from the last run). Fields whose type can't be inferred are shown in **amber** with a type picker, defaulting to string. Unchecked fields are left out.
5. Check the **Preview**, which is written in the block's language. If code above the cursor already opens `TERMORQ_INPUT`, the preview reuses that variable. Bash previews use `jq`.
6. Choose **Insert**, or **Add schema & Insert** if fields will be added to the source node's schema.

## What Insert changes

- The code goes on its own lines, tinted teal with an **Inserted at cursor** (or **Appended**) badge.
- Each path, such as `steps.fetch_users.status`, is added to this block's `uses`.
- Any new fields are added to the **source** node's output schema, so *Available data* and Save accept them.
- **Undo** in the notice restores the snippet, `uses`, and the source schema together. The tint and the notice last 10 seconds by default. You can change this to between 1 and 60 seconds under **Settings → Workflows → Code editor**.

{{% callout style="tip" %}}
Run the workflow once before you use Autogenerate on an HTTP or MCP source. The panel infers fields from **the last run**, so it can offer real keys rather than guesses.
{{% /callout %}}

{{% callout style="checkrun" %}}
In the HTTP mock workflow, add a Python block after `ping` and autogenerate from `ping`. The preview reads `data["steps"]["ping"]["status"]`, and after **Insert**, `uses` contains `steps.ping.status`.
{{% /callout %}}

{{% callout style="exercise" %}}
Autogenerate the same block in **Bash**. What does the preview use to read values?
{{% /callout %}}

{{% details title="Solution" %}}
`jq`, for example `status=$(jq -r '.steps.ping.status' "$TERMORQ_INPUT")`. The exact generated lines may differ slightly between releases.
{{% /details %}}

**Reference:** [Autogenerate code from an earlier node](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/#autogenerate-code-from-an-earlier-node)
