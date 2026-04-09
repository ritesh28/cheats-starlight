---
title: Training Deep Neural Networks (DNN)
---

## Vanishing/Exploding Gradients Problems

- During backpropagation process:
  - Gradients (error signals) are calculated by multiplying derivatives layer-by-layer from the output back to the input
  - Gradients are calculated at every layer: $\frac{\partial{Loss}}{\partial{W_{i,j}}}=\text{derivate layer n}\times\text{derivate layer n-1}\times\cdots$
  - If these gradients become extremely small or large due to repeated multiplication (chain rule), the network's lower layers fail to learn effectively
- Vanishing Gradient Problem:
  - This occurs when the gradients become increasingly small as they propagate backward through the network, eventually approaching zero
  - Cause: for e.x. maximum derivative of Sigmoid is only 0.25. Multiplying these small values over many layers causes the signal to shrink exponentially
  - Impact: The weights in the earlier layers receive almost no updates, meaning they stop learning
- Exploding Gradient Problem:
  - Gradients grow bigger and bigger, so many layers get insanely large weight updates and the algorithm diverges
  - Cause: usually stems from large weight values or poor initialization. If weights are greater than 1, their repeated multiplication leads to massive gradient values
  - Impact: You may see the loss function fluctuate wildly or result in NaN (Not a Number) values, effectively breaking the model
- More generally, DNN suffer from unstable gradients; different layers may learn at widely different speeds

## Solution 1: Glorot (Xavier) and He Initialization

- Fan-in of a layer: number of input neurons connected to a layer. For Dense layer - it is simply the number of neurons in the previous layer
- Fan-out of a layer: number of output neurons that the current layer connects to in the next layer. For Dense layer - it is the number of neurons in the current layer
- Glorot (Xavier) and He initialization are techniques used to set the starting weights of NN.
- Glorot Initialization (aka Xavier Initialization):
  - It helps to keep the variance of activation signals and backpropagating gradients roughly the same across layers
  - It's mostly used when the network uses sigmoid or tanh activation functions. These activation functions can squash values into a small range
  - Weights are based on fan-in & fan-out of each layer
  - Weights are initialized with values drawn from a uniform distribution (or normal distribution of variance $\frac{2}{fan\_in+fan\_out}$ in some cases)
  - Analogy:
    - If you set a microphone amplifier’s knob too close to zero, people won’t hear your voice
    - But, if you set it too close to the max, your voice will be saturated and people won’t understand what you are saying
    - Now imagine a chain of such amplifiers: For your voice to be clear & loud, your voice has to come out of each amplifier at the same amplitude as it came in
- He Initialization:
  - Designed for NN that use the ReLU (or its variants like Leaky ReLU) - either 0 (for negative inputs) or positive (for positive inputs)
  - This means that during training, some neurons can "die" (always output 0), and if too many neurons die, the network can stop learning effectively
  - Since ReLU outputs zeros for negative inputs, we need slightly larger initial weights to avoid the "dying ReLU" problem
  - Focus on activation signal (and not on gradient), weights are, based on fan-in, drawn from normal distribution with variance $\frac{2}{fan\_in}$
- Keras uses Glorot initialization with a uniform distribution
- `keras.layers.Dense(10, activation="relu", kernel_initializer="he_normal")`: Uses He Normal distribution initialization
- Drawback: it reduces vanishing/exploding gradients problems at the beginning of training, but doesn’t guarantee that they won’t come back later during training

## Solution 2: Non-saturating Activation Functions

- For saturating activation function like logistic, derivative becomes 0 at large value - thus resulting in vanishing problem
- Unfortunately, ReLU suffers from a problem called as "dying ReLUs": during training, some neurons effectively die, meaning they stop outputting anything other than 0
- Solution #1: use leaky ReLU
  - $LeakyReLU_\alpha(z) = max(\alpha{z}, z)$
  - Hyperparameter $\alpha$ defines how much the function “leaks”: it is the slope of the function for $z<0$, and is typically set to `0.01`
