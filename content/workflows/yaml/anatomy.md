---
title: 'Anatomy of a workflow file'
description: 'Every root key, what it does, and a fully annotated example.'
weight: 1
---

{{% callout style="goal" %}}
Recognise every root key and write a complete file from memory. **Time:** 15 minutes.
{{% /callout %}}

![The same workflow as YAML](/images/app/workflows-yaml.png "The YAML tab: the same workflow as the canvas. Browser preview with sample data.")

## Annotated example

```yaml
schema: 1                        # required: 1, or 2 when you use `target`
name: Refresh Acme users         # required: unique, ignoring case and surrounding spaces
id: refresh-acme-users           # required: a letter, then letters, numbers, or hyphens
description: |                   # optional Markdown, shown when the list row is expanded
  Pulls users hourly and posts a summary.
folder: ~/src/acme-apis          # project folder: TERMORQ_FOLDER and the code_file base
timeout_secs: 600                # per-block timeout (default 600)
notices:                         # notice cards; each defaults to true
  started: true
  progress: true
  finished: true
  failed: true
  stopped: true
  skipped: true
inputs:                          # named workflow inputs → inputs.<name>
  region:
    type: string
secrets:                         # names resolved from the secret store → secrets.<name>
  - ACME_CLIENT_SECRET
env:                             # extra env vars for code blocks; values are templates
  ACME_REGION: "{{ inputs.region }}"
triggers:                        # see Stage 8
  enabled: true
  manual: true
  selected: schedule
  schedule:
    every: 1h
blocks:                          # required: up to 40, including loop bodies
  - id: list_users
    kind: http
    method: GET
    url: mock://users
```

## Root keys

| Key | Required | Purpose |
| --- | --- | --- |
| `schema` | ✓ | `1`, or `2` when the file uses `target` |
| `name` | ✓ | Display name |
| `id` | ✓ | Stable ID, used in run folders, CLI commands, and HTTP hook URLs |
| `blocks` | ✓ | The steps |
| `description` | | Markdown description (raw HTML and images aren't rendered) |
| `folder` | | Project folder |
| `timeout_secs` | | Per-block timeout in seconds |
| `notices` | | `started`, `progress`, `finished`, `failed`, `stopped`, `skipped` |
| `inputs` | | Declared inputs (each with a schema such as `type`) |
| `secrets` | | A list of secret names |
| `env` | | Environment variables for code blocks |
| `triggers` | | Trigger configuration |
| `target` | | Where code runs (`localHost`, `useTab`, or a WSL mapping). **Requires `schema: 2`** |
| `skills` | | Skill binding for AI blocks |
| `canvas` | | `positions: { <block id>: { x, y } }`, written by the editor when you save |
| `consent` | | Written by the app when you confirm a trigger. Don't edit it by hand |

Any other key fails Save with *property '…' is not recognised.*

{{% callout style="checkrun" %}}
Paste the annotated example into a new workflow and click **Save**. It saves (you can leave the comments in). Then delete `id:` and click **Save** again: you get *'id' is missing.*
{{% /callout %}}

{{% callout style="exercise" %}}
Add a `notices` block that shows only failure cards.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
notices:
  started: false
  progress: false
  finished: false
  failed: true
  stopped: false
  skipped: false
```
{{% /details %}}

**Reference:** [Build a workflow → YAML](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/#yaml)
