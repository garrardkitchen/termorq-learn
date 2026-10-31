---
title: 'At startup and After another workflow'
description: 'Run once when Termorq opens, or chain workflows by outcome.'
weight: 3
---

{{% callout style="goal" %}}
Chain two workflows, so that one runs when the other finishes. **Time:** 10 minutes.
{{% /callout %}}

## At startup

```yaml
triggers:
  enabled: true
  selected: startup
  at_start: true
```

This runs **once** when the app process opens. It's useful for warming caches or checking prerequisites.

## After another workflow

```yaml
schema: 1
name: Notify on failure
id: notify-on-failure
triggers:
  enabled: true
  selected: after
  after:
    workflow: refresh-acme-users
    outcome: failed        # success | failed | any
blocks:
  - id: note
    kind: code
    language: bash
    body: |
      echo "refresh-acme-users failed at $(date -u +%FT%TZ)" >&2
      echo '{"ok":true}'
    outputs:
      type: object
      properties:
        ok: { type: boolean }
```

{{% callout style="tip" %}}
Split long pipelines into smaller workflows chained with `after`. Each part gets its own run history and can be rerun separately.
{{% /callout %}}

{{% callout style="checkrun" %}}
Make `refresh-acme-users` fail (for example, by disabling its model connection) and run it. **Notify on failure** starts automatically.
{{% /callout %}}

{{% callout style="exercise" %}}
Change the chain so that it runs after **every** finish, whether the first workflow succeeded or failed.
{{% /callout %}}

{{% details title="Solution" %}}
`outcome: any`
{{% /details %}}
