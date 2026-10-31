---
title: 'Python'
description: 'Standard-library JSON, stderr diagnostics, and Unicode-safe output.'
weight: 3
---

{{% callout style="goal" %}}
Write the standard Python block, which most later lessons use. **Time:** 5 minutes. **Needs:** Python 3.
{{% /callout %}}

```yaml
language: python
```

```python
import json
import os

with open(os.environ["TERMORQ_INPUT"], encoding="utf-8") as stream:
    data = json.load(stream)
text = data["trigger"]["text"]
if not isinstance(text, str):
    raise ValueError("trigger.text must be a string")
print(json.dumps({"message": text}, ensure_ascii=False))
```

## Things to know

- The runner looks for `python3`, then `python`, and runs it unbuffered (`-u`). Print statements appear in order.
- An uncaught exception exits with a non-zero code, so the block fails and the traceback appears in the error output.
- `ensure_ascii=False` keeps Unicode readable. The output is valid JSON either way.
- Use `print(..., file=sys.stderr)` for diagnostics.
- Only the standard library is guaranteed. If you `pip install` something, it's installed for that interpreter on this computer, not for the workflow.

{{% callout style="checkrun" %}}
Execute step with `{"trigger":{"text":"Grüße 👋"}}` publishes `message: "Grüße 👋"`.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `slug`: the text in lower case, with runs of non-alphanumeric characters replaced by `-`, and leading and trailing `-` removed.
{{% /callout %}}

{{% details title="Solution" %}}
```python
import json, os, re
text = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["trigger"]["text"]
print(json.dumps({"slug": re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")}))
```
{{% /details %}}
