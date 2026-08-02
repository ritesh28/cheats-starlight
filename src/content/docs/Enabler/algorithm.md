---
title: Algorithm (TODO)
---

## Divide & Conquer

- This technique can be divided into the following three parts:
  1. Divide: This involves dividing the problem into smaller sub-problems
  2. Conquer: Solve sub-problems by calling recursively until solved
  3. Combine: Combine the sub-problems to get the final solution of the whole problem
- Merge Sort:
  1. Split the given list into two halves (roughly equal halves in case of a list with an odd number of elements)
  2. Continue dividing the subarrays in the same manner until you are left with only single element arrays
  3. Starting with the single element arrays, merge the subarrays so that each merged subarray is sorted
  4. Repeat step 3 unit with end up with a single sorted array
- Quick Sort:
  1. Select an element of the array. This element is generally called the pivot. Most often this element is either the first or the last element in the array
  2. Then, rearrange the elements of the array so that all the elements to the left of the pivot are smaller than the pivot and all the elements to the right are greater than the pivot. The step is called partitioning. If an element is equal to the pivot, it doesn't matter on which side it goes
  3. Repeat this process individually for the left and right side of the pivot, until the array is sorted

## Greedy

- Greedy is an algorithmic paradigm that builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit
- A problem with minimum or maximum constraint:
  ```txt
  for each step in a ultimate desired solution:
    get the Feasible item from the collection to perform that step
    Solution += Feasible item
  ```
- Problem:
  - A minimum spanning tree (MST) or minimum weight spanning tree for a weighted, connected, undirected graph is a spanning tree with a weight less than or equal to the weight of every other spanning tree. The weight of a spanning tree is the sum of weights given to each edge of the spanning tree
    - Sort all the edges in non-decreasing order of their weight
    - Pick the smallest edge. Check if it forms a cycle with the spanning tree formed so far. If cycle is not formed, include this edge. Else, discard it
    - Repeat step 2 until there are (V-1) edges in the spanning tree
  - Greedy Algorithm to find Minimum number of Coins - Given a value V, if we want to make a change for V Rs, and we have an infinite supply of each of the denominations in Indian currency, i.e., we have an infinite supply of { 1, 2, 5, 10, 20, 50, 100, 500, 1000} valued coins/notes, what is the minimum number of coins and/or notes needed to make the change?
  - Knapsack problem - Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack

## Dynamic Programming

- Dynamic Programming is an algorithmic paradigm that solves a given complex problem by breaking it into subproblems and stores the results of subproblems to avoid computing the same results again
- Memoisation

## BackTracking

- The term backtracking suggests that if the current solution is not suitable, then backtrack and try other solutions
- Recursion is used in this approach
- This approach is used to solve problems that have multiple solutions. If you want an optimal solution, you must go for dynamic programming
- ```txt
  for each step in a ultimate desired solution:
    make a Choice from the collection
    if(passes-all-constrain):
        if(is-last-step): add to the Solution
        else: move forward. Go to step 1.
    else:
        move back. Go to step 2.
  ```
- Problems:
  - Write a program to print all permutations of a given string
  - The N Queen is the problem of placing N chess queens on an N×N chessboard so that no two queens attack each other
  - Maze Problem
