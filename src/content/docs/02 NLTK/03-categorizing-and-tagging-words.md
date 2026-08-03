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
  - lookup table: We map 100 most frequent words with its most likely tag
  - Simply knowing the tags for the 100 most frequent words enables us to tag a large fraction of tokens correctly (nearly half in fact)
  - `nltk.UnigramTagger(model=..., backoff=...)`: use lookup table first, and if it is unable to assign a tag, then use the default tagger, a process known as **backoff**
- General N-Gram tagging:
  - Problem with Unigram/1-Gram:
    - We only consider the current token, in isolation, with no context
    - E.g. we tag "wind" with the same tag, regardless of whether it appears in the context "the wind" or "to wind"
  - n-gram tagger is a generalization of a unigram tagger whose context is the current word together with the part-of-speech tags of the n-1 preceding tokens
  - NOTE: N-Gram taggers should not consider context that crosses a sentence boundary:
    - Accordingly, NLTK taggers are designed to work with lists of sentences, where each sentence is a list of words
    - At the start of a sentence, all preceding tags are set to "None"
  - Problem with N-Gram:
    - As soon as it encounters a new word (i.e., 13.5), it is unable to assign a tag
    - It cannot tag the following word (i.e., million) even if it was seen during training, simply because it never saw it during training with a "None" tag on the previous word
    - Consequently, the tagger fails to tag the rest of the sentence (because the model never saw "None" tag). Its overall accuracy score is very low
  - Trade-off between the accuracy and the coverage of our result:
    - As $n$ gets larger, the specificity of the contexts increases, as does the chance that the data we wish to tag contains contexts that were not present in the training data
- Combining Taggers:
  - To get better accuracy, fall back (backoff) on algorithms with wider coverage
  - For example, we could combine the results of a bigram tagger, a unigram tagger, and a default tagger, as follows:
    - Try tagging the token with the bigram tagger
    - If the bigram tagger is unable to find a tag for the token (i.e it is trying to set 'None'), try the unigram tagger
    - If the unigram tagger is also unable to find a tag, use a default tagger

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

```py title='Lookup Tagger/UnigramTagger'
from nltk.corpus import brown

fd = nltk.FreqDist(brown.words(categories="news"))
most_freq_words = fd.most_common(100)
most_freq_words # [('the', 5580), (',', 5188), ('.', 4030), ('of', 2849), ('and', 2146), ('to', 2116), ('a', 1993) ...]

cfd = nltk.ConditionalFreqDist(brown.tagged_words(categories="news"))
cfd["of"] # FreqDist({'IN': 2716, 'IN-TL': 128, 'IN-HL': 5})

likely_tags = dict((word, cfd[word].max()) for (word, _) in most_freq_words)
likely_tags # {'the': 'AT', ',': ',', '.': '.', 'of': 'IN', 'and': 'CC', 'to': 'TO', 'a': 'AT' ...}

baseline_tagger = nltk.UnigramTagger(model=likely_tags, backoff=nltk.DefaultTagger("NN"))  # 'backoff' to default tagger for unknown words
# You can directly pass tagged sentences to the tagger as well: `nltk.UnigramTagger(brown_tagged_sents)`. This will create `likely_tags` for all words (not just top 100)
brown_tagged_sents = brown.tagged_sents(categories="news")
baseline_tagger.accuracy(brown_tagged_sents) # 0.58
```

```py title='Bigram Tagger'
brown_tagged_sents = brown.tagged_sents(categories="news")
size = int(len(brown_tagged_sents) * 0.9) # 90% for training and rest for testing
train_sents = brown_tagged_sents[:size]
test_sents = brown_tagged_sents[size:]
bigram_tagger = nltk.BigramTagger(train_sents)
bigram_tagger.tag(brown_sents[2007]) # [('Various', 'JJ'), ('of', 'IN'), ('the', 'AT') ...]
bigram_tagger.accuracy(test_sents) # 0.81
```

```py title='Combining Tagger'
t0 = nltk.DefaultTagger('NN')
t1 = nltk.UnigramTagger(train_sents, backoff=t0)
t2 = nltk.BigramTagger(train_sents, backoff=t1)
t2.accuracy(test_sents) # 0.844513...
```

```py title='Storing Taggers'
from pickle import dump, load

# SAVE
output = open('t2.pkl', 'wb')
dump(tagger, output, -1)
output.close()

# LOAD
input = open('t2.pkl', 'rb')
tagger = load(input)
input.close()
```

## Transformation-Based Tagging/Brill Tagging

- Brill tagging is a kind of transformation-based learning
- General idea is very simple: guess the tag of each word, then go back and fix the mistakes. Brill tagger **successively transforms** a bad tagging of a text into a better one
- Analogy with painting: begin with broad brush strokes then fix up the details, with successively finer changes
- This model creates a set of transformational correction rules:
  - Each rule is generated from a template of the form: **replace $T_1$ with $T_2$ in the context $C$** - making the rules **interpretable**
  - Typical contexts are the identity or the tag of the preceding or following word, or the appearance of a specific tag within 2-3 words of the current word
  - During its training phase, the tagger guesses values for $T_1$, $T_2$ and $C$, to create thousands of candidate rules
  - Each rule is scored according to its net benefit: the number of incorrect tags that it corrects, and number of correct tags it incorrectly modifies
