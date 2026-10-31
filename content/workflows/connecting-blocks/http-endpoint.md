---
title: 'HTTP with a saved endpoint'
description: 'Reuse a saved endpoint and its credentials, and serialise a JSON body safely in code first.'
weight: 2
---

{{% callout style="goal" %}}
Send a POST request with a JSON body built from earlier output. **Time:** 15 minutes. **Needs:** a saved HTTP endpoint named **Create message** that accepts `{"message": "..."}`.
{{% /callout %}}

## Steps

1. Add an **HTTP endpoint** block and choose your saved endpoint in **Properties**. Its path parameters, query string, headers, and payload are copied onto the block.
2. Build the request body in a **Code** block first. Don't put text between JSON quotes in a template, because quotes and newlines in user input would break the JSON.

```yaml
- id: prepare_http
  kind: code
  language: python
  uses: [steps.echo.message]
  body: |
    import json, os
    data = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))
    payload = {"message": data["steps"]["echo"]["message"]}
    print(json.dumps({"request_json": json.dumps(payload)}))
  outputs:
    type: object
    properties:
      request_json: { type: string }

- id: send_http
  kind: http
  endpoint: Create message
  method: POST
  body: "{{ steps.prepare_http.request_json }}"
  outputs:
    type: object
    properties:
      body: { type: string }
```

{{% callout style="warning" %}}
**Don't do this:** `body: '{"message":"{{ steps.echo.message }}"}'`. If the message is `She said "hi"`, the result is invalid JSON. Serialise the whole body in code and insert it as one value.
{{% /callout %}}

## Credentials

The endpoint's saved credentials stay in the OS keychain and are read during **credential preflight**, before the run starts. macOS decides whether to show a Keychain prompt. **Cancel run** is available while preflight is in progress. To use a secret directly, declare it under `secrets:` and use it in a header template such as `{{ secrets.API_TOKEN }}`. Termorq masks it in the record.

{{% callout style="checkrun" %}}
On **Runs**, the **send_http** row shows the resolved request and `status` (for example `201`). `steps.send_http.body` holds the response.
{{% /callout %}}

{{% callout style="exercise" %}}
Add a Decision after `send_http` that goes to a `log_failure` block when `steps.send_http.status` isn't `201`. (Decisions are covered in [Stage 5](/workflows/control-flow/decision/).)
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
- id: check_created
  kind: decision
  branches:
    - when: steps.send_http.status == 201
      goto: done
    - else: true
      goto: log_failure
```
A non-2xx status already fails the HTTP block. This decision handles **unexpected successes**, such as `200` instead of `201`.
{{% /details %}}
