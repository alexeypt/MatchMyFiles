/*
  Warnings:

  - Added the required column `folderContentModifiedDate` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderCreatedDate` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderModifiedDate` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "folderContentModifiedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "folderCreatedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "folderModifiedDate" TIMESTAMP(3) NOT NULL;
