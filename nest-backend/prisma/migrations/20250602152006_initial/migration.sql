-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TEAM_LEADER', 'TEAM_MEMBER');

-- CreateEnum
CREATE TYPE "OrderOfImpact" AS ENUM ('IMMEDIATE', 'ENABLING', 'STRUCTURAL');

-- CreateEnum
CREATE TYPE "ImpactType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "FinancialType" AS ENUM ('RISK', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('IMPACT', 'FINANCIAL');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('INTERNAL', 'STAKEHOLDER');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "totalTopics" INTEGER NOT NULL DEFAULT 0,
    "materialTopics" INTEGER NOT NULL DEFAULT 0,
    "totalImpacts" INTEGER NOT NULL DEFAULT 0,
    "materialImpacts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impact" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL,
    "scope" DOUBLE PRECISION NOT NULL,
    "irremediability" DOUBLE PRECISION NOT NULL,
    "likelihood" DOUBLE PRECISION NOT NULL,
    "type" "ImpactType" NOT NULL,
    "orderOfEffect" "OrderOfImpact" NOT NULL,
    "topicId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "Impact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likelihood" DOUBLE PRECISION NOT NULL,
    "magnitude" DOUBLE PRECISION NOT NULL,
    "type" "FinancialType" NOT NULL,
    "topicId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "RiskOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TEAM_MEMBER',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dimension" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,

    CONSTRAINT "Dimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dimensionId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "stakeholderId" TEXT,
    "type" "SubmissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicRating" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "ratingType" "RatingType" NOT NULL,
    "relevance" DOUBLE PRECISION NOT NULL,
    "magnitude" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION,
    "remarks" TEXT,

    CONSTRAINT "TopicRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakeholderRating" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "influence" DOUBLE PRECISION NOT NULL,
    "impact" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION,

    CONSTRAINT "StakeholderRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Standard_name_key" ON "Standard"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dimension_name_standardId_key" ON "Dimension"("name", "standardId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_dimensionId_key" ON "Topic"("name", "dimensionId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicRating_submissionId_topicId_ratingType_key" ON "TopicRating"("submissionId", "topicId", "ratingType");

-- CreateIndex
CREATE UNIQUE INDEX "StakeholderRating_submissionId_stakeholderId_key" ON "StakeholderRating"("submissionId", "stakeholderId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impact" ADD CONSTRAINT "Impact_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impact" ADD CONSTRAINT "Impact_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskOpportunity" ADD CONSTRAINT "RiskOpportunity_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskOpportunity" ADD CONSTRAINT "RiskOpportunity_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dimension" ADD CONSTRAINT "Dimension_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_dimensionId_fkey" FOREIGN KEY ("dimensionId") REFERENCES "Dimension"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "Stakeholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicRating" ADD CONSTRAINT "TopicRating_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicRating" ADD CONSTRAINT "TopicRating_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderRating" ADD CONSTRAINT "StakeholderRating_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderRating" ADD CONSTRAINT "StakeholderRating_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
