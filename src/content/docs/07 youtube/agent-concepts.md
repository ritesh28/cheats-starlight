---
title: Agent Concepts
---

## AI Agent

- AI agent: (example coding agent) its an autonomous software system designed to:
  1. perceive (be aware) its environment,
  2. make decisions, and
  3. execute multi-step actions to achieve specific goals with minimal human intervention
- Autonomous: it means having the power, ability, or freedom to operate independently and make decisions without external control or human intervention
- AI Agent rely on four critical pillars to function:
  1. The Brain (Model): Interprets objectives, processes information, and handles reasoning
  2. Planning: Breaks down main objectives into a sequence of actionable steps and self-corrects if a step fails
  3. Memory: Short-term memory tracks the current workflow, while long-term memory retains context from past interactions
  4. Tools: Interfaces (like APIs, web browsers, and code execution environments) that allow the agent to interact with the outside world

## Engineering Types

- Categories:
  - LLM input: Prompt & Context Engineering
  - Architectural: Loop & Agentic Engineering
- Prompt Engineering: Designing structured instruction to guide LLMs toward accurate, and context-aware responses
- Context Engineering:
  - Designing how data is injected into an LLM's prompt window
  - includes chunking, RAG, compaction (summarization)
- Loop Engineering:
  - Building continuous execution pipelines where an AI repeatedly evaluates its own output, runs tests, and adjusts its actions until a definition of success is met
  - E.g., Plan-Act-Reflect loops
- Agentic Engineering: Crafting autonomous systems capable of perceiving its environment, making decision and executing multi-step actions to achieve specific goals
- Example: the objective: "Find and automatically patch a security vulnerability in a web application":
- | Engineering Type    | Specific Role in a Coding Agent Process                                                                                                       |
  | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
  | Context Engineering | Identifies the exact file throwing errors, extracts only its dependent code components, and feeds them to the model                           |
  | Prompt Engineering  | Crafts the system prompt: "You are a senior security engineer. Analyze this patch for memory leaks and follow PEP 8 style rules."             |
  | Loop Engineering    | Triggers a "Write → Run Tests → Read Error Logs → Fix" cycle, running code in a secure terminal until all tests pass                          |
  | Agentic Engineering | Orchestrates a "Scanner Agent" to find bugs, a "Patch Agent" to write code, and a "QA Agent" to peer-review and approve the code pull request |

## Agent Loop Types

- ReAct Loop (Reasoning + Action):
  - Cycle: Thought → Action → Observation
  - How it thinks:
    - The agent does not create a master plan upfront
    - It analyzes its context window, states what its thinking, immediately calls a tool, reads its output (the observation), and then decides on the absolute next micro-step
  - Analogy:
    - Driving a car through a dense fog using only your headlights
    - You don't map out the next 10 kms; you just look at the 15 meters right in front of you, make a tiny turn, check the road again, and repeat
- Plan-Act-Reflect Loop:
  - How it thinks:
    - The agent generates an overall strategy to achieve a macro-goal
    - It executes that strategy, then evaluates entire block of completed work against the goal, writes down whats failing, and rewires its master plan for a fresh attempt
  - Analogy:
    - A software developer writing a complex application
    - They draft system architecture, write codebase, run a full testing suite, read the crash logs, and then systematically rewrite their design plan based on what failed

## Harness (Engineering)

- Agent = Model + Harness. If you're not the model, you're the harness (Quote from LangChain)
- Each harness feature derives from a behavior the model can't deliver on its own:
- | Desired Agent Behavior                  | What the Harness Adds                 |
  | --------------------------------------- | ------------------------------------- |
  | Work with real data durably             | Filesystem + Git                      |
  | Write & Execute Code                    | Bash + Code Execution                 |
  | Safe Execution + Default Tooling        | Sandboxed Environments + Tooling      |
  | Remember and access new knowledge       | Memory Files + Web Search + MCPs      |
  | Maintain performance over long contexts | Compaction + Tool Offloading + Skills |
  | Complete long horizon work              | Ralph Loops + Planning + Verification |
