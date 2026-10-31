---
title: 'C#'
description: '.NET 10 file-based apps, System.Text.Json, and reflection-free output.'
weight: 4
---

{{% callout style="goal" %}}
Write a C# block as a .NET file-based app. You don't need a project file. **Time:** 10 minutes. **Needs:** .NET SDK 10 or later.
{{% /callout %}}

```yaml
language: csharp
```

```csharp
using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;

var path = Environment.GetEnvironmentVariable("TERMORQ_INPUT")
    ?? throw new InvalidOperationException("TERMORQ_INPUT is missing");
using var input = JsonDocument.Parse(File.ReadAllText(path));
var value = input.RootElement.GetProperty("trigger").GetProperty("text");
if (value.ValueKind != JsonValueKind.String)
    throw new InvalidOperationException("trigger.text must be a string");

Console.WriteLine(new JsonObject { ["message"] = value.GetString() }.ToJsonString());
```

## Things to know

- The runner runs `dotnet run snippet.cs` using [file-based apps](https://learn.microsoft.com/en-us/dotnet/core/sdk/file-based-apps). Use top-level statements: you don't need a `class` or `Main`.
- Build output with `JsonObject.ToJsonString()`. Reflection-based `JsonSerializer.Serialize(anonymousObject)` may be disabled in file-based apps.
- The first run of a snippet compiles it, so expect a few seconds of start-up.
- An unhandled exception exits with a non-zero code, so the block fails.

## Reading plain text

For Execute step with plain text:

```csharp
using System.Text.Json.Nodes;
var text = File.ReadAllText(Environment.GetEnvironmentVariable("TERMORQ_INPUT")!);
Console.WriteLine(new JsonObject { ["message"] = text }.ToJsonString());
```

{{% callout style="checkrun" %}}
Execute step prints `{"message":"Hello from curl"}`.
{{% /callout %}}

{{% callout style="exercise" %}}
Publish `reversed`: the text with its characters in reverse order.
{{% /callout %}}

{{% details title="Solution" %}}
```csharp
using System.Text.Json;
using System.Text.Json.Nodes;
using var doc = JsonDocument.Parse(File.ReadAllText(Environment.GetEnvironmentVariable("TERMORQ_INPUT")!));
var t = doc.RootElement.GetProperty("trigger").GetProperty("text").GetString() ?? "";
var arr = t.ToCharArray(); Array.Reverse(arr);
Console.WriteLine(new JsonObject { ["reversed"] = new string(arr) }.ToJsonString());
```
{{% /details %}}