- Solution #2: ELU (exponential linear unit)
  - $ELU_\alpha(z)=\begin{cases} z & \text{if } z > 0 \\ \alpha(e^z - 1) & \text{if } z \le 0 \end{cases}$
  - Graph is smooth but slower to compute than ReLU & its variant
- Solution #3: SELU (Scaled version of ELU):
  - $SELU_{\alpha,\lambda}(z)=\lambda\times ELU_\alpha(z)$
  - Provide self-normalization (for some specific NN) - output of each layer will tend to preserve mean 0 and standard deviation 1 during training
- When to use what:
  - In general, SELU > ELU > leaky ReLU (and its variants) > ReLU > tanh > logistic
  - If the network’s architecture prevents it from self-normalizing, then ELU may perform better than SELU (since SELU is not smooth at z = 0)
  - If you care a lot about runtime latency, then you may prefer leaky ReLU

```py title='activation func'
## leaky ReLU activation function
leaky_relu = keras.layers.LeakyReLU(alpha=0.2)
layer = keras.layers.Dense(10, activation=leaky_relu, kernel_initializer="he_normal")

## SELU activation
layer = keras.layers.Dense(10, activation="selu", kernel_initializer="lecun_normal")
```

## Solution 3: Batch Normalization (BN)

- BN consist of adding an operation between layers.
- It operates by calculating the mean and variance of a batch for each input ($x_i$), normalizing data to a standard distribution, and then applying a learnable scale and shift
- Algorithm (Calculation is done on a layer for each input ($x_i$) for a Mini-Batch ($B$) of size $m$):
  - Evaluate the mean and standard deviation of each input over the current mini-batch (hence the name “Batch Normalization”):
    - $\mu_{B} = \frac{1}{m} \sum_{i=1}^{m} x_{i}$: mean vector of a layer
    - $\sigma_{B}^{2} = \frac{1}{m} \sum_{i=1}^{m} (x_{i} - \mu_{B})^{2}$: standard deviation vector of a layer
  - Normalize each input of a layer to zero mean and unit variance:
    - $\hat{x}_{i} = \frac{x_{i} - \mu_{B}}{\sqrt{\sigma_{B}^{2} + \epsilon}}$
    - Smoothing term: $\epsilon$ is a tiny number to avoid division by zero (typically $10^{–5}$)
  - Scale & Shift:
    - $z_i = \gamma \hat{x}_i + \beta$
    - Two learnable parameters: $\gamma$ (gamma) for scaling and $\beta$ (beta) for shifting
    - It ensures that network can still represent complex distributions
- If BN layer is 1st layer after the input layer, then we do not need to standardize training set (e.g., `StandardScaler`) since BN layer will do it for us
- Inference/testing:
  - Here we are making predictions for individual instances rather than for batches of instances: We can't compute mean & standard deviation
  - We already learned $\gamma$ (scale vector) and $\beta$ (shift/offset vector). We now only need "final" $\mu$ & $\sigma$ vectors for the prediction
  - Approach #1: After training phase run whole training set as single batch through NN, and compute the mean and standard deviation of each input of the BN layer
  - Approach #2 (Recommended): Use exponential moving average to calculate "final" $\mu$ & $\sigma$ during training
    - NOTE: $\mu$ & $\sigma$ are estimated during training, but they are not used at all during training, only after training for prediction
    - Moving Average: the average is calculated on the fly as soon as next data is available
    - Exponential Moving Average (EMA) is a type of moving average that gives more importance to the most recent data points
      - $V_t = \alpha \cdot V_{t-1} + (1 - \alpha) \cdot \theta_t$
        - $V_t$: The new moving average (at time $t$)
        - $V_{t-1}$: The previous moving average
        - $\theta_t$: The current data point (e.g., the mean of the current mini-batch)
        - $\alpha$(alpha): A "momentum" or "smoothing" parameter between 0 and 1
      - Exponential decay: because the formula is recursive, each previous value's influence is multiplied by ($\alpha<1$) again and again as time goes on
- NOTE: BN layer does not perform same computation during training and after training: it uses batch statistics during training, and “final” statistics after training
- Training is slow, because each epoch takes much more time when you use batch normalization
  - However, this is counterbalanced by the fact that convergence is much faster with BN, so it will take fewer epochs to reach the same performance
