---
title: NumPy
---

- NumPy (Numerical Python) provides an efficient interface to store and operate on dense data arrays
- Numpy is fast because its written in C and is strictly typed i.e. all items in the array has a same type and its defined
- `ndarray`: Numpy Data Array object: fixed size, homogeneous (same type)
  - when creating - if types do not match, numpy will upcast if possible (e.g. integers are casted to floats)
  - when updating - numpy will downcast without raising any warning (e.g. floating value is truncated in an integer array)
- Shape: tuple of Dimension/Axis
  - `Shape(a,b,c,d)`: array has 'a' items. Each 'a' item has 'b' items. Each 'b' item has 'c' items. And so on
  - 2D: `Shape(row,column)`. Special case
  - 1D: `np.array([1, 2, 3, 4])`
- Slicing:
  - Similar syntax to the python list. Negative step value: Reverse the start and stop value
  - Unlike python list, array slice return "views" rather than "copies" of the array data. This means that if we modify sub-array, then the original array will change
  - `x2[:2, :2].copy()`: This creates copy rather than a view
- Reshaping: Change the shape. Rule: initial array size = reshaped size
- Concatenation: Rule: all dimensions except for the concatenation axis must match exactly. By default, concatenation happens along first axis (axis=0) i.e. (2,3) + (2,3) = (4,3)
- Splitting: `np.split(x, [a,b..n])` returns N+1 subarrays - [[0 to a-1], [a to b-1], ...[n to last item]]
- Computation with uFunc (Universal Function)
  - Vectorized operation: Simply perform operation via uFunc on array, which will then be applied to each element. They are fast
  - Example: `x + 5` -> '+' operator is a wrapper round `np.add()`
- Aggregate
  - By default, aggregation is calculated over entire array (mental picture: Array is flattened before aggregation computation)
  - Metal picture when 'axis' keyword is present: 'axis' specifies the dimension that will be collapsed, rather than the dimension that will be returned
  - `x.min(axis=0)`: minimum value within each column; `x.min(axis=1)`: minimum value within each row
- Boolean Data type: First create a mask and then count or modify True values
  - Comparison Operators (Creating the Mask): comparison operators (<, >, <=, >=, ==, !=) returns a Boolean array of the exact same shape
  - Boolean Masking (Filtering the Data): `data[mask]` returns only the elements corresponding to True in 1D shape
- Fancy Indexing: we pass arrays of indices (instead of single value), allowing to quickly access and modify values
  - `arr[1D array or multi-D array]`
  - Shape of the result reflects the broadcasted shape of the index arrays rather than the shape of the array being indexed
  - NOTE: When modifying value, repeated indices (e.g. `1Darr[[1,1]]`) can cause some potentially unexpected result
- Sort: can sort in-place (`x.sort()`), can sort without modifying input (`np.sort(x)`), can partial sort
  - when 'axis' is present, follow same mental picture as of aggregation
- Broadcasting: Set of rules for binary computation on arrays of different sizes. Rules:
  1. Number of dimensions differ: shape of array with fewer dimensions is padded with '1' on its left side. E.g. (2, 3) & (3,) stretches/broadcast to (2, 3) & (1, 3)
  2. Dimension size differ: array with shape equal to 1 in that dimension is stretched to match the other shape. E.g. (1, 3) & (3, 1) stretches/broadcast to (3, 3) & (3, 3)
  3. If in any dimension the sizes disagree and neither is equal to 1, an error is raised. E.g. (3, 2) & (3, 3) -> Error

## Array Basics - Create

| Task to perform                                    | Syntax                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| from list                                          | `np.array([1,2,3,4], dtype=np.float32)`                                                  |
| filled with 0s                                     | `np.zeros(10)` or `np.zeros((10,))` 1Dimension. `(10,)`(1D) & `(10,1)`(2D) are different |
| filled with 3.14                                   | `np.full((3,5), 3.14)`                                                                   |
| linear sequence                                    | `np.arange(0,20,2)`. Similar to python `range()`                                         |
| 5 values evenly spaced between 0 and 1 (including) | `np.linspace(0,1,5)`                                                                     |
| uniformly distributed values between 0 & 1         | `np.random.random((3,3))`                                                                |
| random integers between 0 & 10 (excluding)         | `np.random.randint((0,10,(3,3)))`                                                        |
| generate same random numbers                       | `np.random.seed(0)` or `np.random.randomState(seed).rndint()`                            |
| chose 3 random values from a list with no repeat   | `np.random.choice([10, 20, 30, 40, 50], 3, replace=False)`                               |

## Array Basics - Attributes

