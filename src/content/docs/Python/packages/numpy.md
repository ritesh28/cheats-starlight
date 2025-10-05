---
title: NumPy
---

## Create Array

| Task to perform                                                          | Syntax                                                |
| ------------------------------------------------------------------------ | ----------------------------------------------------- |
| create array from python list                                            | `np.array([1,2,3,4])`                                 |
| explicitly set data type of items                                        | `np.array([1,2,3,4], dtype=np.float32)`               |
| array of length 10 filled with 0s                                        | `np.zeros(10, dtype=np.int)`                          |
| 3x5 floating-point array filled with 1s                                  | `np.ones((3,5), dtype=np.float)`                      |
| 3x5 array filled with 3.14                                               | `np.full((3,5), 3.14)`                                |
| linear sequence starting from 0, ending at 20 (excluding), stepping by 2 | `np.arange(0,20,2)` </br> similar to python `range()` |
| array of 5 values evenly spaced between 0 and 1 (including)              | `np.linspace(0,1,5)`                                  |
| uniformly distributed 3x3 array with values between 0 & 1                | `np.random.random((3,3))`                             |
| 3x3 array of integers in 0 (including) & 10 (excluding)                  | `np.random.randint((0,10,(3,3)))`                     |

## Attributes of Arrays

| Attribute              | Syntax                           |
| ---------------------- | -------------------------------- |
| number of dimension    | `<obj>.ndim`                     |
| size of each dimension | `<obj>.shape`. Result is a tuple |
| total size             | `<obj>.size`                     |
| data type              | `<obj>.dtype`                    |

## Access Item of Arrays

| Type of access              | Syntax                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| 1D - access single item     | `x1[0]`. Allows negative indices as well                                                    |
| multi-D - access singe item | `x2[0,0]`                                                                                   |
| 1D - slicing                | `x[start:stop:step]`. Same like python list                                                 |
| multi-D - slicing           | Works in the same way, with multiple slices separated by commas. E.x. for 3x3, `x2[:2, :3]` |
| multi-D - access column     | `x2[:, 0]`: first column                                                                    |
| multi-D - access row        | `x2[0, :]` or `x2[0]`: first row                                                            |

## Manipulation of Arrays

| Task             | Syntax                                                             |
| ---------------- | ------------------------------------------------------------------ |
| Reshaping        | `np.arange(1, 10).reshape((3, 3))`                                 |
| Concatenation    | `np.concatenation(list_of_arrays, axis=zero_indexed_axis)`         |
| Vertical stack   | `np.vstack(list_of_arrays)`. Concatenation along first axis        |
| Horizontal stack | `np.hstack(list_of_arrays)`. Concatenation along second axis       |
| Depth stack      | `np.dstack(list_of_arrays)`. Concatenation along third axis        |
| Splitting        | `np.split(array, list_of_split_indices)`. Split along first axis   |
| Vertical split   | `np.vsplit(array, list_of_split_indices)`. Split along first axis  |
| Horizontal split | `np.hsplit(array, list_of_split_indices)`. Split along second axis |

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

## Ufunc

| task                | Example                                          |
| ------------------- | ------------------------------------------------ |
| Aggregation         | `np.sum(x)`, `np.min(x)` OR `x.sum()`, `x.min()` |
| Multi-D Aggregation | ``                                               |

### Advanced features

| feature           | Example                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| Specifying output | `np.multiply(x, 10, out=y[::2])`                                                     |
| Aggregate         | `np.add.reduce(x)`, `np.sum.accumulate(x)`                                           |
| Outer product     | `np.multiply.outer(np.arange(1, 6), np.arange(1, 6))`: generate multiplication table |

```py title="nan-inf.py"
print(np.nan)  # not a number
print(np.inf)  # infinity
print(np.isnan(np.nan))  # True
print(np.isinf(np.inf))  # True
print(np.nan == np.nan)  # False
print(np.nan is np.nan)  # True
print(np.inf == np.inf)  # True
print(np.inf is np.inf)  # True
```

```py title="math-operation.py"
# array operation
print([1, 2, 3] * 2)  # [1, 2, 3, 1, 2, 3] - repeater
print([1, 2, 3] + [4, 5, 6])  # [1, 2, 3, 4, 5, 6] - concatenation

# numpy - vectorized operations
a1 = np.array([1, 2, 3])
a2 = np.array([4, 5, 6])
print(a1 * 2)  # [2 4 6]
print(a1 + 2)  # [3 4 5]
print(a1 + a2)  # [5 7 9]
print(a1 * a2)  # [ 4 10 18]

# numpy - different shape (AVOID THIS)
# Broadcasting is NumPy's ability to “stretch” or “replicate” smaller arrays to match the dimensions of larger ones during arithmetic operations
a1 = np.array([1, 2, 3])
print(a1 + np.array([[1], [2]]))  # [[2 3 4] [3 4 5]]
print(
    a1 + np.array([[1, 1], [2, 2]])
)  # ValueError: operands could not be broadcast together with shapes (3,) (2,2)

# numpy math function
print(np.power(a1, 2))  # [1 4 9]
```

