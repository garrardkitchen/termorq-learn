---
title: 'File change'
description: 'Watch the workflow folder, filter by path, and read trigger.path.'
weight: 4
---

{{% callout style="goal" %}}
Run a workflow whenever a particular file in your project changes. **Time:** 10 minutes.
{{% /callout %}}

```yaml
schema: 1
name: On config change
id: on-config-change
folder: ~/src/acme-apis
triggers:
  enabled: true
  selected: file
  file:
    path: config/app.json     # relative to `folder`; must be inside it
    debounce_ms: 1500
blocks:
  - id: changed
    kind: code
    language: python
    uses: [trigger.path, trigger.received_at]
    body: |
      import json, os
      t = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["trigger"]
      print(json.dumps({"line": f"{t['path']} changed at {t['received_at']}"}))
    outputs:
      type: object
      properties:
        line: { type: string }
```

## Rules

- Termorq watches **inside the workflow `folder`**, and refuses a path outside it.
- Changes are **debounced** (by 1.5 seconds by default), so a burst of saves starts one run.
- `path` matches the changed file's path relative to the folder (or a trailing part of it). If you leave `path` empty, any change in the folder triggers a run.
- The trigger provides `trigger.path` and `trigger.received_at`.

{{% callout style="warning" %}}
Don't write files into the watched folder from the same workflow, or each run will trigger the next one. Write artifacts to `$TERMORQ_OUTPUT` instead.
{{% /callout %}}

{{% callout style="checkrun" %}}
Run `touch ~/src/acme-apis/config/app.json`. One run starts, and `line` names the file.
{{% /callout %}}

{{% callout style="exercise" %}}
Make the block validate that the changed file is still valid JSON, and publish `valid: boolean`.
{{% /callout %}}

{{% details title="Solution" %}}
```python
import json, os
t = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["trigger"]
p = os.path.join(os.environ["TERMORQ_FOLDER"], "config", "app.json")
try:
    json.load(open(p, encoding="utf-8")); ok = True
except Exception:
    ok = False
print(json.dumps({"valid": ok}))
```
{{% /details %}}
