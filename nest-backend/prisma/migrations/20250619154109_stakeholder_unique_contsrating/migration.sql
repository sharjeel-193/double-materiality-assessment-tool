/*
  Warnings:

  - A unique constraint covering the columns `[name,activityId]` on the table `Stakeholder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder_name_activityId_key" ON "Stakeholder"("name", "activityId");
