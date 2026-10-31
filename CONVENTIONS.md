# Termorq Learn: tutorial conventions

This file is the **source of truth** for the structure and format of every tutorial on Termorq Learn. If any other copy (for example, a saved assistant skill) disagrees with this file, this file is correct. Update it in the same pull request as any change to the conventions.

---

## 1. Principles

1. **Task-based, not reference.** Every lesson has the learner *build or do* something. Facts, tables, and exhaustive option lists belong in the [reference docs](https://termorq-docs.garrardkitchen.com/docs/). Link to them rather than copying them.
2. **Staged progression.** Order the content so that each stage only depends on earlier ones. A newcomer can read from top to bottom, and an expert can jump straight to a stage.
3. **Every snippet works.** YAML must pass Termorq's **Save** check. Code must run with the runtimes listed in the lesson. If a snippet depends on a saved connection, endpoint, MCP server, or model, name it in the lesson's *Needs* and offer an offline alternative (`mock://`, or `enabled: false`) wherever one exists.
4. **Verified against the product.** When you add or change a fact, check it against the Termorq source or reference docs, and record the commit you checked against in the pull request description.
5. **No secrets.** Never put real keys or tokens in examples. Use `secrets:` names and placeholders such as `<paste the key>`.
6. **UK English**, in the second person ("you"), using imperative steps.

## 2. Site layout

```text
content/
├── _index.md                 # Home (type: home): the entrance to the current track
└── <track>/                  # one folder per track, e.g. workflows/
    ├── _index.md             # track index (weight: 1)
    └── <stage-slug>/         # one folder per stage
        ├── _index.md         # stage index
        └── <lesson-slug>.md  # lessons
assets/
├── images/app/               # product screenshots (attributed in README)
└── <asset-folder>/           # downloadable files (e.g. capstone/), linked as /<asset-folder>/<file>
archetypes/
├── stage.md                  # hugo new content --kind stage …
└── lesson.md                 # hugo new content --kind lesson …
```

- **Workflows** is currently the only track. Don't create empty or placeholder tracks.
- **Adding a future track** (for example, Notes or Terminal): create `content/<track>/` with the same stage/lesson structure, give it a track `_index.md` with a weight after the existing tracks, and **only then** turn the home page into a list of tracks. Each track must ship with real lessons, not stubs.

## 3. Stages

- A stage is a **folder** containing an `_index.md` (a section page). Don't set `type: chapter`: Relearn would show a "Chapter <weight>" banner.
- Stages are numbered from **0**. Stage 0 is always **Orientation** (what it is, how to enable it, a tour). The last stage is always a **Capstone** that uses everything in the track.
- The recommended arc, adapted from the Workflows track:

  | # | Purpose |
  | --- | --- |
  | 0 | Orientation: concepts, enabling the feature, a tour of the UI |
  | 1 | First success: the smallest useful thing, end to end |
  | 2 | The core model: the contract or mental model that everything else relies on |
  | 3…n-1 | Breadth: languages, integrations, control, authoring, operations, automation, sharing |
  | n | Capstone: one project that uses every major feature |

- Stage `_index.md` front matter:

  ```yaml
  title: 'Stage N · Title'
  linkTitle: 'N · Short title'      # sidebar label
  description: 'One sentence.'      # shown in listings
  weight: (N + 1) * 10              # 10, 20, 30 …
  ```

- The stage body (no H1: Relearn renders the title): one or two framing sentences, an optional diagram or table, then `{{% pages description="true" display="tree" %}}`.

## 4. Lessons

### 4.1 File and front matter

- File name: a **kebab-case** slug describing the task, with no numbers (`pass-a-value.md`, not `02-pass.md`). Order lessons with `weight`.
- Front matter:

  ```yaml
  title: 'Sentence case title'
  description: 'One sentence: what the learner builds or learns.'
  weight: 1        # 1, 2, 3 … within the stage
  ```

### 4.2 The lesson template (required order)

Don't add an H1. Relearn renders the front-matter `title` as the page heading. Start body headings at H2.


Every lesson follows this order. Scaffold it with `hugo new content --kind lesson <path>`.

1. **Goal callout**: `{{% callout style="goal" %}}`. What the learner will build, then **Time:** and **Needs:**.
2. **Pro callout**, if the feature is Pro-only and the stage index doesn't already say so: `{{% callout style="pro" %}}`.
3. **Steps**: numbered steps in the app. Bold UI labels exactly as they appear (**Save**, **Run**, **Execute step**).
4. **A working snippet**: a complete YAML workflow, or a block fragment with its parent stated, and/or source code.
5. **Concept sections**: short rules, tables, and warnings (H2 headings).
6. **Check your run**: `{{% callout style="checkrun" %}}`. An *observable* result: what the canvas, **Output**, **Runs**, or the terminal shows.
7. **Exercise**: `{{% callout style="exercise" %}}`. A small extension task.
8. **Solution**: `{{% details title="Solution" %}}…{{% /details %}}`, hidden by default.
9. **Reference link** (optional but encouraged): `**Reference:** [Page](https://termorq-docs.garrardkitchen.com/docs/…)`.

Lessons should take 5–20 minutes. Split anything longer.

### 4.3 Callout styles

These are defined in `hugo.toml` under `params.boxStyle`. Use these styles, not ad-hoc colours.

| Style | Title / icon | Use for |
| --- | --- | --- |
| `goal` | Goal / bullseye | The first element of every lesson |
| `checkrun` | Check your run / circle-check | The verification step |
| `exercise` | Exercise / dumbbell | The practice task |
| `pro` | Pro feature / crown | Pro-only features (edition gating) |
| `notrunnable` | Not runnable yet / ban | UI that exists but the runtime rejects it (for example, Git file `kind: git`). Always give the workaround in the same callout |
| `tip` | (Relearn built-in) | Optional shortcuts |
| `note` | (Relearn built-in) | Side information |
| `warning` | (Relearn built-in) | Mistakes that break things (JSON quoting, secrets) |
| `important` | (Relearn built-in) | Surprises (cron in UTC, the shape of Execute step input) |

### 4.4 Other shortcodes

- **Multi-language code:** `{{< tabs groupid="lang" >}}{{% tab title="Python" %}}…{{% /tab %}}{{< /tabs >}}`. Always use `groupid="lang"`, so the reader's chosen language stays selected across the site. List languages in product order: **Bash, PowerShell, Python, C#, Rust, JavaScript, TypeScript**.
- **OS-specific steps:** `groupid="os"`, with tabs `macOS / Linux` and `Windows`.
- **Per-kind references:** `groupid="kind"`.
- **Solutions and long asides:** `details` (not the deprecated `expand`).
- **Child listings:** `pages` (not the deprecated `children`).
- **Diagrams:** fenced ` ```mermaid ` blocks.
- **Badges and buttons:** `badge` and `button`, sparingly.
- Use `callout`, not the deprecated `notice`. The build must pass with `--panicOnWarning`.

### 4.5 Code and YAML

- State what a fence contains: a **complete workflow**, a **block-list fragment** (and which `blocks:` list it goes under), or **source code** for a block's `body`.
- Complete workflows include `schema`, `name`, `id`, and `blocks`. IDs follow the product rules: workflow IDs use kebab-case, and block IDs use snake_case.
- Code reads `TERMORQ_INPUT` as a **file path**, uses the nesting from `uses`, sends diagnostics to stderr, and prints **one compact JSON object** as the last stdout line when outputs are declared.
- Never put a template inside JSON quotes. Serialise the value in code, then insert it as `"{{ steps.x.request_json }}"`.
- Only use `{{ }}` in fields that are templated (HTTP, MCP, AI, `env`), never in code bodies.
- Document Code file `args` as **one whitespace-split string** (no shell quoting).

### 4.6 Links and images

- Link between lessons with **root-relative content paths**, such as `[Decision](/workflows/control-flow/decision/)`. Relearn resolves them, checks that they exist, and adds the Pages sub-path. Don't use `../` paths, because they break in print views.


- Put images in `assets/images/app/` (global resources, **not** `static/`) and reference them as `/images/app/<file>`. Relearn resolves them as resources and adds the Pages sub-path automatically.
- Always provide alt text and a title that says what the screenshot shows, and whether it's a browser preview or mock.
- Attribute the source of every image in `README.md`.

### 4.7 Downloadable assets

Put files that learners download, such as the capstone YAML and scripts, under `assets/<asset-folder>/`. Link to them with a root path, such as `/capstone/release-digest.yml`, and **also** show their contents inline.

## 5. Pro and edition callouts

- When a whole track or stage is Pro, put **one** `pro` callout on the home page or the stage index. Add lesson-level `pro` callouts only for things that are separately gated (for example, `termorq-cli workflow` and session capture).
- The wording should say where the feature is enabled (for example, **Settings → Experimental → Workflows**), and link to [Free and Pro](https://termorq-docs.garrardkitchen.com/docs/settings/editions/).

## 6. Scope rules (Workflows track)

- **In scope:** the runnable node kinds `code`, `code_file`, `http`, `mcp`, `ai`, `decision`, and `loop`; the seven languages; the programming model; YAML; Autogenerate; Execute step; runs; triggers; capture; and export/import.
- **Git file (`kind: git`)** is taught only with a `notrunnable` callout and the *Code file after checkout* workaround, until the runner supports it.
- **Forges** (GitHub/GitLab integrations) are not part of the Workflows curriculum.

## 7. Quality gate (before merging)

1. `hugo --gc --minify --panicOnWarning` passes locally (CI runs the same command).
2. Every new YAML snippet has been pasted into Termorq and passes **Save**, or is clearly marked as a fragment.
3. Every new code snippet has run on at least one platform (record which in the pull request).
4. The lesson follows the §4.2 order and uses the §4.3 styles.
5. Links to the reference docs resolve.
