---
title: 'Decision: choose one route'
description: 'Write when conditions, route with goto, and rejoin branches with then.'
weight: 1
---

{{% callout style="goal" %}}
Route to one of two blocks based on an earlier value, then rejoin. **Time:** 15 minutes.
{{% /callout %}}

![Decision with YES and ELSE routes that converge on Notify](/images/app/workflows-decision.jpg "A decision with When and Else routes converging on one block.")

```yaml
schema: 1
name: Decision demo
id: decision-demo
inputs:
  text:
    type: string
blocks:
  - id: echo
    kind: code
    language: python
    uses: [inputs.text]
    body: |
      import json, os
      d = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
      print(json.dumps({"message": d["inputs"]["text"].strip()}))
    outputs:
      type: object
      properties:
        message: { type: string }

  - id: choose
    kind: decision
    branches:
      - when: steps.echo.message != ""
        goto: has_text
      - else: true
        goto: empty_text

  - id: has_text
    kind: code
    language: python
    body: |
      import json; print(json.dumps({"route": "non-empty"}))
    outputs:
      type: object
      properties:
        route: { type: string }
    then: joined

  - id: empty_text
    kind: code
    language: python
    body: |
      import json; print(json.dumps({"route": "empty"}))
    outputs:
      type: object
      properties:
        route: { type: string }
    then: joined

  - id: joined
    kind: http
    url: mock://done
```

## Rules

- Termorq evaluates branches **in order**, and the **first true `when` wins**.
- `else: true` is the required fallback.
- `goto` names a block ID. Blocks that aren't chosen are marked **Skipped**.
- Set `then` on each branch block so the routes **converge**. Without it, `has_text` would carry on to `empty_text`, because that's next in file order.
- A shared continuation must **not** require outputs from both branches, because one of them didn't run.

## Condition language

Conditions compare workflow values. They're **not** Bash, JavaScript, or C#.

| Form | Example |
| --- | --- |
| Compare: `==` `!=` `<` `<=` `>` `>=` | `steps.lookup.total > 0` |
| Contains (string or array) | `steps.lookup.names contains "Ada"` |
| Exists (postfix) | `steps.lookup.names exists` |
| Combine with `and`, `or`, `( )` | `steps.lookup.names exists and steps.lookup.total >= 1` |
| Literals | `"text"`, `'text'`, `42`, `true`, `false` |
| Any path | `steps.*`, `inputs.*`, `trigger.*`, `loop.*` |

In the editor, the larger **When** box suggests properties from earlier blocks. Drag the **When** and **Else** handles onto blocks to set their targets.

{{% callout style="checkrun" %}}
Run with `text` = `hi`: **has_text** runs, **empty_text** is **Skipped**, and **joined** runs. Run again with an empty value and the opposite route runs.
{{% /callout %}}

{{% callout style="exercise" %}}
Add a third route: if the message contains `urgent`, go to an `escalate` block first.
{{% /callout %}}

{{% details title="Solution" %}}
Put it **first**, because the first true branch wins:
```yaml
    branches:
      - when: steps.echo.message contains "urgent"
        goto: escalate
      - when: steps.echo.message != ""
        goto: has_text
      - else: true
        goto: empty_text
```
Give `escalate` a `then: joined` as well.
{{% /details %}}