```py title="array-methods.py
a = np.array([1, 2, 3])

# array function does not modify the original numpy array
print(np.append(a, [4, 5]))  # [1 2 3 4 5]
print(np.insert(a, 1, [4, 5]))  # [1 4 5 2 3]
print(np.delete(a, 1))  # [1 3]

# 2-d
# In NumPy, axes are the dimensions of an array.
# For a 2-dimensional array, axis 0 (first level list) represents rows and axis 1 (second level i.e. items of each item in array) represents columns.
# In higher dimensions, axes are numbered sequentially.
# Operations performed with an axis parameter aggregate data along that axis. For example, np.sum(axis=0) sums values vertically across rows, while np.sum(axis=1) sums horizontally across columns.
# Negative axis indices can be used to reference axes from the end, where -1 is the last axis.
a = np.array([[1, 2, 3], [4, 5, 6]])
print(np.sum(a, axis=0))  # [5 7 9] - sum across row
print(np.sum(a, axis=1))  # [6 15] - sum across column
print(np.delete(a, 1, axis=0))  # [[1 2 3]] - delete row
print(np.delete(a, 1, axis=1))  # [[1 3] [4 6]] - delete column
print(
    np.delete(a, 4)
)  # [1 2 3 4 6]. By default, axis is None, so the array is flattened before deletion.
```

```py title="structuring-method.py"
a = np.array([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]])
print(a.shape)  # (3, 5)


# RESIZE ====
a.resize((5, 3))  # return None. Unlike 'reshape', 'resize' mutates the array.
print(a)  # [[ 1  2  3] [ 4  5  6] [ 7  8  9] [10 11 12] [13 14 15]]

# FLATTEN ====
a = np.array([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]])
print(a.flatten())  # [ 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15]
print(a.ravel())  # [ 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15]
# flatten vs ravel - flatten returns a copy of the array, while ravel returns a 'view' of the array. If you modify the original array, the changes will not be reflected in the flattened array returned by flatten, but they will be reflected in the flattened array returned by ravel.
print(a.flat)  # <numpy.flatiter object at 0x142847600>
print([v for v in a.flat])  # list - [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

# TRANSPOSE ====
# The transpose of a 2D is obtained by moving the rows data to the column and columns data to the rows
# For higher dimension - The axes are reversed. If you transposed a shape (2, 3, 4, 5) array, you receive a shape (5, 4, 3, 2) array
print(a.T)  # [[ 1  6 11] [ 2  7 12] [ 3  8 13] [ 4  9 14] [ 5 10 15]]
print(a.transpose())  # [[ 1  6 11] [ 2  7 12] [ 3  8 13] [ 4  9 14] [ 5 10 15]]
print(
    a.swapaxes(0, 1)
)  # provide the 2 axes to swap - [[ 1  6 11] [ 2  7 12] [ 3  8 13] [ 4  9 14] [ 5 10 15]]
```

```py title="split.py"
a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
# split(ary, indices_or_sections, axis) -> list
# Split an array into multiple sub-arrays as 'views'
s1 = np.split(a, 2, axis=0)  # split into 2 sub-arrays along axis 0 (row)
print(s1)  # [array([[1, 2, 3], [4, 5, 6]]), array([[ 7,  8,  9], [10, 11, 12]])]
s1[0][0][0] = 100
print(a)  # [[100   2   3] [  4   5   6] [  7   8   9] [ 10  11  12]]
# np.split(a, 3, axis=0) # ValueError: array split does not result in an equal division

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
s2 = np.split(a, 3, axis=1)  # split into 3 sub-arrays along axis 1 (column)
print(
    s2
)  # [array([[1], [4], [7], [10]]), array([[2], [5], [8], [11]]), array([[3], [6], [9], [12]])]
```

```py title="aggregate.py"
a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.min())  # 1
print(a.max())  # 6
print(a.mean())  # 3.5
print(a.std())  # standard deviation - 1.707825127659933
print(a.sum())  # 21
print(np.median(a))  # 3.5
```

