---
title: Data Structure (TODO)
---

https://neptune-venture.atlassian.net/wiki/spaces/ICS/pages/1104183366/Data+Structures

## Big O Notation

We use Big O to describe how the runtime or space usage grows as the input size grows.

- `O(1)` - Constant time
- `O(log n)` - Logarithmic time
- `O(n)` - Linear time
- `O(n^2)` - Quadratic time
- `O(2^n)` - Exponential time

### Space Complexity

- `O(1)` space - constant extra space
- `O(n)` space - grows linearly with input size

```txt
Example:
O(1)  -> accessing an array index
O(log n) -> binary search
O(n) -> scanning a list
O(n^2) -> nested loops
```

## Arrays

- Great when you know the number of items in advance.
- Useful for fast index-based access.

### Time Complexity

- Lookup by index: `O(1)`
- Lookup by value: `O(n)` in the worst case
- Insert: `O(n)`
- Delete: `O(n)`

## Linked Lists

- Each node points to the next node.
- Useful when you want efficient insertions and deletions at the beginning or middle.

### Time Complexity

- Lookup by index/value: `O(n)`
- Insert at beginning/end: `O(1)`
- Insert in middle: `O(n)`
- Delete at beginning: `O(1)`
- Delete in middle: `O(n)`

### Notes

- Single linked list: traversal is one-way
- Double linked list: traversal is two-way and deletion at the end is faster

## Stacks

- Last In, First Out (LIFO)
- Common operations: `push`, `pop`, `peek`, `isEmpty`

### Time Complexity

- All main operations: `O(1)`

```txt
Example flow:
push(10) -> push(20) -> pop() => 20
```

## Queues

- First In, First Out (FIFO)
- Common operations: `enqueue`, `dequeue`, `peek`, `isEmpty`

### Time Complexity

- All main operations: `O(1)`

## Hash Tables

- Store data as key-value pairs.
- A hash function maps the key to an address in memory.

### Time Complexity

- Insert: `O(1)`
- Lookup: `O(1)`
- Delete: `O(1)`

### Important Note

- Collisions can happen when two keys map to the same address.

## Binary Trees

- A tree has a root, nodes, leaves, and edges.
- A Binary Search Tree (BST) follows this rule:
  - left subtree values are smaller
  - right subtree values are larger

### Time Complexity

- Lookup: `O(log n)`
- Insert: `O(log n)`
- Delete: `O(log n)`

### Tree Traversals

- Pre-order: `Root -> Left -> Right`
- In-order: `Left -> Root -> Right`
- Post-order: `Left -> Right -> Root`

```txt
Example traversal order:
Pre-order  -> 7, 4, 1, 6, 9, 8, 10
In-order   -> 1, 4, 6, 7, 8, 9, 10
Post-order -> 1, 6, 4, 8, 10, 9, 7
```

## Heaps

- A heap is a tree-based structure commonly used for priority queues.
- It allows quick access to the smallest or largest element.

## Graphs

- Graphs are made of nodes (vertices) and edges.
- They are used to model relationships, networks, and paths.

## Quick Summary

| Structure   | Best for                   | Typical Time             |
| ----------- | -------------------------- | ------------------------ |
| Array       | Fast index access          | `O(1)` lookup            |
| Linked List | Frequent insert/delete     | `O(1)` at front          |
| Stack       | LIFO operations            | `O(1)`                   |
| Queue       | FIFO operations            | `O(1)`                   |
| Hash Table  | Fast key-value lookups     | `O(1)` average           |
| Binary Tree | Ordered data storage       | `O(log n)` average       |
| Heap        | Priority queue             | `O(log n)` insert/remove |
| Graph       | Relationships and networks | Depends on algorithm     |
