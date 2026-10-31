---
title: 'Pause, resume, edit the rest, stop'
description: 'Control a run in flight and change the blocks that have not started yet.'
weight: 2
---

{{% callout style="goal" %}}
Stop a run going wrong, or fix the remaining blocks mid-run. **Time:** 10 minutes.
{{% /callout %}}

| Action | Effect |
| --- | --- |
| **Pause run** | Lets the active block finish, then holds the next one |
| **Resume** | Continues from the held block |
| **Edit rest** → **Apply** | Changes the blocks that haven't started **in this run only**. It doesn't write the workflow file |
| **Edit workflow** → **Save** | Changes the file, which affects the **next** run |
| **Stop** | Cancels the active process tree or request immediately, without asking |
| **Cancel run** | Available during credential preflight, before any block starts |

## Rules

- A workflow has **one active run** at a time. A second start is recorded as **Skipped · already running**. Different workflows can run at the same time.
- If Termorq quits while a run is in progress, that run is shown as **stopped** and its partial folder stays.
- `termorq-cli workflow run` blocks the CLI process. Quitting the app stops it.

{{% callout style="checkrun" %}}
Add `sleep 20` to the first block of a three-block workflow. Run it, **Pause** it, use **Edit rest** to change block 3's output, **Apply**, then **Resume**. Block 3 uses the edited version, and the saved file is unchanged.
{{% /callout %}}

{{% callout style="exercise" %}}
Start the same workflow twice quickly, once with **Run** and once with its HTTP trigger. What does **Runs** show?
{{% /callout %}}

{{% details title="Solution" %}}
The second start is recorded as **Skipped · already running**.
{{% /details %}}
