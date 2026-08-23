---
title: Analyzing Sentence Structure
---

You can read the original chapter here:

**[NLTK Book – Chapter 8: Analyzing Sentence Structure](https://www.nltk.org/book/ch08.html?utm_source=chatgpt.com)**

---

# Executive Summary

This chapter introduces **syntactic parsing**—the process of discovering the grammatical structure of a sentence. Instead of treating text as a sequence of words, it explains how to represent sentences as **trees** using formal grammars and parsing algorithms. The central idea is that sentence structure is crucial for understanding meaning, especially when sentences are ambiguous. ([NLTK][1])

The chapter covers:

1. Why syntax matters
2. Phrase structure and parse trees
3. Context-Free Grammars (CFG)
4. Dependency grammars
5. Parsing algorithms
6. Ambiguity
7. Dynamic programming for parsing

---

# Section-wise Summary

## 1. Why Sentence Structure?

Words alone aren't enough.

Example:

> I shot an elephant in my pajamas.

Two interpretations exist:

- I was wearing pajamas.
- The elephant was wearing pajamas.

Same words.
Different structure.
Different meaning.

This motivates parsing. ([NLTK][1])

---

## 2. Constituents

The chapter introduces the idea of **constituents**.

Instead of viewing a sentence as

```
The | boy | saw | the | dog
```

we group words into meaningful phrases:

```
Sentence
 ├── NP
 │     The boy
 └── VP
       saw
       NP
          the dog
```

Important phrase types:

- NP (Noun Phrase)
- VP (Verb Phrase)
- PP (Prepositional Phrase)
- AP (Adjective Phrase)

These become nodes in a syntax tree. ([NLTK][1])

---

## 3. Context-Free Grammar (CFG)

A CFG defines production rules.

Example:

```
S  -> NP VP

VP -> V NP

NP -> Det N

Det -> the | a

N -> dog | boy

V -> saw
```

The grammar can generate infinitely many valid sentences using a finite set of rules.

Example generated sentence:

```
The boy saw the dog.
```

NLTK creates grammars like:

```python
grammar = nltk.CFG.fromstring(...)
```

Then parses them using parsers. ([NLTK][1])

---

## 4. Parse Trees

A parser converts

```
Mary saw Bob
```

into

```
S
├── NP
│    Mary
└── VP
     saw
     NP
        Bob
```

The tree explicitly represents grammatical relationships.

This tree is much richer than a sequence of tokens. ([NLTK][1])

---

## 5. Ambiguity

One sentence may produce multiple parse trees.

Example:

```
I saw a man with a telescope.
```

Interpretation 1

```
I used a telescope.
```

Interpretation 2

```
The man had a telescope.
```

This is called **PP attachment ambiguity**.

One sentence → multiple parse trees. ([NLTK][1])

---

## 6. Recursive Grammar

Human language is recursive.

Example:

```
The dog
```

↓

```
The dog in the park
```

↓

```
The dog in the park beside the river
```

↓

...

CFG naturally models recursion.

This explains why humans can generate infinitely many sentences. ([NLTK][1])

---

## 7. Parsing Algorithms

The chapter explains several classical parsers.

### Recursive Descent Parser

Top-down.

Starts from

```
S
```

and expands rules until matching the sentence.

Pros

- Simple

Cons

- Very inefficient
- Cannot handle left recursion

---

### Shift-Reduce Parser

Bottom-up.

Operations:

- Shift token to stack
- Reduce stack into larger constituents

Example

```
John
```

↓

```
NP
```

↓

```
NP VP
```

↓

```
S
```

Faster but may fail even when a valid parse exists. ([NLTK][1])

---

### Chart Parsing

Uses dynamic programming.

Stores partial results instead of recomputing them.

Advantages:

- Avoids repeated work
- Much faster
- Foundation of many classical parsers

This is arguably the most practically useful parser discussed in the chapter. ([NLTK][1])

---

## 8. Dependency Grammar

Instead of phrase trees:

```
Sentence
```

↓

Find relationships between words.

Example:

```
eat
├── John
└── apple
```

Verb becomes the head.

Dependency parsing is widely used in modern NLP pipelines and libraries. ([NLTK][1])

---

# Is this Chapter Still Relevant in the LLM Era?

**Yes—but for different reasons than when it was written.**

### What is outdated?

Before deep learning:

```
Text
↓

CFG

↓

Parser

↓

Features

↓

Classifier
```

Most NLP systems relied heavily on handcrafted grammars and explicit parsing.

Today:

```
Text
↓

Transformer

↓

Embeddings

↓

LLM
```

Modern LLMs learn syntax implicitly from massive corpora rather than requiring manually written grammars. Studies probing models like BERT show they encode substantial syntactic information without explicit CFGs. ([arXiv][2])

---

### What is still valuable?

Very valuable for understanding:

- constituency parsing
- dependency parsing
- syntax trees
- ambiguity
- grammar formalisms
- linguistic foundations
- parsing algorithms
- why language is hard

Many NLP interviews still expect these concepts.

---

### Where syntax still appears today

- Dependency parsing
- Information extraction
- Knowledge graph construction
- Relation extraction
- Semantic parsing
- Grammar correction
- Low-resource NLP
- Compiler-style language parsing
- Linguistics research
- Interpretability of LLMs

---

### What LLMs replaced

Mostly replaced:

- handcrafted CFGs
- rule-based parsers
- manually engineered grammar features
- explicit syntax features for downstream classifiers

---

### Overall relevance

| Topic                | Relevance Today |
| -------------------- | --------------- |
| CFG                  | ⭐⭐⭐☆☆        |
| Parse Trees          | ⭐⭐⭐⭐☆       |
| Dependency Parsing   | ⭐⭐⭐⭐⭐      |
| Recursive Descent    | ⭐⭐☆☆☆         |
| Shift-Reduce         | ⭐⭐⭐☆☆        |
| Chart Parsing        | ⭐⭐⭐⭐☆       |
| Linguistic Ambiguity | ⭐⭐⭐⭐⭐      |
| Grammar Engineering  | ⭐⭐☆☆☆         |
| Syntax Theory        | ⭐⭐⭐⭐⭐      |

---

# Interview Questions You Might Be Asked

## Basic

1. What is parsing?
2. Why isn't POS tagging sufficient for understanding a sentence?
3. What is a constituent?
4. What is a parse tree?
5. Difference between syntax and semantics?
6. Why are syntax trees useful?
7. What is recursion in grammar?
8. What is syntactic ambiguity?

---

## CFG

9. What is a Context-Free Grammar?
10. Explain production rules.
11. Why is it called context-free?
12. Can CFG generate infinite sentences?
13. What are terminals and non-terminals?
14. Why can't CFG capture every aspect of natural language?

---

## Parsing

15. What is recursive descent parsing?
16. Why does recursive descent fail with left recursion?
17. Explain shift-reduce parsing.
18. What is chart parsing?
19. Why is chart parsing faster?
20. What is dynamic programming in parsing?

---

## Dependency Parsing

21. Difference between constituency parsing and dependency parsing?
22. Which is more commonly used today?
23. What is the head of a sentence?
24. Give an example dependency tree.

---

## LLM Era Questions

25. Do LLMs explicitly build parse trees?
26. Why do transformers work without CFGs?
27. Do LLMs learn syntax?
28. Is dependency parsing still useful?
29. Where would you still use a parser instead of an LLM?
30. How would you combine parsing with an LLM?

---

## Practical Questions

31. Explain PP attachment ambiguity.
32. Draw a parse tree for:

- "John saw Mary."

33. Write a simple CFG for English.
34. How would you parse "The cat sat on the mat" using NLTK?
35. What is the complexity of parsing in general, and why are dynamic programming approaches like chart parsing preferred over naïve recursive parsing?

---

# If you're preparing for modern NLP/LLM interviews

This chapter is **worth studying for conceptual understanding**, but you don't need to memorize every parser implementation. Focus on:

- ✅ Parse trees
- ✅ Constituency vs. dependency parsing
- ✅ CFG basics
- ✅ Syntactic ambiguity
- ✅ Why syntax matters
- ✅ How modern transformers largely learn syntax implicitly while classical parsing remains useful in specialized NLP tasks and as foundational knowledge.

[1]: https://www.nltk.org/book/ch08.html?utm_source=chatgpt.com "8. Analyzing Sentence Structure"
[2]: https://arxiv.org/abs/1905.06316?utm_source=chatgpt.com "What do you learn from context? Probing for sentence structure in contextualized word representations"

Below is a detailed study guide of **Chapter 8: Analyzing Sentence Structure** from the NLTK book, with intuitive explanations and additional examples. The chapter's primary goals are to explain how grammars represent infinitely many valid sentences, how syntax trees capture sentence structure, and how parsers automatically construct those trees. ([NLTK][1])

---

# 1. Why Do We Need Sentence Structure?

Earlier NLP techniques focused on:

- Tokenization
- POS tagging
- N-grams
- Word frequencies

These techniques understand **individual words**, but they don't explain how words combine into meaningful sentences.

Consider:

> Dogs chase cats.

A POS tagger may output:

```text
Dogs/NNS chase/VBP cats/NNS
```

This tells us:

- Dogs → noun
- chase → verb
- cats → noun

But it **doesn't tell us**:

- Who is performing the action?
- Who receives the action?

Sentence structure answers these questions. ([NLTK][1])

---

# 2. Linguistic Data and Infinite Sentences

A language contains **an unlimited number of possible sentences**.

Examples:

- The dog barked.
- The dog that chased the cat barked.
- The dog that chased the cat that climbed the tree barked.
- ...

Humans understand these because language is **recursive**.

A computer cannot simply memorize every sentence, so we need **grammars** that generate all grammatical sentences using a finite set of rules. ([NLTK][1])

### Example

Grammar rule:

```text
S → NP VP
```

can generate:

```text
John runs.

Mary eats.

The cat sleeps.

The boy saw the dog.
```

---

# 3. Ambiguity

One sentence can have multiple valid meanings because it can have multiple valid **structures**, even if every word has only one meaning.

### Example 1 (Chapter example)

> I shot an elephant in my pajamas.

Meaning A:

```text
I was wearing pajamas.
```

Meaning B:

```text
The elephant was wearing pajamas.
```

The ambiguity comes from where the phrase **"in my pajamas"** attaches. ([NLTK][1])

### Example 2

> I saw a man with binoculars.

Meaning 1

```text
I used binoculars.
```

Meaning 2

```text
The man had binoculars.
```

This is **prepositional phrase (PP) attachment ambiguity**.

---

# 4. Constituents

A **constituent** is a group of words that functions as a single unit.

Sentence:

```text
The little bear saw the fish.
```

Constituents are:

```text
[The little bear]
[saw the fish]
[the fish]
```

Not constituents:

```text
little bear saw
```

because that sequence doesn't behave as a grammatical unit.

The chapter motivates this using **substitution tests**: if a sequence can be replaced by a single word (e.g., a pronoun) while preserving grammaticality, it is likely a constituent. ([NLTK][1])

---

# 5. Phrase Structure

Words combine into phrases.

Common phrase types:

| Phrase | Meaning              | Example      |
| ------ | -------------------- | ------------ |
| NP     | Noun Phrase          | the dog      |
| VP     | Verb Phrase          | ate the cake |
| PP     | Prepositional Phrase | in the park  |
| AP     | Adjective Phrase     | very tall    |

### Example

Sentence:

```text
The boy saw the dog in the park.
```

Structure:

```text
S
├── NP
│    The boy
└── VP
     saw
     NP
        the dog
     PP
        in the park
```

---

# 6. Coordination

Two phrases of the **same grammatical category** can be joined with conjunctions.

Examples:

```text
John and Mary
```

Both are noun phrases (NP), so the result is also an NP.

```text
happy and excited
```

Both are adjective phrases (AP).

Invalid example:

```text
John and happy
```

A noun phrase cannot be coordinated with an adjective phrase. ([NLTK][1])

---

# 7. Syntax Trees (Parse Trees)

A parse tree visually represents sentence structure.

Example:

```text
John eats apples.
```

Tree:

```text
S
├── NP
│     John
└── VP
      eats
      NP
          apples
```

The tree makes explicit:

- Subject: John
- Verb: eats
- Object: apples

This representation supports downstream semantic interpretation. ([NLTK][1])

---

# 8. Context-Free Grammar (CFG)

A **Context-Free Grammar** defines how phrases can be built using production rules.

Example grammar:

```text
S  → NP VP

NP → Det N

VP → V NP

Det → the | a

N → dog | cat

V → chased
```

### Generating a sentence

Start with:

```text
S
```

Apply rules:

```text
S

↓

NP VP

↓

Det N VP

↓

the dog VP

↓

the dog V NP

↓

the dog chased NP

↓

the dog chased Det N

↓

the dog chased the cat
```

The same grammar can generate many valid sentences. ([NLTK][1])

---

# 9. Recursive Grammar

A grammar is **recursive** if rules can refer back to themselves, directly or indirectly.

Example:

```text
NP → NP PP
```

Start:

```text
the dog
```

Apply recursively:

```text
the dog in the park
```

Again:

```text
the dog in the park beside the river
```

Again:

```text
the dog in the park beside the river near the school
```

This recursion explains why natural languages can express infinitely many ideas with finite rules. ([NLTK][1])

---

# 10. Parsing

A **parser** takes:

```text
Sentence
```

and produces:

```text
Parse Tree
```

Example:

Input:

```text
Mary saw Bob
```

Output:

```text
S

NP VP

Mary saw Bob
```

Parsing determines which grammar rules produced the sentence. ([NLTK][1])

---

# 11. Recursive Descent Parser

A **top-down** parser.

It starts from:

```text
S
```

and repeatedly expands grammar rules until the sentence is matched.

Example:

```text
S

↓

NP VP

↓

John VP

↓

John V NP

↓

John saw Mary
```

### Advantages

- Easy to understand
- Mirrors the grammar

### Problems

- Repeatedly explores impossible branches
- Fails with **left-recursive** rules (e.g., `NP → NP PP`) because it can recurse forever. ([NLTK][1])

---

# 12. Shift-Reduce Parser

A **bottom-up** parser.

It builds larger structures from the input tokens.

Operations:

### Shift

Move the next word onto a stack.

```text
Stack:

John
```

### Reduce

Replace a recognized sequence with a higher-level constituent.

```text
John

↓

NP
```

Continue:

```text
NP saw Mary

↓

NP VP

↓

S
```

### Pros

- More efficient than naïve top-down search

### Cons

- Greedy choices may miss a valid parse because it generally lacks backtracking. ([NLTK][1])

---

# 13. Chart Parsing

Chart parsing uses **dynamic programming**.

Instead of recomputing the same partial parses repeatedly, it stores them in a chart and reuses them.

Imagine parsing:

```text
The boy saw the dog.
```

If the parser has already established that:

```text
the dog

↓

NP
```

it records that result. Any later step needing that NP can reuse it instead of rebuilding it.

Benefits:

- Avoids repeated computation
- Handles ambiguity efficiently
- Basis for many practical classical parsers ([NLTK][1])

---

# 14. Dependency Grammar

Constituency grammars group words into phrases.

Dependency grammars instead connect words directly through **head–dependent** relationships.

Example:

```text
John eats apples.
```

Dependencies:

```text
eats
├── John
└── apples
```

The verb **eats** is the head; **John** is the subject dependent and **apples** is the object dependent.

Dependency parsing is widely used in modern NLP libraries because these relations are convenient for information extraction and semantic analysis. ([NLTK][1])

---

# 15. Constituency vs. Dependency Parsing

| Constituency Parsing             | Dependency Parsing                                 |
| -------------------------------- | -------------------------------------------------- |
| Groups words into nested phrases | Connects words directly with grammatical relations |
| Produces a phrase-structure tree | Produces a dependency graph/tree                   |
| Useful for phrase-level syntax   | Useful for subject, object, modifier relations     |

### Example

Sentence:

```text
The smart student solved the problem.
```

**Constituency**

```text
S
├── NP
│    The smart student
└── VP
     solved
     NP
        the problem
```

**Dependency**

```text
solved
├── student
│    └── smart
└── problem
```

---

# 16. Key Takeaways

The chapter concludes that:

- Sentences have hierarchical structure, not just sequences of words.
- Grammars compactly describe infinitely many valid sentences.
- Syntax trees reveal constituents and grammatical relations.
- CFGs are a foundational formalism for phrase structure.
- Dependency grammars emphasize head–dependent relationships.
- Ambiguity often arises from different possible structures rather than different word meanings.
- Parsing algorithms automatically recover sentence structure, with chart parsing improving efficiency through dynamic programming. ([NLTK][1])

## In the LLM Era

Although modern transformer-based LLMs typically **do not explicitly run CFG parsers during inference**, they learn rich syntactic patterns from large corpora. Research probing models such as BERT shows they encode substantial information about sentence structure implicitly. ([arXiv][2])

For interviews, the most important concepts from this chapter are:

- Why syntax matters
- Constituents and phrase structure
- Parse trees
- Context-Free Grammars (CFGs)
- Syntactic ambiguity
- Constituency vs. dependency parsing
- Recursive descent, shift-reduce, and chart parsing (at a conceptual level)
- How these classical ideas relate to modern LLMs, which largely learn syntax implicitly rather than relying on handcrafted grammars. ([NLTK][1])

[1]: https://www.nltk.org/book/ch08.html?utm_source=chatgpt.com "8. Analyzing Sentence Structure"
[2]: https://arxiv.org/abs/1905.06316?utm_source=chatgpt.com "What do you learn from context? Probing for sentence structure in contextualized word representations"

Below are **15 advanced interview questions** inspired by **Chapter 8: Analyzing Sentence Structure**. These are the kinds of questions commonly asked in NLP, Computational Linguistics, ML, and LLM interviews. Each answer includes an explanation, reasoning, and examples from both classical NLP and modern LLMs. The questions are grounded in the concepts covered in the NLTK chapter, including CFGs, parsing, ambiguity, and dependency grammar. ([NLTK][1])

---

# 1. Why do we need parsing if we already have POS tagging?

## Answer

POS tagging only assigns a grammatical category to each word.

Example:

> The boy saw the girl.

POS tags:

```text
The/DT
boy/NN
saw/VBD
the/DT
girl/NN
```

Although we know:

- boy → noun
- saw → verb
- girl → noun

we still don't know:

- Who performed the action?
- Who received the action?

Parsing provides this information.

Parse tree:

```text
S
├── NP
│     The boy
└── VP
      saw
      NP
         the girl
```

Now we know:

- Subject = The boy
- Object = the girl

### Real-world example

Question Answering

Question:

> Who saw the girl?

Without parsing:

```
boy
girl
saw
```

are just words.

With parsing:

```
Subject(saw) = boy
Object(saw) = girl
```

Modern LLMs infer this implicitly, while classical NLP systems often required explicit parsing. ([NLTK][1])

---

# 2. Explain syntactic ambiguity with examples.

## Answer

A sentence is **syntactically ambiguous** when the **same sequence of words admits multiple valid parse trees**.

Example:

> I saw the man with a telescope.

### Parse 1

```text
I used a telescope.
```

Tree:

```text
VP
├── saw
└── PP
     with telescope
```

### Parse 2

```text
The man had a telescope.
```

Tree:

```text
NP
├── man
└── PP
     with telescope
```

Notice:

- Words are identical.
- POS tags are identical.
- Only the structure changes.

Another classic example:

> Visiting relatives can be annoying.

Meaning 1

```
The act of visiting relatives.
```

Meaning 2

```
Relatives who are visiting.
```

This ambiguity motivates the need for parsing. ([NLTK][1])

---

# 3. Explain Context-Free Grammar (CFG). Why is it called "context-free"?

## Answer

A CFG defines valid sentence structures using production rules.

Example:

```text
S → NP VP

NP → Det N

VP → V NP

Det → the

N → dog

V → chased
```

Generation:

```
S

↓

NP VP

↓

the dog chased the dog
```

### Why "context-free"?

A rule applies regardless of where the non-terminal appears.

Example:

```
NP → Det N
```

This rule works:

```
Subject NP

Object NP

Inside PP
```

It never depends on neighboring symbols.

Example:

```
The dog chased the cat.
```

Both NPs use the same rule.

CFGs are simple and expressive but cannot enforce certain agreements (e.g., subject–verb agreement) without extensions. ([NLTK][1])

---

# 4. Why are parse trees hierarchical instead of linear?

## Answer

Natural language has nested structure.

Example:

```
The old man with glasses smiled.
```

Linear sequence:

```
The old man with glasses smiled
```

Hierarchy:

```text
S
├── NP
│    ├── The
│    ├── old
│    ├── man
│    └── PP
│         with glasses
└── VP
      smiled
```

The modifier "with glasses" belongs to **man**, not **smiled**.

Hierarchy preserves these relationships.

---

# 5. Explain recursion in grammar.

## Answer

Recursive rules reference themselves (directly or indirectly).

Example:

```
NP → NP PP
```

Generation:

```
dog
```

↓

```
dog in the park
```

↓

```
dog in the park near the river
```

↓

```
dog in the park near the river beside the school
```

A finite grammar can therefore generate infinitely many sentences, one of the core motivations discussed in the chapter. ([NLTK][1])

---

# 6. Why does Recursive Descent Parsing fail with left recursion?

## Answer

Example rule:

```
NP → NP PP
```

Parser starts:

```
Need NP
```

Expands:

```
NP

↓

NP PP

↓

NP PP PP

↓

NP PP PP PP
```

It never reaches terminal words.

Infinite recursion occurs before consuming input.

Solution:

- Rewrite grammar
- Use Chart Parser
- Use Left-Corner Parser

The NLTK chapter explicitly highlights left recursion as a major weakness of recursive descent parsing. ([NLTK][1])

---

# 7. Compare Recursive Descent, Shift-Reduce, and Chart Parsing.

| Feature             | Recursive Descent | Shift-Reduce | Chart Parsing       |
| ------------------- | ----------------- | ------------ | ------------------- |
| Strategy            | Top-down          | Bottom-up    | Dynamic programming |
| Starts from         | Grammar           | Input        | Both                |
| Left recursion      | ❌                | ✅           | ✅                  |
| Recomputes subtrees | Yes               | Sometimes    | No                  |
| Handles ambiguity   | Poorly            | Limited      | Excellent           |

### Example

Sentence:

```
Mary saw Bob.
```

Recursive Descent

```
Start with S

↓

Expand grammar

↓

Match words
```

Shift-Reduce

```
Read Mary

↓

NP

↓

Read saw

↓

VP

↓

S
```

Chart Parser

Stores intermediate results so repeated substructures are reused instead of recomputed. ([NLTK][1])

---

# 8. Why is Chart Parsing more efficient?

## Answer

Suppose:

```
The dog chased the cat in the park.
```

Many grammar rules reuse:

```
the cat
```

Without a chart:

```
Build NP

↓

Discard

↓

Build again

↓

Discard

↓

Build again
```

Chart parsing stores:

```
Span (2–4)

↓

NP
```

Every future rule simply reuses that result.

This dynamic programming approach avoids exponential recomputation. ([NLTK][1])

---

# 9. Constituency Parsing vs Dependency Parsing

## Answer

Sentence:

```
John quickly ate an apple.
```

### Constituency

```text
S
├── NP
│     John
└── VP
      quickly
      ate
      NP
         an apple
```

Groups words into phrases.

### Dependency

```text
ate
├── John
├── quickly
└── apple
```

Shows direct grammatical relationships.

Dependency parsing is more common in modern NLP pipelines because downstream tasks often need subject, object, and modifier relations. ([NLTK][1])

---

# 10. Explain PP Attachment Ambiguity.

Sentence:

```
The boy saw the dog with a collar.
```

Interpretation 1

```
Dog has collar.
```

```text
NP
 └── dog
      └── with collar
```

Interpretation 2

```
Boy used a collar.
```

```text
VP
 └── saw
      └── with collar
```

Different parse trees imply different meanings.

---

# 11. Why can't CFG model all natural language?

## Answer

CFGs struggle with long-distance dependencies and agreement.

Example:

```
The dogs are running.
```

versus

```
The dogs is running.
```

Both may be generated unless the grammar encodes number agreement with additional mechanisms.

Another example:

```
The book that John said Mary bought was expensive.
```

The dependency between **book** and **was** spans multiple clauses.

Feature grammars or dependency grammars are often used to capture such constraints more naturally.

---

# 12. How would you build a parser using NLTK?

Example:

Grammar

```python
grammar = CFG.fromstring("""
S -> NP VP
NP -> 'John'
VP -> V NP
V -> 'likes'
NP -> 'Mary'
""")
```

Parser

```python
parser = nltk.ChartParser(grammar)

sentence = "John likes Mary".split()

for tree in parser.parse(sentence):
    print(tree)
```

Output

```text
S
├── NP John
└── VP
      likes
      Mary
```

This mirrors the workflow shown throughout the chapter. ([NLTK][1])

---

# 13. Do LLMs still need parsing?

## Answer

Generally, **no explicit parser is run during inference**.

Instead:

```
Sentence

↓

Transformer

↓

Embeddings

↓

Attention

↓

Prediction
```

The model learns syntax implicitly from data.

However, explicit parsing remains useful for:

- Information extraction
- Knowledge graph construction
- Grammar checking
- Semantic parsing
- Low-resource NLP
- Linguistics research

---

# 14. When would you prefer dependency parsing over constituency parsing?

Use dependency parsing when you need relationships between words.

Example:

```
Tesla acquired SolarCity.
```

Dependencies:

```
acquired
├── Tesla
└── SolarCity
```

Perfect for:

- Relation extraction
- Event extraction
- Knowledge graphs
- Question answering

Use constituency parsing when phrase boundaries and nested structures are important, such as in syntax-focused linguistic analysis.

---

# 15. Design Question: Build an NLP Pipeline for Question Answering (Classical vs. Modern)

**Classical NLP pipeline**

```
Sentence
      ↓
Tokenizer
      ↓
POS Tagger
      ↓
CFG Parser
      ↓
Dependency Extraction
      ↓
Semantic Analysis
      ↓
Question Answering
```

**Modern LLM pipeline**

```
Sentence
      ↓
Tokenizer
      ↓
Transformer
      ↓
Contextual Embeddings
      ↓
Attention Layers
      ↓
Answer Generation
```

**Interview follow-up:** _Would you ever combine the two?_

Yes. A hybrid system can use dependency parsing or constituency parsing to produce interpretable structural features or verify extracted relations, while an LLM handles reasoning, summarization, or natural language generation. This is common in information extraction, legal NLP, biomedical NLP, and explainable AI systems. ([NLTK][1])

[1]: https://www.nltk.org/book/ch08.html?utm_source=chatgpt.com "8. Analyzing Sentence Structure"
