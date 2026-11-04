# Cheat sheet templates

## Minimal skeleton

Use this shape when creating a new doc under `src/content/docs/`:

1. Frontmatter with `title:` only (unless siblings add more)
2. Overview bullets
3. `## Mental model` + optional Mermaid
4. `## Terminology` table
5. Usage: every fence has `title='...'`. Default `text title='...'`; bash uses e.g. `bash title='install'`; logic is **pseudocode** in `text` (not full ts/py unless asked; do not put "pseudocode" in the title)
6. `## Retain` decision table

## Pseudocode

- Prefer structured pseudocode over runnable language for how-tos
- Keep real API/symbol names where they aid recall
- Omit imports, types, and boilerplate
- Show control flow (try/catch/finally, if/else) clearly
- Use real language fences only when the user asks for copy-paste code
- Do not put sample pseudocode in this skill/template — write it only in the target cheat sheet

## Dense phrase → subpoints

When a bullet packs multiple actions, expand into numbered subpoints with a one-line example each (A / B / C).

## CLI / command reference

Prefer a table: Command | Purpose

## Compare two approaches

Prefer a table: Approach | How | Best for

## Project layout / ASCII

- Default to `text` with a title
- Bash also needs a title (`install`, `run`, …)

## Diagrams

- Mermaid `flowchart` for pipelines and architecture
- ASCII trees/hierarchies as `text title='...'`
- One primary diagram unless a second clarifies a different concern

## Verify / prove it works

Include copy-paste queries or CLI that confirm behavior (KQL, `kubectl`, curl, etc.) when the topic has a backend/UI.
