# 🧠 Smart Notes Advisor

> Learning project: Embeddings + pgvector + RAG + Backend AI

## 📚 What This Project Teaches

- ✅ How to generate embeddings with OpenAI
- ✅ How to store vectors in PostgreSQL (pgvector)
- ✅ How to perform semantic similarity search
- ✅ How to implement RAG (Retrieval-Augmented Generation)
- ✅ How to build backend-only AI features

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL + pgvector

**Using Docker (Recommended):**
```bash
docker run -d \
  --name smart-notes-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_notes \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

**Enable pgvector extension:**
```bash
docker exec -it smart-notes-db psql -U postgres -d smart_notes -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**Run setup script:**
```bash
docker exec -i smart-notes-db psql -U postgres -d smart_notes < scripts/setup-database.sql
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Example `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_notes"
OPENAI_API_KEY="sk-..."
PORT=3000
```

### 4. Run the Server

```bash
npm run dev
```

### 5. Test Health Check

```bash
curl http://localhost:3000/health
```

---

## 📋 Progress Tracker

- [x] Phase 0 — Project Setup
- [x] Phase 1 — PostgreSQL + pgvector
- [ ] Phase 2 — Prisma Schema
- [ ] Phase 3 — Embeddings Service
- [ ] Phase 4 — Add Note Endpoint
- [ ] Phase 5 — Vector Similarity Search
- [ ] Phase 6 — RAG Prompt Builder
- [ ] Phase 7 — Ask Endpoint (RAG)
- [ ] Phase 8 — Security & Discipline
- [ ] Phase 9 — Debug & Learn
- [ ] Phase 10 — Cleanup & Reflection

---

## 🧪 Testing Each Phase

### Phase 0
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok",...}
```

### Phase 1
```bash
# Test pgvector is working
docker exec -it smart-notes-db psql -U postgres -d smart_notes -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

# Test vector operations
docker exec -i smart-notes-db psql -U postgres -d smart_notes < scripts/setup-database.sql
```

---

## 📖 Key Concepts

### What are Embeddings?
Embeddings are numerical representations of text that capture semantic meaning. Similar texts have similar vectors.

### What is pgvector?
A PostgreSQL extension that adds vector data types and similarity search capabilities.

**Similarity Operators:**
- `<=>` Cosine distance (most common for text embeddings)
- `<->` L2/Euclidean distance
- `<#>` Inner product

### What is RAG?
Retrieval-Augmented Generation: Using a database to find relevant context before asking an AI to generate a response.

---

## 🎓 Learning Goals

By the end of this project, you will understand:

- Why embeddings exist
- Why vector DB ≠ normal DB
- RAG vs fine-tuning
- How to build AI features confidently

---

## 🔜 Next Steps

After completing all phases, this foundation can be ported directly into larger applications.