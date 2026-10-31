---
title: 'Run, watch, and inspect'
description: 'Watch blocks run on the canvas, read a failure, and open the run history.'
weight: 4
---

{{% callout style="goal" %}}
Learn what each run state looks like, and find a failed block quickly. **Time:** 10 minutes.
{{% /callout %}}

## Watching a run

| On the canvas | Meaning |
| --- | --- |
| Accent border and sheen, with a dot travelling to the next block | Running |
| Pulse | Waiting |
| One shake, then red | Failed. The editor selects the block, scrolls to it, and opens **Output** with the error |
| **Skipped** | The node is disabled, or a decision didn't route to it |

With `prefers-reduced-motion: reduce`, the colours and labels stay and the motion is turned off.

![A run in progress: finished blocks marked Done, Format Markdown running, and later blocks waiting](/images/app/workflows-run-canvas.png "A run in progress on the canvas, with the selected block's output in the inspector. Browser preview with sample data.")

![Output tab of the properties inspector showing the Tally block's published JSON](/images/app/workflows-inspector-output.png "The Output tab shows what the selected block published. Browser preview with sample data.")

## Make it fail

1. In *Pass a value*, change the `greet` body's last line to `print("not json")`.
2. Click **Run**. **Greet** turns red, and **Output** says the last non-empty line must be a JSON object.
3. Open the **Runs** tab and select the run. Every block captured at the start of the run is listed. Blocks that never ran are marked **not run**.
4. Use **Copy input** and **Copy output** on a block to copy exactly what it received and returned. Secret values stay masked.
5. Fix the line and run again.

![Runs tab with five runs listed and the selected run's details and block input and output](/images/app/workflows-run-detail.png "Runs tab: run history on the left, the selected run's details on the right. Browser preview with sample data.")

## Pause and Stop

- **Pause run** lets the current block finish, then holds the next one.
- **Stop** ends the process tree immediately, without asking for confirmation.

{{% callout style="checkrun" %}}
**Runs** lists two runs: one failed and one successful. Each has a local date and time.
{{% /callout %}}

{{% callout style="exercise" %}}
Add `import time; time.sleep(10)` to the start of **Make name**, run the workflow, and click **Pause run** straight away. What does **Greet** show while the run is paused?
{{% /callout %}}

{{% details title="Solution" %}}
**Make name** finishes, because Pause waits for the active block. **Greet** is held and doesn't start until you **Resume**. Stage 7 covers **Edit rest** and **Apply** on paused runs.
{{% /details %}}
