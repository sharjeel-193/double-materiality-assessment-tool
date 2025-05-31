-- CreateEnum
CREATE TYPE "LocationScope" AS ENUM ('LOCAL', 'NATIONAL', 'CONTINENTAL', 'GLOBAL');

-- CreateEnum
CREATE TYPE "ContextType" AS ENUM ('PRODUCTION', 'TRADE', 'SERVICE', 'EXTRACTION');

-- CreateEnum
CREATE TYPE "BusinessForm" AS ENUM ('SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'CORPORATION');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SMALLER', 'SMALL', 'MEDIUM', 'BIG');

-- CreateTable
CREATE TABLE "Context" (
    "id" TEXT NOT NULL,
    "location" "LocationScope" NOT NULL,
    "type" "ContextType" NOT NULL,
    "form" "BusinessForm" NOT NULL,
    "size_employees" "CompanySize" NOT NULL,
    "size_revenue" "CompanySize" NOT NULL,
    "customer_scope" "LocationScope" NOT NULL,
    "supply_chain_scope" "LocationScope" NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Context_reportId_key" ON "Context"("reportId");

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