- | feature    | BN Before Activation                 | BN After Activation                    |
  | ---------- | ------------------------------------ | -------------------------------------- |
  | Origin     | Recommended by the original authors  | Popular in modern experimentation      |
  | Philosophy | Prepares the data for the activation | Prepares the output for the next layer |
- Hyperparameters of `BatchNormalization()`:
  - `momentum`: Controls the speed of EMA at which the layer "learns" the global mean and variance of your dataset. Good value is close to 1
  - `axis`: Determines which axis should be normalized. It defaults to –1, meaning that by default it will normalize the last axis
    - NOTE: For each epoch, a batch of instances/samples are sent to NN at once. Its not like one sample after another. So input shape: `[batch-size, features]`
    - For Dense layer `[Batch, Features]` with axis=-1, each input feature will be normalized based on $\mu$ & $\sigma$ computed across all the instances in the batch
    - | image shape                                       | recommended axis | what is normalized        |
      | ------------------------------------------------- | ---------------- | ------------------------- |
      | Grey image: `(Batch, Height, Width)`              | axis=[1,2]       | normalize each pixel      |
      | Color (Default): `(Batch, H, W, Channels)`        | axis=-1          | individual color channels |
      | Color (channels first): `(Batch, Channels, H, W)` | axis=+1          | individual color channels |

```py title='Add BN AFTER Activation'
## This model applies BN after every hidden layer and as the first layer in the model (after flattening the input images)
model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(300, activation="elu", kernel_initializer="he_normal"),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(100, activation="elu", kernel_initializer="he_normal"),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(10, activation="softmax")
])

model.summary()
# Each BN layer adds 4 parameters per input: γ, β, μ and σ (for example, the first BN layer adds 3136 parameters, =4*784)
# Non-trainable: The last two parameters, μ and σ, are the moving averages, they are not affected by backpropagation, so Keras calls them “Non-trainable”
# However, they are estimated during training, based on training data, so arguably they are trainable. In Keras, “Non-trainable” means “untouched by backpropagation”
# Non-trainable params: 2,368 (=(3136+1200+400)/2)
# O/P => ________________________________________________________
#  Layer (type)                Output Shape              Param #
# =================================================================
#  flatten_3 (Flatten)         (None, 784)               0
#  batch_normalization_3 (Bat  (None, 784)               3136  (=4*784)
#  chNormalization)
#  dense_9 (Dense)             (None, 300)               235500  (=784*300+300(bias))
#  batch_normalization_4 (Bat  (None, 300)               1200  (=4*300)
#  chNormalization)
# ...
# =================================================================

[(var.name, var.trainable) for var in model.layers[1].variables]
# [('batch_normalization_v2/gamma:0', True),
# ('batch_normalization_v2/beta:0', True),
# ('batch_normalization_v2/moving_mean:0', False),
# ('batch_normalization_v2/moving_variance:0', False)]
```

```py title='Add BN BEFORE Activation'
# Instead of inputs (x_i), we apply mean and standard deviation on Pre-activation values (the direct output of a weighted sum)
# Remove the activation function from the hidden layers, and add them as separate layers after the BN layers
# Since BN layer includes one offset/shift parameter per input, you can remove the bias term from the previous layer (use_bias=False)
model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(300, kernel_initializer="he_normal", use_bias=False),
    keras.layers.BatchNormalization(),
    keras.layers.Activation("elu"),
    keras.layers.Dense(100, kernel_initializer="he_normal", use_bias=False),
    keras.layers.BatchNormalization(),
    keras.layers.Activation("elu"),
    keras.layers.Dense(10, activation="softmax")
])
model.summary()
# O/P => Model: "sequential_2"
# _________________________________________________________________
#  Layer (type)                Output Shape              Param #
# =================================================================
#  flatten_2 (Flatten)         (None, 784)               0
#  batch_normalization (Batch  (None, 784)               3136   (=4*784)
#  Normalization)
#  dense_6 (Dense)             (None, 300)               235200  (=784*300) no bias
#  batch_normalization_1 (Bat  (None, 300)               1200  (=4*300)
#  chNormalization)
#  activation (Activation)     (None, 300)               0
# ...
# =================================================================
```

