/*
  Warnings:

  - Added the required column `size` to the `RootFolder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RootFolder" ADD COLUMN     "size" BIGINT NOT NULL;
