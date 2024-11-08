-- CreateEnum
CREATE TYPE "RootFolderProcessingStatus" AS ENUM ('Created', 'Processing', 'Completed');

-- AlterTable
ALTER TABLE "RootFolder" ADD COLUMN     "status" "RootFolderProcessingStatus" NOT NULL DEFAULT 'Created';
