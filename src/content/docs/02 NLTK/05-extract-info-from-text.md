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
  - Chunk structures can be represented using either tags or trees. The most widespread file representation uses `IOB` tags
    - Each token is tagged with one of three special chunk tags, `I(inside), O(outside), or B(begin)`
    - `B` and `I` tags are suffixed with the chunk type, e.g. `B-NP`, `I-NP`
    - There is one token per line, each with its part-of-speech tag and chunk tag
    - Allow us to represent more than one chunk type, so long as the chunks do not overlap
    - NOTE: we can have nested or flat structure. Nested is NOT RECOMMENDED since we miss few tags because of complex grammar and it is hard to process
    - SEE INFOGRAPHIC

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

```py title='Nested Structure with Cascaded Chunkers'
# AVOID IT
grammar = r"""
  NP: {<DT|JJ|NN.*>+}          # Chunk sequences of DT, JJ, NN
  PP: {<IN><NP>}               # Chunk prepositions followed by NP
  VP: {<VB.*><NP|PP|CLAUSE>+$} # Chunk verbs and their arguments
  CLAUSE: {<NP><VP>}           # Chunk NP, VP
  """
cp = nltk.RegexpParser(grammar)
sentence = [("Mary", "NN"), ("saw", "VBD"), ("the", "DT"), ("cat", "NN"), ("sit", "VB"), ("on", "IN"), ("the", "DT"), ("mat", "NN")]
print(cp.parse(sentence))
# (S
#   (NP Mary/NN)
#   saw/VBD
#   (CLAUSE
#     (NP the/DT cat/NN)
#     (VP sit/VB (PP on/IN (NP the/DT mat/NN)))))
```

## Developing and Evaluating Chunkers

- `conll2000.chunked_sents('train.txt')`: returns list of sentences annotated with part-of-speech tags and chunk tags in the IOB format
- `conll2000.chunked_sents('train.txt', chunk_types=['NP'])`: other chunk tags are hidden - only phrases are present but other tags are missing

```py title='rule-based/regex approach'
from nltk.corpus import conll2000

test_sents = conll2000.chunked_sents("test.txt", chunk_types=["NP"])
grammar = r"NP: {<[CDJNP].*>+}"
cp = nltk.RegexpParser(grammar)
print(cp.accuracy(test_sents))
# ChunkParse score:
#     IOB Accuracy:  87.7%
#     Precision:     70.6%
#     Recall:        67.8%
#     F-Measure:     69.2%
```

```py title='data-driven/lookup approach'
# We use the training corpus to find the chunk tag (I, O, or B) that is most likely for each part-of-speech tag
# In other words, we can build a chunker using a unigram tagger
# NOTE: Here we've built unigram chunker. We can update it to build a BigramChunker by using a BigramTagger rather than a UnigramTagger
class UnigramChunker(nltk.ChunkParserI):
    # Most of code is simply used to convert between tree and tag format
    def __init__(self, train_sents):
        train_data = [
            [(t, c) for w, t, c in nltk.chunk.tree2conlltags(sent)]
            for sent in train_sents
        ]  # w:word, t:part-of-speech(pos), c:chunk
        self.tagger = nltk.UnigramTagger(train_data)

    def parse(self, sentence):
        # generate chunk tag and return a tree
        pos_tags = [pos for (word, pos) in sentence]
        tagged_pos_tags = self.tagger.tag(pos_tags)
        chunktags = [chunktag for (pos, chunktag) in tagged_pos_tags]
        conlltags = [
            (word, pos, chunktag)
            for ((word, pos), chunktag) in zip(sentence, chunktags)
        ]
        return nltk.chunk.conlltags2tree(conlltags)


test_sents = nltk.corpus.conll2000.chunked_sents("test.txt", chunk_types=["NP"])
train_sents = nltk.corpus.conll2000.chunked_sents("train.txt", chunk_types=["NP"])
unigram_chunker = UnigramChunker(train_sents)
print(unigram_chunker.accuracy(test_sents))
# ChunkParse score:
#     IOB Accuracy:  92.9%
#     Precision:     79.9%
#     Recall:        86.8%
#     F-Measure:     83.2%
```

