---
title: Training Deep Neural Networks (DNN)
---

- Ways to speed up training (and reach a better solution):
  1. Initialization strategy for the connection weights
  2. Activation functions
  3. Batch normalization
  4. Reusing parts of a pretrained network (possibly built on an auxiliary task or using unsupervised learning)
  5. Optimizer

![train DNN](./11-training-DNN.drawio.svg)

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
- Unsupervised Pretraining:
  - Useful when you have plenty of unlabeled data (and little labeled data) and can't find a model trained on a similar task
  - Unsupervised pretraining: Learning "Features" pattern first, "Labels" later
  - Train layers one by one, starting with the lowest layer and then going up, using an unsupervised feature detector algorithm such as autoencoders
  - All layers except the one being trained are frozen. Each layer is trained on the output of the previously trained layers
  - Once all layers have been trained this way:
    - Unfreeze all the pretrained layers, or just some of the upper ones
    - Add the output layer for your task, and fine-tune the final network using supervised learning (i.e., with the labeled set)
- Pretraining on an Auxiliary (Supplementary) Task:
  - Useful when you don't have labeled data for a given task, but you have plenty of labeled data for a similar (auxiliary) task
  - Train NN for the auxiliary task and then reuse the lower layers of that network for your actual task
  - The first NN lower layers will learn feature detectors that will likely be reusable by the second NN
  - Example:
    - For natural language processing (NLP) applications, you can easily download millions of text documents and automatically generate labeled data from it
    - For example, you could randomly mask out some words and train a model to predict what the missing words are (this will be Auxiliary task)
    - This Auxiliary task NN already know quite a lot about language, and you can reuse it for your actual task, and fine-tune it on your labeled data
  - Self-supervised learning:
    - Self-supervised learning is when you automatically generate the labels from the data itself, thus created labeled dataset
    - Since this approach requires no human labeling whatsoever, it is best classified as a form of unsupervised learning

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

## Faster Optimizers

- Optimizer is an algorithm responsible for updating model's internal parameters (its weights and biases) to reduce errors and improve performance
- Momentum Optimization:
  - Analogy: Think of a heavy ball rolling down the hill - initially it start slow but quickly it will pick up momentum
  - In contrast, regular Gradient Descent (GD) will simply take small regular steps down the slope, so it will take much more time to reach the bottom
  - GD equation: $\theta \leftarrow \theta - \eta \nabla_{\theta} J(\theta)$
    - $\theta$ represents all weights
    - $\nabla_{\theta}$ is the gradient **vector** of weights
    - Updated $\theta$ is old $\theta$ minus learning rate ($\eta$) times gradient of the cost/error function $J(\theta)$
  - Unlike GD, Momentum optimization cares a great deal about what previous gradients were
  - Momentum algorithm (has 2 steps):
    1. $m \leftarrow \beta m - \eta \nabla_{\theta} J(\theta)$
       - $m$ represents momentum vector
       - $\beta$, a hyperparameter, is called 'momentum' which is set between 0 (high friction) and 1 (no friction). A typical momentum value is 0.9
       - $\beta$ determines how much of previous momentum vector to keep
    2. $\theta \leftarrow \theta + m$
  - Understanding the Speed Multiplier:
    - In standard GD, step size is always fixed: $step=\eta\times\nabla$
    - In Momentum, we multiply $\beta$ to the previous step. This creates a geometric series of steps $total update = \eta\nabla\times(1+\beta+\beta^2+\beta^3+\cdots)$
    - According to the mathematical rule for infinite geometric series, the sum of $(1+\beta+\beta^2+\beta^3+\cdots)$ is exactly $\frac{1}{1-\beta}$
    - For $\beta=0.9$, infinite series returns 10. This means on long run, Momentum optimization is 10 times faster than Gradient Descent
  - Advantage over GD:
    - Faster Convergence: In flat areas (plateaus), GD takes tiny steps and can feel stuck. Momentum builds up enough speed to "race" across these flat sections
    - Momentum can easily roll past local optima and reach global optima
    - Does better even if NN lacks Batch normalization:
      - At layers closer to the output, some inputs might be huge (e.g., 100.0) while others are tiny (e.g., 0.01)
      - Momentum ignores sideways bouncing caused by those uneven scales and uses its "built-up speed" to stay focused on the long-term path to the minimum
  - `optimizer = keras.optimizers.SGD(lr=0.001, momentum=0.9)`: set `momentum` when creating the SGD optimizer
  - Drawback: Extra hyperparameter to tune. However, the momentum value of 0.9 usually works well
