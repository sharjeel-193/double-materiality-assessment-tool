/*
  Warnings:

  - You are about to drop the column `materialImpacts` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "materialImpacts",
ADD COLUMN     "ImpactRadar" JSONB DEFAULT '{}',
ADD COLUMN     "Status" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "Summary" JSONB DEFAULT '{}',
ADD COLUMN     "financialRadar" JSONB DEFAULT '{}',
ADD COLUMN     "importantStakeholders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "topStakeholders" JSONB DEFAULT '[]',
ADD COLUMN     "topTopics" JSONB DEFAULT '[]',
ADD COLUMN     "totalFinancialEffects" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStakeholders" INTEGER NOT NULL DEFAULT 0;
