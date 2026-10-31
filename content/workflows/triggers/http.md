---
title: 'HTTP request'
description: 'The local listener, x-api-key, status codes, and mapping the body to inputs and trigger.'
weight: 5
---

{{% callout style="goal" %}}
Start a workflow with `curl`, and read the request body in a block. **Time:** 15 minutes.
{{% /callout %}}

## Steps

1. Use the *Input and output* example from Stage 2 (the `echo` block with `uses: [trigger.text]`).
2. On **Triggers**, choose **HTTP request**, **Save**, and confirm.
3. Click **Copy key**. The key is stored in the OS keychain (account `workflow-hook-<workflow id>`). It never appears in the YAML, the run record, or the picker.
4. Call the hook:

```bash
export TERMORQ_HOOK_KEY='<paste the key>'
curl -sS -i \
  -H "content-type: application/json" \
  -H "x-api-key: $TERMORQ_HOOK_KEY" \
  -d '{"text":"Hello from curl"}' \
  http://127.0.0.1:8787/hooks/input-output-example
```

```yaml
triggers:
  enabled: true
  selected: http
  http: true
```

## How the body maps

The JSON body becomes `inputs.<name>`. Supported trigger fields, such as `text`, also become `trigger.<name>`. So `{"text":"Hi"}` provides both `inputs.text` and `trigger.text`. Declare `inputs.text` if you want to read it that way.

## Responses

| Status | Meaning |
| --- | --- |
| `202` + `{"run_id":"…"}` | Accepted. The run continues in the background |
| `401` (empty body) | The key is missing or wrong. A key in the query string is **ignored** |
| `400` | Malformed JSON, or the body isn't a JSON object |
| `413` | The body is over 256 KiB |
| `415` | The content type isn't JSON |
| `429` | More than 30 requests a minute from one client |

## The listener

One listener serves every armed workflow. It defaults to `127.0.0.1:8787` (**This machine only**), and the socket is open only while at least one workflow has HTTP armed. **All interfaces** exposes the port on your network. There's **no TLS**, so the key travels in clear text.

{{% callout style="warning" %}}
Never put the hook key in the workflow file or in a repository. Keep it in your shell's environment or a secret manager.
{{% /callout %}}

{{% callout style="checkrun" %}}
`curl` prints `HTTP/1.1 202` and a `run_id`. On **Runs**, the new run's `echo` block shows `message: "Hello from curl"`.
{{% /callout %}}

{{% callout style="exercise" %}}
Send `{"names":["Ada","Lin"]}` to a workflow that loops over `inputs.names`. What do you need to declare?
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
inputs:
  names:
    type: array
    items: { type: string }
```
Then use `for_each: inputs.names` on the loop.
{{% /details %}}
