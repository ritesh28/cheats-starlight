---
title: Introduction to ANN
---

- ANN : Artificial Neural Network
- Deep Learning (DL) is the study of Neural Network (NN)
- NN Architecture: it is a structured arrangement, defining how artificial neurons are organized, connected, and layered to process data
- Training ANN means finding/learning the right values for weights: $w_0$, $w_1$ ... $w_n$

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
  - weight matrix: it contains all the connection weights between the neurons and their **inputs**. Shape: (previous_layer_neuron_count, current_layer_neuron_count)
  - bias weight vector: it contains vector of bias (from previous layer) terms (one per neuron). Shape: (current_layer_neuron_count,)

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

## Other NNs:

- FNN: Feed-forward Neural Network. In this architecture, the signal flows only in one direction (from the inputs to the outputs)
  - Example: MLP
- Wide & Deep NN:
  - Non-sequential NN
  - It connects all or part of the inputs directly to the output layer
  - Advantage: learns both deep patterns (using the deep path) and simple rules (through the short path)

## Implementing NN with Keras

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
  3. Model Sub-classing:
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
- Saving and Restoring a Model:
  - `model.save("my_keras_model.h5")`
  - `model = keras.models.load_model("my_keras_model.h5")`
- Using Callbacks:
  - Callbacks are functions that allow you to save, interrupt model while it trains, rather than treating the training phase as an unchangeable "black box"
  - They are triggered at global-level(`on_train_begin`, `on_train_end`), epoch-level(`on_epoch_begin`, `on_epoch_end`), & batch-level(`on_batch_begin`, `on_batch_end`)
  - Common Built-in Callbacks:
    - ModelCheckpoint:
      - Saves model at regular interval (by default, end of each epoch). Depending on file name, file is overwritten or a new file is created at end of every epoch
      - If validation set is present & `save_best_only=True`: saves model when its performance on the validation set is the best so far
      - `checkpoint_cb = keras.callbacks.ModelCheckpoint("my_keras_model.h5"); model.fit(..., callbacks=[checkpoint_cb]) `
    - EarlyStopping:
      - Interrupt (but not save) training when theres no progress on validation set for a number of epochs (`patience`), and it will optionally roll back to the best model
      - `early_stopping_cb = keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)`
  - Custom callback: Create a class inheriting `keras.callbacks.Callback` and override methods like `on_epoch_end(self, epoch, logs)` (logs contain metrics like 'loss')
- Visualization Using TensorBoard (build-in Callback function):
  - TensorBoard is a live interactive visualization tool that you can use to view learning curves during training, compare learning curves between multiple runs
  - Create a log directory. Each binary log file is called **event file**. Each binary data record in an event file is called **summary**
  - TensorBoard **server** will monitor the log directory, and it will automatically pick up the changes and update the visualizations

```py title='validation set'
# MANUAL SPLIT (PREFERRED)
from sklearn.model_selection import train_test_split
x_train_full, x_test, y_train_full, y_test = train_test_split(X, y, test_size=0.2) # Split off the Test set first
x_train, x_val, y_train, y_val = train_test_split(x_train_full, y_train_full, test_size=0.2) # Split the remaining data into Train and Validation
model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=10) # Pass them to the model

# AUTOMATIC SPLIT
# ensure your data is shuffled, otherwise the validation set might only contain one class of data
model.fit(x_train, y_train, epochs=10, validation_split=0.2)
```

