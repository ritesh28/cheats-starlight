# Cheat sheet templates

## Minimal skeleton

Use this shape when creating a new doc under `src/content/docs/`:

1. Frontmatter with `title:` only (unless siblings add more)
2. Overview bullets
3. `## Mental model` + optional Mermaid
4. `## Terminology` table
5. Usage: install fence with `title='install'`, code fence with `title='minimal.ts'`
6. `## Retain` decision table

## Dense phrase → subpoints

When a bullet packs multiple actions:

```markdown
- X is the standard way to **A, B, and C**
  1. **A** — short meaning
     - Example: …
  2. **B** — short meaning
     - Example: …
  3. **C** — short meaning
     - Example: …
```

## CLI / command reference

Prefer a table: Command | Purpose

## Compare two approaches

Prefer a table: Approach | How | Best for

## Project layout

Use a plain fenced tree (no language tag), e.g.:

```
src/
├── telemetry/
│   └── instrumentation.ts
└── server.ts
```

## Diagrams

- Mermaid `flowchart` for pipelines and architecture
- ASCII tree for parent/child hierarchies (spans, layers)
- One primary diagram unless a second clarifies a different concern

## Verify / prove it works

Include copy-paste queries or CLI that confirm behavior (KQL, `kubectl`, curl, etc.) when the topic has a backend/UI.
