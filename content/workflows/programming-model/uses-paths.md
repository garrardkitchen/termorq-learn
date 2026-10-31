---
title: 'Every path you can put in uses'
description: 'inputs, trigger, steps, loop, and secrets: where each comes from and when it is valid.'
weight: 2
---

{{% callout style="goal" %}}
Know every source a block can read from, and which ones Save accepts in each position. **Time:** 10 minutes.
{{% /callout %}}

| Path | Source | Valid when |
| --- | --- | --- |
| `inputs.<name>` | Workflow input, such as an HTTP request body field or a value you enter when you run the workflow | `<name>` is declared under the root `inputs:` key |
| `trigger.text` | Text from an HTTP or Telegram trigger | Always accepted by Save. Present at run time only if the trigger supplies it |
| `trigger.args` | The text after a Telegram command | Telegram trigger with a `command` |
| `trigger.chat_id`, `trigger.message_id`, `trigger.from_username` | Telegram message metadata | Telegram trigger |
| `trigger.path`, `trigger.received_at` | The changed file | File trigger |
| `steps.<id>.<prop>` | A property published by an earlier block | `<prop>` is declared in that block's `outputs`, or is always published (`status`, `exit`, `duration_ms`) |
| `steps.<loop id>.results` | Every pass of a loop | After the loop |
| `loop.item`, `loop.index`, `loop.count` | The current loop pass. `loop.index` starts at **1** | Only inside a loop `body` |
| `secrets.<name>` | The secret store, resolved at run time | `<name>` is listed under the root `secrets:` key |

## Declaring inputs and secrets

```yaml
schema: 1
name: Greet a city
id: greet-city
secrets:
  - WEATHER_API_KEY
inputs:
  city:
    type: string
blocks:
  - id: greet
    kind: code
    language: python
    uses: [inputs.city, secrets.WEATHER_API_KEY]
    body: |
      import json, os
      data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
      key_present = bool(data["secrets"]["WEATHER_API_KEY"])
      print(json.dumps({"line": f"Hello {data['inputs']['city']}", "has_key": key_present}))
    outputs:
      type: object
      properties:
        line:
          type: string
        has_key:
          type: boolean
```

{{% callout style="warning" %}}
Never print a secret. Termorq redacts known secret values from logs and masks them in the run record, but the safest secret is one that never reaches stdout. Keep secrets out of `input_sample` too.
{{% /callout %}}

{{% callout style="checkrun" %}}
Delete `secrets:` and click **Save**. Save reports `'secrets.WEATHER_API_KEY' is not a property this block can use.` Put it back and the workflow saves.
{{% /callout %}}

{{% callout style="exercise" %}}
Move `uses: [loop.item]` onto a top-level block (one that isn't in a loop). What does Save say?
{{% /callout %}}

{{% details title="Solution" %}}
`'loop.item' is not a property this block can use.` `loop.*` paths are only valid inside a loop's `body`. See [Stage 5](/workflows/control-flow/).
{{% /details %}}