```py title='Image Classifier Using Sequential API: MLP architecture'
## PROCESS(5 steps): CREATE -> COMPILE -> TRAIN -> EVALUATE -> PREDICT
import tensorflow as tf
from tensorflow import keras
fashion_mnist = keras.datasets.fashion_mnist
(X_train_full, y_train_full), (X_test, y_test) = fashion_mnist.load_data()
X_train_full.dtype  # uint8
X_train_full.shape  # (60000, 28, 28)
y_train_full.shape  # (60000,)
class_names = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]  # from keras website
class_names[y_train_full[0]]  # 'Ankle boot'

# CREATE VALIDATION SET
# Since working with Gradient Descent, scale the input features & convert them to float
X_valid, X_train = X_train_full[:5000] / 255.0, X_train_full[5000:] / 255.0
y_valid, y_train = y_train_full[:5000], y_train_full[5000:]

# 1. CREATE MODEL
model = keras.models.Sequential()  # Sequential API
model.add(keras.layers.Flatten(input_shape=[28, 28]))  # convert input shape into 1D. Creates input layer `keras.layers.Input()`
model.add(keras.layers.Dense(300, activation="relu"))  # OR: activation=keras.activations.relu
model.add(keras.layers.Dense(100, activation="relu"))
model.add(keras.layers.Dense(10, activation="softmax"))  # 10 neurons (one per class)

# Alternative way to create model: pass list of layers
# model = keras.models.Sequential([keras.layers.Flatten(...), keras.layers.Dense(...), ... ])

# If the input shape is already 1D, we can directly create dense layer as first layer as:
# keras.layers.Dense(30, activation="relu", input_shape=(8,))
# Alternative: keras.layers.Input(shape=(8,)); keras.layers.Dense(30, activation="relu")

model.summary() # return table of all model's layers
#  Layer (type)                Output Shape              Param #
# =================================================================
#  flatten_1 (Flatten)         (None, 784)               0
#  dense_3 (Dense)             (None, 300)               235500     # Calculation: 784 × 300 connection weights, plus 300 bias terms
#  dense_4 (Dense)             (None, 100)               30100
#  dense_5 (Dense)             (None, 10)                1010
model.layers # return list of layers
model.layers[1].name # OR: model.get_layer("dense_3").name. O/P => dense_3. return name of the layer
weights, biases = model.layers[1].get_weights() # access all the parameters of a layer
# weights are initialized randomly (needed to break symmetry), and biases are initialized to 0
# set `kernel_initializer` (kernel is another name for the matrix of connection weights) or `bias_initializer` to use a different initialization method
weights.shape, biases.shape # ((784, 300), (300,))

# 2. COMPILE MODEL: specify the loss function and the optimizer to use
model.compile(
  loss="sparse_categorical_crossentropy", # OR: loss=keras.losses.sparse_categorical_crossentropy
  optimizer="sgd", # OR: optimizer=keras.optimizers.SGD()
  metrics=["accuracy"] # OR: metrics=[keras.metrics.sparse_categorical_accuracy]. Specify a list of extra metrics to compute during training and evaluation
  )

# 3. TRAINING MODEL
history = model.fit(X_train, y_train, epochs=30, validation_data=(X_valid, y_valid))
# NOTE: calling `fit()` again will continue training further (rather than restarting) since the weights are already updated
# Other Parameter:
##### batch_size=32 (default)
##### class_weight: use it to give larger weight to underrepresented classes, and lower weight to overrepresented classes
##### sample_weight: (supersedes class_weight) use it to give per-sample/instance weight (for e.x., some samples are credible while others are not)
##### provide sample weights (but not class weights) for validation set by adding them as a third item in the validation_data tuple
# O/P =>
# Epoch 1/30
# 1719/1719 [==============================] - 2s 1ms/step - loss: 0.7228 - accuracy: 0.7610 - val_loss: 0.5224 - val_accuracy: 0.8234
# ...
# A step is considered when the model has consumed one batch (32) of samples
# Since X_train has 55,000 samples & each batch contains 32 samples - total number of batches/steps is 1719 (55000/32)
# After every step, model calculate mean error/loss and updates weights as per optimizer function
# After every epoch, model evaluates on the validation set - used only for performance monitoring and not for training

# 4. LEARNING CURVES: use it to verify if the model is converged and whether overfitting
history.history # returns dict of loss and extra metrics it measured at the end of each epoch on the training set and on the validation set
# pd.DataFrame(history.history).plot(figsize=(8, 5))
# plt.grid(True)
# plt.gca().set_ylim(0, 1)  # set the vertical range to [0-1]
# plt.show()

# 5. EVALUATING MODEL
loss, accuracy = model.evaluate(X_test, y_test) # can pass other arguments, such as `batch_size` or `sample_weight`
# O/P => 313/313 [==============================] - 0s 747us/step - loss: 56.8926 - accuracy: 0.8532
# X_test.shape=(10000, 28, 28) & batch_size=32 => which gives step=313 (10000/32)
# NOTE: resist the temptation to tweak the hyperparameters on the test set, or else your estimate of the generalization error will be too optimistic

# 6. USING THE MODEL TO MAKE PREDICTIONS
X_new = X_test[:3]
y_proba = model.predict(X_new) # make prediction (estimates one probability per class)
y_proba.round(2) # y_proba.shape: (3, 10)
```

