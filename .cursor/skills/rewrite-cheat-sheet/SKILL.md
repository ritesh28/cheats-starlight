---
name: rewrite-cheat-sheet
description: >-
  Rewrite an existing Starlight cheat sheet so it reads top-to-bottom without
  feeling scattered. Use when the user asks to rewrite, reorder, restructure,
  clean up, or make a cheat sheet easier to follow; or when an existing
  src/content/docs/*.md is dense, out of order, or hard to scan.
---

# Rewrite Cheat Sheet

## When to use

- User asks to **rewrite / reorder / restructure / clean up** an existing cheat sheet
- Existing doc feels scattered: concepts after how-tos, orphan sections, duplicate explanations
- User wants the same substance, but a clearer reading path

For **new** cheat sheets from a URL/notes/chat share, use [generate-cheat-sheet](../generate-cheat-sheet/SKILL.md) instead.

## Workflow

1. **Read the whole file** — do not rewrite from memory or a partial skim.
2. **Inventory sections** — list current `##` headings and what each actually contains (not just the title).
3. **Diagnose scatter** — map each block to one reading job (see order below). Flag:
   - Concepts that appear after how-tos
   - How-tos that appear before the mental model they need
   - Orphan one-off sections that belong inside a related `##`
   - Duplicate explanations of the same idea
   - Long runnable code where a short dialect-tagged how-to (`ts`/`py`/…) would scan better
   - Broken / inconsistent examples (name mismatch, invented APIs, wrong lifecycle claims)
   - Pseudocode fenced as `text` when it is clearly written in a language dialect
4. **Propose a reading order** (silently, then write) — one job per `##`; progressive disclosure:
   concepts → structure → setup → how-to → verify → ops/retain.
5. **Rewrite in place** — overwrite the target `.md`. Preserve accurate facts; cut filler; merge duplicates; fix inconsistencies while rewriting.
6. **Stop** — do not commit, start a preview server, or browse-test unless the user asks.

## Target reading order

Keep this spine unless the topic truly needs a different path:

1. Overview bullets (definition + why it matters)
2. Mental model / signals / primitives (+ one diagram when flow or hierarchy matters)
3. Core terminology (Term | Mental model | Example) when jargon is dense
4. Structure / layout that later sections assume (trace tree, folder tree, architecture)
5. Setup / bootstrap
6. How-tos (custom spans, metrics, CLI, etc.) — short; pseudocode by default
7. Verify — copy-paste queries/CLI when a backend exists
8. Optional infrastructure (Collector, advanced routing) after the happy path
9. Hardening / sensitive data
10. Production / Retain decision table

Move late orphans (e.g. a lone "P95" section) into terminology or the mental-model table.

## Preserve vs change

| Preserve                         | Change freely                                      |
| -------------------------------- | -------------------------------------------------- |
| Accurate facts, API/package names | Section order and heading names                   |
| Useful tables and diagrams        | Prose → bullets/tables                            |
| Intent of examples                | Long runnable skeletons → short dialect-tagged how-tos |
| Frontmatter `title` (unless wrong)| Duplicate sections → one canonical place          |

- Do **not** invent major new topics unless a hole blocks the reading path (e.g. missing verify queries after "check in the UI").
- If you correct a technical error found while rewriting (wrong API, read-only span mutation, mismatched helper names), keep the fix and make the surrounding text match.
- How-tos stay **pseudocode** by default (short, no boilerplate). Tag the fence by dialect (`ts`/`py`/…); use `text` only when there is no language dialect. Full runnable skeletons only if the user asks.

## Format (shared with generate)

Reuse the same house style as [generate-cheat-sheet](../generate-cheat-sheet/SKILL.md):

- Frontmatter usually just `title:`
- Bullets over paragraphs; tables over prose pairs
- One job per `##`
- Bold only the term/phrase being defined
- Every fence needs `title='...'`; trees/ASCII/strategies → `text`
- Logic/how-tos are **pseudocode** — keep real API names; omit imports/types/boilerplate; never put "pseudocode" in the title; fence tag matches dialect (`ts` if TypeScript-fashion, `py` if Python-fashion, etc.)
- Mermaid for pipelines/architecture; ASCII trees as `text title='...'`
- Section recipes: [template.md](../generate-cheat-sheet/template.md)

## Rewrite moves (common)

| Problem                              | Move                                                              |
| ------------------------------------ | ----------------------------------------------------------------- |
| Concept buried after code            | Lift into mental model / terminology before how-tos               |
| Two sections explain the same thing  | Keep the clearer one; merge unique bullets into it                |
| Helper defined as A, used as B       | One name end-to-end                                               |
| Full app-sized example               | Collapse to tree + short how-to that shows control flow           |
| Decision buried in prose             | `Approach \| How \| Best for` or `Decision \| Guidance` table     |
| Verify missing after setup           | Add copy-paste CLI/query when a backend/UI exists                 |
| Advanced/optional before happy path  | Move after verify (Collector, exotic config)                      |

## Quality checklist

- [ ] Whole file was read before rewriting
- [ ] Someone new can read top-to-bottom without jumping ahead for definitions
- [ ] Each `##` has one job; no orphan micro-sections at the end
- [ ] Mental model / terminology appear before setup and how-tos
- [ ] How-tos are short; fences titled; pseudocode default; dialect tag (`ts`/`py`/…) when written that way
- [ ] Duplicates merged; internal name/API inconsistencies fixed
- [ ] Still a cheat sheet (scannable), not an essay
- [ ] No commit / preview / browse-test unless asked
