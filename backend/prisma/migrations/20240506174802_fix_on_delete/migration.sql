-- DropForeignKey
ALTER TABLE "Citation" DROP CONSTRAINT "Citation_sourceId_fkey";

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
