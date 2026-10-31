---
title: 'TypeScript'
description: 'Native Node type stripping, erasable syntax, and runtime validation.'
weight: 7
---

{{% callout style="goal" %}}
Write a TypeScript block that runs on Node's native type stripping. **Time:** 10 minutes. **Needs:** Node.js 22.6+ (or `tsx`).
{{% /callout %}}

```yaml
language: typescript
```

```typescript
import { readFileSync } from "node:fs";

type Input = { trigger?: { text?: unknown } };
const path = process.env.TERMORQ_INPUT;
if (!path) throw new Error("TERMORQ_INPUT is missing");
const data = JSON.parse(readFileSync(path, "utf8")) as Input | null;
const text = data?.trigger?.text;
if (typeof text !== "string") {
  throw new Error("trigger.text must be a string");
}
console.log(JSON.stringify({ message: text }));
```

## Things to know

- Termorq **prefers native Node** (22.6+), which strips types without type-checking them and ignores `tsconfig.json`. If native support isn't available, it uses a `tsx` executable instead.
- Use only **erasable** syntax: type annotations, `type`, `interface`, and `as`. Avoid `enum`, `namespace`, and parameter properties, because native stripping can't run them. See [Node.js TypeScript support](https://nodejs.org/api/typescript.html).
- Types don't validate JSON at run time. Keep the `typeof` checks.

{{% callout style="checkrun" %}}
Execute step prints `{"message":"Hello from curl"}`. `{"trigger":{}}` fails with *trigger.text must be a string*.
{{% /callout %}}

{{% callout style="exercise" %}}
Accept an `inputs.names` array (declare `inputs: names: {type: array, items: {type: string}}` and `uses: [inputs.names]`), then publish `count` and `first`.
{{% /callout %}}

{{% details title="Solution" %}}
```typescript
import { readFileSync } from "node:fs";
type In = { inputs: { names: string[] } };
const { inputs } = JSON.parse(readFileSync(process.env.TERMORQ_INPUT!, "utf8")) as In;
if (!Array.isArray(inputs.names)) throw new Error("inputs.names must be an array");
console.log(JSON.stringify({ count: inputs.names.length, first: inputs.names[0] ?? "" }));
```
Test it with the Step input `{"inputs":{"names":["Ada","Lin"]}}`.
{{% /details %}}
