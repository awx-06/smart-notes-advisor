-- Setup script for PostgreSQL + pgvector
-- Run this after creating the database

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Test vector operations
CREATE TABLE IF NOT EXISTS test_vectors (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(3)
);

-- Sample data
INSERT INTO test_vectors (content, embedding) VALUES
  ('apple', '[1, 0, 0]'),
  ('banana', '[0.9, 0.1, 0]'),
  ('car', '[0, 0, 1]')
ON CONFLICT DO NOTHING;

-- Test similarity search
SELECT 
  content,
  embedding,
  1 - (embedding <=> '[1, 0, 0]') AS similarity
FROM test_vectors
ORDER BY embedding <=> '[1, 0, 0]'
LIMIT 2;

-- Cleanup test table (optional)
-- DROP TABLE test_vectors;