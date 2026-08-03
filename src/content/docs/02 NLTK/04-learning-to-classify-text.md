---
title: Text Supervised Classification
---

![overview](./04-learning-to-classify-text.drawio.svg)

- Detecting patterns is a central part of Natural Language Processing
- Text Supervised Learning (SEE INFOGRAPHIC):
  - During training:
    - A feature extractor is used to convert each input value to a feature set. These feature sets capture the basic information about each input
    - Pairs of feature sets and labels are fed into the machine learning algorithm to generate a model
  - During prediction:
    - The same feature extractor is used to convert unseen inputs to feature sets
    - These feature sets are then fed into the model, which generates predicted labels
- Choosing the right features:
  - Select relevant features and decide how to encode them
  - If you provide too many features, then the algorithm will have a higher chance of relying on idiosyncrasies of your training data that don't generalize well to new examples
    - This problem is known as **overfitting**
  - Eg. Document Classification (movie review is positive or negative):
    - To limit the number of features that the classifier needs to process, we begin by constructing a list of the 2000 most frequent words in the overall corpus
    - We can then define a feature extractor [2] that simply checks whether each of these words is present in a given document
    - SEE CODE (Document Classification)

```py title='Gender Classification'
import random
from nltk.corpus import names
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction import DictVectorizer
from sklearn.naive_bayes import BernoulliNB
from sklearn.metrics import accuracy_score


# 1. Feature extraction function
def gender_features(name):
    return {
        "suffix1": name[-1].lower(),
        "suffix2": name[-2].lower(),
    }
print(gender_features("Shrek")) # {'suffix1': 'k', 'suffix2': 'e'}

# 2. Load dataset
labeled_names = [(name, "male") for name in names.words("male.txt")] + [
    (name, "female") for name in names.words("female.txt")
]

# Separate features and labels
X = [gender_features(name) for name, gender in labeled_names]
y = [gender for name, gender in labeled_names]

# Convert feature dictionaries to numeric vectors
vectorizer = DictVectorizer(sparse=False)
X_vectorized = vectorizer.fit_transform(X)

# 4. Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,  # 20% test data
    random_state=42,
    shuffle=True,  # shuffle the data before splitting
    stratify=y,  # maintain the same class distribution in train and test sets
)

# 5. Train classifier
classifier = BernoulliNB()
classifier.fit(X_train, y_train)

# 6. Predict a new name
neo_features = vectorizer.transform([gender_features("Neo")])
prediction = classifier.predict(neo_features)[0]
print("Prediction for 'Neo':", prediction) # Prediction for 'Neo': male

# 7. Evaluate accuracy
y_pred = classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy) # Accuracy: 0.789
```

```py title='Document Classification'
from nltk.corpus import movie_reviews

documents = [
    (list(movie_reviews.words(fileid)), category)
    for category in movie_reviews.categories()
    for fileid in movie_reviews.fileids(category)
]
# movie_reviews.categories() # ['neg', 'pos']
# movie_reviews.fileids("pos")[:2] # ['pos/cv000_29590.txt', 'pos/cv001_18431.txt']

all_words = nltk.FreqDist(w.lower() for w in movie_reviews.words())
word_features = list(all_words)[:2000] # returns top high frequency 2000 words

def document_features(document):
    document_words = set(document)
    features = {}
    for word in word_features:
        features["contains({})".format(word)] = word in document_words
    return features

document_features(movie_reviews.words("pos/cv000_29590.txt")) # {'contains(,)': True, 'contains(the)': True, ...}
```

## Part-of-Speech Tagging

- Basic Classification (at word level):
  - Find out what are the most common suffixes (last 1 alphabet, 2 alphabets and 3 alphabets)
  - Define a feature extractor function which checks a given word for these suffixes
  - SEE CODE (Basic - Word level)
- Exploiting Context:
  - Contextual features often provide powerful clues about the correct tag. E.g. The word "run" can be a noun ("go for a run") or a verb ("they run fast")
  - Unlike N-Gram, we use previous **word**
  - SEE CODE (Context - Prev Word)
- Sequence Classification (when samples are related):

```py title='Basic - Word level'
from nltk.corpus import brown

suffix_fdist = nltk.FreqDist()
for word in brown.words():
    word = word.lower()
    suffix_fdist[word[-1:]] += 1
    suffix_fdist[word[-2:]] += 1
    suffix_fdist[word[-3:]] += 1

common_suffixes = [suffix for (suffix, _) in suffix_fdist.most_common(100)]
print(common_suffixes)  # ['e', ',', '.', 's', 'd', 't', 'he', 'n' ...]

def pos_features(word):
    features = {}
    for suffix in common_suffixes:
        features["endswith({})".format(suffix)] = word.lower().endswith(suffix)
    return features
```

```py title='Context - Prev Word'
def pos_features(sentence, i):
    features = {
        "suffix(1)": sentence[i][-1:],
        "suffix(2)": sentence[i][-2:],
        "suffix(3)": sentence[i][-3:],
    }
    if i == 0:
        features["prev-word"] = "<START>"
    else:
        features["prev-word"] = sentence[i - 1]
    return features

pos_features(brown.sents()[0], 8) # {'suffix(1)': 'n', 'suffix(2)': 'on', 'suffix(3)': 'ion', 'prev-word': 'an'}
```
