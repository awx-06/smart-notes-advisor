# Phase 1: PostgreSQL + pgvector

## Goal
Set up PostgreSQL with pgvector extension and verify vector operations work.

---

## Setup Steps

### 1. Start PostgreSQL

**Using Docker (Recommended):**
```bash
docker run -d \
  --name smart-notes-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_notes \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

**Or install locally** (see main README)

---

### 2. Update .env

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_notes"
```

---

### 3. Enable pgvector

```bash
# Connect to database
docker exec -it smart-notes-db psql -U postgres -d smart_notes

# Or locally
psql -U postgres -d smart_notes
```

Then run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

### 4. Test Vector Operations

Run the setup script:
```bash
docker exec -i smart-notes-db psql -U postgres -d smart_notes < scripts/setup-database.sql
```

---

## Key Concepts

### Vector Data Type
```sql
embedding VECTOR(1536)  -- OpenAI's embedding size
```

### Similarity Operators

| Operator | Description | Use Case |
|----------|-------------|----------|
| `<=>` | Cosine distance | Most common for embeddings |
| `<->` | L2 distance (Euclidean) | Geometric similarity |
| `<#>` | Inner product | Dot product similarity |

### Example Query
```sql
-- Find top 3 most similar notes
SELECT content, 1 - (embedding <=> $1) AS similarity
FROM notes
ORDER BY embedding <=> $1
LIMIT 3;
```

---

## Testing Phase 1

✅ **Checklist:**
- [ ] PostgreSQL is running
- [ ] pgvector extension is enabled
- [ ] Test table can store vectors
- [ ] Similarity search returns correct results
- [ ] DATABASE_URL is in .env

---

## Common Issues

### "extension vector does not exist"
→ Install pgvector: https://github.com/pgvector/pgvector#installation

### "could not connect to server"
→ Check PostgreSQL is running: `docker ps` or `brew services list`

### "syntax error at or near VECTOR"
→ pgvector extension not enabled. Run `CREATE EXTENSION vector;`

---

## Next: Phase 2

Once vector operations work, we'll integrate with Prisma to manage the schema in code.