---
title: 'Templates and chips'
description: 'Where {{ }} is expanded, where it is not, and how to stay JSON-safe.'
weight: 3
---

{{% callout style="goal" %}}
Know exactly where `{{ path }}` templates are expanded. **Time:** 5 minutes.
{{% /callout %}}

| Field | Template expanded? |
| --- | --- |
| HTTP `url`, `body`, headers | ✓ |
| MCP `arguments` (and `server`/`tool`) | ✓ |
| AI `system`, `prompt` | ✓ |
| Root `env` values | ✓ |
| Code `body` | ✗ **Never**. Use `uses` and `TERMORQ_INPUT` |
| Code file source | ✗ |
| Decision `when`, loop `for_each`/`while` | These take a **path or condition** without braces, for example `steps.x.total > 0` |

In the editor, templates appear as **chips**. In YAML, **Tab** completes `{{ }}` properties that are in reach.

## The JSON-safety rule

Never place a template **between JSON quotes**:

```yaml
# ✗ breaks when message contains " or a newline
body: '{"message":"{{ steps.echo.message }}"}'

# ✓ serialise the whole object in code, then insert it as one value
body: "{{ steps.prepare.request_json }}"
```

## Secrets in templates

`{{ secrets.NAME }}` works in templated fields once `NAME` is listed under `secrets:`. The value is masked in run records and redacted from logs.

{{% callout style="checkrun" %}}
Put `{{ steps.echo.message }}` inside a Python `body` and run it. The literal braces are printed, and no value is inserted.
{{% /callout %}}

{{% callout style="exercise" %}}
You need an HTTP header `Authorization: Bearer <token>`, where the token is the secret `ACME_TOKEN`. Write the root key and the template.
{{% /callout %}}

{{% details title="Solution" %}}
```yaml
secrets:
  - ACME_TOKEN
# in the HTTP block (or, preferably, in the saved endpoint's own auth settings):
#   Authorization: "Bearer {{ secrets.ACME_TOKEN }}"
```
It's usually better to configure authentication on the **saved endpoint**, so the workflow never mentions the token.
{{% /details %}}
