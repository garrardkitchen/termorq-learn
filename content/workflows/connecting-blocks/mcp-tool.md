---
title: 'MCP tool'
description: 'Call a saved MCP server tool with JSON arguments, and read content vs structuredContent.'
weight: 3
---

{{% callout style="goal" %}}
Call a tool on a saved MCP server and use its result. **Time:** 15 minutes. **Needs:** a saved MCP server (here **Demo tools**) with an `echo` tool that accepts `{"message":"..."}`.
{{% /callout %}}

## Steps

1. Add an **MCP tool** block. Choose the saved server, **connect** it, then choose the tool. Its parameters are copied onto the block.
2. Supply `arguments` as a template that resolves to **one JSON object**. As with HTTP bodies, serialise it in code first.

```yaml
- id: echo_tool
  kind: mcp
  server: Demo tools
  tool: echo
  arguments: "{{ steps.prepare_http.request_json }}"
  outputs:
    type: object
    properties:
      content: { type: array }

- id: read_tool
  kind: code
  language: python
  uses: [steps.echo_tool.content]
  body: |
    import json, os
    content = json.load(open(os.environ["TERMORQ_INPUT"], encoding="utf-8"))["steps"]["echo_tool"]["content"]
    texts = [c.get("text", "") for c in content if c.get("type") == "text"]
    print(json.dumps({"reply": " ".join(texts)}))
  outputs:
    type: object
    properties:
      reply: { type: string }
```

## What MCP publishes

- `status: ok`, a `text` representation of the result, and the **top-level properties** of the MCP result, such as `content` or `structuredContent`.
- JSON **inside** a `content[].text` string is **not** turned into workflow properties automatically. Parse it in a Code block.
- If the arguments don't resolve to a JSON object, the block fails with *MCP arguments must resolve to a JSON object.*

When a run starts, Termorq connects to the saved server automatically if it isn't connected yet. If the block fails, open `@logs` to see whether the credential lookup or the connection failed.

{{% callout style="checkrun" %}}
`steps.echo_tool.content` looks like `[{"type":"text","text":"{\"message\":\"Hello\"}"}]` (the exact shape depends on the tool), and `read_tool` publishes it as `reply`.
{{% /callout %}}

{{% callout style="exercise" %}}
Your tool returns `structuredContent: {"count": 3}`. How do you read `count` in the next block?
{{% /callout %}}

{{% details title="Solution" %}}
Declare `structuredContent: { type: object }` in the MCP block's outputs, add `uses: [steps.echo_tool.structuredContent]` to the next block, and read `data["steps"]["echo_tool"]["structuredContent"]["count"]`. Or let ✦ Autogenerate infer the fields from the last run (see [Autogenerate](/workflows/connecting-blocks/autogenerate/)).
{{% /details %}}
