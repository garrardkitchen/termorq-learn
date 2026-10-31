---
title: 'Block keys by kind'
description: 'The allowed keys for each of the seven runnable kinds, plus the common keys.'
weight: 2
---

{{% callout style="goal" %}}
Know which keys each block kind accepts. Use this page as a cheat sheet. **Time:** 10 minutes.
{{% /callout %}}

## Common to every block

| Key | Purpose |
| --- | --- |
| `id` | Letters, numbers, and underscores. Unique within the file |
| `name` | The label shown on the canvas |
| `kind` | `code`, `code_file`, `http`, `mcp`, `ai`, `decision`, or `loop` |
| `enabled` | `false` skips the block (**Node execution** off) |
| `then` | The next block ID, or `break`/`continue` inside a loop |
| `outputs` | The output schema |
| `uses` | Input paths (code blocks) |
| `skills`, `target` | Advanced: skill binding, and the execution target (`target` needs `schema: 2`) |

## Kind-specific keys

{{< tabs groupid="kind" >}}
{{% tab title="code" %}}
```yaml
- id: transform
  kind: code
  language: python        # bash | powershell | python | csharp | rust | javascript | typescript
  body: |
    print('{"ok":true}')
  input_sample: '{}'      # Execute step fixture only
```
{{% /tab %}}
{{% tab title="code_file" %}}
```yaml
- id: script
  kind: code_file
  path: scripts/report.py # relative to `folder`
  args: --fast --limit 10 # one string, split on whitespace
  language: python        # optional: inferred from the extension
```
{{% /tab %}}
{{% tab title="http" %}}
```yaml
- id: call
  kind: http
  endpoint: Create message   # a saved endpoint (real requests)
  method: POST
  headers: ...               # copied from the saved endpoint
  body: "{{ steps.prep.request_json }}"
# or, offline:
#  url: mock://users
```
{{% /tab %}}
{{% tab title="mcp" %}}
```yaml
- id: tool
  kind: mcp
  server: Demo tools
  tool: echo
  arguments: "{{ steps.prep.request_json }}"   # must resolve to a JSON object
```
{{% /tab %}}
{{% tab title="ai" %}}
```yaml
- id: summarise
  kind: ai
  connection: Summary model
  system: Return one JSON object with "summary".
  prompt: "Summarise: {{ steps.echo.message }}"
  max_tokens: 128
  input_sample: '{"trigger":{"text":"hi"}}'
```
{{% /tab %}}
{{% tab title="decision" %}}
```yaml
- id: choose
  kind: decision
  branches:
    - when: steps.lookup.total > 0
      goto: notify
    - else: true
      goto: done
```
{{% /tab %}}
{{% tab title="loop" %}}
```yaml
- id: each
  kind: loop
  for_each: steps.list.items   # or: repeat: 3   or: while: <condition>
  max: 20                      # default 20, ceiling 100
  body:
    - id: child
      kind: code
      language: bash
      uses: [loop.item]
      body: jq -c '{seen: .loop.item}' "$TERMORQ_INPUT"
```
{{% /tab %}}
{{< /tabs >}}

{{% callout style="notrunnable" %}}
`kind: git` (Git file) appears in the editor, but the runner and the save check don't accept it. See [Git file](/workflows/programming-model/git-file/).
{{% /callout %}}

{{% callout style="checkrun" %}}
Put `url: mock://x` on a **code** block and click **Save**. You get *property 'url' is not recognised.*, because each kind accepts only its own keys.
{{% /callout %}}

{{% callout style="exercise" %}}
Which kinds accept `input_sample`?
{{% /callout %}}

{{% details title="Solution" %}}
`code` and `ai`. These are the two kinds with an isolated **Execute step** editor.
{{% /details %}}
