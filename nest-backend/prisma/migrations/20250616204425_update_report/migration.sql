/*
  Warnings:

  - You are about to drop the column `ImpactRadar` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `Summary` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "ImpactRadar",
DROP COLUMN "Status",
DROP COLUMN "Summary",
ADD COLUMN     "impactRadar" JSONB DEFAULT '{}',
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "summary" JSONB DEFAULT '{}';
