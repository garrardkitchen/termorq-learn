---
title: 'Termorq Learn: Workflows'
type: home
description: 'Hands-on tutorials for Termorq Workflows: build, code, connect, trigger, and run.'
---

Build Termorq Workflows from your first block to a capstone pipeline that uses every runnable node type, all seven code languages, and an HTTP trigger.

![The Workflows editor in Termorq: a trigger, HTTP and Python blocks, and a decision with two routes](/images/app/workflows.png "The Workflows editor. Screenshots are browser previews of the current Termorq designer with sample data; saving and execution need the desktop app.")

{{% callout style="pro" %}}
Workflows are a **Pro** feature and sit behind **Settings → Experimental → Workflows**, which is off by default. Free builds don't offer the flag or the page. See [Free and Pro](https://termorq-docs.garrardkitchen.com/docs/settings/editions/).
{{% /callout %}}

## How the course is organised

The course has eleven **stages**. Each stage builds on the previous one, so if you're new to Workflows, start at Stage 0 and work forwards. If you already build workflows, go straight to the stage you need.

| Stage | You will be able to… |
| --- | --- |
| [0 · Orientation](/workflows/orientation/) | Say what a workflow is, enable it, and find your way around the page |
| [1 · Your first workflow](/workflows/first-workflow/) | Build, save, run, and inspect a two-block workflow |
| [2 · The programming model](/workflows/programming-model/) | Use `TERMORQ_INPUT`, `uses`, output schemas, `ok`, and Execute step |
| [3 · Seven languages](/workflows/languages/) | Write the same block in Bash, PowerShell, Python, C#, Rust, JavaScript, and TypeScript |
| [4 · Connecting blocks](/workflows/connecting-blocks/) | Add HTTP, MCP, and AI blocks, and use ✦ Autogenerate |
| [5 · Control flow](/workflows/control-flow/) | Branch with Decision, iterate with Loop, and route with `then` |
| [6 · YAML authoring](/workflows/yaml/) | Write and validate a complete workflow file by hand |
| [7 · Runs and operations](/workflows/runs/) | Read run folders, pause and stop runs, and use `termorq-cli` |
| [8 · Triggers](/workflows/triggers/) | Start workflows on a schedule, at startup, after another workflow, or from a file change, HTTP request, or Telegram message |
| [9 · Capture and share](/workflows/capture-and-share/) | Turn a terminal session into a workflow, then export and import it |
| [10 · Capstone](/workflows/capstone/) | Ship one workflow that uses every runnable block type and language, started by HTTP |

## What every lesson looks like

Each lesson uses the same layout:

{{% callout style="goal" %}}
**What you'll build**, how long it takes, and what you need before you start.
{{% /callout %}}

1. **Steps** that you follow in the app.
2. **A working snippet**: a YAML file or code you can paste.
3. {{% badge style="green" icon="circle-check" %}}Check your run{{% /badge %}}: what a successful result looks like.
4. {{% badge style="purple" icon="dumbbell" %}}Exercise{{% /badge %}}: a short task, with the solution hidden in an expandable box.

## Learn vs reference

This site teaches you by having you build things. For full details on any feature, see the [Termorq reference docs](https://termorq-docs.garrardkitchen.com/docs/workflows/the-page/). Each lesson links to the reference pages it covers.

{{% button href="/workflows/orientation/" style="primary" icon="play" %}}Start with Stage 0{{% /button %}}