```py title="export-and-import.py
# npy format
a = np.array([1, 2, 3])
np.save("test.npy", a)  # store in npy (binary) format
b = np.load("test.npy")
print(b)  # [1 2 3]

# csv format
a = np.array([[1, 2], [3, 4]])
np.savetxt("test.csv", a, delimiter=",")  # store in csv (text) format
b = np.loadtxt("test.csv", delimiter=",")
print(b)  # [[1. 2.] [3. 4.]]
```

### Advanced

```py title="broadcasting.py
a = np.array([1, 2, 3])  # broadcast -> 123 123
print(a.shape)  # (3,)
b = np.array([[1], [2]])  # broadcast -> 111 222
print(b.shape)  # (2, 1)
c = a + b
# broadcasting
# a: (3,) -> (1, 3)
# a: (1, 3) -> (*2*, 3); '1' is extended to match the dimension of the other array
# b: (2, 1) -> (2, *3*); '1' is extended to match the dimension of the other array
print(c.shape)  # (2, 3)
print(c)  # 234 345

# higher dimensional broadcasting
a = np.random.random((5, 7, 1, 4, 8, 1, 2))
b = np.random.random((5, 1, 8, 4, 1, 5, 1))
print(
    (a + b).shape
)  # (5, 7, 8, 4, 8, 5, 2). Here '1' is extended to match the dimension of the other array
c = np.random.random((5, 1, 8, 4, 2, 5, 1))
print(
    (a + c).shape
)  # ValueError: operands could not be broadcast together with shapes (5,7,1,4,8,1,2) (5,1,8,4,2,5,1)
# Even the multiplier does not work. It has to be 1 or same number for an axis
```

```py title="indexing.py"
a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
# Single value
print(a[0])  # [1 2 3] # first row
print(a[0, 1])  # 2 # single element at (0,1)

# Slicing/Dimensional value
print(a[0:2])  # [[1 2 3] [4 5 6]] # slicing from 0 to 2 items (exclusive)
print(
    a[0:2, 1:3]
)  # [[2 3] [5 6]] # slicing 0 to 2 for first index, then 1 to 3 for second index

# Single value + Slicing
print(a[:, 1])  # [2 5 8] # all rows, column 1. Returns 1D
print(a[:, 1, np.newaxis])  # [[2] [5] [8]]. Returns 2D. New axis is added later
print(a[np.newaxis, :, 1])  # [[2 5 8]]. Returns 2D. New axis is added at beginning

# Array value
print(a[[0, 2]])  # [[1 2 3] [7 8 9]] # returning elements at (0,) and (2,)
print(a[[0, 2], [1, 2]])  # [2 9] # returning elements at (0,1) and (2,2)

# Boolean value
print(a[a > 5])  # [6 7 8 9] # returns all elements greater than 5
print(
    a[a[:, 1] > 5]
)  # [[7 8 9]] # returns all rows where the second column is greater than 5
print(
    a[[True, False, True]]
)  # [[1 2 3] [7 8 9]] # returns rows where the boolean array is True
print(
    a[[True, False, True], [False, True, False]]
)  # [2 8] # returns elements at (0,1) and (2,1) where the boolean array is True
print(
    a[[[True, False, True], [False, True, False], [False, True, False]]]
)  # [1 3 5 8]. Masking
```

```py title="sorting.py"
a = np.array([[5, 9, 8], [4, 1, 6], [7, 3, 2]])

# np.sort() - Return a sorted copy of an array.
# a.sort() - sort the actual array in place.
# Sorting takes place 'across' the provided axis. If None, the array is flattened before sorting. The default is -1, which sorts along the last axis.

print(np.sort(a))  # [[5 8 9] [1 4 6] [2 3 7]]
print(np.sort(a, axis=0))  # [[4 1 2] [5 3 6] [7 9 8]]
print(np.sort(a.flatten()).reshape(a.shape))  # [[1 2 3] [4 5 6] [7 8 9]]
```

```py title="searching.py"
a = np.array([[5, 1, 8], [4, 1, 6], [1, 3, 2]])

# argmax & argmin returns the 'indices'
# By default, the index is into the flattened array, otherwise along the specified axis.
# In case of multiple occurrences of the maximum values, the indices corresponding to the first occurrence are returned.
print(np.argmax(a))  # 2
print(np.argmax(a, axis=0))  # [0 2 0]
print(np.argmax(a, axis=1))  # [2 2 1]

print(np.argmin(a))  # 1
print(np.argmin(a, axis=0))  # [2 0 2]
print(np.argmin(a, axis=1))  # [1 1 0]

# Return the indices of the elements that are non-zero.
# Returns a tuple of arrays, one for each dimension.
# The values are returned in row-major, C-style order. i.e. (0,0), (0,1), (0,2) [incrementing last index first] rather than (0,0), (1,0), (2,0) [incrementing first index first]
print(
    np.nonzero(a)
)  # (array([0, 0, 0, 1, 1, 1, 2, 2, 2]), array([0, 1, 2, 0, 1, 2, 0, 1, 2]))

# where(condition, x, y) - Where True, yield x, otherwise yield y.
print(np.where(a > 5, a, 0))  # [[0 0 8] [0 0 6] [0 0 0]]
```

