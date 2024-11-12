-- DropForeignKey
ALTER TABLE "ComparisonRootFolder" DROP CONSTRAINT "ComparisonRootFolder_rootFolderId_fkey";

-- AddForeignKey
ALTER TABLE "ComparisonRootFolder" ADD CONSTRAINT "ComparisonRootFolder_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "RootFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
