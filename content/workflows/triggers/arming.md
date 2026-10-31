---
title: 'Choosing and arming a trigger'
description: 'One active trigger, the consent prompt, Pause triggers, and the triggers YAML block.'
weight: 1
---

{{% callout style="goal" %}}
Understand how a trigger becomes active and safe. **Time:** 10 minutes.
{{% /callout %}}

## One active automatic trigger

A workflow can **store** settings for every trigger type, but only the **selected** one starts runs automatically. Manual **Run** is always available.

```yaml
triggers:
  enabled: true          # false = all automatic triggers paused
  manual: true
  selected: schedule     # manual | schedule | startup | after | file | http | telegram
  schedule:
    every: 1h
  http: true             # kept for later, but inactive while schedule is selected
```

## Consent

The first time you enable an automatic trigger, the page lists **every HTTP call, MCP tool, model connection, and secret name** that a run can use. **Confirm** arms the trigger, and **Cancel** leaves it off. If you later add a new call or secret name, Termorq asks again. A manual **Run** never asks.

## Pausing

**Pause triggers** stops automatic starts. **Run** still works. Copies and imports always start with their triggers **paused**.

| Trigger | `selected` | Starts when |
| --- | --- | --- |
| Manual | `manual` | You press **Run**, use `@flow`, or run `termorq-cli workflow run` |
| Schedule | `schedule` | A preset interval or a 5-field cron expression matches |
| At startup | `startup` | The app process opens (once) |
| After workflow | `after` | Another workflow finishes with `success`, `failed`, or `any` |
| File | `file` | Something changes inside the workflow folder (debounced by 1.5 seconds) |
| HTTP | `http` | `POST /hooks/<id>` with a valid `x-api-key` |
| Telegram | `telegram` | A message arrives from an allowlisted chat |

{{% callout style="checkrun" %}}
Enable a schedule on a copy of *Probe mock*. The consent list names its `mock://` call and the `ACME_CLIENT_SECRET` secret. Click **Confirm**, and the list row shows **Schedule**.
{{% /callout %}}

{{% callout style="exercise" %}}
Your workflow has both `schedule` and `http` configured. How do you make HTTP the active trigger without losing the schedule settings?
{{% /callout %}}

{{% details title="Solution" %}}
Set `selected: http`, or choose HTTP request on **Triggers**. The schedule settings stay saved but inactive.
{{% /details %}}

**Reference:** [Triggers, runs, and notices](https://termorq-docs.garrardkitchen.com/docs/workflows/triggers/)