## Solution 4: Gradient Clipping

- Gradient Clipping is a technique where we clip the gradients during backpropagation so that they never exceed some threshold
- Used in recurrent neural networks, as Batch Normalization is tricky to use in RNNs. For other types of networks, BN is usually sufficient
- `optimizer = keras.optimizers.SGD(clipvalue=1.0)`: this will clip every component of the gradient vector to a value between –1 & 1
  - This changes the direction of vector. For e.x. `[0.9, 100.0]` becomes `[0.9, 1.0]`
- `optimizer = keras.optimizers.SGD(clipnorm=1.0)`: Proportional Scaling. Each component is scaled such that the total length ($L_2$ norm) of gradient vector is 1.0
  - Preserve the direction but make values small. For e.x. `[0.9, 100.0]` becomes `[0.00899964, 0.9999595]`
- If you observe that gradients explode during training (track in TensorBoard), you may want to try both clipping by value and by norm, with different threshold

## Reusing Pretrained Layers

- Transfer Learning:
  - Its a technique to reuse the lower layers of NN that accomplishes a similar task to the one you are trying to tackle
  - E.x.:
    - Suppose you have access to a NN that was trained to classify pictures into 100 different categories, including animals, plants, vehicles, and everyday objects
    - You now want to train a DNN to classify specific types of vehicles
    - These tasks are very **similar, even partly overlapping,** so you should try to reuse parts of the first network
  - NOTE: Add a **preprocessing step** to resize image (input) to the size expected by the original model
  - Transfer learning will work best when the inputs have similar low-level features - for e.x. grey colored image
  - The more similar tasks are, the more lower layers you want to reuse. For very similar tasks, you can try keeping all hidden layers and just replace output layer
- Freezing/unfreezing reused layers:
  - Freeze a layer means make their weights non-trainable, so gradient descent won’t modify them
  - Once you have decided the number of reused layers:
    - First, freeze all the reused layers then train your model and see how it performs
    - Then try unfreezing one or two of the top hidden layers to let backpropagation tweak them and see if performance improves
  - The more training data you have, the more layers you can unfreeze
  - NOTE: Reduce the learning rate when you unfreeze reused layers: this will avoid wrecking their fine-tuned weights
  - NOTE: Always compile your model after you freeze or unfreeze layers
- NOTE: In general, transfer learning does not work very well with small dense networks: it works best with deep convolutional neural networks

```py title='Transfer learning with Keras'
model_A = keras.models.load_model("my_model_A.h5")
model_B_on_A = keras.models.Sequential(model_A.layers[:-1]) # reuse all layers except for the output layer
model_B_on_A.add(keras.layers.Dense(1, activation="sigmoid"))
# NOTE: model_A and model_B_on_A now share some layers. When you train model_B_on_A, it will also affect model_A
# To avoid modifying model_A, use clone_model(). REMEMBER: clone_model() does not clone the weights)
# model_A_clone = keras.models.clone_model(model_A)
# model_A_clone.set_weights(model_A.get_weights())

#### TRAIN
# For first few epochs, our model will make large error, which leads to large gradient that will wreck the reused weights
# Solution: freeze reused layers initially, giving the new output layer some time to learn reasonable weights
for layer in model_B_on_A.layers[:-1]:
    layer.trainable = False
model_B_on_A.compile(loss="binary_crossentropy", optimizer="sgd", metrics=["accuracy"]) # Always compile after freezing/unfreezing
history = model_B_on_A.fit(X_train_B, y_train_B, epochs=4, validation_data=(X_valid_B, y_valid_B))
# unfreeze
for layer in model_B_on_A.layers[:-1]:
    layer.trainable = True
optimizer = keras.optimizers.SGD(lr=1e-4) # the default lr is 1e-3. Reducing learning rate
model_B_on_A.compile(loss="binary_crossentropy", optimizer=optimizer, metrics=["accuracy"])
history = model_B_on_A.fit(X_train_B, y_train_B, epochs=16, validation_data=(X_valid_B, y_valid_B))
```

## Unsupervised Pretraining
