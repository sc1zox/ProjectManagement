/*
  Warnings:

  - A unique constraint covering the columns `[vorname,nachname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nachname` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vorname` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `nachname` VARCHAR(191) NOT NULL,
    MODIFY `vorname` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_vorname_nachname_key` ON `User`(`vorname`, `nachname`);