- Nesterov Accelerated Gradient (NAG):
  - Variant of Momentum Optimization
  - The idea is to measure the gradient of the cost function not at the local position but slightly ahead in the direction of the momentum
  - NAG algorithm (has 2 steps):
    1. $m \leftarrow \beta m - \eta \nabla_{\theta} J(\theta + {\beta m})$. Gradient is measured at $\theta + {\beta m}$ rather than at $\theta$
    2. $\theta \leftarrow \theta + m$
  - This small tweak works because in general the momentum vector will be pointing in the right direction (i.e., toward the optimum)
  - `optimizer = keras.optimizers.SGD(lr=0.001, momentum=0.9, nesterov=True)`: set `nesterov=True` when creating the SGD optimizer
- AdaGrad (Adaptive Gradient):
  - While Momentum focuses on speed, AdaGrad focuses on scale
  - Analogy:
    - Imagine you are walking on a path where some sections are made of solid rock (frequent features) and others are deep mud (rare features)
    - Standard GD tries to walk at the same pace everywhere. It might sprint over the rock but get stuck in the mud
    - AdaGrad tracks how much you’ve moved in each direction:
      - If you've moved a lot (rock), it slows you down to avoid overshooting
      - If you've barely moved at all (mud), it speeds you up (gives you a higher learning rate) to help you get through it
  - AdaGrad scale down the steepest dimensions more than the flatter ones. This helps to point the result towards the global optimum
  - Algorithm (has 2 steps):
    - $s \leftarrow s + \nabla_{\theta} J(\theta) \otimes \nabla_{\theta} J(\theta)$
      - $\otimes$ represent element-wise multiplication (multiply the numbers that are in the same position)
      - Vector $s$ represents the accumulated sum of squared gradients
      - $s$ becomes larger and larger at each iteration
    - $\theta \leftarrow \theta - \eta \nabla_{\theta} J(\theta) \oslash \sqrt{s + \epsilon}$
      - $\oslash$ represent element-wise division
      - Almost identical to GD, but one big difference: the gradient vector is scaled down
      - $\epsilon$ is a smoothing term to avoid division by zero, typically set to $10^{-10}$
  - This algorithm decays the learning rate, but it does so faster for steep dimensions than for dimensions with gentler slopes. This is called **adaptive learning rate**
  - Disadvantage: Its minimizes learning rate to almost 0, which ends up stopping NN entirely before reaching the global optimum
  - AVOID USING IT
- RMSProp:
  - Problem of AdaGrad: It slows down a bit too fast and ends up never converging to the global optimum
  - RMSProp algorithm fixes this by accumulating only the gradients from the most recent iterations (as opposed to all the gradients since the beginning of training)
  - Algorithm (has 2 steps):
    - $s \leftarrow \rho s + (1-\rho)\nabla_{\theta} J(\theta) \otimes \nabla_{\theta} J(\theta)$
      - Uses exponential decay ($\rho$). Decay rate is typically set to 0.9 (extra hyperparameter, but this default value often works well)
    - $\theta \leftarrow \theta - \eta \nabla_{\theta} J(\theta) \oslash \sqrt{s + \epsilon}$: Same as AdaGrad
  - `keras.optimizers.RMSprop(lr=0.001, rho=0.9)`
- Adam (ADAptive Moment estimation) Optimization:
  - Combines the ideas of Momentum optimization (keep track of decaying past gradients) and RMSProp (keep track of decaying past squared gradients)
  - The momentum decay hyperparameter $beta_1$ is typically initialized to 0.9, while the scaling decay hyperparameter $\beta_2$ is initialized to 0.999
  - `optimizer = keras.optimizers.Adam(lr=0.001, beta_1=0.9, beta_2=0.999)`
  - Since Adam is an adaptive learning rate algorithm (like AdaGrad and RMSProp), it requires less tuning of the learning rate hyperparameter $\eta$
- NAdam Optimization:
  - Variant of Adam
  - it is simply Adam optimization plus the Nesterov trick, so it will often converge slightly faster than Adam
- | Optimizer Class                  | Convergence speed | Convergence quality   |
  | -------------------------------- | ----------------- | --------------------- |
  | SGD                              | bad               | good                  |
  | SGD(momentum=...)                | average           | good                  |
  | SGD(momentum=..., nesterov=True) | average           | good                  |
  | AdaGrad                          | good              | bad (stops too early) |
  | RMSprop                          | good              | average or good       |
  | Adam                             | good              | average or good       |
  | NAdam                            | good              | average or good       |
