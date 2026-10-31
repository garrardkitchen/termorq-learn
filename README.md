# Termorq Learn

**Live site:** https://garrardkitchen.github.io/termorq-learn/

Termorq Learn is the hands-on tutorial site for [Termorq](https://termorq-docs.garrardkitchen.com/). The reference docs explain *what* each feature does. Learn takes you through building with it, one stage at a time.

The first track is **Workflows**: 51 lessons in 11 stages, from enabling the feature to a capstone that uses every runnable node type, all seven code languages, and an HTTP trigger.

| Stage | Topic |
| --- | --- |
| 0 | Orientation |
| 1 | Your first workflow |
| 2 | The programming model (`TERMORQ_INPUT`, `uses`, output schema, `ok`, Execute step, Code file, Git file) |
| 3 | Seven languages: Bash, PowerShell, Python, C#, Rust, JavaScript, TypeScript |
| 4 | Connecting blocks: HTTP, MCP, AI, ✦ Autogenerate |
| 5 | Control flow: Decision, Loop, routing |
| 6 | YAML authoring |
| 7 | Runs and operations |
| 8 | Triggers |
| 9 | Capture and share |
| 10 | Capstone |

## Build and preview locally

The site uses [Hugo](https://gohugo.io/) (extended, **0.166.0 or later**) and the [Relearn theme](https://github.com/McShelby/hugo-theme-relearn), pinned to **9.4.0** as a git submodule.

```bash
git clone --recurse-submodules https://github.com/garrardkitchen/termorq-learn.git
cd termorq-learn
hugo serve            # http://localhost:1313/termorq-learn/
hugo --gc --minify    # production build into ./public
```

If you cloned without `--recurse-submodules`, run `git submodule update --init --recursive`.

To update Relearn:

```bash
cd themes/hugo-theme-relearn && git fetch --tags && git checkout <new tag> && cd ../..
git add themes/hugo-theme-relearn && git commit -m "chore: bump Relearn to <new tag>"
```

## Writing lessons

Read **[CONVENTIONS.md](CONVENTIONS.md)** before you add or change content. It defines the stage and lesson structure, the lesson template, the callout styles, naming, and the Pro callouts. Scaffold new pages from the archetypes:

```bash
hugo new content --kind stage workflows/<stage-slug>/_index.md
hugo new content --kind lesson workflows/<stage-slug>/<lesson-slug>.md
```

## Deployment

Every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which builds with Hugo and deploys to GitHub Pages using the official `actions/deploy-pages` flow. Pull requests build with `--panicOnWarning` but don't deploy.

## Attribution

- Screenshots in `assets/images/app/` and the logo in `assets/images/logo.png` come from the Termorq documentation in [garrardkitchen/ai-terminal](https://github.com/garrardkitchen/ai-terminal) (`docs/learn/static/images/`). They're browser previews of the app.
- Product facts were checked against the Termorq source and reference docs at ai-terminal `eb9bdca`.
- Theme: [Hugo Relearn](https://github.com/McShelby/hugo-theme-relearn) by Sören Weber and contributors (MIT).

## License

Same licence as the Termorq product: the [Termorq Non-Commercial Use License](LICENSE).
