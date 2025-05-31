/*
  Warnings:

  - A unique constraint covering the columns `[name,contextId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_contextId_key" ON "Activity"("name", "contextId");
