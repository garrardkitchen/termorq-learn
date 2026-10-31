---
title: 'Git file (not runnable yet)'
description: 'What the Git file node is, why the runner rejects kind: git today, and the Code file workaround.'
weight: 8
---

{{% callout style="goal" %}}
Know what the **Git file** node does today, and run a file from a repository safely. **Time:** 5 minutes.
{{% /callout %}}

{{% callout style="notrunnable" %}}
The editor offers **Git file** (`kind: git`) with fields for a public repository, ref, path, and inferred language. **The runner rejects `kind: git`.** A workflow that contains it won't save or run, even if the editor verified the repository.

**Use Code file after checkout:** clone or check out the repository locally, review the revision, then point a `code_file` block at it.
{{% /callout %}}

## The workaround

```bash
# One-time (or in a setup step you trust): check out a reviewed revision
git clone https://github.com/acme/scripts ~/src/acme-scripts
git -C ~/src/acme-scripts checkout v1.4.2
```

```yaml
schema: 1
name: Run reviewed script
id: run-reviewed-script
folder: ~/src/acme-scripts
blocks:
  - id: report
    kind: code_file
    path: tools/report.py
    outputs:
      type: object
      properties:
        ok: { type: boolean }
```

Pinning to a tag or commit you've reviewed means the code you run is code you've read. That's also why this route is safer than running whatever happens to be on a remote branch.

{{% callout style="checkrun" %}}
Save accepts the `code_file` version. If you put `kind: git` in YAML, Save reports `'kind' must be code, code_file, http, mcp, ai, decision, loop.`
{{% /callout %}}

{{% callout style="exercise" %}}
Write the YAML for a Code file block that runs `scripts/build.ps1` from your checkout with the args `-Configuration Release`.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
- id: build
  kind: code_file
  path: scripts/build.ps1
  args: -Configuration Release
```
`.ps1` means the language is inferred as `powershell`.
{{% /details %}}