- Learning Rate Scheduling:
  - If you set learning rate way too high, training may actually diverge
  - If you set learning rate too low, training will eventually converge to the optimum, but it will take a very long time
  - If you set learning rate slightly high, it will make progress very quickly at first, but it will end up dancing around the optimum, never really settling down
  - Approach #1: Before Training
    - Start with a large learning rate, and divide it by 3 until the training algorithm stops diverging
    - optimal learning rate is typically half the current learning rate
  - Approach #2: Reduce the learning rate during training. These strategies are called **learning schedules**:
    - Power scheduling (also known as polynomial decay): Learning rate first drops quickly, then more and more slowly
      - Learning rate at any given step ($t$): $\eta_t = \frac{\eta_0}{(1 + \frac{t}{s})^c}$
        - Step is when NN process a single mini-batch
        - $t$: Iteration/Step Number. It tracks how many batches of data the model has seen so far
        - Hyperparameter: $\eta_0$ (Initial Learning Rate), $s$ (Scale. Also called 'Decay rate' which is inverse of Scale), $c$ (Power. Usually set to 1 by default)
      - If $c=1$ - learning rate at every $s$ step becomes $\eta_0/2,\eta_0/3,\eta_0/4,\cdots$
    - Exponential scheduling: Learning rate is reduced by a fixed percentage
      - Unlike Power Scheduling, which slows down its rate of decay over time, Exponential Scheduling drops the learning rate relentlessly
      - Learning rate at any given step ($t$): $\eta_t = \eta_0 \cdot r^{t/s}$
        - $r$: Decay Rate/Base. If $r=0.1$ learning rate will gradually drop by a factor of 10 every $s$ steps
        - For other variables, refer previous 'Power scheduling'
    - Piecewise constant scheduling:
      - Use a constant $\eta$ for a number of epochs (e.g. $\eta_0=0.1$ for 5 epochs), then a smaller $\eta$ for another number of epochs (e.g. $\eta_1=0.001$ for 50 epochs), and so on
      - Problem: it requires fiddling around to figure out the right sequence of learning rates and how long to use each of them
    - Performance scheduling: Measure validation error every $N$ steps (just like for early stopping) and reduce $\eta$ by a factor of $\lambda$ when the error stops dropping
  - When calling `fit()` next time, set `initial_epoch` if learning schedule is based on epoch counter since epoch is reset to 0 every time you call `fit()`

```py title='learning schedule'
## POWER SCHEDULING
optimizer = keras.optimizers.SGD(lr=0.01, decay=1e-4) # `decay` is inverse of Scale

## EXPONENTIAL SCHEDULING
def exponential_decay(lr0, s): # Not hardcoding initial learning rate & scale
    def exponential_decay_fn(epoch, current_lr): # Scheduler require this function signature (epoch, optional_current_learning_rate) -> new_learning_rate
        return lr0 * 0.1**(epoch / s)
    return exponential_decay_fn
exponential_decay_fn = exponential_decay(lr0=0.01, s=20)
lr_scheduler = keras.callbacks.LearningRateScheduler(exponential_decay_fn) # callback scheduler
history = model.fit(X_train_scaled, y_train, [...], callbacks=[lr_scheduler]) # update lr at the beginning of each epoch

## PERFORMANCE SCHEDULING
# ReduceLROnPlateau: Stands for "reduce learning rate on plateau"
# Below code will multiply the learning rate by 0.5 whenever the best validation loss does not improve for 5 consecutive epochs
lr_scheduler = keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
```

```py title='tf.keras scheduler'
# tf.keras offers an alternative way to implement learning rate scheduling
# this approach is not part of the Keras API, it is specific to tf.keras
# Here, you save the model, the learning rate and its schedule (including its state) get saved as well
s = 20 * len(X_train) // 32 # number of steps in 20 epochs (batch size = 32)
learning_rate = keras.optimizers.schedules.ExponentialDecay(initial_learning_rate=0.01, decay_steps=s, decay_rate=0.1)
optimizer = keras.optimizers.SGD(learning_rate)
```

## Avoiding Overfitting Through Regularization

- L1 & L2 Regularization:
  - `layer = keras.layers.Dense(..., kernel_regularizer=keras.regularizers.l2(0.01))`: Apply L2 regularization to a Keras layer’s connection weights
  - `keras.regularizers.l1_l2()`: Apply both L1 & L2 regularization
