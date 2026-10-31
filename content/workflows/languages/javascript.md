---
title: 'JavaScript'
description: 'Node.js ES modules, node: built-ins, and JSON.stringify output.'
weight: 6
---

{{% callout style="goal" %}}
Write a JavaScript block as an ES module. **Time:** 5 minutes. **Needs:** Node.js.
{{% /callout %}}

```yaml
language: javascript
```

```javascript
import { readFileSync } from "node:fs";

const path = process.env.TERMORQ_INPUT;
if (!path) throw new Error("TERMORQ_INPUT is missing");
const data = JSON.parse(readFileSync(path, "utf8"));
const text = data?.trigger?.text;
if (typeof text !== "string") {
  throw new Error("trigger.text must be a string");
}
console.log(JSON.stringify({ message: text }));
```

## Things to know

- The runner writes your code to `snippet.mjs`, so it's an **ES module**: use `import`, not `require`. Top-level `await` works.
- For Code file, `.js` and `.mjs` are inferred as JavaScript.
- Node built-ins (`node:fs`, `node:path`, and `fetch`) are available. `npm` packages aren't installed for you.
- Never use `JSON.stringify(obj, null, 2)` for the final line, because it prints several lines.

{{% callout style="checkrun" %}}
Execute step prints `{"message":"Hello from curl"}`.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `chars`: an array of the unique characters in the text, sorted.
{{% /callout %}}

{{% details title="Solution" %}}
```javascript
import { readFileSync } from "node:fs";
const { trigger } = JSON.parse(readFileSync(process.env.TERMORQ_INPUT, "utf8"));
console.log(JSON.stringify({ chars: [...new Set(trigger.text)].sort() }));
```
Declare `chars: { type: array, items: { type: string } }`.
{{% /details %}}
