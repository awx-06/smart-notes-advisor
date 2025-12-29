-- AlterTable
ALTER TABLE "notes" DROP COLUMN "embedding";
ALTER TABLE "notes" ADD COLUMN "embedding" vector(768);
