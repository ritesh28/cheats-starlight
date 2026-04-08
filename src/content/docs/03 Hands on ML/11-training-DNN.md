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

## Solution 3: Batch Normalization

## Solution 4: Gradient Clipping
