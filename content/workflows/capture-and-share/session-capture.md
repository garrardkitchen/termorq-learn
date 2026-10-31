---
title: 'Capture a session as a workflow'
description: 'Record shell, saved API, MCP, and AI actions, then review an editable draft.'
weight: 1
---

{{% callout style="goal" %}}
Turn three things you did in the terminal into a runnable workflow draft. **Time:** 15 minutes.
{{% /callout %}}

{{% callout style="pro" %}}
Session capture is Pro.
{{% /callout %}}

## Steps

1. Start capture with `@capture` or the **Capture session** command. You can also press **Cmd+Option+R** on macOS, or **Ctrl+Alt+R** on Windows/Linux (**Ctrl+Shift+R** where AltGr uses Ctrl+Alt). The Pro tray menu has **Capture session to Workflow** too.
2. Do your work in **this tab**: run a shell command, call a saved endpoint (`@endpoint Find user --id 42`), call an MCP tool, and ask the AI something.
3. A pulsing **Capturing** pill in the footer counts your actions. Click it, then choose **Finish and review**.
4. An **unsaved** draft opens with its triggers **paused**. Review it, rename it, and **Save**.

![The Shortcuts dialog filtered to session capture](/images/app/shortcuts.png "Shortcuts for session capture.")

## What becomes what

| Captured | Becomes |
| --- | --- |
| A POSIX, Git Bash, or WSL command | A **Bash** Code block ending with `{"ok":true}` and declaring `ok: boolean` |
| A PowerShell command | A **PowerShell** Code block |
| A Command Prompt command | A PowerShell block that calls `cmd.exe` |
| A saved endpoint call | An **HTTP** block. The request values become **named workflow inputs**, which you enter when you press **Run** (`42` isn't saved as a default) |
| An MCP tool call | An **MCP** block |
| An AI prompt | An **AI** block using the tab's model. The prompt becomes a required input. Earlier chat context isn't captured |

## What's left out (and why)

- **Interactive** commands, and commands that **change or read persistent shell state** (`cd`, `export`, reading `$VAR`), stay in the review list with a prerequisite note. The draft doesn't pretend that shell state was saved.
- **Secret-looking** values are scrubbed before they enter the in-memory buffer. Those steps are listed for review: add a saved secret, or enter the value again in the editor.
- Capture is per tab and memory-only, and holds up to **200** actions. If nothing was captured, **Finish capture** closes the session without creating an empty workflow.

**Ctrl+Alt+Shift+R** (macOS: **Cmd+Option+Shift+R**) discards the capture. `@record` is a different feature: it records scrollback as an asciinema recording.

{{% callout style="checkrun" %}}
The draft has one block per captured, representable action. Shell blocks end with `{"ok":true}`, and pressing **Run** asks for any captured request inputs.
{{% /callout %}}

{{% callout style="exercise" %}}
Capture `cd /tmp && ls`. Why isn't it in the runnable draft, and how would you rewrite it as a block?
{{% /callout %}}

{{% details title="Solution" %}}
`cd` changes persistent shell state, so it's left out. Rewrite it as one Bash block, `ls /tmp >&2; echo '{"ok":true}'`, or use an absolute path.
{{% /details %}}

**Reference:** [Capture a session as a Workflow](https://termorq-docs.garrardkitchen.com/docs/workflows/session-capture/)
