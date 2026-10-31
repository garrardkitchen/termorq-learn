---
title: 'Validate, complete, and keep files tidy'
description: 'Tab completion, the save checker, termorq-cli validation, and where files live.'
weight: 4
---

{{% callout style="goal" %}}
Author YAML quickly and catch every error before you run anything. **Time:** 10 minutes.
{{% /callout %}}

## In the YAML tab

- **Tab** completes keys, legal values (kinds, languages, and trigger presets), and `{{ }}` properties.
- **Esc** closes the list and stays on the page. There's no Monaco editor, so expect a lightweight text editor.
- **Save** shows up to 20 reasons, sorted by line and column.

## Outside the app

`termorq-cli workflow` runs the same checker and prints the same sentences. If a file has an error, it doesn't run:

```bash
termorq-cli workflow list
termorq-cli workflow run refresh-acme-users
# Line 19: property 'foo' is not recognised.
```

## Where files live

| Source | Path |
| --- | --- |
| **Yours** | `workflows/user/<id>.yml` in the app data folder |
| **Workspace** | `.ai-terminal/workflows/<id>.yml` in an open team workspace (the app never commits or pushes it) |
| **Included** | Shipped with the app and read-only. Saving one writes **your** copy, which overrides the included version |

{{% callout style="warning" %}}
Workspace files are shared with your team. A raw token in one of them is refused by the team-workspace scrubber. Use `secrets:` names instead.
{{% /callout %}}

{{% callout style="checkrun" %}}
After saving, `termorq-cli workflow list` shows your workflow with source `yours`.
{{% /callout %}}

{{% callout style="exercise" %}}
Write a deliberately broken file containing: an invalid workflow ID, a repeated key, and a block ID with a hyphen. Predict all three messages, then check your predictions with **Save**.
{{% /callout %}}

{{% details title="Solution" %}}
- `'id' must be a letter, then letters, numbers, or hyphens.`
- `property '<key>' is repeated.`
- A block ID error for the hyphenated ID (block IDs allow letters, numbers, and underscores only).
{{% /details %}}
