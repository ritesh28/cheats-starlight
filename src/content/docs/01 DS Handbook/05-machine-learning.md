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
     2. For unsupervised learning: we transform or infer properties of the data using `transform()` or `predict()`

- Comparing prediction result of various model and its hyperparameters:
  - Typically one evaluates the efficacy of the model by comparing its results to some known **baseline**
  - Example: Gaussian Naive Bayes is often a good model to use as a baseline classification because it is fast and has no hyperparameters to choose

| package                    | method                                   | usage                                                            |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `sklearn.cross_validation` | `train_test_split(X, y, random_state=1)` | split the data into a training set and a testing set             |
| `sklearn.metrics`          | `accuracy_score(ytest, y_model)`         | returns fraction of predicted labels that match their true value |
