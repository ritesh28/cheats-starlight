---
title: PyTorch
---

![PyTorch Image](./pytorch.drawio.svg)

## Tensor Basics

```py title="Version-&-Cuda"
import torch
torch.__version__ # '2.0.1'
torch.cuda.is_available() # CUDA (GPU) support

if torch.cuda.is_available():
    device = torch.device("cuda")
    x = torch.ones(5, device=device)
    # OR
    y = torch.ones(5)
    y = y.to(device)
    # Changing to CPU
    y = y.to("cpu")
```

```py title="Initialize"
torch.tensor([3, 5, 4])  # tensor([3, 5, 4])
torch.arange(0, 9).reshape((3, 3))  # tensor([[0, 1, 2], [3, 4, 5], [6, 7, 8]])

# Value
torch.empty(3)  # tensor([0., 0., 0.])
torch.empty(2, 3)  # 2D
torch.rand(3)  # tensor([0.4373, 0.1261, 0.1981])
torch.ones(4)  # tensor([1., 1., 1., 1.])
torch.zeros(4)  # tensor([0., 0., 0., 0.])
```

```py title="Data Type"
torch.ones(3).dtype  # (DEFAULT) torch.float32
torch.ones(3, dtype=torch.int)  # Explicit. tensor([1, 1, 1], dtype=torch.int32)
```

```py title="Shape-Size"
torch.tensor(1).shape  # torch.Size([])
torch.tensor([1, 2]).shape  # torch.Size([2])
torch.tensor([[1, 2], [3, 4]]).shape  # torch.Size([2, 2])
torch.ones(3, 4, 2).size()  # torch.Size([3, 4, 2])
```

```py title="Operation"
x = torch.tensor([1, 2, 3])
y = torch.tensor([7, 8, 9])
x + y  # Same as torch.add(x, y). tensor([ 8, 10, 12])
y.add_(x)  # will modify (inplace operation) and return 'y'
torch.empty(4) == torch.zeros(4)  # tensor([True, True, True, True])
```

```py title="Slicing"
torch.arange(0, 9).reshape((3, 3))[0]  # Same as '[0, :]'. First row. tensor([0, 1, 2])
torch.arange(0, 9).reshape((3, 3))[:, 0]  # First column. tensor([0, 3, 6])
torch.arange(0, 9).reshape((3, 3))[1, 1]  # tensor(4). Tensor with one value
torch.tensor([[4]]).item()  # 4. 'item' first convert value to Scalar
```

```py title="View-Reshape"
x = torch.ones(3, 4)
x.view(12)  # tensor([1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.])
x.view(-1, 6)  # use -1 for PyTorch to infer that dimension
torch.arange(0, 9).view((3, 3))[:, 0]
```

```py title="Non-contiguous tensor"
a = torch.arange(6).reshape(2, 3)
b = a.T
b.is_contiguous()  # False
```

```py title="Numpy & PyTorch"
# pytorch -> numpy
a = torch.arange(6).reshape(2, 3)
b = a.numpy() # type(b): numpy.ndarray
# If the PyTorch using CPU, 'a' & 'b' will share same memory space
a.add_(6)
b  # Modified. array([[ 6,  7,  8], [ 9, 10, 11]])

# numpy -> pytorch
a = np.ones(5)
b = torch.from_numpy(a)  # tensor([1., 1., 1., 1., 1.], dtype=torch.float64)
a += 2
b  # Modified. tensor([3., 3., 3., 3., 3.], dtype=torch.float64)
```

## Gradient Calculation With Autograd

```py title="Basic Grad"
a = torch.tensor(
    1.0, requires_grad=True
)  # Only Tensors of floating point and complex dtype can require gradients. Thats why '1.0'
# requires_grad=True: it tells PyTorch's autograd engine to start tracking all operations on this tensor.
# The goal is to calculate the gradient of some final value with respect to this starting value (a).
b = a**2  # tensor(1., grad_fn=<PowBackward0>)
c = 5 * b  # tensor(5., grad_fn=<MulBackward0>)
c.backward()
# This is the back-propagation step.
# When you call .backward() on a tensor, PyTorch calculates the gradients of that tensor with respect to all the "leaf" tensors that have requires_grad=True.
# How the gradient is calculated: PyTorch uses the chain rule of calculus to compute the final gradient.
# 1. The first step is to compute the gradient of c with respect to b: c=5b => dc/db=5
# 2. Next, compute the gradient of b with respect to a: b=a^2 => db/da=2a
# 3. Finally, apply the chain rule to find the gradient of c with respect to a: dc/da=(dc/db)*(db/da); dc/da=10a
# 4. Since the initial value of a is 1, the final gradient is 10*1=10
a.grad  # tensor(10.)
```

