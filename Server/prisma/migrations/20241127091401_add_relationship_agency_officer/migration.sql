-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_approve_by_fkey` FOREIGN KEY (`approve_by`) REFERENCES `Officer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
