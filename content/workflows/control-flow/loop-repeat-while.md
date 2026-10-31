---
title: 'Loop: repeat, while, break, and continue'
description: 'Fixed-count and condition-controlled loops, plus then: break and then: continue.'
weight: 3
---

{{% callout style="goal" %}}
Use the other two loop modes and leave a loop early. **Time:** 15 minutes.
{{% /callout %}}

## repeat: a fixed count

```yaml
- id: poll
  kind: loop
  repeat: 3
  body:
    - id: ping
      kind: http
      url: "mock://status/{{ loop.index }}"
```

## while: repeat while a condition holds

The condition is checked **before each pass**. The body must change the value it tests, otherwise the loop only stops at `max`.

```yaml
schema: 1
name: Countdown
id: countdown
blocks:
  - id: start
    kind: code
    language: python
    body: |
      import json; print(json.dumps({"more": True}))
    outputs:
      type: object
      properties:
        more: { type: boolean }
  - id: drain
    kind: loop
    while: steps.start.more == true
    max: 5
    body:
      - id: work
        kind: code
        language: python
        uses: [loop.index]
        body: |
          import json, os
          i = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["loop"]["index"]
          print(json.dumps({"done_at": i}))
        outputs:
          type: object
          properties:
            done_at: { type: number }
        then: break
```

`repeat` and `while` loops don't have `loop.item`, so leave it out of `uses`.

## break and continue

Inside a loop body, `then` accepts two special targets:

| `then:` | Effect |
| --- | --- |
| `break` | Leave the loop. The run continues after the loop |
| `continue` | Skip the rest of this pass and start the next one |

Outside a loop, the run fails: *'break' is only valid inside a loop.*

A common pattern is a **Decision inside the body** whose branches end in `then: continue` or `then: break`:

```yaml
body:
  - id: check
    kind: decision
    branches:
      - when: loop.item == "stop"
        goto: halt
      - else: true
        goto: process
  - id: halt
    kind: http
    url: mock://halt
    then: break
  - id: process
    kind: http
    url: "mock://item/{{ loop.index }}"
    then: continue
```

{{% callout style="checkrun" %}}
**Countdown** runs `work` once (`done_at: 1`), then leaves the loop because of `then: break`. Without `break`, it would stop at `max: 5`, because `steps.start.more` never changes.
{{% /callout %}}

{{% callout style="exercise" %}}
Set `max: 101` on any loop, then save and run it. What happens? Then try a loop of 60 nested inside another loop of 2.
{{% /callout %}}

{{% details title="Solution" %}}
Save accepts it (it's a number), but the run fails with *The loop maximum is 101, and the ceiling is 100.* The nested 2 × 60 = 120 passes goes over the **100-passes-per-run** limit, so the run fails with *This run reached 100 passes.* or *The loop would run … passes, and this run allows 100.*
{{% /details %}}
