---
title: VSCode Agents
---

## Context Engineering Primitive

|                  | custom instructions                           | reusable prompts                        | custom agents                                                          |
| ---------------- | --------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| folder structure | `.github/instructions/*.instructions.md`      | `.github/prompts/*.prompt.md`           | `.github/agents/*.agent.md`                                            |
| definition       | rules of engagement                           | executable commands                     | personas & workflows                                                   |
| primary purpose  | guidelines that influence all AL interactions | specific tasks you run when needed      | different working contexts with specialized tools & instructions       |
| best for         | coding standards, language-specific rules     | generate components, inc. text coverage | API architect, security review                                         |
| usage            | automatically applied to all requests         | user runs slash command                 | user switches agents                                                   |
| font-matter      | name, description, applyTo (files)            | name, description, agent, model, tools  | name, description, argument-hint (inputs), tools, handoff (next steps) |

## Custom Instructions vs Skills

- `.github/skills/hello-world/SKILL.md`
- example - We can teach new skill (like reading pdf) to agents

## Structured Autonomy

- Structured Autonomy is a three-phase workflow designed to maximize the value you get from AI-assisted development while keeping premium requests low.
- The system follows a simple principle: use premium models sparingly for thinking, use cheap models liberally for doing.
- Workflow - 3 steps:
  1. Plan:
     - 1 request. Use Premium Model
     - You describe what you want to build. The planning agent researches your codebase, reads documentation, and breaks your feature into logical commits
     - Example: /plan Add a user profile page to this application that allows the user to view and edit their profile information
     - Output: `plans/{feature-name}/plan.md`
  2. Generate:
     - 1 request. Use Premium Model
     - The generator takes your plan and produces complete, copy-paste ready implementation instructions with full code blocks. No placeholders, no TODOs—just working code based on your actual codebase patterns
     - Example: /generate #plan.md
     - Output: `plans/{feature-name}/implementation.md`
  3. Implement:
     - Many requests. Use Cheap Model
     - The implementation agent follows the generated instructions step-by-step, checking off items as it goes and stopping at defined commit boundaries for you to verify and commit
     - Example: /implement #implementation.md

## Agent Orchestration

- plan mode
- sub agents

## TODO

- https://agents.md/
- https://code.visualstudio.com/docs/copilot/overview