```py title='classifier-based approach'
def tags_since_dt(sentence, i):
    # creates a string describing the set of all part-of-speech tags that have been encountered since the most recent determiner,
    # or since the beginning of the sentence if there is no determiner before index i
    tags = set()
    for word, pos in sentence[:i]:
        if pos == "DT":
            tags = set()
        else:
            tags.add(pos)
    return "+".join(sorted(tags))


def npchunk_features(sentence, i, history):
    word, pos = sentence[i]
    if i == 0:
        prevword, prevpos = "<START>", "<START>"
    else:
        prevword, prevpos = sentence[i - 1]
    if i == len(sentence) - 1:
        nextword, nextpos = "<END>", "<END>"
    else:
        nextword, nextpos = sentence[i + 1]
    return {
        "pos": pos,
        "word": word,
        "prevpos": prevpos,
        "nextpos": nextpos, # lookahead features
        "prevpos+pos": "%s+%s" % (prevpos, pos), # paired features
        "pos+nextpos": "%s+%s" % (pos, nextpos),
        "tags-since-dt": tags_since_dt(sentence, i), # complex contextual features
    }


class ConsecutiveNPChunkTagger(nltk.TaggerI):
    # A custom tagger that uses a maximum entropy classifier to tag words in a sentence with their corresponding chunk tags (B-NP, I-NP, O)
    def __init__(self, train_sents):
        train_set = []
        for tagged_sent in train_sents:
            untagged_sent = nltk.tag.untag(tagged_sent)
            history = []
            for i, (word, tag) in enumerate(tagged_sent):
                featureset = npchunk_features(untagged_sent, i, history)
                train_set.append((featureset, tag))
                history.append(tag)
        self.classifier = nltk.NaiveBayesClassifier.train(train_set)

    def tag(self, sentence):
        history = []
        for i, word in enumerate(sentence):
            featureset = npchunk_features(sentence, i, history)
            tag = self.classifier.classify(featureset)
            history.append(tag)
        return zip(sentence, history)


class ConsecutiveNPChunker(nltk.ChunkParserI):
    # A wrapper class for the ConsecutiveNPChunkTagger that provides a parse method to chunk sentences
    def __init__(self, train_sents):
        tagged_sents = [
            [((w, t), c) for (w, t, c) in nltk.chunk.tree2conlltags(sent)]
            for sent in train_sents
        ]
        self.tagger = ConsecutiveNPChunkTagger(tagged_sents)

    def parse(self, sentence):
        tagged_sents = self.tagger.tag(sentence)
        conlltags = [(w, t, c) for ((w, t), c) in tagged_sents]
        return nltk.chunk.conlltags2tree(conlltags)

chunker = ConsecutiveNPChunker(train_sents)
print(chunker.accuracy(test_sents))
# ChunkParse score:
#     IOB Accuracy:  95.0%
#     Precision:     85.9%
#     Recall:        90.0%
#     F-Measure:     87.9%
```

## Named Entity Recognition (NER)

- Named entities (NEs) are definite noun phrases that refer to specific types of individuals, such as organizations, persons, dates, and so on
- Entity recognition is often performed using chunkers, which segment multi-token sequences, and label them with the appropriate entity type
- Sub-task of NER:
  1. Identifying the boundaries of the NE, and
  2. Identifying its type
- Usage:
  - Identifying relations in Information Extraction
  - In question answering (QA)
- Approach to build NER: we can build a tagger that labels each word in a sentence using IOB format, where chunks are labeled by their appropriate type (same as noun phrase chunker)

```py title='Example Data'
# IOB format: 'PER': person; 'ORG': organization
Eddy N B-PER
Bonte N I-PER
is V O
woordvoerder N O
van Prep O
diezelfde Pron O
Hogeschool N B-ORG
. Punc O
```

## Relation Extraction

- Once named entities have been identified in a text, we then want to extract the relations that exist between them
- Approach: look for all triples of the form `(X, α, Y)`, where `X` & `Y` are named entities of the required types, and `α` is the string of words that intervenes between `X` & `Y`
- E.g. `([ORG: 'Georgia-Pacific'], 'in', [LOC: 'Atlanta'])`
