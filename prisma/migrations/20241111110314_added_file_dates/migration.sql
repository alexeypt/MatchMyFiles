/*
  Warnings:

  - Added the required column `fileContentModifiedDate` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileCreatedDate` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileModifiedDate` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileContentModifiedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fileCreatedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fileModifiedDate" TIMESTAMP(3) NOT NULL;
