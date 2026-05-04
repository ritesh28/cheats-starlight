## TODO examples (REMOVE LATER)

- https://www.tensorflow.org/hub/tutorials
- https://github.com/tensorflow/models/
- https://github.com/jtoy/awesome-tensorflow

## TensorFlow

- TensorFlow is a library for heavy numerical computation. Its well suited and fine-tuned for Machine Learning
- Core modules:
  - `tf.keras`: implementing keras api
  - `tf.data`, `tf.io`: data loading and preprocessing
  - `tf.image`: image processing
  - `tf.nn`, `tf.rnn`, `tf.train`: low-level deep learning api
  - `tf.sparse`: contains operations for sparse tensors (`tf.SparseTensor` data structure)
- Many TensorFlow operations have multiple implementations, called **kernels**:
  - Each kernel is dedicated to a specific device type, such as CPUs, GPUs, or TPUs (Tensor Processing Units)
  - GPUs speed up computations by splitting computations into many smaller chunks and running them in parallel across many GPU threads
  - TPUs are even faster
- A tensor is a multidimensional array (exactly like a **NumPy ndarray**), but it can also hold a scalar (a simple value, such as 42)
- Tensor Operation:
  - `t + 10` is equivalent to calling `tf.add(t, 10)`
  - `tf.square(t)`
  - `t @ tf.transpose(t)`: `@` -> matrix multiplication. Equivalent to calling `tf.matmul()`. `<tf.Tensor: shape=(2, 2), dtype=float32, numpy=array(...)>`
  - Many functions & classes have aliases to organize modules properly. E.g. `tf.add()` & `tf.math.add()` are same function
    - Notable Exception: We have `tf.math.log()` but no `tf.log()` alias (as it might be confused with logging)
  - Sometime function names are different for TensorFlow & NumPy. When the name differs, there is often a good reason for it. For e.x.:
    - `tf.transpose(t)` creates a new tensor with its own copy of the transposed data, while `np.T()` is just a transposed view on the same data
    - `tf.reduce_sum()` is named this way because its GPU kernel (GPU implementation) uses a reduce algorithm that does not guarantee the order in which the elements are added
  - Keras’ Low-Level API:
    - Keras API actually has its own low-level API, located in `keras.backend`
    - It includes functions like `square()`, `exp()`. In `tf.keras`, these functions just call the corresponding TensorFlow operations
    - If you want to write code that will be portable to other Keras implementations, you should use these Keras functions
    - `from tensorflow import keras; K = keras.backend; K.square(K.transpose(t)) + 10`
  - NOTE:
    - For better performance, always use a vectorized implementation
    - If you want to benefit from TensorFlow’s graph features, you should use only TensorFlow operations
- Tensor Type Conversions:
  - Type conversions can significantly hurt performance, and they can easily go unnoticed when they are done automatically
  - To avoid this, TensorFlow does not perform any type conversions automatically: it raises exception if you try to execute an operation on tensors with incompatible types
  - `tf.constant(2.) + tf.constant(40)`: raises error
  - `tf.constant(2.) + tf.constant(40., dtype=tf.float64)`: raises error since TensorFlow uses 32-bit by default
  - `tf.cast(t2, tf.float32)`: convert type manually
- Tensor Variables:
  - `tf.constant()` (SmallCase 'c'): as the name suggests, you cannot modify them
  - `tf.Variable` (CapitalCase 'V'): its a data structure (another e.x: `tf.SparseTensor`) which can be modified:
    - In-place modification: use `assign()` (or `assign_add()` or `assign_sub()` which increment or decrement the variable by the given value)
    - Modify individual cells (or slices): use `assign()`, `scatter_update()`, `scatter_nd_update()`. NOTE: direct item assignment will not work

```py title='tensor creation & indexing'
import tensorflow as tf

## CREATE
t = tf.constant(42)  # scalar. <tf.Tensor: shape=(), dtype=int32, numpy=42>. No shape
t = tf.constant([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])  # matrix. <tf.Tensor: shape=(2, 3), dtype=float32, numpy=array(...)>

## TENSORS AND NUMPY
# Tensors play nice with NumPy: create tensor from NumPy array, and vice versa, and apply TensorFlow operations to NumPy arrays and vice versa
a = np.array([2.0, 4.0, 5.0])
t = tf.constant(a)  # <tf.Tensor: shape=(3,), dtype=float64, numpy=array([2., 4., 5.])>
t.numpy()  # or np.array(t). # array([2., 4., 5.])
tf.square(a)  # <tf.Tensor: shape=(3,), dtype=float64, numpy=array([ 4., 16., 25.])>
np.square(t)  # array([ 4., 16., 25.])
# NOTE:
# NumPy uses 64-bit precision by default, while TensorFlow uses 32-bit (reason: more than enough for NN, plus it runs faster and uses less RAM)
# When creating a tensor from a NumPy array, make sure to set dtype=tf.float32

## LIKE ndarray, tensor HAS A SHAPE AND A DATA TYPE
t.shape # TensorShape([2, 3])
t.dtype # tf.float32

## INDEXING: works much like in NumPy
t[:, 1:] # <tf.Tensor: shape=(2, 2), dtype=float32, numpy=array(...)>
t[:, 1] or t[..., 1] # column 1. <tf.Tensor: shape=(2,), dtype=float32, numpy=array([2., 5.], dtype=float32)>
t[..., 1, tf.newaxis] # newaxis adds a new dimension at the end of the shape of the tensor. <tf.Tensor: shape=(2, 1), dtype=float32, numpy=array([[2.],[5.]], dtype=float32)>
```

