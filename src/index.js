import express from 'express';
import dotenv from 'dotenv';
import prisma from './db.js';

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
    phase: 'Phase 2 - Prisma Integration'
  });
});

// ✅ Database connection test
app.get('/db-test', async (req, res) => {
  try {
    // Execute a simple query to test connection
    await prisma.$queryRaw`SELECT 1 as test`;
    
    // Count notes in database
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
});