---
title: 'Telegram'
description: 'Bot token, chat allowlist, commands, and trigger.args.'
weight: 6
---

{{% callout style="goal" %}}
Start a workflow by sending `/refresh hello` from your phone. **Time:** 15 minutes. **Needs:** a Telegram bot token from @BotFather, and your chat ID.
{{% /callout %}}

## Steps

1. On **Triggers**, choose **Telegram**. Enter the bot token and click **Save bot settings**. Termorq checks the token with `getMe` and stores it in the keychain (account `telegram-token-<id>`).
2. Add your chat ID to the allowlist, and optionally a command such as `refresh` (with or without `/`).
3. **Save**, confirm, and keep Termorq open.

```yaml
triggers:
  enabled: true
  selected: telegram
  telegram:
    bot: '@acme_ops_bot'
    chats: ['123456789']
    command: refresh
blocks:
  - id: args
    kind: code
    language: bash
    uses: [trigger.args, trigger.from_username]
    body: |
      jq -c '{text: (.trigger.args // ""), who: (.trigger.from_username // "")}' "$TERMORQ_INPUT"
    outputs:
      type: object
      properties:
        text: { type: string }
        who: { type: string }
```

## What the message provides

| Path | Value for `/refresh hello world` |
| --- | --- |
| `trigger.text` | `/refresh hello world` |
| `trigger.args` | `hello world` |
| `trigger.chat_id`, `trigger.message_id`, `trigger.from_username` | Message metadata |

## Rules

- Termorq long-polls Telegram. **The bot doesn't reply.**
- Messages from chats that aren't on the allowlist are ignored. `/refresh` and `/refresh@my_bot` both match the command.
- When the bot first connects, it skips messages that were already waiting. The poll stops when you quit Termorq.
- The Triggers panel shows the poll status: Telegram API errors, allowlist or command mismatches, and the run ID that each matching message started.

{{% callout style="checkrun" %}}
Send `/refresh hello world`. **Triggers** shows a run ID, and the `args` block publishes `text: "hello world"`.
{{% /callout %}}

{{% callout style="exercise" %}}
Send a message from a chat that isn't on the allowlist. What does the panel show, and does a run start?
{{% /callout %}}

{{% details title="Solution" %}}
No run starts, and the poll status reports an allowlist mismatch.
{{% /details %}}
