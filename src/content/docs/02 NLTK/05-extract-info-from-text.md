---
title: Extracting Information from Text
---

## Information Extraction Architecture

- Information Extraction: task of converting **unstructured** data of natural language sentences into **structured** data like list of key-value pairs or table
- Architecture: Takes raw text of a document as its input, and generates a list of **(entity, relation, entity)** tuples as its output (SEE INFOGRAPHIC):
  1. Segment: Raw text of the document is split into sentences using a sentence segmenter
  2. Token: Each sentence is further subdivided into words using a tokenizer
  3. POS tag: Each sentence is tagged with part-of-speech tags
  4. Named Entity Detection: Search for mentions of potentially interesting entities in each sentence
  5. Relation Detection: Search for likely relations between different entities in the text
- E.x. Given a document that indicates that the company ABC is located in Atlanta, it might generate the tuple `([ORG: 'ABC'], 'in', [LOC: 'Atlanta'])`

```py title='pre-process'
# Perform first 3 task
def ie_preprocess(document):
    sentences = nltk.sent_tokenize(document) # sentence segmenter
    sentences = [nltk.word_tokenize(sent) for sent in sentences] # word tokenizer
    sentences = [nltk.pos_tag(sent) for sent in sentences] # part-of-speech tagger
```

## Chunking

- Chunking: The process of segmenting and labelling multi-token sequences (SEE INFOGRAPHIC)
- Chunking is used in Named Entity Detection
- Noun Phrase (NP) Chunking:
  - We search for chunks corresponding to individual noun phrases
  - E.x. text with NP-chunks marked using brackets: `[ The/DT market/NN ] for/IN [ system-management/NN software/NN ] for/IN [ Digital/NNP ] [ 's/POS hardware/NN ] ...`
  - NP-chunks are often smaller pieces than complete noun phrases:
    - E.x. "the market for system-management software for Digital's hardware" is a single noun phrase, but it is captured in NP-chunks by the simpler chunk "the market"
    - Reason: One of the motivations is that NP-chunks are defined so as not to contain other NP-chunks i.e. no nesting or no overlapping
  - Create NP-chunker: define a chunk grammar, consisting of rules that indicate how sentences should be chunked (SEE CODE)
- Tag Patterns:
  - A tag pattern is a sequence of part-of-speech tags delimited using angle brackets
  - They are used to specify rules that make up a chunk grammar
  - They are similar to regular expression patterns
  - E.g. `<DT>?<JJ.*>*<NN.*>+`: This will chunk any sequence of tokens:
    - beginning with an optional determiner
    - followed by zero or more adjectives of any type
    - followed by one or more nouns of any type
- Chunking with Regular Expressions:
  - Process:
    - To find the chunk structure for a given sentence, the `RegexpParser` chunker begins with a flat structure in which no tokens are chunked
    - The chunking rules are applied in turn, successively updating the chunk structure
      - NOTE: If a tag pattern matches at overlapping locations, the leftmost match takes precedence
    - Once all of the rules have been invoked, the resulting chunk structure is returned
- Chinking:
  - Chink to be a sequence of tokens that is not included in a chunk
  - E.x. `[ the/DT little/JJ yellow/JJ dog/NN ] barked/VBD at/IN [ the/DT cat/NN ]`. Here `barked/VBD at/IN` is a chink
  - In grammar, chink regex is represented as `}...{`
- Representing Chunks: Tags vs Trees:
  - TODO

```py title='Grammar'
## simple chunk grammar consisting of two rules
grammar_1 = r"""
  NP: {<DT|PP\$>?<JJ>*<NN>}   # chunk determiner/possessive, adjectives and noun
      {<NNP>+}                # chunk sequences of proper nouns
"""
cp = nltk.RegexpParser(grammar)
sentence = [("Rapunzel", "NNP"), ("let", "VBD"), ("down", "RP"), ("her", "PP$"), ("long", "JJ"), ("golden", "JJ"), ("hair", "NN")]
print(cp.parse(sentence))
# O/P =>
# (S
#   (NP Rapunzel/NNP)
#   let/VBD
#   down/RP
#   (NP her/PP$ long/JJ golden/JJ hair/NN))

## example: tag pattern matches at overlapping locations
nouns = [("money", "NN"), ("market", "NN"), ("fund", "NN")]
grammar = "NP: {<NN><NN>}  # Chunk two consecutive nouns"
cp = nltk.RegexpParser(grammar)
print(cp.parse(nouns)) # (S (NP money/NN market/NN) fund/NN)
```

```py title='NP-Chunker'
sentence = [
    ("the", "DT"),
    ("little", "JJ"),
    ("yellow", "JJ"),
    ("dog", "NN"),
    ("barked", "VBD"),
    ("at", "IN"),
    ("the", "DT"),
    ("cat", "NN"),
]

grammar = "NP: {<DT>?<JJ>*<NN>}"
# simple grammar with a single regular-expression rule
# his rule says that an NP chunk should be formed whenever the chunker finds an optional determiner (DT) followed by any number of adjectives (JJ) and then a noun (NN)

cp = nltk.RegexpParser(grammar) # chunk parser
result = cp.parse(sentence)
print(result) # The result is a tree, which we can either print, or display graphically (`result.draw()`)
# Graph: Each non-leaf node is a label; leaf nodes represent tokens
# O/P =>
# (S  ## this is root level label ('S' means sentence)
#   (NP the/DT little/JJ yellow/JJ dog/NN)  ## first NP chunk
#   barked/VBD
#   at/IN
#   (NP the/DT cat/NN))  ## second NP chunk
```

```py title='Chink'
grammar = r"""
  NP:
    {<.*>+}          # Chunk everything
    }<VBD|IN>+{      # Chink sequences of VBD and IN
  """
sentence = [("the", "DT"), ("little", "JJ"), ("yellow", "JJ"), ("dog", "NN"), ("barked", "VBD"), ("at", "IN"),  ("the", "DT"), ("cat", "NN")]
cp = nltk.RegexpParser(grammar)
print(cp.parse(sentence))
# (S
#    (NP the/DT little/JJ yellow/JJ dog/NN)
#    barked/VBD
#    at/IN
#    (NP the/DT cat/NN))
```
