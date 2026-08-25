---
title: Analyzing the Meaning of Sentences
---

- Deals with "How can a computer understand the meaning of a sentence rather than just its structure?"
- **Syntax** explains sentence structure; **semantics** explains sentence meaning
  - Syntactic parsing creates a parse tree
  - Semantic parsing converts natural language into a formal meaning representation such as:
    - SQL
    - First-order logic
    - Lambda expressions
    - Knowledge graph queries
- Natural Language Understanding (NLU)/ Semantic Parsing:
  - Foundation: first-order logic (FOL), lambda calculus, model checking, and discourse representation
  - Workflow: `Sentence -> meaning representation (FOL) -> DB query (Knowledge Base + Inference Engine) -> Answer`
  - E.g. Sentence: "Which cities are in China?", Query: `SELECT city FROM world WHERE country='China'`
  - Instead of merely matching keywords, the sentence is translated into a logical/database query
  - This motivates the distinction between **syntax** (sentence form) and **semantics** (sentence meaning)
- End-to-end pipeline: `Sentence -> Syntactic Parser -> Semantic Representation (FOL) -> Knowledge Base / Model -> Model Checking / Theorem Proving -> Answer / Inference`
- Modern LLMs rarely translate text into explicit first-order logic before answering questions. They learn semantic representations (embeddings) from large datasets
- | Feature          | Symbolic Semantics | Neural (LLMs) Semantics    |
  | ---------------- | ------------------ | -------------------------- |
  | Representation   | First-order logic  | Embeddings                 |
  | Interpretability | High               | Low                        |
  | Scalability      | Smaller domains    | Very large domains         |
  | Knowledge source | Rules + KB         | Training data              |
  | Example          | `love(john,mary)`  | `[0.18, -0.42, 0.73, ...]` |

## Truth-Conditional Semantics (Set Theory)

- Idea: The meaning of a sentence is determined by the conditions under which it is true
- E.x. "John loves Mary" is true if:
  - John exists
  - Mary exists
  - "love" holds between them
- Meaning therefore depends on the **world (model)** rather than the words (grammar) alone
- Words refer to objects in the world. E.x. "Paris" refers to "The city Paris"; "John" refers to one individual

## Logic as Meaning Representation

- Instead of English, computer uses **First Order Logic (FOL)**
- FOL provides a formal language for representing **meaning**
- E.g: English: "John runs." -> Logic: `run(john)`
- This representation is:
  - unambiguous,
  - machine-readable, and
  - suitable for reasoning
- FOL Components:
  1. Constants: Specific objects. E.g. John, India
  2. Variables: Represent unknown objects. E.g. `x`, `y`
  3. Predicates: Represent a property of an object or a relation between multiple objects
     - Types:
       - Unary Predicate (1 Argument): Describes a single property of one object. E.x: `tall(John)` means "John is tall."
       - Binary Predicate (2 Arguments): Describes a relation between two objects. E.x: `love(John, Mary)` means "John loves Mary."
       - Ternary Predicate (3 Arguments): Describes a relation among three objects. E.x: `give(John, book, Mary)` means "John gives a book to Mary."
  4. Functions: returns another object. E.g. `mother(john)` returns John's mother
- Limitation: FOL is powerful but cannot naturally represent several linguistic phenomena. Examples include:
  - Tense: "John had been running."
  - Belief: "Alice believes Bob is honest."
  - Generalized quantifiers: "Most students passed."
  - These often require richer logical systems (e.g., temporal logic) beyond standard FOL

## Logical Operators

- AND: English: "John runs and Mary dances." -> Logic: `run(john) ∧ dance(mary)`
- OR: English: "John runs or Mary dances." -> Logic: `run(john) ∨ dance(mary)`
- NOT: English: "John does not run." -> Logic: `¬run(john)`
- IMPLIES: English: "If it rains, roads become wet." -> Logic: `rain → wet`

## Quantifiers

- Existential Quantifier (∃):
  - English: "A student dances." -> Logic: `∃x(Student(x) ∧ Dance(x))`
  - Meaning: There exists at least one student who dances
- Universal Quantifier (∀):
  - English: "Every student studies." -> Logic: `∀x(Student(x) → Study(x))`
  - Meaning: For every person, if they are a student, then they study.

## Models

