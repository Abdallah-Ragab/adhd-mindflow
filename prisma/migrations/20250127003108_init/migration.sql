-- CreateEnum
CREATE TYPE "Event" AS ENUM ('taskCreated', 'taskUpdated', 'taskDeleted', 'taskDone', 'taskUndone', 'timerStart', 'timerStop', 'SubTaskDone', 'SubTaskUndone', 'countUp', 'countDown');

-- CreateEnum
CREATE TYPE "Schedule" AS ENUM ('daily', 'weekly', 'custom', 'once');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('time', 'count', 'checklist', 'checkbox');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revokedToken" (
    "signature" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "revokedToken_pkey" PRIMARY KEY ("signature")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "TaskType" NOT NULL,
    "goal" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,
    "schedule" "Schedule" NOT NULL,
    "dueDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "isTimerRunning" BOOLEAN NOT NULL DEFAULT false,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "unit" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLog" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "event" "Event" NOT NULL,
    "subTaskId" INTEGER,

    CONSTRAINT "TaskLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSchedule" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "fri" BOOLEAN NOT NULL DEFAULT true,
    "sat" BOOLEAN NOT NULL DEFAULT true,
    "sun" BOOLEAN NOT NULL DEFAULT true,
    "mon" BOOLEAN NOT NULL DEFAULT true,
    "tue" BOOLEAN NOT NULL DEFAULT true,
    "wed" BOOLEAN NOT NULL DEFAULT true,
    "thu" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CustomSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomSchedule_taskId_key" ON "CustomSchedule"("taskId");

-- AddForeignKey
ALTER TABLE "revokedToken" ADD CONSTRAINT "revokedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "SubTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSchedule" ADD CONSTRAINT "CustomSchedule_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
