-- DropForeignKey
ALTER TABLE `agency` DROP FOREIGN KEY `Agency_approve_by_fkey`;

-- AlterTable
ALTER TABLE `agency` MODIFY `approve_by` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_approve_by_fkey` FOREIGN KEY (`approve_by`) REFERENCES `Officer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
