---
title: PostgreSQL ACID Normalization
---

- Database correctness rests on two layers: **transaction guarantees at runtime** (ACID) and **schema shape at design time** (normalization)
- **ACID** makes each transaction reliable under failure and concurrency
- **Normalization** stores each fact once so updates cannot disagree with themselves
- **Constraints** makes sure the engine enforces schema invariants

## ACID

| Property        | Guarantee                                 | Typical mechanism                         |
| --------------- | ----------------------------------------- | ----------------------------------------- |
| **Atomicity**   | All-or-nothing                            | Rollback on error / crash mid-txn         |
| **Consistency** | Valid state → valid state                 | Constraints, FKs, triggers, cascades      |
| **Isolation**   | Concurrent txns do not corrupt each other | Locks, MVCC, isolation levels             |
| **Durability**  | Committed data is permanent               | Write-ahead log flushed before commit ACK |

- Example:
  - Consistency: balance `CHECK (balance >= 0)` blocks a withdraw that would go negative
  - Isolation: account has $50; two $40 withdraws at once → one succeeds, one fails

## Normalization

- **Normalization** = structure tables so each fact lives in one place → less redundancy, fewer update anomalies
- Progress through **Normal Forms**; each level assumes the previous
- Goal: split into logical tables until every non-key value depends on **the key, the whole key, and nothing but the key**

| Form    | Rule                                                  | Smell if violated                           |
| ------- | ----------------------------------------------------- | ------------------------------------------- |
| **1NF** | Atomic cells; no repeating groups / multi-value cells | `products = "Laptop, Mouse"` in one cell    |
| **2NF** | Already 1NF; no partial deps on a composite key       | Location repeats for every product in store |
| **3NF** | Already 2NF; no transitive deps between non-keys      | `City` duplicated whenever `ZipCode` is     |

### 1NF — atomic values

- Each column holds a single value; no lists stuffed into one cell

```text title='1NF before / after'
Before (not 1NF):
order_id | customer | products
1        | Alice    | Laptop, Mouse

After (1NF): one product per row
order_id | customer | product
1        | Alice    | Laptop
1        | Alice    | Mouse
```

### 2NF — no partial dependencies

- Already 1NF, and every non-key column depends on the **entire** primary key — not just one piece of a composite key

```text title='2NF before / after'
Before (1NF but not 2NF):
PK = (StoreID, ProductID)
'StoreLocation' depends only on StoreID → partial dependency

After (2NF):
Sales:  StoreID, ProductID, Price
Stores: StoreID, StoreLocation
```

### 3NF — no transitive dependencies

- Already 2NF, and no non-key column depends on another non-key column

```text title='3NF before / after'
Before (2NF but not 3NF):
ZipCode → City (City depends on ZipCode, not on StudentID)

After (3NF):
Students:  StudentID, StudentName, ZipCode
Locations: ZipCode, City
```

## Retain

| Decision                        | Guidance                                                                 |
| ------------------------------- | ------------------------------------------------------------------------ |
| Stay normalized (3NF-ish)       | Default for writes, correctness, and evolving labels/metadata            |
| Keep a lookup / reference table | Values change, need soft-delete or extra attributes — prefer over `enum` |
| Denormalize a column            | Only when a hot read path pays too much for the join; own the sync cost  |
| Enforce with constraints        | Prefer DB invariants over “app will always check” for money / uniqueness |
| ACID vs eventual consistency    | Money, inventory, auth → strong txn; feeds/analytics may tolerate lag    |
