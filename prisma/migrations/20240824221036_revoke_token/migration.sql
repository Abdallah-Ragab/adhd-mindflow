-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskLog" DROP CONSTRAINT "TaskLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Timer" DROP CONSTRAINT "Timer_logId_fkey";

-- CreateTable
CREATE TABLE "revokedToken" (
    "signiture" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "revokedToken_pkey" PRIMARY KEY ("signiture")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_logId_fkey" FOREIGN KEY ("logId") REFERENCES "TaskLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revokedToken" ADD CONSTRAINT "revokedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
