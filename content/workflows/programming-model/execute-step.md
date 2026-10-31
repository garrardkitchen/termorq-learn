---
title: 'Test one block with Execute step'
description: 'Use the code editor, Step input, and input_sample to iterate on a block without a full run.'
weight: 5
---

{{% callout style="goal" %}}
Iterate on a single code block in seconds, without triggers or a new entry on **Runs**. **Time:** 10 minutes.
{{% /callout %}}

![Code node editor with sample input, parameters, and output panels](/images/app/workflows-code-editor.png "Code editor: upstream data on the left, parameters and snippet in the centre, output on the right. Browser preview with sample data.")

## Steps

1. Select a **Code** block and choose **Open code editor**.
2. Type JSON or plain text in **Step input**.
3. Choose **Execute step**. Only this block runs. The output panel shows stdout, errors, and published properties.
4. **Copy output** copies everything in that panel.
5. **Save** the workflow to keep the sample as `input_sample`.

## How Step input becomes the input file

| You type | `TERMORQ_INPUT` file contains |
| --- | --- |
| A JSON object, array, number, boolean, or `null` | That JSON |
| Plain text (including a JSON string value) | Raw text. It's also available as `inputs.text` and `trigger.text` |
| Nothing | `{}` |
| Text starting with `{` or `[` that isn't valid JSON | Rejected |

{{% callout style="important" %}}
In Execute step, Step input **is** the file. It isn't built from `uses`. To reproduce a full run, type the **same nested shape** that `uses` would produce, for example `{"trigger":{"text":"Hello"}}`, not `{"text":"Hello"}`.
{{% /callout %}}

## input_sample in YAML

```yaml
- id: echo
  kind: code
  language: python
  uses: [trigger.text]
  input_sample: |-
    {"trigger":{"text":"Hello from curl"}}
  body: |
    import json, os
    data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
    print(json.dumps({"message": data["trigger"]["text"]}))
  outputs:
    type: object
    properties:
      message: { type: string }
```

`input_sample` is a **test fixture**. A trigger or a full run never uses it as a default. A passing Execute step doesn't prove that the real trigger supplies every path in `uses`.

{{% callout style="checkrun" %}}
Execute step shows `message: "Hello from curl"`, and the **Runs** tab gets no new entry.
{{% /callout %}}

{{% callout style="exercise" %}}
Type the plain text `Hello` (without quotes) into Step input. The block above fails. Change the body so it handles **both** the nested JSON shape and plain text.
{{% /callout %}}

{{% details title="Solution" %}}
```python
import json, os
raw = open(os.environ["TERMORQ_INPUT"], encoding="utf-8").read()
try:
    text = json.loads(raw)["trigger"]["text"]
except (ValueError, KeyError, TypeError):
    text = raw
print(json.dumps({"message": text}))
```
{{% /details %}}

{{% callout style="note" %}}
Execute step is available for inline **Code** blocks. AI blocks have the equivalent **Open AI editor** ([Stage 4](/workflows/connecting-blocks/ai/)). Test **Code file** blocks with a full run.
{{% /callout %}}