```py title="iterating.py"
a = np.arange(12).reshape(3, 4) + 1
print(a)  # [[ 1  2  3  4] [ 5  6  7  8] [ 9 10 11 12]]

for ele in np.nditer(a):  # default order is C (row-major order)
    print(ele, end=" ")  # 1 2 3 4 5 6 7 8 9 10 11 12
print()

for ele in np.nditer(a, order="F"):  # F for Fortran order (column-major order)
    print(ele, end=" ")  # 1 5 9 2 6 10 3 7 11 4 8 12
print()

# Modinfying elements in array
with np.nditer(a, op_flags=["readwrite"]) as it:
    for ele in it:
        ele[...] = ele * 2  # modify the elements in place
print(a)  # [[ 2  4  6  8] [10 12 14 16] [18 20 22 24]]
```

```py title="masking.py"
import numpy.ma as ma

a = np.array([1, 2, 3, np.nan, 4, np.inf])

masked__a = ma.masked_array(
    a, mask=[0, 0, 0, 1, 0, 1]
)  # value with '1' is masked. Boolean can also be passed
print(masked__a)  # [1.0 2.0 3.0 -- 4.0 --]
print(masked__a.size)  # 6
print(masked__a.mean())  # 2.5 (masked values are ignored; thus length = 4)

print(masked__a[3])  # --
print(type(masked__a))  # numpy.ma.core.MaskedConstant'>
print(masked__a[3].dtype)  # float64

print(ma.getmask(masked__a))  # [False False False True False True]

print(ma.masked_greater(a, 2))  # [1.0 2.0 -- nan -- --]
print(ma.masked_inside(a, 1, 3))  # [-- -- -- nan 4.0 inf] # inclusive 1 and 3
print(ma.masked_where(a % 2 == 0, a))  # [1.0 -- 3.0 nan -- inf]
print(ma.masked_invalid(a))  # [1.0 2.0 3.0 -- 4.0 --]
```

```py title="copy_and_view.py"
a = np.array([1, 2, 3])
new_copy = a.copy()  # creates a copy i.e. different space is allocated
new_copy[0] = 100
print(new_copy)  # [100 2 3]
print(new_copy.base)  # None. since it does not point to the original array
print(a)  # [1 2 3]. original array is not changed

new_copy_2 = a[[0, 1]]  # creates a copy of the selected elements
new_copy_2[0] = 100
print(new_copy_2)  # [100 2]
print(new_copy_2.base)  # None
print(a)  # [1 2 3]. original array is not changed

# creates a view. No new space is allocated.
# In layman, it just provide a different perspective to look at the data
new_view = a[:]
new_view[0] = 100
print(new_view)  # [100 2 3]
print(new_view.base)  # [100 2 3]. base is not 'None'. it points to the original array
print(a)  # [100   2   3]. original array is also changed
```

```py title="vectorization.py"
def square_if_even(x: int):
    return x**2 if x % 2 == 0 else x


a = np.array([[1, 2, 3], [4, 5, 6]])
print(np.square(a))  # [[ 1  4  9] [16 25 36]]

vectorized_square_if_even = np.vectorize(
    square_if_even
)  # make it compatible with numpy
print(vectorized_square_if_even(a))  # [[ 1  4  3] [16  5 36]]

# matrix multiplication
a = np.array([[1, 2], [3, 4]])
print(np.matmul(a, a))  # [[ 7 10] [15 22]]
print(a @ a)  # [[ 7 10] [15 22]]
```

```py title="custom-data-type.py"
print(np.array([1, 2, 3]).dtype)  # int64
print(np.array([1, 2, 3.0]).dtype)  # float64
print(np.array([1, 2, 3, "hello"]).dtype)  # <U21
print(np.array([1, 2, {"k": "v"}]).dtype)  # object

print(
    np.array([1.0, 2.3], dtype=np.int64)
)  # [1 2]. Explicit casting. Raises error if casting not possible.

# custom data type - used for performance optimization
dt = np.dtype("U3", "f4")  # 3-character unicode string, 4-byte float
print(np.array([("hello", 1), ("world", 2.3)], dtype=dt))  # [['hel' '1'] ['wor' '2.3']]
```
