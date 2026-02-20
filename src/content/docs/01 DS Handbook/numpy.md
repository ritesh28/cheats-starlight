---
title: NumPy
---

![NumPy Image](./numpy.drawio.svg)

## Array Basics - Create

| Task to perform                                    | Syntax                                                        |
| -------------------------------------------------- | ------------------------------------------------------------- |
| from list                                          | `np.array([1,2,3,4], dtype=np.float32)`                       |
| filled with 0s                                     | `np.zeros(10)` or `np.zeros((10,))` 1Dimension                |
| filled with 1s                                     | `np.ones((3,5), dtype=np.float)` 2Dimension                   |
| filled with 3.14                                   | `np.full((3,5), 3.14)`                                        |
| linear sequence                                    | `np.arange(0,20,2)` </br> similar to python `range()`         |
| 5 values evenly spaced between 0 and 1 (including) | `np.linspace(0,1,5)`                                          |
| uniformly distributed values between 0 & 1         | `np.random.random((3,3))`                                     |
| random integers between 0 & 10 (excluding)         | `np.random.randint((0,10,(3,3)))`                             |
| generate same random numbers                       | `np.random.seed(0)` or `np.random.randomState(seed).rndint()` |
| chose 3 random values from a list with no repeat   | `np.random.choice([10, 20, 30, 40, 50], 3, replace=False)`    |

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
| 1D - slicing                | `x[start:stop:step]`. SEE INFOGRAPHIC    |
| multi-D - slicing           | `x2[:2, :3]`. Slice for each dimension   |
| 2D - access column          | `x2[:, 0]`: first column                 |
| 2D - access row             | `x2[0, :]` or `x2[0]`: first row         |

## Array Basics - Manipulation

| Task                            | Syntax                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Reshaping                       | `np.arange(1, 10).reshape((3, 3))`                                                               |
| `newaxis` keyword               | Adds new dimension with size 1. E.x. `X.shape => (3, 2); X[:, np.newaxis, :].shape => (3, 1, 2)` |
| Reshaping via `newaxis` keyword | `<arr>[np.newaxis, :]` or `<arr>.reshape((1, 3))`. Row vector                                    |
| Concatenation                   | `np.concatenation(list_of_arrays, axis=zero_indexed_axis)`. SEE INFOGRAPHIC                      |
| Vertical stack                  | `np.vstack(list_of_arrays)`. Concatenation along first axis                                      |
| Horizontal stack                | `np.hstack(list_of_arrays)`. Concatenation along second axis                                     |
| Depth stack                     | `np.dstack(list_of_arrays)`. Concatenation along third axis                                      |
| Splitting                       | `np.split(array, list_of_split_indices)`. Split along first axis                                 |
| Vertical split                  | `np.vsplit(array, list_of_split_indices)`. Split along first axis                                |
| Horizontal split                | `np.hsplit(array, list_of_split_indices)`. Split along second axis                               |

