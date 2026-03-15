---
title: Machine Learning
---

![ML image](./05-machine-learning.drawio.svg)

## What is ML

- Think of ML as a MEANS OF BUILDING MODELS OF DATA
- ML involves building mathematical models to help understand data
- **Model of Data**: is a blueprint, diagram, or math equation that defines how data elements are organized, stored, and related to one another
- NOTE: Avoid saying 'algorithm'. Instead say 'model'. For example - 'Regression Model'

## Scikit-Learn

- Every ML Model in Scikit-Learn is implemented via the **Estimator API**. Steps to follow:
  1. Import appropriate estimator class
  2. Initiate class using model hyperparameters
  3. Arrange data into a features matrix and target vector
  4. Fit the model to your data by calling the `model_obj.fit()`
     - `fit()` causes multiple internal computations to take place, and the results of these computations are stored in model specific **attributes/parameters**
     - By convention all model parameters that were learned during `fit()` process have trailing underscores
  5. Apply the model to new data:
     1. For supervised learning: we predict labels for unknown data using `predict()`
     2. For unsupervised learning: we transform or infer properties of the data using `transform()` (dimensional reduction task) or `predict()` (clustering task)

- Comparing prediction result of various model and its hyperparameters:
  - Typically one evaluates the efficacy of the model by comparing its results to some known **baseline**
  - Example: Gaussian Naive Bayes is often a good model to use as a baseline classification because it is fast and has no hyperparameters to choose

| package                   | method                                                          | usage                                                                          |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `model_selection`         | `train_test_split(X, y, random_state=0, train_size=0.5)`        | split the data into a training set and a testing set                           |
| `model_selection`         | `cross_val_score(model, X, y, cv=5)`                            | cross-validation. `cv=5`: 5-fold                                               |
| `model_selection`         | `validation_curve(model, X, y, param_name=, param_range=, cv=)` | compute both training and validation score across the param range              |
| `model_selection`         | `learning_curve(model, X, y, train_sizes=, cv=)`                | returns training dataset, training scores, & validation scores                 |
| `model_selection`         | `GridSearchCV(model, param_grid=, cv=)`                         | calling `fit()` will fit model at each grid point, keeping track of all scores |
| `metrics`                 | `accuracy_score(ytest, y_model)`                                | returns fraction of predicted labels that match their true value               |
| `metrics`                 | `confusion_matrix(ytest, y_model)`                              | "confusion" shows whether the model is confusing two or more classes           |
| `feature_extraction`      | `DictVectorizer(sparse=False, dtype=int)`                       | Vectorization: one-hot encoding                                                |
| `feature_extraction.text` | `CountVectorizer()`                                             | Vectorization: texts -> word counts                                            |
| `feature_extraction.text` | `TfidfVectorizer()`                                             | Vectorization: texts -> tf-idf (value range: `[0,1]`)                          |

## Model Validation

- Model Validation: Its a process of comparing the prediction to the known value
- Testing data collection:
  - Holdout set:
    - We hold back some subset of the data from the training of the model, and then use this holdout set to check the model performance
    - Use `model_selection.train_test_split`
    - Disadvantage: we have lost a portion of our data to the model training
  - Cross-validation:
    - To do a sequence of fits/trainings where each subset of the data is used both as a training set and as a validation set
    - 2-fold cross-validation: split the dataset in 2 subset. Alternately using each half of the data as a holdout set
    - N-fold cross-validation: split the data in N sets. For every permutation & combination, train model on (N-1) set and use remaining 1 set for validation
    - leave-one-out cross-validation: train on all points but one in each trial. Validation score is either 1 or 0 (since only 1 test sample)
    - Combine (by, say, taking the mean) every accuracy scores to get a better measure of the global model performance

```py title="cross-validation"
# ==== MANUAL APPROACH: 2-fold
# split the data with 50% in each set
X1, X2, y1, y2 = train_test_split(X, y, random_state=0, train_size=0.5)
y2_model = model.fit(X1, y1).predict(X2)
y2_val_score = accuracy_score(y2, y2_model) # validation score: accuracy score on validation/test set
y1_model = model.fit(X2, y2).predict(X1)
y1_val_score = accuracy_score(y1, y1_model)

# ==== QUICK APPROACH: 2-fold
scores = cross_val_score(model, X, y, cv=2)
scores.mean()

# ==== leave-one-out
cross_val_score(model, X, y, cv=LeaveOneOut(len(X)))
```

## Selecting the best model

![Best Model](./machine-learning-best-model.drawio.svg)

- Bias-variance trade-off:
  - The question of “the best model” is about finding a sweet spot in the trade-off between bias and variance
  - SEE INFOGRAPHIC
  - Bias: The prediction is biased because the model is not flexible, didn't account for all features
  - Variance: The prediction is variance (highly random) because the model is too flexible to account for noises (random errors)
