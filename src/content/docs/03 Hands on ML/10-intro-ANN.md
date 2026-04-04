---
title: Introduction to ANN
---

- ANN : Artificial Neural Network
- Deep Learning (DL) is the study of Neural Network (NN)
- NN Architecture: it is a structured arrangement, defining how artificial neurons are organized, connected, and layered to process data
- Training ANN means finding/learning the right values for weights: $w_0$, $w_1$ ... $w_n$
- FNN: Feed-forward Neural Network. In this architecture, the signal flows only in one direction (from the inputs to the outputs)

![ANN](./10-intro-ANN.drawio.svg)

## Artificial Neuron

- An artificial neuron is a computation building block of NN
- Computational types:
  1. Basic: has one or more binary (on/off) inputs and one binary output. It activates its output when more than a certain number of its inputs are active
  2. Threshold Logic Unit (TLU) or Linear Threshold Unit (LTU):
     - Inputs (multiple) and output (single) are now numbers (instead of binary value) and each input connection is associated with a weight
     - TLU computes a weighted sum of its inputs, then applies a **step function** to that sum and outputs the result
     - $h_W(X)=step(z)$, where $z=w_1x_1+w_2x_2+⋯+w_nx_n=X^TW$
     - A single TLU can be used for binary classification. If the summation exceeds a threshold, it outputs positive class or else outputs negative class
- Special types:
  1. Input neuron: they are special passthrough neuron. They just output whatever input they are fed
  2. Bias neuron: output 1 all the time ($x_0=1$). Has no incoming connection (makes sense)

## Activation Function

- An activation function is a mathematical formula applied to the output of an artificial neuron
- Why activation function is needed:
  - If you chain (NN is chain of layers) several linear transformations, all you get is a linear transformation
  - For e.x., `f(x) = 2 x + 3` and `g(x) = 5 x - 1`, then chaining them gives you another linear function: f`(g(x)) = 2(5 x - 1) + 3 = 10 x + 1`
  - So if you don’t have some non-linearity between layers, then even a deep stack of layers is equivalent to a single layer
- Types:
  1. Step function: outputs a constant for a range, changing values abruptly at specific points, resulting in a graph that looks like a series of horizontal steps. Examples:
     - heaviside step function: $step(z)=\begin{cases}0 &\text{if } z<0 \\ 1 &\text{if } z\ge0 \end{cases}$
     - sign step function: $step(z)=\begin{cases}-1 &\text{if } z<0 \\ 0 &\text{if } z=0 \\ +1 &\text{if } z>0\end{cases}$
     - Gradient Descent (derivation) does not work well with step function
  2. Logistic function (sigmoid):
     - "S-shaped" curve that squashes any input into a range between 0 and 1
     - Best Use: The output layer of a binary classifier (where you need a probability like 0.85)
     - Downside: If the input is very large or very small, the curve becomes flat
  3. Hyperbolic tangent function:
     - Similar to the Logistic function but squashes inputs into a range between -1 and 1
     - Best Use: Hidden layers. Because it is centered at zero, it makes the data "cleaner" for the next layer to process
     - Downside: Like the Logistic function, it still suffers from "flat ends"
  4. Rectified Linear Unit function (ReLU):
     - Modern industry standard
     - If input is negative, output is 0; if input is positive, output is the input itself
     - Why it's better: It is mathematically very simple (fast to compute) and it does not saturate (flatten out) for positive values
     - Downside: Not differentiable at `z = 0` - the slope changes abruptly, which can make Gradient Descent bounce around
  5. Softplus Activation (Smooth ReLU):
     - Softplus is a smooth, curved version of the ReLU function
     - While ReLU has a sharp "corner" at zero, Softplus is a continuous curve that never quite hits a hard zero
  6. Softmax activation function:
     - It applies to whole output layer
     - It turns a vector of output numbers into probabilities that sum up to exactly 1.0 (100%)
     - Best Use: The output layer of a multi-class classifier (e.g., is this image a Cat, Dog, or Bird?)

## Layer

- Dense/fully connected layer: When all the neurons in a layer are connected to every neuron in the previous layer
- Input layer: features are fed here. Consist of list of (passthrough) input neurons
- Hidden layer: in-between input & output layer
- Output layer: labels are returned here
- Layer-by-layer calculation:
  1. Weighted Sums: Each neuron multiplies the inputs by its weights and adds a bias
  2. Activation: It then applies an activation function (like ReLU or Sigmoid) to decide how much **signal** to send forward
  3. Sequential Flow: Layer 1 sends its results to Layer 2, Layer 2 to Layer 3, and so on. This continues until the data reaches the Output Layer
- NOTE: each layer manages:
  - weight matrix: it contains all the connection weights between the neurons and their **inputs**
  - bias weight vector: it contains vector of bias (from previous layer) terms (one per neuron)

