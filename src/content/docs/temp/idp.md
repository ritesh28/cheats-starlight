---
title: IDP
---

- Intelligent Document Processing (IDP) is a **data pipeline that turns messy documents into trustworthy structured data**
- Mental shift: not “OCR with AI” — a **probabilistic document-understanding system** with validation, confidence, and human feedback
- Abstraction: `Document → Understanding → Structured representation → Decision`
- Core loop: **perception** (OCR + layout) → **interpretation** (classify + extract) → **validation** (schema + rules) → **workflow** (auto / review / reject)
- Treat extraction as a **versioned, asynchronous job** — not a sync HTTP call that “returns JSON”
- In IDP, **confidence, ambiguity, and human intervention** are first-class

```text title='mental model'
document
   ↓
OCR
   ↓
layout parsing
   ↓
classification + extraction
   ↓
structured representation
   ↓
validation → business action
```

## Core terminology

| Term                       | Mental model                                       | Example                              |
| -------------------------- | -------------------------------------------------- | ------------------------------------ |
| **Document**               | Original artifact (may be multi-page / multi-type) | `invoice.pdf`, passport scan         |
| **OCR**                    | Pixels → text + confidence + bounding boxes        | `"INV-1234"` @ 0.97                  |
| **Layout understanding**   | Text + coordinates + visual structure              | Header vs line items vs total        |
| **Classification**         | What is this (doc / page / region)?                | Invoice vs PO vs receipt             |
| **Extraction**             | Unstructured → schema                              | `{ invoiceNumber, total, … }`        |
| **Key-value**              | Label ↔ value despite wording variants             | `Inv No.` / `Reference` → same field |
| **Table extraction**       | 2D spatial structure → rows/cols/cells             | Line items array                     |
| **Entity extraction**      | Typed spans in free text                           | PERSON, MONEY, DATE                  |
| **Confidence**             | Model’s self-score — **≠ correctness**             | total @ 0.62 → review                |
| **Grounding / provenance** | Where a value came from                            | page + bbox + `sourceText`           |
| **HITL**                   | Human resolves individual uncertain cases          | Queue item for clerk                 |

## OCR vs Document AI vs LLM

| Technology          | Main job                              |
| ------------------- | ------------------------------------- |
| **OCR**             | Read text                             |
| **Layout / Doc AI** | Understand spatial/document structure |
| **ML classifier**   | Classify documents                    |
| **LLM**             | Semantic interpretation / extraction  |
| **Rules**           | Deterministic validation              |
| **Human review**    | Resolve ambiguity                     |

```text title='compose layers — do not skip to LLM'
OCR → Layout → ML/LLM → Rules → Human

Not: PDF → LLM → magically correct JSON
```

## Native PDF vs scanned

| Input           | Path               | Notes                        |
| --------------- | ------------------ | ---------------------------- |
| **Native PDF**  | Text extraction    | Often faster / more accurate |
| **Scanned PDF** | Render pages → OCR | Needs preprocess quality     |

- Detect which case you have; one PDF may also need **splitting** (invoice + PO + receipt in one file)

## Confidence, validation, grounding

```text title='confidence routing'
>= threshold     → auto-accept
mid band         → human review
low              → reject / reprocess
```

- **Confidence ≠ truth** — combine model score + business validation + cross-field checks into a **trust decision**
- Principle: **probabilistic AI interprets; deterministic code enforces invariants**

```text title='business invariants'
subtotal + tax = total
invoiceDate <= today
currency / VAT format valid
vendor / PO exists in master data
```

```json title='grounded field'
{
  "total": {
    "value": 290,
    "page": 2,
    "boundingBox": [400, 700, 500, 730],
    "sourceText": "$290.00",
    "confidence": 0.98
  }
}
```

| Problem                      | Typical approach |
| ---------------------------- | ---------------- |
| Date / tax / known template  | Rules / template |
| Document classification      | ML               |
| Layout / tables              | Document AI      |
| Flexible semantic extraction | LLM              |
| Final financial invariant    | Rules            |
| Ambiguous result             | Human            |

## Async pipeline ops

```text title='treat IDP as jobs'
POST /documents → 202 Accepted → queue → workers
(not: wait 30s for 200 OK)
```

- **Idempotency:** same `document_hash` + `processing_version` → same logical result
- **Version extraction:** record `model` / `modelVersion` / `promptVersion` / `schemaVersion` — reprocessing can change outputs
- Track **automation rate ≠ accuracy** — auto-accept with silent errors is worse than review

## Production

| Decision                 | Guidance                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| **AI vs rules**          | AI proposes; schema + business rules verify                               |
| **Automation vs safety** | High auto-accept raises false-accept risk — tune thresholds by field cost |
| **LLM use**              | Flexible extraction / Q&A / normalization — never trust raw JSON          |
| **Sync vs async**        | Default to queue + workers                                                |
| **Evidence**             | Prefer provenance on every extracted fact                                 |
| **Eval**                 | Labeled set + hard slices (scan, rotate, multi-page, vendors, languages)  |
| **Security**             | Know where docs go at inference (provider logs / retention / residency)   |
| **Observability**        | OCR/class/field confidence, validation fails, correction rates, versions  |

### Memorize

1. OCR ≠ document understanding
2. Layout matters
3. Classify before extract
4. Extraction targets a schema
5. Output is probabilistic
6. Confidence ≠ correctness
7. Rules enforce invariants
8. Humans handle uncertainty
9. Provenance for every fact
10. IDP = async, observable, versioned pipeline

> **IDP = perception + interpretation + validation + workflow**
