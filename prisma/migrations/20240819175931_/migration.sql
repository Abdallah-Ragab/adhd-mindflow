/*
  Warnings:

  - You are about to drop the column `sauterday` on the `Schedule` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Task_userId_key";

-- DropIndex
DROP INDEX "TaskLog_taskId_key";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "sauterday",
ADD COLUMN     "saturday" BOOLEAN NOT NULL DEFAULT true;
