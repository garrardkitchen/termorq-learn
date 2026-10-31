---
title: 'TERMORQ_INPUT is a path'
description: 'Read the input file correctly, keep its nesting, and avoid the three most common mistakes.'
weight: 1
---

{{% callout style="goal" %}}
Read workflow input from `TERMORQ_INPUT` the right way. **Time:** 10 minutes. **Needs:** Python 3 and Bash with `jq`.
{{% /callout %}}

## The rule

`TERMORQ_INPUT` is an **environment variable that contains a file path**. Open that file, then parse its contents.

- It's **not** the JSON itself. Don't run `json.loads(os.environ["TERMORQ_INPUT"])`.
- **stdin is closed**, so reading stdin gets you nothing.
- Code bodies are **not** template-expanded, so `{{ ... }}` inside source code stays as literal text.

The file contains only the paths listed in `uses`, **nested exactly as their dotted paths**:

```yaml
uses:
  - trigger.text
  - steps.lookup.total
```

```json
{"trigger":{"text":"Hello"},"steps":{"lookup":{"total":2}}}
```

You read `data["trigger"]["text"]`, not a flattened `data["text"]`.

## Try it

Paste this workflow. It uses a mock HTTP block, so it makes no network calls:

```yaml
schema: 1
name: Read input
id: read-input
blocks:
  - id: lookup
    kind: http
    method: GET
    url: mock://users
    outputs:
      type: object
      properties:
        path:
          type: string
  - id: show
    kind: code
    language: python
    uses: [steps.lookup.status, steps.lookup.path]
    body: |
      import json, os, sys
      path = os.environ["TERMORQ_INPUT"]
      print(f"input file: {path}", file=sys.stderr)
      with open(path, encoding="utf-8") as f:
          data = json.load(f)
      print(json.dumps({"summary": f"{data['steps']['lookup']['path']} -> {data['steps']['lookup']['status']}"}))
    outputs:
      type: object
      properties:
        summary:
          type: string
```

{{% callout style="checkrun" %}}
**show → Output** contains `summary: "users -> 200"`. The stderr line shows a temporary path. The file is created with mode `0600` on Unix and deleted when the block ends.
{{% /callout %}}

## When there's no input

- If `uses` is empty, a full run provides **no** input file, so `TERMORQ_INPUT` is unset.
- If a listed path isn't available, for example because the trigger didn't provide `trigger.text`, the block **fails before your code starts**. Listing a path doesn't give it a default value.

{{% callout style="tip" %}}
Request only the values a block needs. This is good data minimisation, because a block can't leak data it never received. It isn't a sandbox, though: your code still runs with your user's permissions.
{{% /callout %}}

{{% callout style="exercise" %}}
Rewrite `show` in Bash using `jq`. It should publish the same `summary` property.
{{% /callout %}}

{{% details title="Solution" %}}
```bash
set -euo pipefail
jq -c '{summary: "\(.steps.lookup.path) -> \(.steps.lookup.status)"}' "$TERMORQ_INPUT"
```
Set `language: bash` on the block. `jq -c` prints a single compact line, which satisfies the last-line rule.
{{% /details %}}

**Reference:** [What TERMORQ_INPUT is for](https://termorq-docs.garrardkitchen.com/docs/workflows/node-types/#what-termorq_input-is-for)
