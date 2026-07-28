---
title: Performance
---

- Follow following in order:
  1. Identify the real bottleneck first
  2. Queries
  3. Indexing
  4. Schema and Storage
  5. Caching and Pooling
  6. Scale hardware

## Step 1. Identify Bottleneck

1. First **identify the bottleneck** using system metrics and tools like `EXPLAIN ANALYZE`
   - `EXPLAIN ANALYZE` executes a specified SQL query and returns computation cost i.e. execution time
2. Then systematically optimize your **queries, indexes, schema, caching, and hardware**

## Step 2. Optimize Queries

- Why: Inefficient code is the most common cause of database slowdowns
- **Avoid `SELECT *`**: Select only the columns you need
- **Filter data early**: Apply `WHERE` predicates before joins
- **Fix N+1 queries**:
  - Problem: run '1' initial query to fetch a list of records, followed by 'N' additional queries to fetch related data for each record
  - Solution 1: use sql joins (1 query)
  - Solution 2: use ORM ( Object-Relational Mapper) Eager Loading (2 queries)
    - Eager Loading tells the ORM to fetch the related data upfront by using `IN` operator
    - `SELECT id FROM posts;` and `SELECT * FROM posts WHERE post_id IN (1, 2, 3);`
- **Use bulk logic**: Prefer `UPDATE`, `INSERT`, and `DELETE` in bulk over row-by-row processing

## Step 3. Implement Smart Indexing

- Why: Indexes act like a book's index, letting the database engine find data without scanning entire tables
- **Index key columns** used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY`
- **Use composite indexes** for common multi-column filters
- **Drop unused indexes**: each index slows writes and increases storage cost

## Step 4. Improve Schema and Storage Layout

- Why: How you structure your data dictates how hard the machine has to work to retrieve it
- **Choose tight/smallest data types** to fit more data into memory (e.g., `INT` instead of `BIGINT` if numbers are small)
- **Partition large tables** by logical ranges such as date or region
- **Archive historical data** to reduce the size of active tables
- **Denormalize selected fields** by intentionally duplicating data to eliminate expensive, multi-table joins in high-read environments

## Step 5. Cache and Manage Connections

- Why: working outside of db to increase performance
- **Use external caching** like Redis to serve highly repetitive, unchanging lookup data instantly
- **Enable connection pooling** like PgBouncer to reuse existing open db connections rather than creating new ones for every single request
- **Keep transactions short** to release db locks and prevent blocking other processes

## Step 6. Scale Infrastructure

- Why: upgrade hardware when software tuning reaches its limit
- **Vertical scaling**: upgrade CPU, RAM, and hard disk
- **Horizontal scaling**: add read replicas to offload search traffic from your primary write db, or implement sharding across multiple nodes

### Horizontal Scaling: Read Replication

- Primary database (Write): original database that other replicas are based on
- Replicas (Read): copies of the primary database in different nodes/machines
- Changes made in the primary database are automatically propagated to replicas, enabling high availability, fault tolerance, and scalability
- It uses synchronous or asynchronous replication methods to keep data consistent across locations
  - Synchronous replication: primary database waits for a success message from the replica before telling the user the write is done
  - Asynchronous replication: primary database saves the data, tells the user it is done right away, and updates the replica in the background

### Horizontal Scaling: Sharding

- Sharding is a technique that:
  - Breaks up a single massive database into smaller, distinct, and more manageable pieces called shards
  - These shards are then distributed across completely separate physical database servers
- Application routes traffic to a sharded database by using a logic called a Shard Router (or Query Router)
- Router inspects query, extracts pre-defined field called **Shard Key**, applies logic, and opens connection to db server holding that data
- Example: Imagine you run a global store. You shard `customers` database across 3 separate servers using the `country_code` as Shard Key:
  - If country_code is AU or NZ → Connect to Shard 1 (Sydney Server)
  - If country_code is US or CA → Connect to Shard 2 (Virginia Server)
- Problem: What happens if a store manager logs in and wants to run a report showing total sales across all countries?
