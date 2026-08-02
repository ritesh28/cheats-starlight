---
title: Processing Raw Text
---

- NLP Pipeline:
  1. Extract raw text, and trim to desired content
  2. Tokenize the text, select tokens of interest, create NLTK text
  3. Normalize the words like converting to lower case, build the vocabulary
- `nltk.Index()`:
  - Takes a list of (key, value) pairs as input and returns a custom lookup dictionary (an inverted index) that maps keys to lists of values
  - Simply a wrapper for a standard dictionary initialization
  - `nltk.Index([('v', 'went'), ('v', 'go'), ('n', 'apple')]) # O/P=> Index({'v': ['went', 'go'], 'n': ['apple']})`

## Regex

- NLTK implements a **custom token-based regex engine** under the hood that behaves completely differently to standard Python regex
- When you use `<nltk.Text object>.findall()`, you are searching across a list of tokenized words, not a raw string of characters
- When using regex methods, NLTK encode list of words into a specialized format where every word is wrapped in angle brackets:
  - Original text: `["you", "rule", "bro"]`
  - NLTK internal format: `"<you><rule><bro>"`
- Because of this internal rewriting, NLTK modifies the regular expression syntax with three specific rules:
  - Angle Brackets (`< >`) mark token boundaries: E.g. `<.*>` means "match any single word"
  - Dot (`.`) is sandboxed: Inside the brackets, a `.` matches any character except a closing angle bracket, protecting it from the "greedy match trap" seen in standard Python regex
  - Ignored Whitespace: Any spaces between the brackets in your pattern (like the spaces in `r"<.*> <.*> <bro>"`) are ignored
- Example:
  - `chat.findall(r"<a> <man>")`: find all instances of "a man" in the text
  - `chat.findall(r"<.*> <.*> <bro>")`: find any three-word phrase where the third word is exactly "bro". O/P=>`you rule bro; telling you bro; u twizted bro`
  - `moby.findall(r"<a> (<.*>) <man>")`: `()` extract the word caught inside the parentheses. O/P=>`monied; nervous; dangerous; white`
  - `chat.findall(r"<l.*>{3,}")`: O/P=>`lol; lmao; love`: find sequences of three or more words starting with the letter "l"
  - `hobbies.findall(r"<\w*> <and> <other> <\w*s>")`: find expressions of the form `x and other ys` to allows us to discover hypernyms. O/P=>`water and other liquids`

## Normalizing Text

- Lower case: by using `lower()`, we can normalize the text to lowercase so that the distinction between "The" and "the" is ignored
- Stemming: task of stripping off any **affixes** (both prefix and suffix)
  - NLTK includes several off-the-shelf stemmers. **Porter** and **Lancaster** stemmers follow their own blind, hardcoded rules for stripping affixes
  - If it sees a word ending in "s" or "ing", it blindly cuts it off, regardless of whether the final string is a real word
  - E.x. Porter stemmer correctly handles the word "lying" (mapping it to "lie"), while the Lancaster stemmer does not
  - Stemming is not a well-defined process, and we typically pick the stemmer that best suits the application we have in mind
- Lemmatization: task of converting the **form of word** to the known word in dictionary
  - WordNet Lemmatizer do not blindly chop off letters. Example:
    - If you feed it the word "cooking", it considers removing the affix "-ing" to create "cook"
    - Before finalizing this, it performs a validation lookup inside the WordNet lexical database. Because "cook" exists in the dictionary, it returns "cook"
  - Stemming just removes the affixes; while Lemmatization returns the base form
- Non-standard words:
  - Identify non-standard words including numbers, abbreviations, and dates, and mapping any such tokens to a special vocabulary
  - E.x. every decimal number could be mapped to a single token "0.0", and every acronym could be mapped to "AAA"
  - This keeps the vocabulary small and improves the accuracy of many language modeling tasks

```py title='Porter Stemmer'
porter = nltk.PorterStemmer()  # just removes affixes
porter.stem("running")  # run
porter.stem("better")  # better. no change
porter.stem("women")  # women. No change
```

```py title='WordNet Lemmatizer'
wnl = nltk.WordNetLemmatizer()  # returns the base form of a word
# wnl.lemmatize("running") # running.
wnl.lemmatize("running", pos="v")  # run. Part of Speech: Verb
wnl.lemmatize("better", pos="a")  # good. Part of Speech: Adjective
wnl.lemmatize("women")  # woman
```

## Tokenization

- Tokenization is a task of breaking up the raw text into identifiable linguistic units (such as words and punctuation)
- `token_list = word_tokenize(raw); text = nltk.Text(token_list)`
- Simplest approach: split text on whitespace
- Challenge #1: presence of contractions, such as "didn't"
  - When analyzing the meaning of a sentence, it would probably be more useful to **normalize** this form to two separate forms: "did" and "n't" (or not)
  - We can do this work with the help of a lookup table

## Segmentation

- Tokenization is an instance of a more general problem of segmentation:
  - Tokenization breaks a continuous sequence of characters down into smaller individual units like words or punctuation
  - While segmentation divides a large text layout down into larger structural units like sentences or paragraphs
- Sentence Segmentation: `nltk.sent_tokenize("Dr. Smith arrived at 6 p.m. He began surgery.") # O/P=> ['Dr. Smith arrived at 6 p.m.', 'He began surgery.']`
- Sentence Segmentation Challenge #1:
  - We cannot simply split text at every full stop character (".")
  - A segmentation algorithm must analyze the surrounding context to determine if:
    - a period marks the absolute end of a sentence, or
    - if it is just a structural part of an abbreviation (like "Dr. Smith", "Inc.", or "e.g.")
- Word Segmentation:
  - Challenge #1: For some writing systems, tokenizing text is more difficult by the fact that there is no visual representation of word boundaries
  - Challenge #2: Processing of spoken language, where the hearer must segment a continuous speech stream into individual words
