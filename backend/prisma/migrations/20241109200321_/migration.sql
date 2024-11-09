-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_roadmapId_fkey`;

-- AlterTable
ALTER TABLE `team` MODIFY `roadmapId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `Roadmap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
