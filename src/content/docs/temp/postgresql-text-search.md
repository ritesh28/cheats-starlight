---
title: PostgreSQL Text Search
---

- Stay in Postgres for moderate search needs; graduate to Elasticsearch/OpenSearch when you need heavy ranking, facets, or multi-tenant scale
- Two different tools: **FTS** (linguistic) vs **trigram** (fuzzy / substring) — pick by query shape, not by habit

## Full-text search (FTS)

### `to_tsvector`

- **`to_tsvector`** = “to Text Search Vector” — raw text → optimized **`tsvector`** for Postgres FTS
- Not rigid `LIKE '%…%'` matching

```sql title='to_tsvector'
SELECT to_tsvector('english', 'The quick brown foxes are jumping over lazy dogs');
-- 'brown':3 'dog':9 'fox':4 'jump':6 'lazy':8 'quick':2
-- {<stem>:<position>} — positions enable phrase search (words next to each other)
```

| Phase                 | What happens                                               |
| --------------------- | ---------------------------------------------------------- |
| **1. Tokenize**       | Strip punctuation; split into word tokens                  |
| **2. Lowercase**      | Case-insensitive matching                                  |
| **3. Stop-word drop** | Remove filler (`the`, `are`, `over`, …) — low search value |
| **4. Stem**           | Lexemes: `foxes`→`fox`, `jumping`→`jump`, `dogs`→`dog`     |

| vs `ILIKE '%jump%'` | Why FTS wins                                               |
| ------------------- | ---------------------------------------------------------- |
| **Linguistic**      | `jump` also hits `jumping` / `jumps` / `jumped`            |
| **Performance**     | Leading `%` kills B-tree → seq scan; `tsvector` + GIN wins |

```sql title='match with @@'
SELECT title FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'fox & jump');
-- finds "foxes jumping" even though the query used root forms
```

```sql title='generated column + GIN'
-- Don’t recompute `to_tsvector(...)` in every `WHERE` on huge text — store it once, index it
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) STORED
);

CREATE INDEX idx_articles_search ON articles USING gin (search_vector);
```

### `to_tsquery` / `plainto_tsquery` / `phraseto_tsquery`

- User input → **`tsquery`** → feed into `@@` against a `tsvector`
- Difference is **formatting**: strict operators vs messy human text vs exact phrase

| Function               | Input style             | Behavior                                                                |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------- |
| **`to_tsquery`**       | Must include operators  | Spaces alone → syntax error                                             |
| **`plainto_tsquery`**  | Raw search-bar sentence | Drop stop words, lower-case, stem, join remaining with `&`              |
| **`phraseto_tsquery`** | Phrase intent           | Same cleanup as `plainto_tsquery`, but join with `<->` (adjacent order) |

| Operator  | Meaning                                    |
| --------- | ------------------------------------------ |
| **`&`**   | AND — both terms                           |
| **`\|`**  | OR — either term                           |
| **`!`**   | NOT — exclude term                         |
| **`<->`** | Phrase — terms directly next to each other |

```sql title='to_tsquery'
SELECT to_tsquery('english', 'fat & cat');      -- 'fat' & 'cat'
SELECT to_tsquery('english', 'fat <-> cat');    -- phrase "fat cat"
SELECT to_tsquery('english', 'fat & !rat');     -- fat, exclude rat
```

```sql title='plainto_tsquery'
SELECT plainto_tsquery('english', 'The quick brown foxes');
-- 'quick' & 'brown' & 'fox'  (dropped "The", stemmed foxes, AND-joined)
```

```sql title='phraseto_tsquery'
-- plainto: 'bake' & 'soda'  → also hits "baking bread … soda"
-- phrase:  'bake' <-> 'soda' → only adjacent "baking soda"
SELECT phraseto_tsquery('english', 'baking soda');
```

### `ts_rank` / `ts_rank_cd`

- Match (`@@`) finds rows; **rank** scores them so the best float to the top — higher score = more relevant
- Both take `tsvector` + `tsquery` → float. Difference: **frequency** vs **proximity**

|              | **`ts_rank`**                                     | **`ts_rank_cd`** (cover density)                         |
| ------------ | ------------------------------------------------- | -------------------------------------------------------- |
| **Metric**   | How often terms appear                            | How close terms are (smallest window covering all terms) |
| **Best for** | Keywords, tags, short text                        | Long articles / posts where context matters              |
| **Weakness** | Keyword stuffing (repeat a word 50× → high score) | Scattered words across a long doc stay low               |

```sql title='rank by proximity'
SELECT title, ts_rank_cd(search_vector, q) AS rank
FROM articles, to_tsquery('english', 'postgres & speed') q
WHERE search_vector @@ q
ORDER BY rank DESC;
-- "postgres speed optimizations" beats "…postgres… [far] …speed…"
```

- Longer docs score higher by default (more chances to match). Pass a **normalization** int as the 3rd arg to level the field:
  - `ts_rank(search_vector, to_tsquery(...), 1)`: Divides the rank by the logarithm of the document length (recommended)

## Trigram search

- **`pg_trgm`** = built-in extension for **fuzzy / similarity / autocomplete / typo** search
- Unlike FTS (whole-word lexemes), chops text into **3-character slices**

```sql title='what is a trigram'
CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT show_trgm('apple');
-- {"  a"," ap",app,ppl,ple,"le "}  — padded edges + overlapping 3-char slices
```

### Similarity

- **Jaccard**: shared trigrams ÷ unique trigrams across both strings → score `0.0`…`1.0`
- Similarity Operator **`%`**: match if similarity ≥ threshold (default **0.3**)
- Distance Operator **`<->`**: distance — lower = more similar (good for `ORDER BY`)

```sql title='similarity'
SELECT similarity('apple', 'aple');  -- ~0.44

SELECT * FROM products WHERE name % 'iphne';  -- hits 'iPhone'
ORDER BY name <-> 'iphne';
```

### Performance

- `LIKE '%search%'` breaks DB performance because B-Tree indexes cannot read them, resulting in slow Sequential Scans
- `pg_trgm` completely solves this. Because it indexes the character slices rather than the whole string
- `CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);`

### FTS vs trigram

|                       | **FTS** (`tsvector`)              | **Trigram** (`pg_trgm`)                 |
| --------------------- | --------------------------------- | --------------------------------------- |
| **Style**             | Lexical — `jumping` ↔ `jump`      | Character — `iphne` ↔ `iPhone`          |
| **Typos**             | Strict — misspell fails           | High tolerance                          |
| **Partial / `%abc%`** | Weak                              | Excels                                  |
| **Best for**          | Articles, descriptions, long text | Autocomplete, names, SKUs, short titles |
| **Index size**        | Moderate                          | Larger (many character slices)          |
