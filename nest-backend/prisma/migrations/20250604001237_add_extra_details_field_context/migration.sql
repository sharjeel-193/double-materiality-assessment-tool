/*
  Warnings:

  - Added the required column `extra_details` to the `Context` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Context" ADD COLUMN     "extra_details" TEXT NOT NULL;
