---
title: 'Stage 10 · Capstone'
linkTitle: '10 · Capstone'
description: 'One HTTP-triggered workflow that uses every runnable block type and all seven languages.'
weight: 110
---

Bring everything together. You'll build **Release notes digest**, a workflow that:

- starts from an **HTTP trigger** with a list of change titles;
- **validates** the input in Python;
- **loops** over each change, classifying it in **Bash** and scoring it in **PowerShell**;
- counts results in **C#**, computes a checksum in **Rust**, and formats Markdown in **JavaScript**;
- runs a **Code file** written in **TypeScript**;
- publishes through an **HTTP** endpoint (`mock://`) and an **MCP** tool;
- **branches** on whether there are breaking changes, asking an **AI** model for an upgrade warning only when there are.

```mermaid
flowchart TD
  H(["HTTP trigger<br/>POST /hooks/release-digest"]) --> V["validate · Python"]
  V --> L["each_change (loop)<br/>classify · Bash → score · PowerShell"]
  L --> C["tally · C#"] --> R["checksum · Rust"] --> F["format · JavaScript"]
  F --> T["stamp · Code file (TypeScript)"] --> P["publish · HTTP mock://"] --> M["post · MCP tool"]
  M --> D{"gate · Decision<br/>breaking > 0?"}
  D -->|when| A["ai_warn · AI"]
  D -->|else| Q["quiet · Python"]
  A --> E["done · HTTP mock://"]
  Q --> E
```

{{% pages description="true" display="tree" %}}
