/*
  Warnings:

  - You are about to drop the column `scoreQuadrant` on the `Stakeholder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stakeholder" DROP COLUMN "scoreQuadrant",
ADD COLUMN     "avgImpact" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "avgInfluence" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
