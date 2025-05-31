-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_contextId_fkey";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context"("id") ON DELETE CASCADE ON UPDATE CASCADE;
