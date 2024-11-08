/*
  Warnings:

  - You are about to drop the column `comparisonId` on the `RootFolder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RootFolder" DROP CONSTRAINT "RootFolder_comparisonId_fkey";

-- AlterTable
ALTER TABLE "RootFolder" DROP COLUMN "comparisonId";

-- CreateTable
CREATE TABLE "_ComparisonToRootFolder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComparisonToRootFolder_AB_unique" ON "_ComparisonToRootFolder"("A", "B");

-- CreateIndex
CREATE INDEX "_ComparisonToRootFolder_B_index" ON "_ComparisonToRootFolder"("B");

-- AddForeignKey
ALTER TABLE "_ComparisonToRootFolder" ADD CONSTRAINT "_ComparisonToRootFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComparisonToRootFolder" ADD CONSTRAINT "_ComparisonToRootFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "RootFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
