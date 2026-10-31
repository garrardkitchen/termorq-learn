---
title: 'Rust'
description: 'rustc without Cargo: standard library only, byte-level input, and careful output.'
weight: 5
---

{{% callout style="goal" %}}
Write a Rust block that works without any crates. **Time:** 10 minutes. **Needs:** `rustc` with edition 2024 support.
{{% /callout %}}

```yaml
language: rust
outputs:
  type: object
  properties:
    input_bytes:
      type: number
```

```rust
use std::{env, error::Error, fs};

fn main() -> Result<(), Box<dyn Error>> {
    let path = env::var("TERMORQ_INPUT")?;
    let input = fs::read(path)?;
    println!("{{\"input_bytes\":{}}}", input.len());
    Ok(())
}
```

## Things to know

- The runner compiles with `rustc --edition 2024 -O`, then runs the binary. **There's no Cargo**, so crates such as `serde_json` aren't available.
- The standard library has no JSON parser. Use Rust for byte, line, or number processing, and use another language for JSON field transformations.
- Use `format!` and `println!` for output. Escape `{` and `}` by doubling them. Only interpolate values that can't contain quotes, backslashes, or newlines, or escape them yourself.
- Returning `Err` from `main` exits with a non-zero code, so the block fails.

{{% callout style="checkrun" %}}
With the exact compact sample `{"trigger":{"text":"Hello from curl"}}` (no trailing newline), the output is `{"input_bytes":38}`. That's the UTF-8 **byte** count of the whole file.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `lines` (number): the number of lines in the input file. Test it with multi-line plain text in Step input.
{{% /callout %}}

{{% details title="Solution" %}}
```rust
use std::{env, fs};
fn main() {
    let text = fs::read_to_string(env::var("TERMORQ_INPUT").unwrap()).unwrap();
    println!("{{\"lines\":{}}}", text.lines().count());
}
```
{{% /details %}}