```py title='tensor variable'
v = tf.Variable([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]) # <tf.Variable 'Variable:0' shape=(2, 3) dtype=float32, numpy=array(...)>
v.assign(2 * v) # => [[2., 4., 6.], [8., 10., 12.]]
v[0, 1].assign(42) # => [[2., 42., 6.], [8., 10., 12.]]
v[:, 2].assign([0., 1.]) # => [[2., 42., 0.], [8., 10., 1.]]
v.scatter_nd_update(indices=[[0, 0], [1, 2]], updates=[100., 200.]) # => [[100., 42., 0.], [8., 10., 200.]]
```

## Saving and Loading Models That Contain Custom Components

- When saving, Keras just saves the name of the custom function. It does not even save the arguments/hyperparameter of the custom function
- When loading, you need to provide a dictionary that maps the function name to the actual function
- NOTE: the function name is the function referenced/returned and not the name of the function that created it (REFER CODE 'custom huber func')
- Use subclass & implement `get_config()` for model to save the arguments/hyperparameter (REFER CODE 'custom huber subclass')

## Custom Loss Functions

- MSE (mean squared error) disadvantage: MSE might penalize large errors too much, so your model will end up being imprecise
- MAE (mean absolute error) disadvantage: MAE would not penalize outliers as much, & training might take a while to converge & the trained model might not be very precise

```py title='custom huber func'
# For each batch during training, Keras will call the huber_fn() to compute the loss, and use it to perform a Gradient Descent step
# Also, Keras will keep track of the total loss since the beginning of the epoch, and it will display the mean loss
def create_huber(threshold=1.0):
  def huber_fn(y_true, y_pred):
    error = y_true - y_pred
    is_small_error = tf.abs(error) < threshold
    squared_loss = tf.square(error) / 2
    linear_loss = threshold * tf.abs(error) - threshold**2 / 2
    return tf.where(is_small_error, squared_loss, linear_loss) # return a tensor containing one loss per instance
  return huber_fn

model.compile(loss=create_huber(2.0), optimizer="nadam") # create_huber() returns huber_fn reference
model.fit(X_train, y_train, [...])

# LOADING MODEL
model = keras.models.load_model("my_model_with_a_custom_loss_threshold_2.h5", custom_objects={"huber_fn": create_huber(2.0)})
```

```py title='custom huber subclass'
from tensorflow import keras
class HuberLoss(keras.losses.Loss):
    def __init__(self, threshold=1.0, **kwargs):
        # kwargs handles the name and reduction parameters of the base Loss class
        # reduction algorithm specifies how to aggregate the individual instance losses across the batch
        # default is 'auto' which means 'sum_over_batch_size' (total loss divided by batch size)
        # other options include 'sum' (total loss) and 'none' (no reduction, return individual losses)
        self.threshold = threshold
        super().__init__(**kwargs)

    def call(self, y_true, y_pred):
        # takes labels and predictions, computes all the instance losses (per batch), and returns them
        error = y_true - y_pred
        is_small_error = tf.abs(error) < self.threshold
        squared_loss = tf.square(error) / 2
        linear_loss = self.threshold * tf.abs(error) - self.threshold**2 / 2
        return tf.where(is_small_error, squared_loss, linear_loss)

    def get_config(self):
        # returns a dictionary mapping each hyperparameter name to its value
        base_config = super().get_config()
        return {**base_config, "threshold": self.threshold}

model.compile(loss=HuberLoss(2.), optimizer="nadam")

# LOADING MODEL
model = keras.models.load_model("my_model_with_a_custom_loss_class.h5", custom_objects={"HuberLoss": HuberLoss})
# When saving, Keras calls the loss instance’s get_config() and saves the config as JSON in the HDF5 file
# When loading, Keras calls from_config() (implemented by base class (Loss)) and just creates an instance of the class, passing **config to the constructor
```

## Custom Activation Functions, Initializers, Regularizers, & Constraints
