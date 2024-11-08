/*
  Warnings:

  - You are about to drop the column `primaryRootFolderId` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the `_RootFolders` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ComparisonProcessingStatus" AS ENUM ('Created', 'Processing', 'Completed');

-- DropForeignKey
ALTER TABLE "Comparison" DROP CONSTRAINT "Comparison_primaryRootFolderId_fkey";

-- DropForeignKey
ALTER TABLE "_RootFolders" DROP CONSTRAINT "_RootFolders_A_fkey";

-- DropForeignKey
ALTER TABLE "_RootFolders" DROP CONSTRAINT "_RootFolders_B_fkey";

-- AlterTable
ALTER TABLE "Comparison" DROP COLUMN "primaryRootFolderId",
ADD COLUMN     "status" "ComparisonProcessingStatus" NOT NULL DEFAULT 'Created';

-- AlterTable
ALTER TABLE "RootFolder" ADD COLUMN     "comparisonId" INTEGER;

-- DropTable
DROP TABLE "_RootFolders";

-- CreateTable
CREATE TABLE "ComparisonRootFolder" (
    "comparisonId" INTEGER NOT NULL,
    "rootFolderId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,

    CONSTRAINT "ComparisonRootFolder_pkey" PRIMARY KEY ("comparisonId","rootFolderId")
);

-- AddForeignKey
ALTER TABLE "ComparisonRootFolder" ADD CONSTRAINT "ComparisonRootFolder_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonRootFolder" ADD CONSTRAINT "ComparisonRootFolder_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "RootFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
