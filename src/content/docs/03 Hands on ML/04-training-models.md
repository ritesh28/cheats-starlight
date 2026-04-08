---
title: Training Models
---

## Gradient Descent

- Gradient Descent is an **optimization** algorithm used to minimize a cost function (error) by finding the optimal parameters **iteratively** for a model
- Steps:
  1. Start with a random initial value
  2. Measures gradient at that value
  3. Move in the direction of descending gradient. The distance you move is controlled by learning rate ($\eta$)
  4. Repeat step 2 & 3 til the gradient is zero. At this point, stop since the minimum point of the function is reached
- The Gradient: The Direction:
  - Gradient ($\nabla$) represents multi-variable change. It is a vector (list) containing all the first-order partial derivatives of a function
  - A first-order partial derivative measures how a function changes when you move along only one axis, keeping all other variables constant
    - If $f(x,y)=3x^2+2xy+y^3$, then to find partial derivative with respect to $x$ ($\frac{\partial f}{\partial x}$) treat $y$ as a constant
    - $\frac{\partial f}{\partial x} = 6x+2y$
    - Its called "first-order" because you only derived it once. If you took the derivative of the result again, it would be second-order (which tells the curvature of slope)
  - Calculation: For a cost function $J$ with parameters $\theta$, the gradient is: $\nabla J(\theta)=\begin{bmatrix}\frac{\partial J}{\partial \theta_0}, \frac{\partial J}{\partial \theta_1} \cdots \frac{\partial J}{\partial \theta_n}\end{bmatrix}$
- The Descent: The Action:
  - Descent refers to the process of moving in the **opposite direction** of the gradient to reach the minimum point of the function
  - Calculation: This movement is controlled by learning rate ($\eta$), which determines the size of each step taken downward: $\theta_{new}=\theta_{old} - \eta\times\nabla J(\theta)$
- Learning Rate:
  - If the learning rate is too small, then the algorithm will have to go through many iterations to **converge**, which will take a long time
  - If the learning rate is too high, you might jump across the valley and end up on the other side, possibly even higher up than you were before
    - This might make the algorithm **diverge**, with larger and larger values, failing to find a good solution
- Challenges:
  1. Curve should be smooth, or else will have abrupt change in gradient at the pointy edge
  2. Challenge to distinguish local minima and global minima
  3. If the curve is plateau-like (low slope). Algorithm will take a very long time to cross the plateau
- NOTE: When using Gradient Descent, ensure that all features have a similar scale (use `StandardScaler`), or else it will take much longer to converge
- Training a model means searching for a combination of model parameters that minimizes a cost function (over the training set)
- MSE cost function for a Linear Regression model happens to be a convex function - no local minima and no sharp edge. Good candidate for gradient descent
- Number of epochs: set very large number of epoch but interrupt the algorithm when gradient vector becomes smaller than a tiny number $\epsilon$ (tolerance)
- 3 Variants: The primary difference is the amount of data used to calculate the gradient for each update/step of the model's parameter
  - | feature          | Batch Gradient Descent | Stochastic Gradient Descent (SGD)   | Mini-batch Gradient Descent                          |
    | ---------------- | ---------------------- | ----------------------------------- | ---------------------------------------------------- |
    | data per update  | entire dataset         | 1 single random (stochastic) sample | Small subset (typically 32, or higher multiple of 2) |
    | Update Frequency | Once per epoch         | Many times per epoch                | Multiple times per epoch                             |
    | Convergence      | Smooth and stable      | Noisy and erratic (zigzag)          | Balanced; smoother than SGD                          |
    | Speed/Efficiency | Slow for large data    | Very fast; memory efficient         | Fast; uses GPU parallelism                           |
    | Local Minima     | May get stuck          | Can escape them easily              | Balanced exploration                                 |
- Learning schedule:
  - Its a function that determines the learning rate at each epoch
  - To reach minima quickly, we gradually reduce the learning rate
  - Start out large (which helps make quick progress and escape local minima), then get smaller and smaller, allowing the algorithm to settle at the global minimum

```py title='sgd'
# runs for maximum 1,000 epochs or until the loss drops by less than 0.001 during one epoch
# starts with a learning rate of 0.1 using the default learning schedule
# does not use any regularization
from sklearn.linear_model import SGDRegressor
sgd_reg = SGDRegressor(max_iter=1000, tol=1e-3, penalty=None, eta0=0.1)
sgd_reg.fit(X, y.ravel())
```
