---
title: Concepts
---

## ACID Properties

- ACID properties are a set of four core principles that guarantee database transactions are processed reliably
- Atomicity ("All or Nothing"): it treats a transaction as a single, indivisible unit of work
  - If an error or system crash occurs halfway through, the DBMS triggers a rollback to undo all partial changes
- Consistency (Preserving Rules): It ensures that a transaction brings the database from one valid state to another valid state
  - Every transaction must follow all defined database schemas, constraints, cascades, and triggers
  - Example: Bank account has a constraint that the balance cannot drop below $0 and a user can withdraw more than the available balance
- Isolation (Independent Execution): It ensures that concurrently running transactions do not interfere with each other
  - DB uses concurrency control techniques, such as locks or timestamps, to make transactions behave as if they were running sequentially
  - Example: 2 people withdraw $50 at the exact same second from an account containing $60 - one succeed and the other fails
- Durability (Permanent Changes): It guarantees that once a transaction commits, its changes survive permanently in non-volatile memory
  - Committed data will never be lost, even in the event of a total system crash or power failure immediately after
  - DB immediately writes transaction logs to a permanent storage drive (HDD/SSD) before confirming success to the user

## Normalization

- Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity/consistency
- The process follows a series of progressive stages called Normal Forms (NF). Each level builds upon the previous one
- The goal is to split data into logical tables so that each fact is stored in one place
- Summary:
  - **1NF**: eliminate repeating groups and keep atomic values
  - **2NF**: remove partial dependencies
  - **3NF**: remove transitive dependencies
  - **BCNF**: ensure every determinant is a candidate key

### First Normal Form (1NF): Atomic Values

- A table is in 1NF if each column contains atomic values and there are no repeating groups or arrays

```text
#### Problem:
order_id | customer_name | products
1        | Alice         | Laptop, Mouse

#### Solution: Fix by splitting repeating values into separate rows or another table
order_id | customer_name | products
1        | Alice         | Laptop
1        | Alice         | Mouse
```

### Second Normal Form (2NF): No Partial Dependencies

- A table is in 2NF if it is already in 1NF and all non-key attributes depend on the entire primary key, not just part of it

```text
#### Problem:
Primary key: combination of `StoreID` & `ProductID`
`StoreLocation` column only depends on `StoreID` (part of the key), creating a partial dependency
| StoreID (Key) | ProductID (Key) | Price | StoreLocation |
| S1            | P99             | $10   | New York      |
| S1            | P88             | $12   | New York      |

#### Solution: Move the partial dependency into a separate lookup table
Table A (Sales): StoreID, ProductID, Price
Table B (Stores): StoreID, StoreLocation
```

### Third Normal Form (3NF): No Transitive Dependencies

- A table is in 3NF if it is in 2NF and no non-key column depends on another non-key column
- Every value must depend on "the key, the whole key, and nothing but the key."

```text
#### Problem: `ZipCode` determines `City` i.e `City` depends on `ZipCode`
| StudentID (Key) | StudentName | ZipCode | City          |
| 401             | Bob         | 90210   | Beverly Hills |

#### Solution: Remove the transitive column and place it into its own table where its determinant becomes the primary key
Table A (Students): StudentID, StudentName, ZipCode
Table B (Locations): ZipCode, City
```

### Boyce-Codd Normal Form (BCNF): Strict 3NF

- A table is in BCNF if it is in 3NF and every determinant is a primary key
- Determinant: If `A → B`, then A determines B; B depends on A; A is the determinant

```text
#### Problem:
A student takes a course from an instructor. Each instructor teaches only one subject, but multiple instructors teach the same subject
Primary key: (`StudentID`, `Subject`)
However, `Instructor` determines `Subject`. Because `Instructor` is a non-key column determining a key column, it violates BCNF.
| StudentID (Key) | Subject (Key) | Instructor  |
| 501             | Math          | Prof. Jones |
| 502             | Math          | Prof. Jones |

#### Solution: Separate the relationships into two cleaner tables
Table A (Student_Instructors): StudentID, InstructorID
Table B (Instructors): InstructorID, InstructorName, Subject
```
