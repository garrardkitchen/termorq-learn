---
title: 'Routing, skipping, and disabled nodes'
description: 'then targets, Node execution off, disconnected wires, and how Runs shows skipped blocks.'
weight: 4
---

{{% callout style="goal" %}}
Control exactly which blocks run without deleting any. **Time:** 10 minutes.
{{% /callout %}}

## Ways a block doesn't run

| Cause | How it shows | YAML |
| --- | --- | --- |
| **Node execution** is off | Still visible, marked **Skipped** | `enabled: false` |
| A decision chose another route | **Skipped** | — |
| A block before it failed | **not run** | — |
| You disconnected its only incoming wire | It's disabled automatically and **Skipped**, even if file order would reach it | `enabled: false` |
| A `then` jumped past it | It doesn't run | `then: <id>` |

## Steps

1. Open **Decision demo** from the previous lesson.
2. Select `joined` and turn **Node execution** off in **Settings**. Run the workflow: `joined` is shown as **Skipped**.
3. Turn it back on. Use the small **×** on the wire into `joined` to disconnect it. Because that was its only explicit incoming route, it's disabled.
4. Drag from `has_text`'s output handle back onto `joined` to restore `then: joined`.

{{% callout style="note" %}}
If you disconnect a **decision** route, it **falls through** to the next block in YAML order. If a route already has a target and you choose a new node, the new node is inserted **before** that target.
{{% /callout %}}

{{% callout style="checkrun" %}}
**Runs → (latest)** lists every block captured at the start. Disabled and unrouted blocks are visible with their skipped or not-run state.
{{% /callout %}}

{{% callout style="exercise" %}}
Write a YAML fragment where block `a` jumps straight to `c`, so that `b` never runs, without using a decision.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
- id: a
  kind: http
  url: mock://a
  then: c
- id: b
  kind: http
  url: mock://b
- id: c
  kind: http
  url: mock://c
```
{{% /details %}}
