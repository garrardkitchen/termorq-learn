---
title: 'Pass a value to the next block'
description: 'Publish a property from one block and read it in the next with uses and TERMORQ_INPUT.'
weight: 2
---

{{% callout style="goal" %}}
Build a two-block workflow where block 2 reads a value that block 1 published. **Time:** 10 minutes. **Needs:** Python 3.
{{% /callout %}}

## Steps

1. Create a new workflow and paste this into the **YAML** tab:

```yaml
schema: 1
name: Pass a value
id: pass-a-value
blocks:
  - id: make_name
    name: Make name
    kind: code
    language: python
    body: |
      import json
      print(json.dumps({"name": "Ada"}))
    outputs:
      type: object
      properties:
        name:
          type: string

  - id: greet
    name: Greet
    kind: code
    language: python
    uses: [steps.make_name.name]
    body: |
      import json, os
      with open(os.environ["TERMORQ_INPUT"], encoding="utf-8") as f:
          data = json.load(f)
      name = data["steps"]["make_name"]["name"]
      print(json.dumps({"greeting": f"Hello, {name}!"}))
    outputs:
      type: object
      properties:
        greeting:
          type: string
```

2. Switch to **Editor**. Each card shows `steps.<id>` near its lower edge.
3. Select **Greet** and open **Properties → Input**. *Available data* lists `steps.make_name.name` with a **string** pill.
4. Click **Save**, then **Run**.

## What happened

- `make_name` printed `{"name": "Ada"}` as its last line. Because `name` is declared in `outputs`, Termorq published it as `steps.make_name.name`.
- `greet` listed `steps.make_name.name` under `uses`. Termorq wrote a temporary JSON file containing **only** that value, keeping its nesting:

  ```json
  {"steps":{"make_name":{"name":"Ada"}}}
  ```

- `TERMORQ_INPUT` holds the **path** to that file, not the JSON itself.

{{% callout style="warning" %}}
Code bodies are **not** template-expanded. Writing `{{ steps.make_name.name }}` inside Python source doesn't insert the value. Always use `uses` and read the input file.
{{% /callout %}}

## Check your run

{{% callout style="checkrun" %}}
**Greet → Output** shows `greeting: "Hello, Ada!"`. On the **Runs** tab, select the latest run: the **Greet** row shows the value passed through `uses`.
{{% /callout %}}

{{% callout style="exercise" %}}
Add a third block, `shout`, that reads `steps.greet.greeting` and publishes it upper-cased as `loud`.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
  - id: shout
    kind: code
    language: python
    uses: [steps.greet.greeting]
    body: |
      import json, os
      data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
      print(json.dumps({"loud": data["steps"]["greet"]["greeting"].upper()}))
    outputs:
      type: object
      properties:
        loud:
          type: string
```
{{% /details %}}
