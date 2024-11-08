/*
  Warnings:

  - You are about to drop the `_ComparisonToRootFolder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rootFolderId` to the `Comparison` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ComparisonToRootFolder" DROP CONSTRAINT "_ComparisonToRootFolder_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComparisonToRootFolder" DROP CONSTRAINT "_ComparisonToRootFolder_B_fkey";

-- AlterTable
ALTER TABLE "Comparison" ADD COLUMN     "primaryRootFolderId" INTEGER,
ADD COLUMN     "rootFolderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ComparisonToRootFolder";

-- CreateTable
CREATE TABLE "_RootFolders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RootFolders_AB_unique" ON "_RootFolders"("A", "B");

-- CreateIndex
CREATE INDEX "_RootFolders_B_index" ON "_RootFolders"("B");

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_primaryRootFolderId_fkey" FOREIGN KEY ("primaryRootFolderId") REFERENCES "RootFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RootFolders" ADD CONSTRAINT "_RootFolders_A_fkey" FOREIGN KEY ("A") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RootFolders" ADD CONSTRAINT "_RootFolders_B_fkey" FOREIGN KEY ("B") REFERENCES "RootFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
