/*
  Warnings:

  - You are about to drop the column `endTime` on the `Feeding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feeding" DROP COLUMN "endTime",
ADD COLUMN     "duration" DOUBLE PRECISION;
