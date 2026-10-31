---
title: 'Loop: for each item'
description: 'Iterate an array, read loop.item and loop.index, and collect results.'
weight: 2
---

{{% callout style="goal" %}}
Run a block once per array item and use the collected results. **Time:** 15 minutes.
{{% /callout %}}

![Loop with a nested Notify user block in its body frame](/images/app/workflows-loop.jpg "A loop frame with a nested block.")

```yaml
schema: 1
name: Loop names
id: loop-names
blocks:
  - id: names
    kind: code
    language: python
    body: |
      import json; print(json.dumps({"items": ["Ada", "Lin", "Grace"]}))
    outputs:
      type: object
      properties:
        items: { type: array, items: { type: string } }

  - id: each_name
    kind: loop
    for_each: steps.names.items
    max: 20
    body:
      - id: greet
        kind: code
        language: python
        uses: [loop.item, loop.index, loop.count]
        body: |
          import json, os
          d = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["loop"]
          print(json.dumps({"greeting": f"Hello {d['item']} ({d['index']}/{d['count']})"}))
        outputs:
          type: object
          properties:
            greeting: { type: string }

  - id: count_passes
    kind: code
    language: python
    uses: [steps.each_name.results]
    body: |
      import json, os
      r = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["steps"]["each_name"]["results"]
      print(json.dumps({"count": len(r), "first": r[0]["greet"]["greeting"]}))
    outputs:
      type: object
      properties:
        count: { type: number }
        first: { type: string }
```

## Loop facts

| Fact | Value |
| --- | --- |
| Loop context | `loop.item` (the current element), `loop.index` (**starts at 1**), `loop.count` |
| Output | `steps.<loop id>.results`: one object per pass, **keyed by child block ID**, plus `status` and `exit` |
| `max` | Defaults to **20**, and the ceiling is **100** |
| Passes per run | **100** in total, across all loops |
| Nesting | Up to **2** levels deep |
| Blocks per file | 40, **including** loop bodies |

In the editor, a loop is a **frame**. Add blocks with the **+** inside the frame, or drag existing blocks into it. While it runs, the frame shows progress such as `3 of 12`. Keep the `- id:` of each child indented under `body:` in YAML.

{{% callout style="checkrun" %}}
**count_passes** publishes `count: 3` and `first: "Hello Ada (1/3)"`. On **Runs**, `greet` appears **three times**, once per pass.
{{% /callout %}}

{{% callout style="exercise" %}}
Replace the inline `names` block with a workflow input: declare `inputs: names: {type: array, items: {type: string}}` and loop over `inputs.names`.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
inputs:
  names:
    type: array
    items: { type: string }
blocks:
  - id: each_name
    kind: loop
    for_each: inputs.names
    body: [ ...same greet block... ]
```
When you press **Run**, enter the names. An HTTP trigger can supply them as `{"names":["Ada","Lin"]}`.
{{% /details %}}