| Attribute              | Syntax                           |
| ---------------------- | -------------------------------- |
| number of dimension    | `<obj>.ndim`                     |
| size of each dimension | `<obj>.shape`. Result is a tuple |
| total size             | `<obj>.size`                     |
| data type              | `<obj>.dtype`                    |

## Array Basics - Accessing

| Type of access              | Syntax                                   |
| --------------------------- | ---------------------------------------- |
| 1D - access single item     | `x1[0]`. Allows negative indices as well |
| multi-D - access singe item | `x2[0,0]`                                |
| 1D - slicing                | `x[start:stop:step]`                     |
| multi-D - slicing           | `x2[:2, :3]`. Slice for each dimension   |
| 2D - access column          | `x2[:, 0]`: first column                 |
| 2D - access row             | `x2[0, :]` or `x2[0]`: first row         |

## Array Basics - Manipulation

| Task                            | Syntax                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Reshaping                       | `np.arange(1, 10).reshape((3, 3))`                                                               |
| `newaxis` keyword               | Adds new dimension with size 1. E.x. `X.shape => (3, 2); X[:, np.newaxis, :].shape => (3, 1, 2)` |
| Reshaping via `newaxis` keyword | `<arr>[np.newaxis, :]` or `<arr>.reshape((1, 3))`. Row vector                                    |
| Flatten multi-D to 1D           | `xx.ravel()`. Shape: `(20, 20) -> (400,)`                                                        |
| Concatenation                   | `np.concatenation(list_of_arrays, axis=zero_indexed_axis)`. Default Axis = 0                     |
| Vertical stack                  | `np.vstack(list_of_arrays)`. Concatenation along first axis                                      |
| Horizontal stack                | `np.hstack(list_of_arrays)`. Concatenation along second axis                                     |
| Splitting                       | `np.split(array, list_of_split_indices)`. Split along first axis                                 |
| Vertical split                  | `np.vsplit(array, list_of_split_indices)`. Split along first axis                                |
| Horizontal split                | `np.hsplit(array, list_of_split_indices)`. Split along second axis                               |

```py title="Concatenation"
grid = np.array(
    [
        [1, 2, 3],
        [4, 5, 6],
    ]
)  # 2x3 array
g1 = np.concatenate([grid, grid], axis=0)  # along first axis, default
# shape: (4, 3)
# array([[1, 2, 3],
#        [4, 5, 6],
#        [1, 2, 3],
#        [4, 5, 6]])
g2 = np.concatenate([grid, grid], axis=1)  # along second axis
# shape: (2, 6)
# array([[1, 2, 3, 1, 2, 3],
#        [4, 5, 6, 4, 5, 6]])
```

## Computation on NumPy Arrays: Universal Functions (uFunc)

| Task                   | Syntax                                                                    |
| ---------------------- | ------------------------------------------------------------------------- |
| unary uFunc            | `x / 2` or `-x`                                                           |
| binary uFunc           | `x / y`. Both must be of same shape or else broadcasting happens          |
| specifying output      | `np.multiply(x, 10, out=y[::2])`                                          |
| aggregate - sum        | `x.sum()`(preferred) or `np.add.reduce(x)` or `np.sum(x)`                 |
| aggregate - accumulate | `np.cumsum(x)`(preferred). E.g. `np.cumsum([1, 2, 3, 4]) # [1, 3, 6, 10]` |
| aggregate - min        | `x.min()`(preferred) or `np.min(x)`                                       |
| aggregate - get index  | `np.argmin(x)`, `np.argmax(x)`                                            |
| aggregate - ignore NaN | `np.nan*()`. NaN-safe counterpart that ignore missing values              |

## Boolean Data type - Comparison & Masking

| Task                                  | Syntax                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| comparison - less than                | `x < 3` or `np.less(x, 3)` O/P-> `array([ True, True, False], dtype=bool)`                 |
| comparison - not equal                | `x != 3` or `np.not_equal(x, 3)`                                                           |
| bool array - count `True` entries     | `np.sum(x < 6)`(preferred). False -> 0 & True -> 1                                         |
| bool array - count `True` in each row | `np.sum(x < 6, axis=1)`                                                                    |
| bool array - any, all                 | `np.any(x > 8, axis=1)`, `np.all(x < 10)`                                                  |
| bool array - bitwise logic operator   | `np.sum((inches > 0.5) & (inches < 1))`. Between 0.5 & 1.0 inches. uFunc: `np.bitwise_and` |

```py title='Multiple Condition'
arr = np.array([5, 12, 18, 25, 30])

# Select numbers between 10 and 26
complex_mask = (arr >= 10) & (arr <= 26)

print(arr[complex_mask])
# Output: [12 18 25]
```

## Fancy Indexing