- Validation Curve:
  - SEE INFOGRAPHIC
  - Training Score: Accuracy evaluation on training dataset itself
  - Validation Score: Accuracy evaluation on testing/validation dataset
  - Relationship b/w model complexity & model score:
    - Training score is always higher than the validation score. Reason: model will be a better fit to data it has seen than to data it has not seen
    - For low model complexity (high-bias model)(training data is underfit): model is a poor predictor for both training data and any previously unseen data
    - For high model complexity (high-variance model)(training data is overfit): model predicts the training data very well, but fails for any previously unseen data
    - For some intermediate value, the validation curve has a maximum. This level of complexity indicates a suitable trade-off between bias and variance
  - Use `validation_curve()` for compute both training and validation score across a hyperparameter range of the model
- Learning Curve:
  - SEE INFOGRAPHIC
  - Relationship b/t training size & model score:
    - For small dataset: Model will overfit. Training score will be high, while validation score will be low (since model has not seen a lot of data)
    - For large dataset: Model will underfit. Training score will decrease, but the validation score will increase
    - Model will never, except by chance, give better score to validation set than training set: this means the curves should keep getting closer together but never cross
  - NOTE:
    - Adding more samples will not help you once a particular model has converged to a particular score
    - In that case, only way to increase model performance is to use another (often more complex) model
  - Use `learning_curve()`
- Grid Search:
  - Find the optimal hyperparameters for the model by specifying a grid of values: `param_grid = {hp1: [...], hp2: [...], hp3: [...]}`
  - `GridSearchCV()` returns a model with has `fit()`, `score()` & other methods
  - `grid.best_params_`: returns best value for each hyperparameter from the `param_grid`
  - `grid.best_estimator_`: returns best model

```py title='Tune hyperparameter knobs'
def PolynomialRegression(degree=2, **kwargs):
  return make_pipeline(PolynomialFeatures(degree), LinearRegression(**kwargs))

# ==== SINGLE HYPERPARAMETER
degree = np.arange(0, 21)
train_scores, val_scores = validation_curve(PolynomialRegression(), X, y, 'polynomialfeatures__degree', degree, cv=7)

# ==== MULTIPLE HYPERPARAMETERS
param_grid = {
    "polynomialfeatures__degree": np.arange(21),
    "linearregression__fit_intercept": [True, False],
    "linearregression__normalize": [True, False],
}
grid = GridSearchCV(PolynomialRegression(), param_grid, cv=7)
grid.fit(X, y)
model = grid.best_estimator_
```

## Feature Engineering/Vectorization

- Feature engineering is the process of taking whatever information you have about your problem and turning it into numbers that you can use to build your feature matrix
- Also called vectorization, as it involves converting arbitrary data into well-behaved vectors
- Categorical Features:
  - Do not encode as a numerical mapping i.e `{'abc':1,'xyz':2}` since model makes a fundamental assumption that numerical data reflect algebraic quantities
  - One-hot encoding: This creates extra columns indicating the presence or absence of a category with a value of 1 or 0
- Text Features:
  - word-count: take each snippet of text, count the occurrences of each word within it, and put the results in a table
    - Disadvantage: too much weight on the words that appear very frequently
  - term frequency–inverse document frequency (TF–IDF): weights the word counts by a measure of how often they appear in the documents
- Image Features:
  - simple approach: simply use each pixel value as a feature column
- Derived Features:
  - This column is mathematically derived from some input feature/column

```py title='Vectorization'
# ==== CATEGORICAL FEATURES: one-hot encoding
data = [
    {"price": 850000, "rooms": 4, "neighborhood": "Queen Anne"},
    {"price": 700000, "rooms": 3, "neighborhood": "Fremont"},
    {"price": 600000, "rooms": 2, "neighborhood": "Fremont"},
]
vec = DictVectorizer(sparse=False, dtype=int)
X = vec.fit_transform(data)
print(vec.get_feature_names_out()) # array(['neighborhood=Fremont', 'neighborhood=Queen Anne', 'price', 'rooms'], dtype=object)
print(X) # X.toarray() if sparse=True
# array([[     0,      1, 850000,      4],
#        [     1,      0, 700000,      3],
#        [     1,      0, 600000,      2]])

# ==== TEXT FEATURES: word count
sample = ["problem of evil", "evil queen", "horizon problem"]
vec = CountVectorizer()
X = vec.fit_transform(sample)
print(pd.DataFrame(X.toarray(), columns=vec.get_feature_names_out()))
#    evil  horizon  of  problem  queen
# 0     1        0   1        1      0
# 1     1        0   0        0      1
# 2     0        1   0        1      0
```

$$
y=ax+b \\
y=ax^3+bx^2+cx+d \dashrightarrow \text{degree-3 polynomial}
$$
