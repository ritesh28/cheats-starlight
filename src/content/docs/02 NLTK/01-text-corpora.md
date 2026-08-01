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

- NLP: Natural Language Processing
- NLTK: Natural Language ToolKit
- NLP faces following challenges:
  - Word sense disambiguation:
    - We want to work out which sense of a word was intended in a given context
    - E.g: ambiguous word 'serve': help with food or drink; hold an office; put ball into play
    - We automatically disambiguate words using context, exploiting the simple fact that nearby words have **closely related meanings**
  - Pronoun Resolution:
    - To work out "who did what to whom" — i.e., to detect the subjects and objects of verbs
    - E.g. "The thieves stole the paintings. They were subsequently caught."
  - Generating Language Output: Such as question answering and machine translation (e.g. English -> French)

## Accessing Text Corpora

- Gutenberg Corpus: contains books
- Nps Chat: contains instant messaging chats
- Brown Corpus: contains text from 500 sources, and the sources have been categorized by genre, such as news, editorial, and so on
- Reuters Corpus: contains news documents. The documents have been classified into 90 topics, and grouped into two sets, called "training" and "test"

```py title='Gutenberg Corpus'
nltk.corpus.gutenberg.fileids() # returns list of file identifiers (file names) for texts in Gutenberg corpus. ['austen-emma.txt',...'whitman-leaves.txt']

emma = nltk.corpus.gutenberg.words("austen-emma.txt")
print(type(emma)) # nltk.corpus.reader.util.StreamBackedCorpusView
print(len(emma)) # 192427. Total words
print(emma[:10]) # ['[', 'Emma', 'by', 'Jane', 'Austen', '1816', ']', 'VOLUME', 'I', 'CHAPTER']

emma_text = nltk.Text(emma)
type(emma_text) # nltk.text.Text
emma.concordance("surprise")

len(nltk.corpus.gutenberg.raw(fileid)) # Total characters. raw() format: <string>. '[Emma by Jane Austen...'
len(nltk.corpus.gutenberg.words(fileid)) # Total words
len(nltk.corpus.gutenberg.sents(fileid)) # Total sentences. sents() format: list of list of words. [['[', 'The',...'1603', ']'], ['Actus', 'Primus', '.'], ...]
len(set(w.lower() for w in nltk.corpus.gutenberg.words(fileid))) # Total Vocabulary (unique words)
```

```py title='NPS Chats'
nltk.corpus.nps_chat.fileids() # returns list of file identifiers. ['10-19-20s_706posts.xml', ...'11-09-teens_706posts.xml']

p = nltk.corpus.nps_chat.posts("10-19-20s_706posts.xml")
type(p) # nltk.corpus.reader.xmldocs.XMLCorpusView
p[0] # 'p' is list of chats (list of words).  ['now', 'im', 'left', 'with', 'this', 'gay', 'name']

w = nltk.corpus.nps_chat.words("10-19-20s_706posts.xml")
type(w) # nltk.collections.LazyConcatenation
w[:10] # ['now', 'im', 'left', 'with', 'this', 'gay', 'name', ':P', 'PART', 'hey']
```

```py title='Brown Corpus'
nltk.corpus.brown.categories() # ['adventure', ...'science_fiction']
nltk.corpus.brown.words(categories="news") # ['The', 'Fulton', 'County', 'Grand', 'Jury', 'said', ...]
nltk.corpus.brown.sents(categories=["news", "editorial", "reviews"]) # [['The', 'Fulton', 'County'...], ['The', 'jury', 'further'...], ...]
nltk.corpus.brown.words(fileids=["cg22"]) # ['Does', 'our', 'society', 'have', 'a', 'runaway', ',', ...]
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

## Computing: Simple Statistics

- Frequency Distribution: it tells us the frequency of each vocabulary item in the text
  - `FreqDist(text1)`: returns tuple (token, count)
- Collocations & Bigrams:
  - Collocation: Its a sequence of words/tokens that occur together unusually often. Thus 'red wine' is a collocation, whereas 'the wine' is not
    - Collocations are resistant to the substitution. E.g. 'maroon wine' sounds definitely odd
    - Collocations are essentially frequent N-grams
  - Bigram: Its a collocation (sequence of word/token) of 2 words. I.e. Bigrams are word pairs
    - `list(bigrams(["more", "is", "said", "than"])) => [('more', 'is'), ('is', 'said'), ('said', 'than')]`
    - `text4.collocations(window_size=2, num=5) => United States; fellow citizens; years ago; four years; Federal Government`

```py title='freqDist'
fdist1 = FreqDist(text1) # returns tuple of token and its count
type(fdist1) # nltk.probability.FreqDist

print(fdist1) # <FreqDist with 19317 samples and 260819 outcomes>
len(text1) # 260819. Total tokens
len(fdist1)  # 19317. Total unique words. Same as `len(set(text1))`
fdist1.most_common(5)  # 5 most common words. [(',', 18713), ('the', 13721), ('.', 6862), ('of', 6536), ('and', 6024)]
fdist1["and"]  # 6024. Frequency of the word 'and'
```
