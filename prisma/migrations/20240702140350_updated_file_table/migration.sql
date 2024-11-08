/*
  Warnings:

  - You are about to drop the column `path` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `absolutePath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativePath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `absolutePath` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativePath` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "path",
ADD COLUMN     "absolutePath" TEXT NOT NULL,
ADD COLUMN     "relativePath" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "path",
ADD COLUMN     "absolutePath" TEXT NOT NULL,
ADD COLUMN     "relativePath" TEXT NOT NULL;
