---
title: 'Code file: keep source in your repo'
description: 'Run a local script with code_file, infer its language, and pass whitespace-split args.'
weight: 7
---

{{% callout style="goal" %}}
Move a block's source code into a file that's under source control. **Time:** 10 minutes.
{{% /callout %}}

**Code file** (`kind: code_file`) works exactly like **Code**: it has the same input file, the same last-line rule, and the same seven languages. The difference is that the source lives at `path`, resolved relative to the workflow's `folder`.

## Steps

1. Set the workflow's **folder** to a project, for example `~/src/acme-apis`.
2. Save this as `scripts/echo.py` in that folder:

   ```python
   import json, os, sys
   data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
   print(json.dumps({"message": data["trigger"]["text"], "argv": sys.argv[1:]}))
   ```

3. Add the block:

```yaml
- id: from_file
  name: Echo from file
  kind: code_file
  path: scripts/echo.py
  args: --mode fast --verbose
  uses: [trigger.text]
  outputs:
    type: object
    properties:
      message: { type: string }
      argv: { type: array }
```

## Rules

- **Language** is inferred from the extension: `.sh` (and unknown extensions) → bash, `.ps1` → powershell, `.py` → python, `.cs` → csharp, `.rs` → rust, `.js`/`.mjs` → javascript, `.ts` → typescript. Set `language:` explicitly for an unusual extension.
- **`args` is a single string split on whitespace.** Shell quoting is **not** applied: `args: --name "Ada Lovelace"` becomes three arguments, `--name`, `"Ada`, and `Lovelace"`. Pass structured values through `uses` and the input file instead.
- The source is **copied into a build directory**, and the working directory is the run's `files/`. Relative imports and companion files next to the original **don't** resolve. Keep scripts self-contained, or use explicit paths built from `$TERMORQ_FOLDER`.
- Code file **isn't a project launcher**: it doesn't run `cargo`, `npm install`, or `.csproj` builds.
- Code file has no Execute step. Test it with a full run (you'll need a trigger that supplies `trigger.text`, or use `inputs`).

{{% callout style="checkrun" %}}
`steps.from_file.argv` is `["--mode","fast","--verbose"]`.
{{% /callout %}}

{{% callout style="exercise" %}}
Change `args` to `--greeting "hello world"`. Predict `argv` before you run it.
{{% /callout %}}

{{% details title="Solution" %}}
`["--greeting", "\"hello", "world\""]`. The value is split on whitespace and the quotes stay as literal characters. That's why structured values should go through `uses`.
{{% /details %}}
