/*
  Warnings:

  - The primary key for the `revokedToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `signiture` on the `revokedToken` table. All the data in the column will be lost.
  - Added the required column `signature` to the `revokedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "revokedToken" DROP CONSTRAINT "revokedToken_pkey",
DROP COLUMN "signiture",
ADD COLUMN     "signature" TEXT NOT NULL,
ADD CONSTRAINT "revokedToken_pkey" PRIMARY KEY ("signature");