- Dropout:
  - In Dropout, "dropping" a neuron means its output is temporarily forced to zero for a single training step
  - Since the output is zero, it’s as if the neuron (and all its outgoing connections) doesn't exist for that specific pass
  - It happens at every training step (every batch), not the whole epoch
  - Every neuron (including the input neurons, but always excluding the output neurons) has a probability $p$ of being temporarily “dropped out"
    - Dropout rate: Its the hyperparameter $p$ and it is typically set to 50%
  - During backpropagation, no gradient flows through a zeroed-out neuron, so its weights are not updated for that step
  - #1 Idea behind dropout: Imagine a 5-person team working on a project:
    - Without Dropout: One "superstar" does all the work, and the other four just sit back. If the superstar gets sick (noisy data), the project fails
    - With Dropout: Every day, two random people do not work. To get the project done, everyone has to learn the skills. You end up with a robust team where no one is indispensable
  - #2 Idea behind dropout: Ensemble Power similar to Random Forest:
    - Since each neuron can be either present or absent, there is a total of $2^N$ possible networks (where $N$ is the total number of droppable neurons)
    - These NN are obviously not independent since they share many of their weights, but they are nevertheless all different
    - The resulting NN can be seen as an averaging ensemble of all these smaller neural networks
  - Testing vs. Training:
    - After training, neurons don’t get dropped anymore
    - Problem:
      - During training, 50% ($p$=0.5) of neurons are "off," so a neuron only receives half the usual signals
      - At testing, all neurons are "on," meaning the signal suddenly doubles in strength, confusing the model
    - Fix 1(Post Training): To balance this, you scale the weights down by 0.5 ($(1-p)$ called as "keep probability") so the total incoming signal matches what the model "expects"
    - Fix 2(During Training): Modern frameworks usually divide the neuron's outputs by 0.5 (keep probability) during training instead
  - Overfitting:
    - Since dropout is only active during training, the training loss is penalized compared to the validation loss, so comparing the two can be misleading
    - `with keras.backend.learning_phase_scope(1): fit(...)`: this will force dropout to be active during both training and validation (Specific to `tf.keras`)
    - Increase dropout rate if model is overfitting. Conversely, decrease dropout rate if model underfit
    - It can also help to increase the dropout rate for large layers, and reduce it for small ones
    - Many state-of-the-art architectures only use dropout after the last hidden layer, so you may want to try this if full dropout is too strong
  - NOTE: for self-normalizing network, use **AlphaDropout**: this is a variant of dropout that preserves the mean and standard deviation of its inputs

```py title='dropout'
# Use keras.layers.Dropout layer
# During training, it randomly drops some "inputs" (setting them to 0) and divides the remaining inputs by the keep probability
# After training, it does nothing at all, it just passes the inputs to the next layer
# Following code applies dropout regularization before every Dense layer, using a dropout rate of 0.2
model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    keras.layers.Dropout(rate=0.2), # drops neurons from the Flatten layer
    keras.layers.Dense(300, activation="elu", kernel_initializer="he_normal"),
    keras.layers.Dropout(rate=0.2),
    keras.layers.Dense(100, activation="elu", kernel_initializer="he_normal"),
    keras.layers.Dropout(rate=0.2),
    keras.layers.Dense(10, activation="softmax")
])
```

## Misc:

- A sparse model is a machine learning system where most of the internal parameters (weights) or connections are exactly **zero**
- L1 & L2 Regularization:
  - $\lambda$: The regularization parameter (hyperparameter) that controls the strength of the penalty
  - $w_j$: The individual weight (coefficient) of the model
  - $\text{Loss}(y, \hat{y})$: The standard cost/loss function, such as Mean Squared Error (MSE)
  - L1 Regularization (Lasso):
    - L1 adds the sum of the absolute values of the weights to the cost/error function
    - This often results in "sparse" models where some weights become exactly zero
    - Equation: $J(\theta) = \text{Loss}(y, \hat{y}) + \lambda \sum_{j=1}^{n} |w_j|$
  - L2 Regularization (Ridge):
    - L2 adds the sum of the squared values of the weights
    - This keeps weights small but rarely forces them to zero, leading to a more evenly distributed contribution from all features
    - Equation: $J(\theta) = \text{Loss}(y, \hat{y}) + \lambda \sum_{j=1}^{n} w_j^2$

```py title='refactor using partial'
from functools import partial

RegularizedDense = partial( # specifying common hyperparameter for Dense class
    keras.layers.Dense,
    activation="elu",
    kernel_initializer="he_normal",
    kernel_regularizer=keras.regularizers.l2(0.01),
)
model = keras.models.Sequential(
    [
        keras.layers.Flatten(input_shape=[28, 28]),
        RegularizedDense(300),
        RegularizedDense(100),
        RegularizedDense(10, activation="softmax", kernel_initializer="glorot_uniform"),
    ]
)
```
