---
title: 'termorq-cli workflow'
description: 'List, run, and inspect workflows from a terminal or a script.'
weight: 4
---

{{% callout style="goal" %}}
Run a workflow without opening its page. **Time:** 5 minutes.
{{% /callout %}}

{{% callout style="pro" %}}
`termorq-cli workflow` is Pro. A Free binary leaves it out of `--help` and refuses the command.
{{% /callout %}}

```bash
termorq-cli workflow list
termorq-cli workflow list --workspace ~/src/acme-apis
termorq-cli workflow run refresh-acme-users
termorq-cli workflow runs refresh-acme-users
```

| Command | Prints |
| --- | --- |
| `workflow list` | Each workflow's name, ID, and source (`included`, `yours`, or `workspace`) |
| `workflow run <id>` | Starts the run and **waits** in this process |
| `workflow runs <id>` | The run directories under `workflows/runs/<id>/` |

- `--workspace` takes an absolute path or one starting with `~`.
- A file with a problem prints the same sentence as **Save**, and the run doesn't start.
- Schedules and the HTTP listener belong to the **desktop app**. The CLI starts only the run you name.

{{% callout style="checkrun" %}}
`termorq-cli workflow run hello-workflow` finishes, and `workflow runs hello-workflow` lists the new directory.
{{% /callout %}}

{{% callout style="exercise" %}}
Write a one-line shell command that runs `hello-workflow` and then prints its newest run directory.
{{% /callout %}}

{{% details title="Solution" %}}
```bash
termorq-cli workflow run hello-workflow && termorq-cli workflow runs hello-workflow | tail -1
```
{{% /details %}}

**Reference:** [termorq-cli workflow](https://termorq-docs.garrardkitchen.com/docs/cli/workflow/)