## Loss function

- A loss function is a mathematical formula that measures the difference (loss) between the model's predicted output and the actual correct answer
- Regression (Predicting a Number):
  1. Mean Squared Error (MSE):
     - The "default" choice
     - It squares errors, so it harshly punishes large mistakes
     - Use this if your data follows a normal distribution and you want to strongly discourage outliers
  2. Mean Absolute Error (MAE):
     - It takes the absolute difference
     - It is robust to outliers because it treats all errors linearly rather than squaring them
     - Use this if your data is "noisy" with many extreme values
  3. Huber Loss:
     - A hybrid that acts like MSE for small errors and MAE for large ones
     - Use this when you want a balance: sensitive enough to be accurate, but robust enough not to be derailed by outliers
- Classification (Predicting a Category):
  1. Binary Cross-Entropy (Log Loss):
     - The standard for binary classification (e.g., Spam vs. Not Spam)
     - It works with the Sigmoid(logistic) activation function
  2. Categorical Cross-Entropy:
     - Used for multi-class classification where classes are mutually exclusive (e.g., Cat vs. Dog vs. Bird)
     - It typically requires Softmax activation in the final layer
  3. Sparse Categorical Cross-Entropy:
     - Same as Categorical Cross-Entropy, but used when your labels are integers (0, 1, 2) instead of one-hot encoded vectors ([1, 0, 0])
     - This saves memory for a large number of classes

## Perceptron

- Simplest ANN architecture
- Uses TLU neuron
- Consist of:
  - input layer: (passthrough) input neuron for every feature & 1 bias neuron
  - No hidden layer
  - output layer: dense layer of TLU neurons
- Perceptron Training Rule: weights are adjusted based on the difference between its prediction and actual target. $w_{i,j}^\text{(next step)}=w_{i,j}+\eta(y_j−\widehat{y}_j)x_i$:
  - $w_{i,j}$ is the connection weight between the $i^{th}$ input neuron and the $j^{th}$ output neuron
  - $x_i$ is the $i^{th}$ input value of the current training instance
  - $\widehat{y}_j$ is the predicted output of the $j^{th}$ output neuron for the current training instance
  - $y_j$ is the actual output of the $j^{th}$ output neuron for the current training instance
  - $\eta$ is the learning rate
- Shortcoming:
  - It can learn linear pattern only and not any complex patterns
  - Perceptron do not output a class probability; rather, they just make predictions based on a hard threshold
- For a linear pattern, solution is not generally unique since there is an infinity of hyperplanes that can separate them

```py title='example'
import numpy as np
from sklearn.datasets import load_iris
from sklearn.linear_model import Perceptron

iris = load_iris()
X = iris.data[:, (2, 3)]  # petal length, petal width
y = (iris.target == 0).astype(np.int64)  # Iris Setosa. 1 if Iris Setosa, else 0
per_clf = Perceptron() # binary classifier. Same as SGDClassifier(loss="perceptron", learning_rate="constant", eta0=1 (learning rate), penalty=None (no regularization))
per_clf.fit(X, y)
y_pred = per_clf.predict([[2, 0.5]])
y_pred  # array([0])
```

## Multi-Layer Perceptron (MLP) & Backpropagation

- MLP Consist of:
  - input & output layer: same as simple Perceptron
  - hidden layer: 1 or more layer of densely connected TLUs and 1 bias neuron
- MLP was hard to train using Perceptron Training Rule. Developer then came up with the backpropagation training algorithm
- Backpropagation:
  - It is simply Gradient Descent (Optimization algorithm)
  - It uses **reverse-mode autodiff** (automatic differentiation) for automatically computing gradients
- Activation function was updated from step function to logistic function since Gradient Descent does not work well with step function
- Training a model is an iterative loop of four phases:
  - Forward Pass: Data is fed through the network to make a prediction. Initially, with **random weights**, the prediction will likely be wrong
    - If weights are same (initialization), then all neurons in a given layer will be identical, and thus backpropagation will affect them in same way, so they will remain identical
    - In other words, despite having hundreds of neurons per layer, your model will act as if it had only one neuron per layer
  - Calculate Loss: A "loss function" measures the exact distance between the model's prediction and the actual correct answer (the ground truth)
  - Backward Pass (Backpropagation):
    - The model starts at the end (the error) and works backward toward the input layer
    - It uses the Chain Rule from calculus (NN is a long chain of layers) to determine how much each individual weight contributed to that final error
  - Gradient Descent Step: tweak all the connection weights using formula: `New Weight = Old Weight - (Learning Rate * Gradient)`