```py title="Error"
# requires_grad=False
a = torch.tensor(1.0, requires_grad=False)
b = a**2
b.backward() # RuntimeError: element 0 of tensors does not require grad and does not have a grad_fn

# Non-scalar value
a = torch.tensor([1.0, 1.0], requires_grad=True)
b = a**2
b.backward()  # RuntimeError: grad can be implicitly created only for scalar outputs
```

```py title="Non-Scalar"
x = torch.rand(
    3, requires_grad=True
)  # tensor([0.9011, 0.9410, 0.5830], requires_grad=True)
y = x + 2  # tensor([2.9011, 2.9410, 2.5830], grad_fn=<AddBackward0>)
v = torch.tensor([0.1, 0.1, 0.001])
y.backward(v) # pass a tensor
# backward throws error if mismatch in shape for any 'leaf' tensor
x.grad  # tensor([0.1000, 0.1000, 0.0010])
```

```py title="Prevent-Gradient-History"
# requires_grad_()
x = torch.rand(3, requires_grad=True)
x.requires_grad_(False)  # In-place operation. tensor([0.1011, 0.3622, 0.5896])

# detach()
x = torch.rand(3, requires_grad=True)
y = x.detach()
y  # tensor([0.1011, 0.3622, 0.5896])

# with torch.no_grad()
x = torch.rand(3, requires_grad=True)
with torch.no_grad():
    y = x + 2
    print(y)  # tensor([2.2192, 2.4610, 2.4645])
```

```py title='Reset-Grad'
weights = torch.ones(4, requires_grad=True)
for epoch in range(3):
    model_output = (weights * 3).sum()
    model_output.backward()
    print(weights.grad)  # always prints 'tensor([3., 3., 3., 3.])'
    weights.grad.zero_()  # reset the grads for next backward()
```

## Gradient Descent Algo

```py title="Manual Approach"
# formula: Y = 2*X
X = np.array([1, 2, 3, 4], dtype=np.float32)
Y = np.array([2, 4, 6, 8], dtype=np.float32)

w = 0.0  # initial weight


# model prediction
def forward(x):
    return w * x


# loss function - Mean Squared Error (MSE)
def loss(y, y_predicted):
    return ((y_predicted - y) ** 2).mean()


# gradient
def gradient(x, y, y_predicted):
    return np.dot(2 * x, y_predicted - y).mean()


print(f"Prediction before training: f(5) = {forward(5):.3f}")

# training
learning_rate = 0.01
n_iters = 20
for epoch in range(n_iters):
    y_pred = forward(X)
    l = loss(Y, y_pred)
    dw = gradient(X, Y, y_pred)
    w -= learning_rate * dw  # update weight
    if epoch % 2 == 0:
        print(f"Epoch {epoch+1}: w = {w:.3f}, loss = {l:.8f}")

print(f"Prediction after training: f(5) = {forward(5):.3f}")

# O/P =>
# Prediction before training: f(5) = 0.000
# Epoch 1: w = 1.200, loss = 30.00000000
# Epoch 3: w = 1.872, loss = 0.76800019
# Epoch 5: w = 1.980, loss = 0.01966083
# Epoch 7: w = 1.997, loss = 0.00050332
# Epoch 9: w = 1.999, loss = 0.00001288
# Epoch 11: w = 2.000, loss = 0.00000033
# Epoch 13: w = 2.000, loss = 0.00000001
# Epoch 15: w = 2.000, loss = 0.00000000
# Epoch 17: w = 2.000, loss = 0.00000000
# Epoch 19: w = 2.000, loss = 0.00000000
# Prediction after training: f(5) = 10.000
```

```py title="Training Pipeline"
import torch
import torch.nn as nn

# formula: Y = 2*X
X = torch.tensor([[1], [2], [3], [4]], dtype=torch.float32)
Y = torch.tensor([[2], [4], [6], [8]], dtype=torch.float32)

X_test = torch.tensor([5], dtype=torch.float32)

n_samples, n_features = X.shape
print(f"Number of samples: {n_samples}, number of features: {n_features}")

input_size = n_features
output_size = n_features
model = nn.Linear(input_size, output_size)

print(f"Prediction before training: f(5) = {model(X_test).item():.3f}")

# training
learning_rate = 0.01
n_iters = 100
loss = nn.MSELoss()  # mean square error
optimizer = torch.optim.SGD(
    model.parameters(), lr=learning_rate
)  # stochastic gradient descent

for epoch in range(n_iters):
    y_pred = model(X)
    l = loss(Y, y_pred)
    l.backward()  # compute gradients: dl/dw
    optimizer.step()  # update weight
    optimizer.zero_grad()  # zero gradients
    if epoch % 10 == 0:
        [w, b] = model.parameters()
        print(f"Epoch {epoch+1}: w = {w[0][0].item():.3f}, loss = {l:.8f}")

print(f"Prediction after training: f(5) = {model(X_test).item():.3f}")
```
