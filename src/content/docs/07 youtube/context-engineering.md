## Foundation of LLM Context

- Difference b/t prompting and context:
  - prompt: system message + user message
  - context = system prompt + RAG + tools + memory + Conversation History + Guardrails & schemas ...
  - prompt engineering: one dimensional
  - context engineering: multi dimensional
- The 4 Era:
  1. Prompting (2023): Write a clever instruction
  2. Vibe coding (early 2025): Let the AI figure it out
  3. Context Engineering (mid 2025): Design the information system
  4. Agentic Engineering (2026): Build autonomous system
- OS Analogy:
- | Operating system | LLM system                                   |
  | ---------------- | -------------------------------------------- |
  | CPU              | LLM Model (Claud, GPT-4o, Gemini)            |
  | RAM              | Context Window (128K-2M tokens)              |
  | File System      | Retrieval/RAG (Vector DBs, documents)        |
  | System Calls     | Tool/API Calls (MCP, Function Calling)       |
  | Applications     | Agents (Autonomous task executors)           |
  | OS Kernel        | System Prompt (CLAUDE.md, base instructions) |
- Context window has 2 constraint (just like RAM): memory is temporary & it has a size
- token & english word relationship:
  - 1 token = $\frac{3}{4}$ word = 0.75 words
  - 1 page = 300 words (about 2 paragraphs)
  - 2M token = $2M \times \frac{3}{4}$ words = 1.5M words
  - 1.5M words = $\frac{1.5M}{300}$ pages = $\frac{15 \times 10^5}{3 \times 10^2}$ pages = 5k pages
- You should engineer to reduce the context window because:
  - Context Rot: Context quality will degrade with the increase in token size
  - Cost: The more token the more cost
  - Latency
- Definition: Context engineering is the process of finding the smallest set of high-signal tokens that maximize the likelihood of your desired outcome
- Context Window (6 elements). Focus on the order to minimize Context Rotting:
  1. System prompt
  2. Memory & State
  3. Retrieved Knowledge (RAG)
  4. Tool outputs
  5. Conversation History
  6. Current Query
- If the conversation grows long, the system must either:
  - Drop older messages (most common in chat systems)
  - Summarize earlier content into fewer tokens
  - Or reject the request if using raw API
- Context Rot (Lost in the middle Effect):
  - Context Overflow: Exceeding the maximum token limit (Uncommon Problem)
  - Context Rot: Performance degradation within the allowed limit (Common Problem)
  - Lost in the middle Effect: LLMs effectively use information at the beginning or end of a long input context but struggle to access or reason with information buried in middle
- The Three-Layer Context Model (REFER INFOGRAPHIC):
  - Every LLM call assembles context from three distinct layers - Instructional, Knowledge, and Tool - each with its own engineering discipline

## RAG Pipeline Architecture

- Complete retrieval-augmented generation flow - from raw documents through chunking, embedding, and vector storage to grounded AI responses

## Agent Architecture

- The capstone agent integrates all six modules:instructional context, RAG, MCP tools, memory, guardrails, and observability:into a single orchestrator
