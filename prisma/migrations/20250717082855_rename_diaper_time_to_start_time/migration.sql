/*
  Warnings:

  - You are about to drop the column `time` on the `Diaper` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Diaper` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Diaper_babyId_time_idx";

-- DropIndex
DROP INDEX "Diaper_babyId_userId_time_idx";

-- DropIndex
DROP INDEX "Diaper_userId_time_idx";

-- AlterTable
ALTER TABLE "Diaper" DROP COLUMN "time",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Diaper_babyId_startTime_idx" ON "Diaper"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Diaper_userId_startTime_idx" ON "Diaper"("userId", "startTime");

-- CreateIndex
CREATE INDEX "Diaper_babyId_userId_startTime_idx" ON "Diaper"("babyId", "userId", "startTime");
