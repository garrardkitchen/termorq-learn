---
title: 'HTTP with mock://'
description: 'Learn the HTTP block offline: status, body, and top-level JSON properties.'
weight: 1
---

{{% callout style="goal" %}}
Learn what an HTTP block publishes, without needing a network connection or credentials. **Time:** 5 minutes.
{{% /callout %}}

A `url` beginning with `mock://` returns a canned `200` response. It makes **no network request**. Direct URLs are accepted **only** for `mock://`. To call a real API, you use a saved endpoint, which is covered in the next lesson.

```yaml
schema: 1
name: HTTP mock
id: http-mock
blocks:
  - id: ping
    kind: http
    method: GET
    url: mock://users
    outputs:
      type: object
      properties:
        path: { type: string }
        mock: { type: boolean }
  - id: read
    kind: code
    language: python
    uses: [steps.ping.status, steps.ping.path, steps.ping.body]
    body: |
      import json, os
      d = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["steps"]["ping"]
      print(json.dumps({"line": f"{d['status']} {d['path']} ({len(d['body'])} bytes)"}))
    outputs:
      type: object
      properties:
        line: { type: string }
```

## What HTTP publishes

| Property | Type | Notes |
| --- | --- | --- |
| `status` | number | Always available. A non-success status fails the block (`HTTP 404.`) |
| `body` | string | The response body, capped at **4,096 bytes** in the record |
| *top-level JSON keys* | varies | When the response is a JSON object. **Declare** the ones you need in `outputs`. The mock body is `{"ok":true,"mock":true,"method":"GET","path":"users"}` |

Templates work in `url` too, for example `url: "mock://users/{{ loop.index }}"`.

{{% callout style="checkrun" %}}
**read** publishes `line: "200 users (…bytes)"`.
{{% /callout %}}

{{% callout style="exercise" %}}
Change the method to `POST` and publish the `method` property from the mock response.
{{% /callout %}}

{{% details title="Solution" %}}
Add `method: { type: string }` to `ping.outputs.properties`, then read `steps.ping.method` in a later block. It is `"POST"`.
{{% /details %}}
