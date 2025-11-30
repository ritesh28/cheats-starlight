---
title: Mathematics
---

![Intro Image](./mathematics_intro.drawio.svg)

## Linear Functions

- A linear function is a straight line. A Linear Equation can NOT contain exponents or square roots: `y = x**2; y = Math.sqrt(x); or y = Math.sin(x)`
- `f(x) = y`
- ![Linear func](./mathematics_linear_func.drawio.svg)

## Linear Algebra

- ![Linear algebra](./mathematics_linear_algb.drawio.svg)
- Scalar is a single number. Vector is 1D array. Matrix is 2D array. Tensor is N-dimensional matrix.

### Vector

- In geometry, a vector can describe a movement from one point to another. E.x. The vector [3, 2] says go 3 right (x-axis) and 2 up (y-axis).
- | Operation    | Example                       |
  | ------------ | ----------------------------- |
  | scalar add   | `[1 2 3] + 2 = [3 4 5]`       |
  | vector add   | `[1 2 3] + [3 4 5] = [4 6 8]` |
  | scalar multi | `[2 2 2] * 3 = [6 6 6]`       |

### Matrix

- | Type                      | Definition                                           |
  | ------------------------- | ---------------------------------------------------- |
  | Square Matrix             | matrix with the same number of rows and columns      |
  | Diagonal Matrix           | values on the diagonal entries, and zero on the rest |
  | Scalar Matrix             | equal diagonal entries and zero on the rest          |
  | Identity Matrix           | 1 on the diagonal and 0 on the rest                  |
  | Zero Matrix (Null Matrix) | has only zeros                                       |

- Operations: ![Matrix Operation](./mathematics_matrix_op.drawio.svg)

## Probability

- Probability is how likely something is to occur, or how likely something is true.
- `Probability = number of WAYS the event can happen / number of possible OUTCOMES`. Value is between 0 & 1.
- The probability of an event `A` is often written as `P(A)`.

## Statistics

- Statistics is about summarizing (describing) observations from a set of data.
- Statistics can be broken down into different measures:
  - Tendency (Measures of the Center):
    - **Mean**: average of all values. `Mean = Sum / Count`
    - **Median**: mid-point value.
    - **Mode**: value that appears the most number of times.
    - **Outliers**: values "outside" the other values
    - **Percentile**: Percentiles give you a number that describes the value that a given percent of the values are lower than.
      - What is the 75 percentile in a list of people's ages? The answer is 43, meaning that 75% of the people are 43 or younger.
  - Spread (Measures of Variability):
    - **Min and Max**
    - **Variance**: describes how far a set of numbers is Spread Out from the mean (average) value. Steps:
      1. Calculate the Mean (m)
      2. Calculate the Sum of Squares (ss): `∑((a[i] - m) ** 2)`
      3. `variance = ss / count`
    - **Standard Deviation**: measures how spread out numbers are. The symbol is σ (Greek letter sigma). `σ = Math.sqrt(variance)`
