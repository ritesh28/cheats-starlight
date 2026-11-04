---
name: generate-cheat-sheet
description: >-
  Create concise technical cheat sheets as Starlight Markdown docs (bullets,
  tables, Mermaid/ASCII diagrams, titled code). Use when the user asks to
  create/write/update a cheat sheet, crash course, or quick reference; distill
  notes or a shared ChatGPT/docs URL into src/content/docs.
---

# Generate Cheat Sheet

## When to use

- User asks for a cheat sheet, crash course, or quick reference
- User points at a target `.md` under `src/content/docs/` and a source (URL, notes, chat share)
- User asks to expand a dense definition into subpoints with examples

## Workflow

1. **Locate target** — open the destination file (or create it). Match folder/title conventions of sibling docs.
2. **Match style** — skim 1–2 nearby cheat sheets in the same folder (and `src/content/docs/_example.md`) for voice and formatting.
3. **Ingest source** — if given a URL/share link, fetch it. Distill; do not paste the source verbatim.
4. **Draft structure** — overview bullets → mental model → terminology → how-to/code → verify/ops → rules to retain.
5. **Add diagrams** — Mermaid for architecture/flow; ASCII for trees/hierarchies. Prefer one clear diagram over many.
6. **Write the file** — overwrite or fill the target `.md`. Keep scannable; expand only what aids recall.
7. **Stop** — do not commit unless asked.

## Output shape

Required frontmatter:

```yaml
---
title: Short Title
---
```

Body order:

1. Overview bullets (definition with bold key phrase; optional numbered subpoints + examples for dense phrases; 2–5 more bullets)
2. `## Mental model` — primitives/analogy; comparison table if options compete; Mermaid/ASCII diagram
3. `## Core terminology` — Term | Mental model | Example table when jargon is dense
4. How-to sections — project tree, install, bootstrap, custom code with `title='...'` fences
5. Verify section — copy-paste queries/CLI when a backend exists
6. `## Production` / retain — Decision | Guidance table

Nested example fences (write these literally in the cheat sheet):

- **Every fence needs a `title='...'`** (including `bash`, trees, ASCII, one-liners)
- **Default language:** `text` with a short title — use for trees, ASCII diagrams, strategies, env snippets when no better language fits
- Mermaid: language `mermaid` (title optional only if siblings omit it; prefer a title when useful)
- Code: real language tag + `title='path/or-purpose.ts'`; minimal skeleton only
- Bash: `bash title='install'` / `bash title='run'` — never bare ` ```bash `

Examples:

````markdown
```text title='span tree'
POST /orders
└── Validate order
```

```text title='project layout'
src/
└── telemetry/
```

```bash title='install'
npm install @microsoft/opentelemetry @opentelemetry/api
```

```bash title='run'
node --import ./dist/telemetry/instrumentation.mjs ./dist/server.js
```
````

## Writing rules

- **Cheat sheet, not essay** — bullets over paragraphs; tables over prose lists of pairs
- **One job per `##` section** — one headline purpose
- **Bold sparingly** — only the term or phrase being defined
- **Examples under dense phrases** — when a line packs multiple verbs/concepts (e.g. "generate, collect, and export"), add numbered subpoints each with a one-line example
- **Fences** — always set `title='...'`. Default to `text title='...'` when language is unclear. Bash and install/run commands must have titles too. Prefer TypeScript/Python matching the topic for real code
- **Diagrams** — Mermaid or ASCII only (no Draw.io unless the folder already uses `.drawio.svg`). ASCII trees use `text title='...'`
- **Frontmatter** — usually just `title:`; add other Starlight fields only if siblings use them
- **No fluff** — skip marketing, long intros, "further reading" dumps unless the user asks
- **Accuracy** — prefer current package/API names from the source; if unsure, note the assumption briefly in a bullet

## Source distillation

From a long crash course / chat share / article:

| Keep | Drop |
| ---- | ---- |
| Mental model, terms, decision tables | Filler transitions, retries, UI chrome |
| Minimal bootstrap + custom instrumentation/code | Full apps, repeated explanations |
| Verify queries / CLI that prove it works | Generic "check the docs" without commands |
| Trade-offs that change production behavior | Vendor hype and soft CTAs |

## Quality checklist

- [ ] Opens with a crisp definition + why it matters
- [ ] Mental model early (primitives, analogy, or signal table)
- [ ] At least one Mermaid or ASCII diagram when the topic has flow/hierarchy
- [ ] Terminology table if >5 jargon terms
- [ ] Every fence has a `title='...'` (bash included); trees/ASCII use `text title='...'`
- [ ] Matches tone/structure of sibling docs in the same folder
- [ ] No verbatim dump of the source URL/chat

## Additional resources

- Template and section recipes: [template.md](template.md)