```py title="concatenation.py
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

| Task                   | Syntax                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| unary uFunc            | `x / 2` or `-x`                                                  |
| binary uFunc           | `x / y`. Both must be of same shape or else broadcasting happens |
| specifying output      | `np.multiply(x, 10, out=y[::2])`                                 |
| aggregate - sum        | `x.sum()`(preferred) or `np.add.reduce(x)` or `np.sum(x)`        |
| aggregate - accumulate | `np.cumsum(x)`(preferred) or `np.add.accumulate(x)`              |
| aggregate - min        | `x.min()`(preferred) or `np.min(x)`                              |
| aggregate - get index  | `np.argmin(x)`, `np.argmax(x)`                                   |
| aggregate - ignore NaN | `np.nan*()`. NaN-safe counterpart that ignore missing values     |
| Multi-D Aggregation    | SEE INFOGRAPHIC                                                  |

## Boolean Data type - Comparison & Masking

| Task                                  | Syntax                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| comparison - less than                | `x < 3` or `np.less(x, 3)` O/P-> `array([ True, True, False], dtype=bool)`                 |
| comparison - not equal                | `x != 3` or `np.not_equal(x, 3)` O/P-> `array([ True, True, False], dtype=bool)`           |
| bool array - count `True` entries     | `np.count_nonzero(x < 6)` or `np.sum(x < 6)` (preferred). False -> 0 & True -> 1           |
| bool array - count `True` in each row | `np.sum(x < 6, axis=1)`                                                                    |
| bool array - any, all                 | `np.any(x > 8, axis=1)`, `np.all(x < 10)`                                                  |
| bool array - bitwise logic operator   | `np.sum((inches > 0.5) & (inches < 1))`. Between 0.5 & 1.0 inches. uFunc: `np.bitwise_and` |
| masking                               | `x[x < 5]`. O/P is 1D array                                                                |

```py title='Masking Operation'
rainy = inches > 0 # construct a mask of all rainy days
summer = (np.arange(365) - 172 < 90) & (np.arange(365) - 172 > 0) # construct a mask of all summer days (June 21st is the 172nd day)
print("Median precipitation on rainy days in 2014 (inches): ", np.median(inches[rainy]))
print("Median precipitation on summer days in 2014 (inches): ", np.median(inches[summer]))
print("Maximum precipitation on summer days in 2014 (inches): ", np.max(inches[summer]))
print(
    "Median precipitation on non-summer rainy days (inches):",
    np.median(inches[rainy & ~summer]),
)
# Median precipitation on rainy days in 2014 (inches): 0.194881889764
# Median precipitation on summer days in 2014 (inches): 0.0
# Maximum precipitation on summer days in 2014 (inches): 0.850393700787
# Median precipitation on non-summer rainy days (inches): 0.200787401575
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

row = np.array([0, 1, 2])
col = np.array([2, 1, 3])
print(X[row, col])  # [ 2  5 11]

print(X[row[:, np.newaxis], col])  # broadcasting
# [[ 2  1  3]
#  [ 6  5  7]
#  [10  9 11]]
```

```py title='Combing Indexing'
X = np.arange(12).reshape((3, 4))

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

# To get around this problem, you can use np.add.at, which performs in-place operation on specified indices:
x = np.zeros(10)
np.add.at(x, i, 1)
print(x)  # [0. 0. 1. 2. 3. 0. 0. 0. 0. 0.]
```

## Sorting & Partitioning

| Syntax                       | Purpose                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `np.sort`                    | by default, uses quick-sort algo (NlogN)                                                                      |
| `np.sort(x)`                 | sort without modifying the input                                                                              |
| `x.sort()`                   | sort the array in-place                                                                                       |
| `np.argsort(x)`              | returns the indices of the sorted elements                                                                    |
| `np.sort(X, axis=0)`         | sort each column of X. `axis=0` collapses row                                                                 |
| `np.partition(x, 3)`         | first three values in the resulting array are the three smallest. Items in both subset are arranged arbitrary |
| `np.partition(X, 2, axis=1)` | partition along an arbitrary axis of a multidimensional array                                                 |
| `np.argpartition()`          | computes indices of the partition                                                                             |

## Structured Data: USE Pandas

```py title="structured array"
# Categories
name = ["Alice", "Bob", "Cathy", "Doug"]
age = [25, 45, 37, 19]
weight = [55.0, 85.5, 68.0, 61.5]

# Use a compound data type for structured arrays
data = np.zeros(
    4, dtype={"names": ("name", "age", "weight"), "formats": ("U10", "i4", "f8")}
)
print(data.dtype)  # [('name', '<U10'), ('age', '<i4'), ('weight', '<f8')]
# 'U10' translates to “Unicode string of maximum length 10"
# 'i4' translates to “4-byte (i.e., 32 bit) integer”
# 'f8' translates to “8-byte (i.e., 64 bit) float”

# fill the structured array with data
data["name"] = name
data["age"] = age
data["weight"] = weight
print(data)
# [('Alice', 25, 55. ) ('Bob', 45, 85.5) ('Cathy', 37, 68. ) ('Doug', 19, 61.5)]

# Accessing fields
data["name"]  # Get all names
data[0]  # Get first row of data
data[-1]["name"]  # Get the name from the last row
data[data["age"] < 30]["name"]  # Get names where age is under 30
```
