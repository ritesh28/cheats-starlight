---
title: PostgreSQL Access Control
---

- Postgres security stacks layers: **roles** (who) → **privileges / GRANT** (what on which object) → **RLS** (which rows) → **parameters** (no SQL injection)
- Default posture: **least privilege** — app roles get only what they need; migrations/admin stay separate
- Object tree for permissions: **database → schema → table/view/function → columns / rows**

```text title='authz stack'
connection as role
        ↓
object privileges (GRANT / REVOKE)
        ↓
RLS policies (optional row filter)
        ↓
query result
```

## DDL vs DML

| Family  | Job                                                          | Commands                               |
| ------- | ------------------------------------------------------------ | -------------------------------------- |
| **DDL** | Structure — rules, constraints, containers; not row values   | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`  |
| **DML** | Data inside tables — what the app runs constantly at runtime | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |

- Split roles on this line:
  1. **`app_user` / `app_rw`** — **DML only** (`SELECT`/`INSERT`/`UPDATE`/`DELETE`). Compromised app must not `DROP` tables
  2. **`migrator`** — **DDL** (`CREATE`/`ALTER`/schema owner). Upgrades structure during deploys only

## Core terminology

| Term            | Mental model                                           | Example                            |
| --------------- | ------------------------------------------------------ | ---------------------------------- |
| **Role**        | Identity + permission set (user ≈ role that can login) | `app_user`, `migrator`, `readonly` |
| **Login role**  | Role with `LOGIN` — can open a connection              | app pool user                      |
| **Group role**  | Role without login — hold grants; others inherit       | `app_rw`                           |
| **Schema**      | Namespace for objects                                  | `public`, `app`, `audit`           |
| **Privilege**   | Allowed action on an object                            | `SELECT`, `INSERT`, `USAGE`        |
| **Owner**       | Role that created the object — full control            | bypasses RLS unless `FORCE`        |
| **RLS**         | Per-row filter on top of table grants                  | `tenant_id = …`                    |
| **Search path** | Schema order for unqualified names                     | `"$user", public`                  |

## Roles

- Roles are the **unified** authn/authz mechanism — Postgres has no separate “users” vs “groups”; a role can be either or both
- Four levers: **LOGIN** → **attributes** → **memberships** → **object privileges**

```text title='role shape'
role
 ├── LOGIN? (connection gate)
 ├── attributes (SUPERUSER, CREATEDB, BYPASSRLS, …)
 ├── memberships (GRANT group TO login / IN ROLE)
 └── object privileges (GRANT / REVOKE on tables, schemas, …)
```

### LOGIN — connection gate

| Role style  | Attribute  | Behavior                                     |
| ----------- | ---------- | -------------------------------------------- |
| **“User”**  | `LOGIN`    | Can authenticate and open a session          |
| **“Group”** | no `LOGIN` | Cannot sign in; holds privileges for members |

```sql title='user vs group role'
CREATE ROLE john WITH LOGIN PASSWORD 'secure_password';  -- user
CREATE ROLE engineering;                                 -- group (NOLOGIN default)
```

### Attributes — server-level powers

Hardcoded capabilities on the role itself (not per-object grants). Bypass normal object privilege checks where noted.

| Attribute       | Meaning                                              |
| --------------- | ---------------------------------------------------- |
| **SUPERUSER**   | Bypass almost all permission checks — avoid for apps |
| **CREATEDB**    | Create databases                                     |
| **CREATEROLE**  | Create / alter / drop roles; grant memberships       |
| **BYPASSRLS**   | Skip RLS policies — admin/migrator, not app traffic  |
| **REPLICATION** | Initiate streaming replication connections           |

```sql title='alter attributes'
ALTER ROLE john WITH CREATEDB;
```

### Memberships — role hierarchy

- `GRANT group_role TO user_role` — member gets the group’s privileges
- Default **`INHERIT`**: object privileges of parent roles apply automatically
- **`NOINHERIT`**: must `SET ROLE group_role` to use those privileges

```sql title='membership'
GRANT engineering TO john;
-- CREATE ROLE readonly NOINHERIT LOGIN;  -- then SET ROLE … when needed
```

### Object privileges — granular access

Attributes = global powers. Object privileges = per-database-object access via `GRANT` / `REVOKE` (detail in section below).

| Object             | Common privileges                                                           |
| ------------------ | --------------------------------------------------------------------------- |
| **Tables / views** | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER` |
| **Schemas**        | `USAGE` (access objects inside), `CREATE` (create like table, index)        |
| **Functions**      | `EXECUTE`                                                                   |
| **Databases**      | `CONNECT`, `CREATE`, `TEMPORARY`                                            |

```sql title='grant to group, not each user'
GRANT USAGE ON SCHEMA api TO engineering;
GRANT SELECT, INSERT ON TABLE api.users TO engineering;
```

### Workflow

```text title='group → privileges → login → grant'
1. CREATE ROLE engineering;                          -- group, no LOGIN
2. GRANT … ON … TO engineering;                      -- object privileges on the group
3. CREATE ROLE john WITH LOGIN PASSWORD '...';       -- login (user)
4. GRANT engineering TO john;                        -- inherit
```

## Schemas

- **Schema** = namespace (`schema.table`). Not the same as “database schema” in casual speech (DDL overall)
- Control **who can create/see objects** with schema privileges: `USAGE` (see/use objects you already have grants on), `CREATE` (create objects)
- Prefer app objects in a dedicated schema (e.g. `app`); lock down or empty `public`

```sql title='schema privileges'
-- Namespace `app`; owner = migrator (omit AUTHORIZATION → owner = current user)
CREATE SCHEMA app AUTHORIZATION migrator;

GRANT USAGE ON SCHEMA app TO app_rw;
GRANT CREATE ON SCHEMA app TO migrator;   -- not to app_rw

-- optional: keep public locked
REVOKE CREATE ON SCHEMA public FROM PUBLIC; -- PUBLIC (uppercase) is a group Role
```

