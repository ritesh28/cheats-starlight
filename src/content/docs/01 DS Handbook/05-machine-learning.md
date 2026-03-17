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

| package                   | method                                                            | usage                                                                              |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `model_selection`         | `train_test_split(X, y, random_state=0, train_size=0.5)`          | split the data into a training set and a testing set                               |
| `model_selection`         | `cross_val_score(model, X, y, cv=5)`                              | cross-validation. `cv=5`: 5-fold                                                   |
| `model_selection`         | `validation_curve(model, X, y, param_name=, param_range=, cv=)`   | compute both training and validation score across the param range                  |
| `model_selection`         | `learning_curve(model, X, y, train_sizes=, cv=)`                  | returns training dataset, training scores, & validation scores                     |
| `model_selection`         | `GridSearchCV(model, param_grid=, cv=)`                           | calling `fit()` will fit model at each grid point, keeping track of all scores     |
| `metrics`                 | `accuracy_score(ytest, y_model)`                                  | returns fraction of predicted labels that match their true value                   |
| `metrics`                 | `confusion_matrix(ytest, y_model)`                                | "confusion" shows whether the model is confusing two or more classes               |
| `metrics`                 | `classification_report(ytest, y_model, target_names=['l1','l2'])` | Display matrix of precision, recall, F1, & support for all labels (classification) |
| `feature_extraction`      | `DictVectorizer(sparse=False, dtype=int)`                         | Vectorization: one-hot encoding                                                    |
| `feature_extraction.text` | `CountVectorizer()`                                               | Vectorization: texts -> word counts                                                |
| `feature_extraction.text` | `TfidfVectorizer()`                                               | Vectorization: texts -> tf-idf (value range: `[0,1]`)                              |
| `preprocessing`           | `PolynomialFeatures(degree=3, include_bias=False)`                | Generate feature matrix consisting of all polynomial combinations of input feature |
| `impute`                  | `SimpleImputer(strategy="mean")`                                  | Replace missing values                                                             |
| `pipeline`                | `make_pipeline(estimator1, estimator2, ...)`                      | Apply all Vectorizations at once                                                   |

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
  - NOTE: if `best_params_` fell at the edges, we would want to expand the grid to make sure we have found the true optimum.

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
- Also called vectorization, as it involves converting arbitrary data into well-behaved vectors:
  1. **Categorical Features:**
     - Do not encode as a numerical mapping i.e `{'abc':1,'xyz':2}` since model makes a fundamental assumption that numerical data reflect algebraic quantities
     - One-hot encoding: This creates extra columns indicating the presence or absence of a category with a value of 1 or 0
  2. **Text Features:**
     - word-count: take each snippet of text, count the occurrences of each word within it, and put the results in a table
       - Disadvantage: too much weight on the words that appear very frequently
     - term frequency–inverse document frequency (TF–IDF): weights the word counts by a measure of how often they appear in the documents
  3. **Image Features:**
     - Simple approach: Use each pixel value as a feature column
  4. **Derived Features:**
     - This column is mathematically derived from some input feature/column
     - This approach allow to improve the score not by changing the model, but by transforming the input
     - e.x. `preprocessing.PolynomialFeatures()` returns matrix of all polynomial combinations of input features
  5. **Imputation of Missing Data:**
     - It is a task of replacing missing data with some appropriate fill value
     - Simple strategy: Replace missing values with mean, median, or most frequent value. This provide baseline imputation. Use `preprocessing.Imputer`
- Feature Pipelines:
  - This allow to apply multiple vectorization at once
  - `model = make_pipeline(SimpleImputer(strategy="mean"), PolynomialFeatures(degree=2), LinearRegression())`

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

# ==== DERIVED FEATURES: PolynomialFeatures
# Data that is not well described by a straight line
x = np.array([1, 2, 3, 4, 5])
y = np.array([4, 2, 1, 3, 7])
X = x[:, np.newaxis]
poly = PolynomialFeatures(degree=3, include_bias=False)
X2 = poly.fit_transform(X)
# The derived feature matrix has columns representing x, x^2, & x^3
model = LinearRegression().fit(X2, y)
# Computing a linear regression on this expanded input gives a much closer fit to our data
yfit = model.predict(X2)
plt.scatter(x, y)
plt.plot(x, yfit)

