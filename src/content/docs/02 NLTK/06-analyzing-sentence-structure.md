---
title: Analyzing Sentence Structure
---

- Syntactic parsing: the process of discovering the grammatical structure of a sentence
  - Instead of treating text as a sequence of words, it explains how to represent sentences as **trees** using formal grammars and parsing algorithms
- Sentence structure is crucial for understanding meaning, especially when sentences are ambiguous
  - E.g. "I shot an elephant in my pajamas." has 2 interpretations: "I was wearing pajamas." & "The elephant was wearing pajamas."
  - Same words. Different structure. Different meaning.
- Language is recursive. E.g:
  - The dog barked
  - The dog that chased the cat barked
  - The dog that chased the cat that climbed the tree barked
- Relevancy in LLM Era:
  - Before deep learning: `Text(Sentence -> Tokenizer -> POS Tagger) -> CFG -> Parser -> Features -> Classifier`
  - Today: `Text -> Transformer -> Embeddings -> LLM`
  - Modern LLMs learn syntax implicitly from massive corpora rather than requiring manually written grammars

## Why Do We Need Sentence Structure?

- Earlier NLP techniques focused on:
  - Tokenization
  - POS tagging
  - N-grams
  - Word frequencies
- These techniques understand **individual words**, but they don't explain how words combine into meaningful sentences
- E.g. "Dogs chase cats."
  - A POS tagger may output: `Dogs/NNS chase/VBP cats/NNS`. This tells us: Dogs/Cats → noun, chase → verb
  - But it DOESN'T tell us: Who is performing the action? or Who receives the action?
  - Sentence structure answers these questions

## Constituents

- A constituent is a group of words that functions as a single unit
- Substitution tests: if a sequence can be replaced by a single word (e.g., a pronoun) while preserving grammar rules, it is likely a constituent
- Instead of viewing a sentence as `The | boy | saw | the | dog`, we group words into meaningful phrases:
  ```
  Sentence
   ├── NP
   │     The boy
   └── VP
         saw
         NP
          ├── the dog
  ```
- Important phrase types:
  - NP (Noun Phrase). E.g. "[The big blue bus] stopped here."
  - VP (Verb Phrase). E.g. "She [has been reading] for hours."
  - PP (Prepositional Phrase). E.g. "The keys are [on the kitchen table.]"
  - AP (Adjective Phrase). E.g. "The movie was [incredibly long and boring.]"
- Constituents (phrases) become nodes in a syntax tree

## Context-Free Grammar (CFG)

- A CFG defines production rules
- The grammar can generate infinitely many valid sentences using a finite set of rules
- `grammar = nltk.CFG.fromstring(...)`
- It is Context-Free because it does not depend on the previous/next sentences. E.g. "He won the game" - who is "he"
- Recursive Grammar:
  - A grammar is recursive if rules can refer back to themselves, directly or indirectly
  - E.g. `NP → NP PP`. "the dog" or "the dog in the park" or "the dog in the park beside the river" or "the dog in the park beside the river near the school"
- Why can't CFG model all natural language:
  - CFGs struggle with long-distance dependencies and agreement
  - E.x. "The dogs are running." & "The dogs is running.". Both may be generated unless the grammar encodes number agreement with additional mechanisms
  - Another e.x. "The book that John said Mary bought was expensive.":
    - The dependency between **book** and **was** spans multiple clauses
    - Feature grammars or dependency grammars are often used to capture such constraints more naturally

```txt title='Example'
# Grammar Rule
S  -> NP VP
VP -> V NP
NP -> Det N
Det -> the | a
N -> dog | boy
V -> saw

# Generated sentence
The boy saw the dog.
```

## Parse/Syntax Trees

- A parse tree visually represents sentence structure
- A parser converts `Mary saw Bob` into a tree:
  ```
  S
  ├── NP
  │     Mary
  └── VP
       saw
       NP
         Bob
  ```
- The tree explicitly represents grammatical relationships
- Ambiguity: One sentence may produce multiple parse trees
  - E.x. `I saw a man with a telescope.` has 2 interpretation: `I used a telescope.` & `The man had a telescope.`
  - This is called **PP (prepositional phrase) attachment ambiguity**

## Parsing Algorithms - Recursive Descent Parser

- Top-down
- Starts from `S` and expands rules until matching the sentence
- Pros: Simple
- Cons:
  - Very inefficient: Repeatedly explores impossible branches
  - Fails with left-recursive rules (e.g., `NP → NP PP`) because it can recurse forever

```text title='example'
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

## Parsing Algorithms - Shift-Reduce Parser

- Bottom-up
- Operations:
  - Shift token to stack: move the next word onto a stack
  - Reduce stack into larger constituents. E.g. `John -> NP -> NP VP -> S`
- Faster but may fail even when a valid parse exists (because of greedy choices and no back track)

## Parsing Algorithms - Chart Parsing

- Uses dynamic programming
- Stores partial results (in a chart) instead of recomputing them
- Both: top-down & bottom-up
- Pros: Avoids repeated work; Much faster; Handles ambiguity efficiently

## Dependency Grammar

- Instead of phrase trees (constituency grammar), we find relationships between words
- Verb becomes the head. E.x.:
  ```
  eat (head)
  ├── John (subject dependent)
  └── apple (object dependent)
  ```
- Dependency parsing is widely used in modern NLP libraries because these relations are convenient for:
  - information extraction
  - semantic analysis
  - question answering

```text title='Constituency vs Dependency'
# TEXT: "The smart student solved the problem."
# Constituency
S
├── NP
│    The smart student
└── VP
    solved
    NP
      the problem

# Dependency
solved
├── student
│    └── smart
└── problem
```
