---
title: 'Hello, workflow (60 seconds)'
description: 'Create one Bash block that publishes ok, save it, and run it.'
weight: 1
---

{{% callout style="goal" %}}
Create a workflow with one Bash block that publishes `ok: true`. **Time:** 5 minutes. **Needs:** Bash on `PATH`.
{{% /callout %}}

## Steps

1. Open **Workflows** (**Cmd/Ctrl+Shift+G**) and choose **New workflow**.
2. Under **Settings** (next to **Editor**), name it `Hello workflow`.
3. Add a **Code** block. New Code blocks start as **Bash**.
4. In **Properties → Code**, set the snippet to:

   ```bash
   echo '{"ok":true}'
   ```

5. Open **Properties → Schema** and add a property named `ok` with type `boolean`.
6. Click **Save**, then **Run**.

## The same workflow as YAML

Open the **YAML** tab. You should see something like this. The block ID is generated, so yours may differ.

```yaml
schema: 1
name: Hello workflow
id: hello-workflow
blocks:
  - id: hello
    name: Hello
    kind: code
    language: bash
    body: |
      echo '{"ok":true}'
    outputs:
      type: object
      properties:
        ok:
          type: boolean
```

{{% callout style="tip" %}}
You can also paste YAML straight into the **YAML** tab and switch back to **Editor**. The rest of the course often gives you YAML to paste, because it's the quickest way to get to a known starting point.
{{% /callout %}}

## Check your run

{{% callout style="checkrun" %}}
- The card shows **Running**, then **Done**.
- **Properties → Output** shows `ok: true`, together with `exit: 0` and `status: ok`.
- Your terminal stayed usable throughout, because workflows don't block the prompt.
{{% /callout %}}

## Why the last line matters

Because the block **declares** an output (`ok`), the **last non-empty line of stdout** must be one JSON object, and that object must include `ok` as a boolean. Stage 2 covers this rule in detail.

{{% callout style="exercise" %}}
Change the snippet to print `Starting…` before the JSON line. Does the block still pass? Then try printing `Done` *after* the JSON.
{{% /callout %}}

{{% details title="Solution" %}}
`echo Starting…` followed by `echo '{"ok":true}'` passes, because only the **last** non-empty line is parsed. Printing `Done` after the JSON fails with *The last non-empty line of code output must be a JSON object*. Send diagnostic messages to stderr (`echo Done >&2`) instead.
{{% /details %}}

**Reference:** [Build a workflow → In 60 seconds](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/#in-60-seconds)
