---
title: 'Inside a run folder'
description: 'run.json, blocks/ logs, files/, retention, and what is masked.'
weight: 1
---

{{% callout style="goal" %}}
Find and read everything a run left behind. **Time:** 10 minutes.
{{% /callout %}}

```text
workflows/runs/<workflow id>/<run id>/
├── run.json      # the run record: blocks, inputs passed via uses, outputs, status
├── blocks/       # per-block logs (secrets masked)
└── files/        # cwd for code blocks; artifacts written via TERMORQ_OUTPUT
```

**Settings → Workflows** shows where this folder is on your computer.

## From the Runs tab

1. Open a workflow and choose **Runs** (or choose **Runs** on its row in the list).
2. Select a run. Every block captured when the run started is listed, with its values from `uses`, resolved requests, outputs, and text or error.
3. **Copy input** and **Copy output** copy those values for a block. Secrets stay masked.
4. Loop body blocks appear **once per pass**.
5. **Open folder** opens the run directory, and **Delete run** removes it, including `files/`. Delete asks first, and focus starts on **Cancel**.

Drag the divider to give the history list or the run details more room.

## Retention

Termorq keeps the **newest 50** runs per workflow (configurable in **Settings → Workflows**). Each new run deletes the oldest folder beyond the limit. The **disk use** shown in the workflow list counts the definition plus all of its run files.

{{% callout style="warning" %}}
`files/` is deleted along with the run. Copy any artifact you want to keep somewhere else, for example by adding a final Code block that copies it to `$TERMORQ_FOLDER/reports/`.
{{% /callout %}}

{{% callout style="checkrun" %}}
Run *Output rules* from Stage 2 that writes `report.csv`, then click **Open folder**: the file is in `files/`, and `run.json` lists the `emit` block's outputs.
{{% /callout %}}

{{% callout style="exercise" %}}
Add a final block that copies `report.csv` into `$TERMORQ_FOLDER/reports/<run id>.csv`.
{{% /callout %}}

{{% details title="Solution" %}}
```bash
set -euo pipefail
mkdir -p "$TERMORQ_FOLDER/reports"
cp "$TERMORQ_OUTPUT/report.csv" "$TERMORQ_FOLDER/reports/$TERMORQ_RUN.csv"
jq -nc --arg p "reports/$TERMORQ_RUN.csv" '{ok:true, saved:$p}'
```
{{% /details %}}
