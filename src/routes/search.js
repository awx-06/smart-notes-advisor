import express from 'express';
import { Prisma } from '@prisma/client';
import { generateEmbedding } from '../services/embeddings.js';
import { generateInsights } from '../services/advisor.js';
import prisma from '../db.js';

const router = express.Router();

/**
 * POST /search - Semantic search for similar notes
 * Body: { "query": "your search query", "limit": 5 }
 */
router.post('/', async (req, res) => {
  try {
    const { query, limit = 5, insights = false } = req.body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Query must be a non-empty string'
      });
    }

    console.log(`🔍 Searching for:  "${query}"`);

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);

    const vectorLiteral = `[${queryEmbedding.join(',')}]`;

    // Perform vector similarity search using pgvector
    const results = await prisma.$queryRaw(Prisma.sql`
      SELECT 
        "id",
        "content",
        "createdAt",
        1 - ("embedding" <=> ${vectorLiteral}::vector) as similarity
      FROM "Note"
      ORDER BY "embedding" <=> ${vectorLiteral}::vector
      LIMIT ${limit}
    `);

    console.log(`✅ Found ${results.length} similar notes`);

    // res.json({
    //   status: 'success',
    //   query,
    //   count: results.length,
    //   data: results.map(note => ({
    //     id: note.id,
    //     content: note.content,
    //     createdAt: note.createdAt,
    //     similarity: parseFloat(note.similarity.toFixed(4))
    //   }))
    // });

    // Format results
    const formattedResults = results.map(note => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt,
      similarity: parseFloat(note.similarity.toFixed(4))
    }));

    // Build response
    const response = {
      status: 'success',
      query: query,
      count: formattedResults.length,
      data: formattedResults
    };

    // If insights requested, generate AI Analysis
    if (insights && formattedResults.length > 0) {
      console.log('🤖 Generating AI insights for search results...');

      const aiInsights = await generateInsights(query, formattedResults);

      response.insights = aiInsights;

      console.log('✅ AI insights added to response');
    }

    res.json(response);

  } catch (error) {
    console.error('❌ Error searching notes:', error);
    res.status(500).json({
      status: 'error',
      message: error. message,
    });
  }
});

export default router;