- How data are consumed during training:
  - Group dataset into small bundles (typically 32 samples) called **mini-batches**, instead of entire dataset at once (slow process) or just one row at a time (chaotic process)
  - The model makes predictions for all 32 instances, calculates average error for that group, and then performs one backpropagation update based on that average
  - Once weights are adjusted, it moves to the next 32, and the next, until it has seen every single row in your training data
  - An **Epoch** is completed when the model has cycled through every mini-batch in the entire dataset exactly once
  - Converge: NN rarely learns everything in one go. It see same data multiple times (multiple epochs) to fine-tune those weights and lower the error further
  - Example: If you have 3,200 images, one Epoch would consist of 100 Mini-batches (of 32 images each)
- Chain Rule (Calculus):
  - It is used to calculate the derivative (the rate of change) of a composite function — essentially a function inside another function
  - If you have three variables where $z$ depends on $y$, and $y$ depends on $x$, the Chain Rule says:
    - To find out how much a change in $x$ affects $z$, you multiply the individual rates of change together
    - Formula: $\frac{dz}{dx}=\frac{dz}{dy} \times \frac{dy}{dx}$
- Regression MLPs:
  - If you want to predict a single value, then you just need a single output neuron: its output is the predicted value
  - For multivariate regression (i.e., to predict multiple values at once)(for e.x., find center and size of a image), you need one output neuron per output dimension
  - | Architecture of regression MLP: Hyperparameter | Typical Value                                                                     |
    | ---------------------------------------------- | --------------------------------------------------------------------------------- |
    | # input neurons                                | One per input feature                                                             |
    | # hidden layers                                | Depends on the problem. Typically 1 to 5                                          |
    | # neurons per hidden layer                     | Depends on the problem. Typically 10 to 100                                       |
    | # output neurons                               | 1 per prediction dimension                                                        |
    | Hidden activation                              | ReLU (or SELU)                                                                    |
    | Output activation                              | None or ReLU/Softplus (if positive outputs) or Logistic/Tanh (if bounded outputs) |
    | Loss function                                  | MSE or MAE/Huber (if outliers)                                                    |
- Classification MLPs:
  - For binary classification, you need single output neuron using logistic activation function: output will be between 0 & 1, providing probability of positive class
  - For multi-class classification, you need one output neuron per class, and should use softmax activation function for the whole output layer
  - Loss function: use cross-entropy

## Implementing MLPs with Keras

- Keras (https://keras.io/) provides **specification** (rules & guidelines) for how deep learning code should look and behave
- Keras (https://github.com/keras-team/keras) (not to confuse, we'll call it keras-team) provide **implementation** as python package
  - keras-team don't do heavy mathematical lifting itself, but relies on "backend engine" to handle complex tensor operations and hardware acceleration
  - One of the popular engine is **TensorFlow**
  - TensorFlow itself now comes bundled with its own Keras implementation called `tf.keras`
- 3 Coding favour for building model:
  1. Sequential API:
     - Simplest way to build a model - stack layers one after another in a linear list
     - Cons: Cannot handle multiple inputs/outputs, shared layers, or non-linear topology (like branches)
  2. Functional API:
     - Instead of a list, you define functions that take layers as inputs and return layers as outputs. You then connect them to create a graph
     - Pros: Supports multiple inputs/outputs, branching, and layer sharing. Allows you to access intermediate layer outputs easily
  3. Model Subclassing:
     - OOPs approach
     - Create a class inheriting from `tf.keras.Model`. Define layers in the `__init__()` and the forward pass logic in the `call()`
- During building model, whole dataset is made of:
  1. Training set(70-80%): Used by the model to learn weights and patterns
  2. Validation set(10-15%):
     - Once the model has seen the entire training set (one epoch), it runs a forward pass on the Validation data
     - It calculates Validation Loss and Accuracy
     - NOTE: The model does not update its weights based on this data
     - Comparison (training & validation metrics):
       - Training Loss low, Validation Loss high: The model is overfitting
       - Both losses decreasing: The model is learning well
     - Use case:
       - Hyperparameter Tuning like learning rate, adding more layers
       - Early Stopping: tell Keras to stop training if the Validation Loss stops improving, even if you set epochs=100. This saves time and prevents overfitting
       - Model Checkpoint-ing: You can set a "callback" to only save the version of the model that achieved the best validation score
  3. Testing set(10-15%): Used only once after training is complete to provide an unbiased evaluation of the final model

```py title='validation set'
# Manual Split
from sklearn.model_selection import train_test_split
x_train_full, x_test, y_train_full, y_test = train_test_split(X, y, test_size=0.2) # Split off the Test set first
x_train, x_val, y_train, y_val = train_test_split(x_train_full, y_train_full, test_size=0.2) # Split the remaining data into Train and Validation
model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=10) # Pass them to the model

# Automatic split
# ensure your data is shuffled, otherwise the validation set might only contain one class of data
model.fit(x_train, y_train, epochs=10, validation_split=0.2)
```
