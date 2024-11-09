/*
  Warnings:

  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_TeamMembers` DROP FOREIGN KEY `_TeamMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TeamMembers` DROP FOREIGN KEY `_TeamMembers_B_fkey`;

-- AlterTable
ALTER TABLE `Team` ADD COLUMN `userId` INTEGER NULL;

-- DropTable
DROP TABLE `_TeamMembers`;

-- CreateIndex
CREATE UNIQUE INDEX `Project_teamId_key` ON `Project`(`teamId`);

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
