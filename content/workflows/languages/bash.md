---
title: 'Bash'
description: 'jq-based JSON handling, strict mode, and returning compact output.'
weight: 1
---

{{% callout style="goal" %}}
Write a Bash block that validates its input and publishes JSON safely. **Time:** 10 minutes. **Needs:** `bash` and `jq` on `PATH`.
{{% /callout %}}

```yaml
language: bash
```

```bash
set -euo pipefail
: "${TERMORQ_INPUT:?TERMORQ_INPUT is missing}"
jq -ce '
  if (.trigger.text | type) == "string" then
    {message: .trigger.text}
  else
    error("trigger.text must be a string")
  end
' "$TERMORQ_INPUT"
```

## Things to know

- Workflow Bash is **always Bash**, even if your terminal tab runs zsh or fish. On Windows, install Git Bash or expose WSL's `bash` on `PATH`.
- `set -euo pipefail` together with `jq -e` makes parse and validation errors fail the block.
- Build output with `jq -n --arg` or `--argjson`. **Never** build JSON with `echo "{\"message\":\"$x\"}"`, because quotes or newlines in `$x` will break it.
- `.sh` files, and files with unrecognised extensions, default to Bash in **Code file**.
- ✦ **Autogenerate** writes Bash that reads each value with `jq`.

{{% callout style="checkrun" %}}
Execute step with the starter sample prints `{"message":"Hello from curl"}`. Step input `{"trigger":{"text":42}}` fails with *trigger.text must be a string*.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `words` (number): the number of whitespace-separated words in `trigger.text`.
{{% /callout %}}

{{% details title="Solution" %}}
```bash
set -euo pipefail
text=$(jq -r '.trigger.text' "$TERMORQ_INPUT")
words=$(wc -w <<<"$text" | tr -d ' ')
jq -nc --argjson words "$words" '{words: $words}'
```
Declare `words: { type: number }`.
{{% /details %}}
