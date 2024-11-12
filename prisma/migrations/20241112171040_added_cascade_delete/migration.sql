-- DropForeignKey
ALTER TABLE "ComparisonRootFolder" DROP CONSTRAINT "ComparisonRootFolder_comparisonId_fkey";

-- DropForeignKey
ALTER TABLE "ComparisonRootFolder" DROP CONSTRAINT "ComparisonRootFolder_rootFolderId_fkey";

-- AddForeignKey
ALTER TABLE "ComparisonRootFolder" ADD CONSTRAINT "ComparisonRootFolder_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonRootFolder" ADD CONSTRAINT "ComparisonRootFolder_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "RootFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
