---
title: 'Schedule'
description: 'Preset intervals, 5-field cron (evaluated in UTC), and scheduled inputs.'
weight: 2
---

{{% callout style="goal" %}}
Run a workflow every hour, and on weekday mornings. **Time:** 10 minutes.
{{% /callout %}}

## Presets

```yaml
triggers:
  enabled: true
  selected: schedule
  schedule:
    every: 1h        # 1m | 5m | 15m | 30m | 1h | 1d
```

## Cron

```yaml
  schedule:
    cron: "0 7 * * 1-5"    # minute hour day-of-month month day-of-week
```

- Five fields are supported, using `*`, lists (`1,15`), ranges (`1-5`), and steps (`*/15`). Both `0` and `7` mean Sunday.
- Runs are **at least one minute apart**.

{{% callout style="important" %}}
Cron expressions are matched against **UTC**. In London during British Summer Time (UTC+1), `0 7 * * 1-5` fires at 08:00 local time. Adjust the hour for your time zone.
{{% /callout %}}

## Passing inputs on a schedule

`schedule.input` provides the run's inputs. A JSON object becomes `inputs.*`. Any other value becomes `inputs.input`.

```yaml
inputs:
  region:
    type: string
triggers:
  enabled: true
  selected: schedule
  schedule:
    every: 1d
    input: '{"region":"eu-west"}'
```

{{% callout style="checkrun" %}}
With `every: 1m`, two runs appear on **Runs** about a minute apart. Pause triggers afterwards.
{{% /callout %}}

{{% callout style="exercise" %}}
Write a cron expression for "every 15 minutes during 09:00–17:59 UTC, Monday to Friday".
{{% /callout %}}

{{% details title="Solution" %}}
`*/15 9-17 * * 1-5`
{{% /details %}}