```sql title='search_path'
-- Unqualified names (e.g. SELECT * FROM documents) resolve in order:
--   1) app.documents → use it and stop
--   2) public.documents → if not in app
--   3) else: relation "documents" does not exist

-- Session only — gone when you disconnect
SET search_path TO app, public;

-- Permanent for role — applied automatically on every login (no manual SET)
ALTER ROLE app_user SET search_path TO app, public;
```

- **Convenience** — write `FROM documents JOIN users` instead of `app.documents` / `public.users`; path routes invisibly
- **Security (schema hijacking)** — put `app` **before** `public` so a fake `public.documents` never wins over legitimate `app.documents`

## GRANT / REVOKE / privileges

| Privilege                             | Typical object       | Allows                   |
| ------------------------------------- | -------------------- | ------------------------ |
| **CONNECT**                           | database             | Open a connection        |
| **USAGE**                             | schema / sequence    | Resolve/use objects      |
| **CREATE**                            | schema / database    | Create objects           |
| **SELECT / INSERT / UPDATE / DELETE** | table / view         | DML                      |
| **TRUNCATE**                          | table                | Empty table              |
| **REFERENCES**                        | table / columns      | Create FKs pointing here |
| **TRIGGER**                           | table                | Create triggers          |
| **EXECUTE**                           | function / procedure | Call it                  |
| **ALL PRIVILEGES**                    | object               | Everything applicable    |

```sql title='grant / revoke'
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT USAGE ON SCHEMA app TO app_rw;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA app
  TO app_rw;

-- Sequence = counter object behind SERIAL / IDENTITY (nextval / currval)
-- USAGE → call nextval(); SELECT → read currval() / last_value
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_rw;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app TO app_rw;

-- future objects created by migrator
ALTER DEFAULT PRIVILEGES FOR ROLE migrator IN SCHEMA app
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;

REVOKE INSERT, UPDATE, DELETE ON app.audit_log FROM app_rw;
GRANT SELECT ON app.audit_log TO app_rw;
```

```sql title='column privileges'
GRANT SELECT (id, email), UPDATE (email)
  ON app.users
  TO app_rw;
-- SELECT * fails if other columns exist without SELECT
```

- **`PUBLIC`** = every role. `REVOKE … FROM PUBLIC` removes the wide-open default
- Prefer granting to **group roles**, then `GRANT group TO login` — rotate people without rewriting object grants

## SQL injection

- Never concatenate user input into SQL text — use **bound parameters** (`$1`, `$2`, …)
- Structure is fixed; data is separate

```ts title='parameters not string concat'
// bad:  `SELECT * FROM users WHERE email = '${email}'`
await db.query("SELECT * FROM users WHERE email = $1", [email]);
```

## Row-Level Security (RLS)

- **RLS** = policies that filter which **rows** a role can see or write — on top of table `GRANT`s
- Classic use: **shared-schema multi-tenancy** (`tenant_id` + policy) so `SELECT * FROM documents` cannot leak other tenants
- Table owners / superusers **bypass** RLS unless you `FORCE ROW LEVEL SECURITY`

```text title='RLS flow'
query asks for rows
        ↓
RLS policies (USING / WITH CHECK)
        ↓
only permitted rows visible / writable
```

```sql title='enable + tenant policy'
ALTER TABLE app.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.documents FORCE ROW LEVEL SECURITY;  -- also apply to owner

CREATE POLICY tenant_isolation ON app.documents
  FOR ALL  -- SELECT + INSERT + UPDATE + DELETE (or use FOR SELECT / INSERT / …)
  TO app_rw
  -- USING: which existing rows can you see / touch (SELECT, UPDATE, DELETE)
  USING (tenant_id = current_setting('app.tenant_id')::bigint)
  -- WITH CHECK: which new row can you write (INSERT, UPDATE SET …)
  -- Without it: reads are filtered, but you could INSERT another tenant's id
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::bigint);
```

| Clause         | Applies to                        | Job                                        |
| -------------- | --------------------------------- | ------------------------------------------ |
| **USING**      | `SELECT` / existing rows for DML  | Which rows are visible / eligible          |
| **WITH CHECK** | `INSERT` / `UPDATE` new row image | Which new values are allowed to be written |

```ts title='set tenant per request'
await db.query("BEGIN");
await db.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantId]); // true = local to txn
await db.query("SELECT * FROM documents"); // RLS filters automatically
await db.query("COMMIT");
```

| Trap                     | Guidance                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| **Forgot `ENABLE`**      | Policies exist but do nothing until RLS is enabled on the table      |
| **Pool reuse**           | Always set tenant with `set_config(..., true)` / `SET LOCAL` per txn |
| **Missing `WITH CHECK`** | Reads filtered; writes can still plant another tenant’s id           |
| **Bypass roles**         | `BYPASSRLS` / superuser for migrator only — never app pool           |
| **Policy + index**       | Index `tenant_id` (often leading) so policies stay cheap             |

## Production

| Decision               | Guidance                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| **App vs migrator**    | Separate login roles; app = DML only; migrator = DDL + default privileges |
| **No superuser apps**  | Pool role never `SUPERUSER` / `BYPASSRLS`                                 |
| **Lock `public`**      | `REVOKE CREATE ON SCHEMA public FROM PUBLIC`                              |
| **Default privileges** | Set so new tables inherit grants to `app_rw` automatically                |
| **Secrets**            | Prefer scram-sha-256; rotate passwords; use IAM/cloud auth when available |
| **Audit**              | Log DDL / role changes; optional `pgaudit` for statement audit            |
