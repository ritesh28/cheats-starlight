---
title: Categorizing and Tagging Words
---

- POS tagging or simply tagging: process of classifying words into their parts of speech (like noun, verb, adjective, pronoun) and labeling them accordingly
  - POS: part-of-speech or word classes or lexical categories
  - tagged token is represented using a tuple (token, tag)
  - raw text with POS representation: `The/AT grand/JJ jury/NN commented/VBD ...`. Pattern: `token/tag`
  - tagset: collection of tags (POS) used for a particular task
  - text-to-speech usually performs POS-tagging since a word depending on whether is is used as noun or verb, for example, is pronounced differently
- `tagged_words()` vs `tagged_sents()`:
  - tag of a word depends on the word and its context within a sentence. For this reason, we work with data at the level of (tagged) sentences rather than words
  - `tagged_words()`: use this when sentence structure does not matter and you only care about individual word mechanics
  - `tagged_sents()`: use this when sequence and context matter

```py title='POS Tagger'
text = word_tokenize("And now for something completely different")
nltk.pos_tag(text) # [('And', 'CC'), ('now', 'RB'), ('for', 'IN'), ('something', 'NN'), ('completely', 'RB'), ('different', 'JJ')]
nltk.pos_tag(text, tagset="universal") # [('And', 'CONJ'), ('now', 'ADV'), ('for', 'ADP'), ('something', 'NOUN'), ('completely', 'ADV'), ('different', 'ADJ')]
# with 'universal', we get a standard POS tagset

# Help for tag
nltk.help.upenn_tagset('RB')

# Representing tagged token
tagged_token = nltk.tag.str2tuple('fly/NN')
tagged_token # ('fly', 'NN')

# Tagged Corpus
nltk.corpus.brown.tagged_words() # Output is a simple list of tuples. [('The', 'AT'), ('Fulton', 'NP-TL') ...]
nltk.corpus.brown.tagged_sents() # Output is a list containing an inner list. Preserves original sentence boundaries. [[('The', 'AT'), ('Fulton', 'NP-TL') ...],[...]]
```

## Types of Taggers

- Regular Expression (Rule-Based) Taggers:
  - These use rigid, human-written patterns to assign tags
  - They do not look at structural sentence context; instead, they check the physical spelling of the word
  - Example Rule: If a word ends in "-ing", tag it as a verb. If a word ends in "-ly", tag it as an adverb
- Lookup Tagger/Unigram Tagger:

```py title='Regex Tagger'
brown_tagged_sents = nltk.corpus.brown.tagged_sents()
brown_sents = nltk.corpus.brown.sents() # ['``','Only','a','relative','handful','of' ...]

patterns = [
    (r".*ing$", "VBG"),  # verb
    (r".*ed$", "VBD"),  # simple past
    (r".*es$", "VBZ"),  # 3rd singular present
    (r".*ould$", "MD"),  # modals
    (r".*\'s$", "NN$"),  # possessive nouns
    (r".*s$", "NNS"),  # plural nouns
    (r"^-?[0-9]+(\.[0-9]+)?$", "CD"),  # cardinal numbers
    (r".*", "NN"),  # nouns (default)
]
# patterns are processed in order, and the first one that matches is applied
regexp_tagger = nltk.RegexpTagger(patterns)
regexp_tagger.tag(brown_sents[3]) # [('``', 'NN'), ('Only', 'NN'), ('a', 'NN'), ('relative', 'NN'), ('handful', 'NN'), ('of', 'NN') ...]

regexp_tagger.accuracy(brown_tagged_sents) # 0.20. Evaluating a tagger
```
