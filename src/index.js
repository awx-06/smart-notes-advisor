import express from 'express';
import dotenv from 'dotenv';
import prisma from './db.js';
import { generateEmbedding } from './services/embeddings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Smart Notes Advisor',
    phase: 'Phase 3 - Embeddings Service'
  });
});

// ✅ Database connection test
app.get('/db-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    const count = await prisma.note.count();
    
    res.json({
      status: 'connected',
      message: 'Database connection successful',
      notesCount: count
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// ✅ Test embeddings endpoint
app.post('/test-embedding', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing required field: text'
      });
    }

    // Generate embedding
    const embedding = await generateEmbedding(text);

    res.json({
      status: 'success',
      text: text,
      embeddingDimensions: embedding.length,
      embeddingPreview: embedding.slice(0, 5), // First 5 numbers
      message: 'Embedding generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  DB test: http://localhost:${PORT}/db-test`);
  console.log(`🤖 Test embedding: POST http://localhost:${PORT}/test-embedding`);
});
