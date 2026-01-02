import express from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import prisma from '../db.js';
import { generateEmbedding } from '../services/embeddings.js';

const router = express.Router();

/**
 * POST /notes - Add a new note with embedding
 * Body: { "content": "Your note text here" }
 */
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Content must be a non-empty string'
      });
    }

    console.log(`📝 Creating note:  "${content. substring(0, 50)}..."`);

    // Generate embedding
    const embedding = await generateEmbedding(content);
    const vectorLiteral = `[${embedding.join(',')}]`;
    const id = randomUUID();

    // Insert using raw SQL because Prisma does not support pgvector yet
    const inserted = await prisma.$queryRaw(Prisma.sql`
      INSERT INTO "Note" ("id", "content", "embedding", "updatedAt")
      VALUES (${id}, ${content}, ${vectorLiteral}::vector, NOW())
      RETURNING "id", "content", "createdAt", "updatedAt";
    `);

    const note = Array.isArray(inserted) ? inserted[0] : inserted;
    console.log(`✅ Note created with ID: ${note.id}`);

    res.status(201).json({
      status: 'success',
      data: {
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        embeddingDimensions: embedding.length,
      },
    });
  } catch (error) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({
      status: 'error',
      message:  error.message,
    });
  }
});

/**
 * GET /notes - List all notes
 */
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        // Don't return embeddings (too large)
      },
    });

    res.json({
      status: 'success',
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * GET /notes/: id - Get a specific note
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!note) {
      return res. status(404).json({
        status: 'error',
        message: 'Note not found',
      });
    }

    res.json({
      status: 'success',
      data:  note,
    });
  } catch (error) {
    console.error('❌ Error fetching note:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;