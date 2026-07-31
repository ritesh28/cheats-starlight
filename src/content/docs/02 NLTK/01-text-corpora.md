---
title: Text Corpora
---

![overview](./01-text-corpora.drawio.svg)

```py title='nltk'
import nltk
nltk.__version__ # 3.9.4

nltk.download() # opens UI to install various text corpora and models
nltk.data.path.append("/Users/riteshraj/.../nltk-data") # tells nltk where to find text corpora and models

from nltk.book import * # loads text1, ...text9, sent1, ...sent9, gutenberg, ...wordnet, FreqDist, Text and bigrams
type(text1) # nltk.text.Text
```

## Searching Text using Context

- Concordance:
  - It shows us every occurrence of a given word, together with some context (immediate surrounding text - like 10 words before and 10 words after the given word)
  - Usage: it allows researchers to study how a writer used language. e.g. Someone use 'monstrous' in a negative way and someone in a positive way
  - `text1.concordance("monstrous")`
- Similar:
  - It shows other words (with context) that appear in a similar range of contexts
  - `text1.similar("monstrous")`
- Common Context:
  - It allows us to examine just the contexts that are shared by two or more words
  - `text2.common_contexts(["monstrous", "very"])`
- Dispersion Plot
  - It is a data visualization tool that shows where specific words appear throughout a text corpus (spatial distribution of the words)
  - X-axis represents progression of text corpus from start to finish; Y-axis contains given words; Each blue stripe/tick represents a single occurrence of that specific word
  - `text1.dispersion_plot(["monstrous", "very"])`: SEE INFOGRAPHIC

## Count

- Token: a sequence of characters (e.g. hair, :) that we want to treat as a group. For nltk, a token is a word or a punctuation symbol
- `len(text3)`: returns number of tokens; unlike Python which returns number of characters
- Vocabulary of (raw) text: It means set (**no duplication**) of tokens that the raw text contains. `sorted(set(text3))`
- Lexical: It means relating to the words or vocabulary of a language, as opposed to its grammar, syntax, or structure. In simple term, it means **a word**
- Lexical Richness/Diversity: 2 ways to look at this:
  - `len(set(text3)) / len(text3) = 0.06230`: number of distinct words is just 6% of the total number of words
  - `len(text3) / len(set(text3)) = 16.0501`: each word is used 16 times on average

## Frequency Distribution