- A model represents a miniature world consisting of:
  - objects. E.g: John, Mary, Dog
  - relations. E.g: `love(John,Mary)`, `own(Mary,Dog)`
  - properties
- Model Checking: Once logic is available, the computer can determine whether a statement is true
  - This is automated reasoning. NLTK provides tools to evaluate such logical formulas automatically
  - E.g.:
    - Knowledge base: `love(john,mary); friend(mary,john)`
    - Query: `love(john,mary)`. Answer: True
    - Query: `love(mary,john)`. Answer: False

## Theorem Proving

- Instead of checking stored facts, the system can infer new ones. It derives new facts from existing knowledge
- This is deductive reasoning
- Knowledge: Every student is a person. John is a student
- Logic: `∀x(Student(x) → Person(x)); Student(John)`
- Inference: `Person(John)`
- Example of theorem provers: Prover9, Mace4

| Model Checking            | Theorem Proving       |
| ------------------------- | --------------------- |
| Checks truth in one model | Derives new knowledge |
| No inference              | Uses logical rules    |
| Verification              | Deduction             |

## Compositional Semantics

- Idea: The meaning of a sentence comes from the meanings of its parts and how they are syntactically combined
- Meaning of the sentence = Meanings of the words + Syntactic structure
- E.x. "John loves Mary.":
  - Lexical Meanings (The Parts):
    - John/Mary = the individual entity John
    - loves = the binary relation `love(x, y)`, where `x` is the lover and `y` is the beloved
  - Syntactic Rule (The Combination): The grammar tells us that "John" is the subject (x) and "Mary" is the object (y)
  - Compositional Result: By substituting the parts into the structure, we get `love(John, Mary)`
- Meaning is built step by step

## Lambda Calculus

- Lambda Calculus provide mathematical system for semantic composition. Lambda means anonymous functions (functions without names)
- It makes semantic composition possible
- Instead of storing complete sentence meanings, we build them piece by piece
- Beta Reduction: simply means replacing variable with argument

```txt title='Example'
Verb
↓
walks
↓
represented as
↓
λx.walk(x) ## 'λx.x' - A function that takes 'x' and returns 'x'
↓
Apply it to John
↓
(λx.walk(x))(John)
↓
β-reduction
↓
walk(John)
```

## Semantic Features in Grammar

- Feature-based grammars can include a semantic (`sem`) attribute
- Instead of only parsing syntax (e.g. `NP + VP`), they also compute semantics (e.g. `love(john,mary)`) during parsing

## Scope Ambiguity

- Some sentences have multiple logical interpretations
- E.g. "Every student read a book.":
  - Interpretation 1: Each student may have read a different book. `∀x(Student(x) → ∃y(Book(y) ∧ Read(x,y)))`
  - Interpretation 2: There exists one particular book that everyone read. `∃y(Book(y) ∧ ∀x(Student(x) → Read(x,y)))`

## Discourse Representation Theory (DRT)

- Meaning extends beyond individual sentences
- E.x. "John bought a dog. It barked.". In this what is "It"
- DRT maintains discourse context so pronouns and references can be resolved across sentences
- DRT extends first-order logic across multiple sentences
- E.x "Angus owns a dog. It bit Irene.". Combined Meaning: `∃x(Dog(x) ∧ Own(Angus,x) ∧ Bite(x,Irene))`
- NLTK's `DiscourseTester` demonstrates incremental discourse interpretation

---

## Most Important Interview Topics (Highest Priority)

If you're preparing for NLP, LLM, or AI interviews, prioritize these concepts from Chapter 10:

1. Semantic Parsing
2. Syntax vs. Semantics
3. First-Order Logic (FOL)
4. Predicates, Constants, Variables
5. Quantifiers (`∀`, `∃`)
6. Truth-Conditional Semantics
7. Model Checking vs. Theorem Proving
8. Compositional Semantics (Frege's Principle)
9. Lambda Calculus and β-Reduction
10. Scope Ambiguity
11. Discourse Representation Theory (DRT)
12. Symbolic Semantics vs. Neural (LLM) Semantics
13. Natural Language to SQL
14. Neuro-Symbolic AI and the continuing relevance of formal semantics in the LLM era. ([nltk.org][1])

[1]: https://www.nltk.org/book/ch10.html?utm_source=chatgpt.com "10. Analyzing the Meaning of Sentences"
