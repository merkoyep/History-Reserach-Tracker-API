/*
  Warnings:

  - You are about to drop the `_CitationToSource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sourceId` to the `Citation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CitationToSource" DROP CONSTRAINT "_CitationToSource_A_fkey";

-- DropForeignKey
ALTER TABLE "_CitationToSource" DROP CONSTRAINT "_CitationToSource_B_fkey";

-- AlterTable
ALTER TABLE "Citation" ADD COLUMN     "sourceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CitationToSource";

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
