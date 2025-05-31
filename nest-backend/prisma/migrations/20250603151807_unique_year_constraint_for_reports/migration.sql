/*
  Warnings:

  - A unique constraint covering the columns `[companyId,year]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_companyId_year_key" ON "Report"("companyId", "year");
