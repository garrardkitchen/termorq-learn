---
title: 'AI block'
description: 'Prompt a saved model, get a structured summary, and test it with the AI editor.'
weight: 4
---

{{% callout style="goal" %}}
Ask a model for a one-sentence summary and use it in a later block. **Time:** 15 minutes. **Needs:** a saved OpenAI-compatible model connection (here **Summary model**).
{{% /callout %}}

```yaml
- id: summarise
  kind: ai
  connection: Summary model
  system: 'Return a single JSON object with a string property named "summary".'
  prompt: "Summarise this message in one sentence: {{ steps.echo.message }}"
  max_tokens: 128
  input_sample: |-
    {"trigger":{"text":"Deploy finished in 4m with 2 warnings"}}
  outputs:
    type: object
    properties:
      summary: { type: string }
```

## How it works

- `system` and `prompt` are **templates**. Values you insert are sent to the model, and secrets are masked in the run record.
- The block always publishes `text` (the reply) and `model`.
- If you declare **another** property, such as `summary`, Termorq asks the model to end its reply with one JSON object and reads that final line. If the reply doesn't end with that object, the block fails.
- A new AI block starts with a prompt that already includes earlier properties, and a default `summary` output.

## Test it in isolation

Select the block and choose **Open AI editor**. Type JSON or plain text in **Step input** and choose **Execute step**:

| Step input | Available in the prompt as |
| --- | --- |
| `{"trigger":{"text":"Hello"}}` | `{{ trigger.text }}` |
| `{"name":"Ada"}` | `{{ inputs.name }}` |
| `Hello` (plain text) | `{{ trigger.text }}` and `{{ inputs.text }}` |

The editor shows the response, errors, published output, and any skills used. Isolated tests don't start triggers or create a Runs entry. `input_sample` is saved with the workflow, but a full run never uses it.

{{% callout style="warning" %}}
Model output is **data, not a decision**. Validate it in Code or a Decision before you act on it, for example by checking `summary` isn't empty and is under 200 characters.
{{% /callout %}}

{{% callout style="checkrun" %}}
The AI editor shows a reply ending in a line like `{"summary":"The deploy completed in four minutes with two warnings."}`, and **Output** lists `summary`. The exact wording varies from run to run.
{{% /callout %}}

{{% callout style="exercise" %}}
Change the block to classify the message as `info`, `warning`, or `error`, publishing `severity` constrained by `enum`.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
  system: 'Classify the message. Reply with one JSON object: {"severity": "info"|"warning"|"error"}.'
  prompt: "{{ steps.echo.message }}"
  outputs:
    type: object
    properties:
      severity:
        type: string
        enum: [info, warning, error]
```
{{% /details %}}