# ==== IMPUTING MISSING VALUES: simple approach
X = np.array([[np.nan, 0, 3], [3, 7, 9], [3, 5, 2], [4, np.nan, 6], [8, 8, 1]])
imp = SimpleImputer(strategy="mean")
X2 = imp.fit_transform(X)
```

## Metrics

- For a given label, 4 outcomes:
  - TN (True Negative) or TP (True Positive): Good outcome
  - FN (False Negative): Bad. Predicted negative (not present) which is wrong
  - FP (False Positive): Bad. Predicted positive (present) which is wrong
- `accuracy_score()`
- `confusion_matrix()`
- `classification_report()`:
  - | Metric    | Definition                                                                    |
    | --------- | ----------------------------------------------------------------------------- |
    | Precision | how many of prediction were right (more focus on `y_model`)                   |
    | Recall    | how many of the total right labels you actually found (more focus on `ytest`) |
    | F1-Score  | Harmonic mean of precision and recall                                         |
    | Support   | The actual count of items in that class                                       |

## Models

![All models](./machine-learning-all-models.drawio.svg)

| type           | sub-type    | model                        | package        | model                                                       |
| -------------- | ----------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| Classification | Naive Bayes | Gaussian Naive Bayes         | `naive_bayes`  | `GaussianNB()`                                              |
| Classification | Naive Bayes | Multinomial Naive Bayes      | `naive_bayes`  | `MultinomialNB()`                                           |
| Regression     | Linear      | Simple Linear Regression     | `linear_model` | `LinearRegression(fit_intercept=)`                          |
| Regression     | Linear      | Ridge regularization ($L_2$) | `linear_model` | `make_pipeline(PolynomialFeatures(30), Ridge(alpha=0.1))`   |
| Regression     | Linear      | Lasso regularization ($L_1$) | `linear_model` | `make_pipeline(PolynomialFeatures(30), Lasso(alpha=0.001))` |
| Classification | SVM         | Support Vector Classifier    | `svm`          | `SVC(kernel="linear\|rbf", C=1e10)`                         |

## Naive Bayes Classification

- These model group work as a quick-and-dirty baseline for a classification problem, since they are fast and have few tunable parameters
- Suitable for very high-dimensional datasets
- They provide straightforward probabilistic prediction
- Bayesian Classification:
  - We’re interested in finding the probability of a label given some observed features: $P(L|features)=\frac{P(features|L)P(L)}{P(features)}$
  - All we need now is some model by which we can compute $P(features|L_i)$ for each label
  - These models are called **generative model** because it specifies the hypothetical random process that generates the data
  - We make naive assumptions about the generative model for each label, hence the name **naive bayes**
- Gaussian Naive Bayes:
  - Assumption: data from each label is drawn from a simple Gaussian distribution (SEE INFOGRAPHIC)
  - Given a label, majority of data are located at a single point
  - Fit the model by finding the mean & standard deviation of the points within each label
  - `model = GaussianNB()`
- Multinomial Naive Bayes:
  - Assumption: feature are generated from a simple multinomial distribution
  - Multinomial distribution: describes the probability of set of features (typically word count) belonging to a specific category
  - E.g. For each category, "Spam" & "Not Spam", the model learns a unique probability for every word in the vocabulary
  - This model is most appropriate for features that represent counts or count rates

## Linear Regression

- These model group provide baseline for regression tasks
- Simple Linear Regression:
  - 2D straight-line fit is a model of the form $y=ax+b$, where $a$ is slope & $b$ is intercept
  - multidimensional linear models:
    - These are of form: $y=a_0+a_1x_1+a_2x_2+⋯$ where there are multiple x values/features
    - Geometrically, this is akin to fitting a plane to points in 3D, or fitting a hyper-plane to points in higher dimensions
  - `LinearRegression(fit_intercept=False)`: No intercept is used i.e. data is expected to be centered
    - parameters: `coef_` list & `intercept_` value
    - coefficients estimate how much each feature contributes
- Basis Function Regression:
  - Transforming data according to **basis functions** allows to fit linear regression to non-linear relationships b/t variables/features
  - The idea is to take our multi-D linear model $y=a_0+a_1x_1+a_2x_2+⋯$ and build the $x_1,x_2,x_3...$, from 1D input $x$
  - What we have done is taken 1D $x$ and projected them into a higher dimension, so that a linear fit can fit more complicated relationships between $x$ & $y$
  - Polynomial basis functions:
    - $y=a_0+a_1x+a_2x^2+a_3x^3+⋯$
    - `PolynomialFeatures(3, include_bias=False)`: This transformer convert 1D into 3D by taking he exponent of each value
    - `poly_model = make_pipeline(PolynomialFeatures(7), LinearRegression())`
- Regularization:
  - Basic function can quickly lead to overfitting
  - Regularization: The process of penalizing large values of the model parameters. This is done to avoid overfitting
  - Ridge regression ($L_2$ regularization):
    - This proceeds by penalizing the sum of squares (2-norms) of the model coefficients (`.coef_`)
    - $P=\alpha\sum_{n=1}^{N} \theta_n^2$, $\alpha$ controls the strength of the penalty, thus controlling the complexity of resulting model
    - By squaring the magnitude of the coefficients, large coefficients are penalized heavily, forcing them to become smaller but not zero
  - Lasso regularization ($L_1$):
    - It involves penalizing the sum of absolute values (1-norms) of regression coefficients (`.coef_`)
    - $P=\alpha\sum_{n=1}^{N} |\theta_n|$
    - It adds a "penalty" to the standard regression model, which forces the coefficients of less important variables to shrink towards zero, often hitting exactly zero
    - Use Lasso if you suspect only few features are important and you want the model to automatically perform feature selection by zeroing out the rest

## Support Vector Machines (SVMs)

- These model group provide models for both classification & regression
- Support Vector Classifier:
  - | Bayesian classification            | SVC                                                                                                                 |
    | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
    | generative classification          | **discriminative classification**                                                                                   |
    | we model each class                | we find a line (in 2D) or manifold (in multi-D) that divides the classes from each other                            |
    | all points in a label are enclosed | only support vectors matters; any points further from the margin that are on the correct side do not modify the fit |
  - Maximizing the Margin: Draw a line with a margin of some width, up to the nearest point (**Support Vector**), separating 2 sets of data
  - `model = SVC(kernel=, C=1e10)`
    - `kernel` transformation: Similar to basis function - transform non-linear data into higher dimensions in order to fit a linear classifier
      - Unlike basis function, transformation is done implicitly i.e. without building full N-dimensional representation
      - `kernel='linear'`: Used when data is already linearly separable; the simplest kernel
      - `kernel='rbf'`: (radial basis function) Compute distance from every point. Thus projecting N points into N dimensions
    - `C`: controls the margin hardness. For large C, margin is hard & points cannot lie in it. For smaller C, margin is softer & can grow to encompass some points
    - `gamma`: (for kernel='rbf') inversely control the influence of distance. High gamma means that influence restricted to the immediate area of a given point
  - `model.support_vectors_`: list of training points touching the margin

## Decision Trees & Random Forests

## Misc

$$
y=ax+b \\
y=ax^3+bx^2+cx+d \dashrightarrow \text{degree-3 polynomial}
$$