```py title='Complex Models using Functional API: Wide & Deep NN'
# REFER INFOGRAPHIC FOR WIDE & DEEP NN
## COMPLEX MODEL WITH SINGLE INPUT & OUTPUT
input = keras.layers.Input(shape=X_train.shape[1:]) # shape of each sample
hidden1 = keras.layers.Dense(30, activation="relu")(input)
hidden2 = keras.layers.Dense(30, activation="relu")(hidden1)
concat = keras.layers.Concatenate([input, hidden2])
output = keras.layers.Dense(1)(concat)
model = keras.models.Model(inputs=[input], outputs=[output]) # create model by specifying input & output layers

## HANDLING MULTIPLE INPUTS
# Here we are sending 5 features through the deep path (features 0 to 4), and 6 features through the wide path (features 2 to 7)
input_A = keras.layers.Input(shape=[5])
input_B = keras.layers.Input(shape=[6])
hidden1 = keras.layers.Dense(30, activation="relu")(input_B)
hidden2 = keras.layers.Dense(30, activation="relu")(hidden1)
concat = keras.layers.concatenate([input_A, hidden2])
output = keras.layers.Dense(1)(concat)
model = keras.models.Model(inputs=[input_A, input_B], outputs=[output])
# Pass pair of matrices (X_train_A, X_train_B) for fit(), evaluate() & predict()
model.fit((X_train_A, X_train_B), y_train, ...)

## HANDLING MULTIPLE OUTPUTS
# Use case: Want to locate and classify main object in a picture. NN can learn features in data that are useful across tasks
[...] # Same as multiple inputs handling
output = keras.layers.Dense(1)(concat)
aux_output = keras.layers.Dense(1)(hidden2)
model = keras.models.Model(inputs=[input_A, input_B], outputs=[output, aux_output])
model.compile(loss=["mse", "mse"], loss_weights=[0.9, 0.1], optimizer="sgd") # Each output needs its own loss function and have its own importance
# Pass values for each output for fit(), evaluate(). predict() returns multiple sets of outputs
history = model.fit([X_train_A, X_train_B], [y_train, y_train], ...)
total_loss, main_loss, aux_loss = model.evaluate([X_test_A, X_test_B], [y_test, y_test])
y_pred_main, y_pred_aux = model.predict([X_new_A, X_new_B])
```

```py title='Dynamic Models Using Subclassing API'
# Sequential & Functional API are declarative: you start by declaring which layers you want to use and how they should be connected
# Use subclassing api for dynamic model
# Cons: Since architecture is hidden under call(), summary() do not return how layers are connected, and we can't save or inspect model
class WideAndDeepModel(keras.models.Model): # Inherit Model class
  def __init__(self, units=30, activation="relu", **kwargs):
    # Create layers in __init__()
    super().__init__(**kwargs)
    self.hidden1 = keras.layers.Dense(units, activation=activation)
    self.hidden2 = keras.layers.Dense(units, activation=activation)
    self.main_output = keras.layers.Dense(1) # named as 'main_output', since Keras models have an 'output' attribute
    self.aux_output = keras.layers.Dense(1)

  def call(self, inputs):
    # Connect the already defined layers in call()
    # Additionally, Can do anything - for loops, if statements, low-level TensorFlow operations
    input_A, input_B = inputs
    hidden1 = self.hidden1(input_B)
    hidden2 = self.hidden2(hidden1)
    concat = keras.layers.concatenate([input_A, hidden2])
    main_output = self.main_output(concat)
    aux_output = self.aux_output(hidden2)
    return main_output, aux_output

model = WideAndDeepModel()
```

```py title'Visualization Using TensorBoard'
root_logdir = os.path.join(os.curdir, "my_logs")
def get_run_logdir():
  import time
  run_id = time.strftime("run_%Y_%m_%d-%H_%M_%S")
  return os.path.join(root_logdir, run_id)
run_logdir = get_run_logdir() # e.g., './my_logs/run_2019_01_16-11_28_43'

# train model
tensorboard_cb = keras.callbacks.TensorBoard(run_logdir) # pass the folder name
# during training TensorBoard callback will create event files and write summaries to them
history = model.fit(X_train, y_train, epochs=30, validation_data=(X_valid, y_valid), callbacks=[tensorboard_cb])

# start the TensorBoard server
!tensorboard --logdir=./my_logs --port=6006
```
