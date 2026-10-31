---
title: 'Troubleshooting playbook'
description: 'Symptom → cause → fix for the errors you will actually hit.'
weight: 5
---

{{% callout style="goal" %}}
Diagnose a failed run in under a minute. **Time:** reference.
{{% /callout %}}

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `TERMORQ_INPUT` is unset in a full run | `uses` is empty | Add the paths the block needs to `uses`. `input_sample` doesn't supply them |
| `'trigger.text' is not available` | A manual run, or a trigger that doesn't send `text` | Use an HTTP or Telegram trigger, or read `inputs.<name>` instead |
| `… is not a property this block can use.` (on Save) | Undeclared output, input, or secret, or `loop.*` used outside a loop | Declare it, or fix the path |
| `The last non-empty line of code output must be a JSON object` | Pretty-printed JSON, a trailing log line, or an array | Print one compact object last, and send logs to stderr |
| A declared property is missing or has the wrong type | `"2"` vs `2`, `"true"` vs `true` | Match `outputs.properties` exactly |
| A JSON parser rejects Step input | Plain text, or the wrong nesting | Type `{"trigger":{"text":"…"}}`, or read the input as text |
| `Name a saved endpoint, or use mock://.` | A direct `url` to a real host | Save the endpoint, and set `endpoint:` |
| `HTTP 4xx/5xx.` | The API rejected the request | Check the resolved request on **Runs** |
| `MCP arguments must resolve to a JSON object.` | Template text that isn't an object | Serialise the arguments in a Code block |
| An AI block fails with declared outputs | The model didn't end with a JSON object | Tighten `system`, and raise `max_tokens` |
| A Code file can't import a sibling file | The source is copied to a build directory | Make it self-contained, or use `$TERMORQ_FOLDER` paths |
| A runtime can't start | It isn't installed, or isn't on `PATH` for the app | Install it, then **restart Termorq** |
| `'kind' must be code, code_file, …` | `kind: git` | Use [Code file after checkout](/workflows/programming-model/git-file/) |
| An MCP block fails before calling the tool | Credential lookup or connection failed | Open `@logs` |
| **Skipped · already running** | A run was already active | Wait, or **Stop** the active run |

{{% callout style="checkrun" %}}
You can match each Stage 2–5 failure you caused deliberately to a row in this table.
{{% /callout %}}

{{% callout style="exercise" %}}
A block prints `{"count": 3}` followed by `done.`, and its output schema declares `count`. Which row applies, and what is the smallest fix in Bash?
{{% /callout %}}

{{% details title="Solution" %}}
The last-line row. Change `echo done.` to `echo done. >&2`. The added `>&2` sends it to stderr.
{{% /details %}}
