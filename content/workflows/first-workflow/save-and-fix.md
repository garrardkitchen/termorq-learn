---
title: 'Save, and fix what Save rejects'
description: 'Read the Not saved panel, fix line-numbered reasons, and understand IDs and limits.'
weight: 3
---

{{% callout style="goal" %}}
Break a workflow on purpose, read the **Not saved** panel, and fix it. **Time:** 5 minutes.
{{% /callout %}}

**Save** checks the draft before writing anything. If the check fails, Termorq doesn't write the file, doesn't leave the page, and doesn't start a run. The **Not saved** panel lists up to 20 reasons, one per line:

```text
Line 19: property 'foo' is not recognised.
Line 23, column 13: malformed YAML.
```

## Steps

1. Open your *Pass a value* workflow in **YAML**.
2. Add `colour: blue` under the `greet` block and click **Save**. The panel says `property 'colour' is not recognised.`
3. Change `uses: [steps.make_name.name]` to `uses: [steps.make_name.nme]` and click **Save** again. Save says `'steps.make_name.nme' is not a property this block can use.`, because `make_name` doesn't declare `nme`.
4. Undo both changes and **Save**.

## Rules the checker enforces

| Rule | Example |
| --- | --- |
| Workflow `id`: a letter, then letters, numbers, or hyphens | `refresh-acme-users` ✓ · `1st_flow` ✗ |
| Block `id`: letters, numbers, or underscores | `list_users` ✓ · `list-users` ✗ |
| `schema`, `name`, `id`, `blocks` are required | `'blocks' is missing.` |
| At most **40 blocks** per file, including nested loop bodies | `a workflow can have 40 blocks.` |
| Each block allows only the keys valid for its `kind` | `property 'url' is not recognised.` on a code block |
| Every `uses` path and `{{ }}` template must name something reachable: a declared earlier output, a declared `inputs.<name>`, a declared `secrets.<name>`, a supported `trigger.<field>`, or `loop.*` inside a loop | `'inputs.city' is not a property this block can use.` |
| Names are unique, ignoring capitalisation and surrounding spaces | Two workflows named `Deploy` and `deploy ` can't both exist |

## Unsaved edits

- The title shows **Unsaved** until you save.
- **Run** uses the draft on screen. It doesn't write the file.
- If you leave with unsaved changes (via **Back**, **Esc**, the shortcut, or the jump list), Termorq asks **Stay**, **Discard**, or **Save**. Focus starts on **Stay**.

{{% callout style="checkrun" %}}
After you undo your changes, **Save** succeeds and the **Unsaved** marker disappears.
{{% /callout %}}

{{% callout style="exercise" %}}
Rename the block `make_name` to `make-name` (with a hyphen). How many reasons does Save report, and why?
{{% /callout %}}

{{% details title="Solution" %}}
At least two. The ID itself is invalid, because block IDs can't contain hyphens. The `greet` block's `uses` also still points at `steps.make_name.name`, which no longer exists. Renaming a producer means updating every consumer.
{{% /details %}}

**Reference:** [Build a workflow → YAML](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/#yaml)