```py title='1D'
x = np.array([51, 92, 14, 71, 60, 20, 82, 86, 74, 74], dtype=np.int32)

ind_1d = [3, 7, 4]
print(x[ind_1d])  # [71, 86, 60]

ind_2d = np.array([[3, 7], [4, 5]])
print(x[ind_2d])
# [[71 86]
#  [60 20]]
```

```py title='2D'
X = np.arange(12).reshape((3, 4))
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9  10 11]]

row = np.array([0, 1, 2])
col = np.array([2, 1, 3])
print(X[row, col])  # [ 2  5 11]

print(X[row[:, np.newaxis], col])  # broadcasting
# shape[(3,1), (3,)] -> [(3,1), (1,3)] -> [(3,3), (3,3)]
# [[ 2  1  3]
#  [ 6  5  7]
#  [10  9 11]]
```

```py title='Combing Indexing'
X = np.arange(12).reshape((3, 4))
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9  10 11]]

# combine fancy and simple indices
print(X[2, [2, 0, 1]])  # broadcast to [2, 2, 2], [2, 0, 1]
# O/P => [10  8  9]

# combine fancy indexing with slicing
X[1:, [2, 0, 1]]  # fancy indexing happens on slicing array
# O/P => [[ 6  4  5]
#          [10  8  9]]

# combine fancy indexing with masking
mask = np.array([1, 0, 1, 0], dtype=bool)
row = np.array([0, 1, 2])
X[row[:, np.newaxis], mask]  # return entries where mask is True
# O/P => [[ 0  2]
#          [ 4  6]
#          [ 8 10]]
```

```py title='Modifying values'
x = np.arange(10)
i = np.array([2, 1, 8, 4])
x[i] -= 10
print(x)  # [ 0 -9 -8  3 -6  5  6  7 -2  9]

# NOTE: repeated indices can cause some potentially unexpected results (AVOID IT)
# EXAMPLE #1
x = np.zeros(10)
x[[0, 0]] = [4, 6]
print(x)  # [ 6. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
# Where did the 4 go? The result of this operation is to first assign x[0] = 4, followed by x[0] = 6.

# EXAMPLE #2
i = [2, 3, 3, 4, 4, 4]
x[i] += 1
print(x)  # [6. 0. 1. 1. 1. 0. 0. 0. 0. 0.]
# REASON: x[i] + 1 is evaluated, and then the result is assigned to the indices in x

# To get around this problem, you can use np.add.at, which performs **in-place** operation on specified indices:
x = np.zeros(10)
np.add.at(x, i, 1)
print(x)  # [0. 0. 1. 2. 3. 0. 0. 0. 0. 0.]
```

## Sorting & Partitioning

| Syntax               | Purpose                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `np.sort(x)`         | sort without modifying the input                                                                              |
| `x.sort()`           | sort the array **in-place**                                                                                   |
| `np.argsort(x)`      | returns the indices of the sorted elements                                                                    |
| `np.sort(X, axis=0)` | sort each column of X. `axis=0` collapses row                                                                 |
| `np.partition(x, 3)` | first three values in the resulting array are the three smallest. Items in both subset are arranged arbitrary |

## Misc

| Syntax                                                              | Usage                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `np.array([[[1], [2], [3]], [[4], [5], [6]]]).reshape(1, -1).shape` | (1, 6). Reshape the array to have 1 row and as many columns as needed                       |
| `np.percentile(np.arange(101), q=[25, 50, 75])`                     | Returns the q-th percentile(s) of the array elements                                        |
| `np.where(a < 5, a, 10*a)`                                          | Returns array with elements with `a` if `a < 5` or `10*a`                                   |
| `counts, bin_edges = np.histogram(data, bins=4)`                    | Compute the histogram of a dataset                                                          |
| `X, Y = np.meshgrid(x, y)`                                          | Takes 1D array (representing axes) and returns 2 2D array used to create a rectangular grid |

```py title='meshgrid'
x = np.array([1, 2, 3])
y = np.array([4, 5])

X, Y = np.meshgrid(x, y)
# X: [[1 2 3] [1 2 3]] => contains copies of the x-values repeated for each y-value. DUPLICATE ROW
# Y: [[4 4 4] [5 5 5]] => contains copies of the y-values repeated for each x-value. DUPLICATE COLUMN

# ==== PARAMETER
# indexing='xy': This decides how the grid is arranged. 'xy': Standard Cartesian coordinate system (DEFAULT)
# sparse=False: By default, this creates a full grid. If set to True, it’ll generate a compact grid to save memory (helpful for large arrays)
# copy=True: This ensures that the output is a separate copy of the data, not just a reference
```
