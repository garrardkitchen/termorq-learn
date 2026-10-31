---
title: 'Stage 4 · Connecting blocks'
linkTitle: '4 · Connecting blocks'
description: 'HTTP endpoints, MCP tools, AI models, and ✦ Autogenerate: reuse saved connections instead of writing clients.'
weight: 50
---

Choose the smallest block that does the job:

| Need | Block | Why |
| --- | --- | --- |
| Call an API you've already saved in Termorq | **HTTP endpoint** (`http`) | It reuses the saved connection, headers, and credentials, so you don't write an HTTP client |
| Call a tool on a saved MCP server | **MCP tool** (`mcp`) | It reuses the server's transport and authentication, and the tool's input contract |
| Make a judgement call: summarise, classify, or interpret | **AI** (`ai`) | It sends a prompt to a saved OpenAI-compatible model |
| Transform or validate data, or compute something | **Code** | Covered in Stages 2–3 |

Unlike code bodies, HTTP, MCP, and AI fields **are templates**: `{{ steps.x.y }}` is replaced with the value before the call is made. The editor shows these as chips.

{{% pages description="true" display="tree" %}}
