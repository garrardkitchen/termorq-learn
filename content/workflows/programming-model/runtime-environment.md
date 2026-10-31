---
title: 'Working directory, environment, and secrets'
description: 'Where code runs, the TERMORQ_* variables, the env map, and the block timeout.'
weight: 6
---

{{% callout style="goal" %}}
Understand where your code runs and which environment variables it can see. **Time:** 10 minutes.
{{% /callout %}}

## Working directory

Each code block starts in the run's **`files/`** directory:

```text
workflows/runs/<workflow id>/<run id>/
├── run.json        # the run record
├── blocks/         # masked per-block logs
└── files/          # cwd for code; artifacts go here
```

Your project folder (the workflow's `folder` setting) **isn't** the working directory, and Termorq never changes it. Use `$TERMORQ_FOLDER` to read from it.

## Variables Termorq sets

| Variable | Value |
| --- | --- |
| `TERMORQ_INPUT` | Path to the input file (only set when the block has inputs) |
| `TERMORQ_OUTPUT` | The run's `files/` directory |
| `TERMORQ_FOLDER` | The workflow's configured `folder` |
| `TERMORQ_WORKFLOW` | The workflow ID |
| `TERMORQ_RUN` | The run ID |
| `TERMORQ_BLOCK` | The current block ID |

## The env map

The root `env:` map adds variables to every code block. Values **are** templates, so you can pass a secret to trusted code this way:

```yaml
schema: 1
name: Env demo
id: env-demo
folder: ~/src/acme-apis
timeout_secs: 120
secrets:
  - ACME_TOKEN
env:
  ACME_REGION: eu-west
  ACME_TOKEN: "{{ secrets.ACME_TOKEN }}"
blocks:
  - id: where
    kind: code
    language: bash
    body: |
      echo "cwd=$PWD" >&2
      echo "project=$TERMORQ_FOLDER run=$TERMORQ_RUN" >&2
      test -n "$ACME_TOKEN" && has=true || has=false
      jq -nc --arg r "$ACME_REGION" --argjson has "$has" '{region:$r, has_token:$has}'
    outputs:
      type: object
      properties:
        region: { type: string }
        has_token: { type: boolean }
```

## Timeouts

`timeout_secs` (default **600**) limits how long each block can run. You can change the default for new workflows under **Settings → Workflows**.

{{% callout style="checkrun" %}}
The stderr log shows `cwd=…/runs/env-demo/<run id>/files`, and the output is `region: "eu-west"`.
{{% /callout %}}

{{% callout style="exercise" %}}
Set `timeout_secs: 2` and add `sleep 5` to the block. What happens?
{{% /callout %}}

{{% details title="Solution" %}}
The block is stopped after 2 seconds and the run fails. Use short timeouts for blocks that call services that sometimes hang.
{{% /details %}}
