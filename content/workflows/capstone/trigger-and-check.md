---
title: 'Trigger it and check the run'
description: 'Arm the HTTP trigger, POST changes with curl, and verify every block on Runs.'
weight: 3
---

{{% callout style="goal" %}}
Start the capstone from outside Termorq and confirm that every block did its job. **Time:** 15 minutes.
{{% /callout %}}

## Steps

1. On **Triggers**, confirm that **HTTP request** is selected, **Save**, and **Confirm** the consent list. It names the `mock://` calls, the MCP tool, and the model.
2. Click **Copy key**.
3. Send a release with a breaking change:

```bash
export TERMORQ_HOOK_KEY='<paste the key>'
curl -sS -i \
  -H "content-type: application/json" \
  -H "x-api-key: $TERMORQ_HOOK_KEY" \
  -d '{"changes":["feat: dark mode","fix: crash on save","feat!: drop v1 API","docs: typo"]}' \
  http://127.0.0.1:8787/hooks/release-digest
```

4. Then send one without a breaking change:

```bash
curl -sS -i -H "content-type: application/json" -H "x-api-key: $TERMORQ_HOOK_KEY" \
  -d '{"changes":["feat: export to CSV","fix: typo in header"]}' \
  http://127.0.0.1:8787/hooks/release-digest
```

## Check your run

{{% callout style="checkrun" %}}
For the **first** request, **Runs → (latest)** shows:

- `validate`: `total: 4`
- `classify` and `score`, **four times each** (once per pass), with kinds `feature`, `fix`, `breaking`, and `other`
- `tally`: `breaking: 1`, `features: 1`, `fixes: 1`, `score: 11`
- `checksum`: a 16-character hex `checksum`
- `format` → `markdown` beginning `## Release notes digest`
- `stamp`: `file: digest.md`. **Open folder** → `files/digest.md` exists
- `publish`: `status: 200`, `path: digest`
- `post`: the MCP `content`
- `gate` → **ai_warn** ran and `quiet` is **Skipped**
- `done`: `status: 200`

For the **second** request, `breaking: 0`, so `quiet` publishes *No breaking changes in 2 items.* and `ai_warn` is **Skipped**.
{{% /callout %}}

Validated output from a local dry run of the code blocks (PowerShell scoring simulated, model and MCP omitted):

```markdown
## Release notes digest

- ✨ feat: dark mode (weight 3)
- 🐛 fix: crash on save (weight 2)
- 💥 feat!: drop v1 API (weight 5)
- • docs: typo (weight 1)

Breaking: 1 · Score: 11 · Checksum: <16 hex chars>

_Run <run id> · <timestamp>_
```

## Failure drills

Try each of these, then match what you see to the [troubleshooting playbook](/workflows/runs/troubleshooting/):

| Send | Expect |
| --- | --- |
| `{"changes":[]}` | `validate` fails: *inputs.changes must be a non-empty list* |
| `{"changes":"oops"}` | `validate` fails |
| No `x-api-key` header | `401`, and no run starts |
| `-H "content-type: text/plain"` | `415` |

{{% callout style="exercise" %}}
**Graduation task:** add a **Schedule** configuration (`cron: "0 8 * * 1"`, with `input: '{"changes":["chore: weekly check"]}'`) **without** making it the active trigger. Then explain how you would switch to it.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
triggers:
  enabled: true
  manual: true
  selected: http
  http: true
  schedule:
    cron: "0 8 * * 1"
    input: '{"changes":["chore: weekly check"]}'
```
To switch, set `selected: schedule`, or choose Schedule on **Triggers**. Remember that cron runs in **UTC**.
{{% /details %}}

🎉 **You've completed the Workflows track.** Keep the [reference docs](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/) handy, and use this capstone as a template for your own pipelines.
