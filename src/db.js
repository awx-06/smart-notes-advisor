import { PrismaClient } from '@prisma/client';

// Create a single Prisma Client instance
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Log queries during development
});

export default prisma;