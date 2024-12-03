-- CreateTable
CREATE TABLE `ApprovalLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `agency_id` BIGINT NOT NULL,
    `officer_id` BIGINT NULL,
    `status_before` ENUM('pending', 'approved', 'rejected') NOT NULL,
    `status_after` ENUM('pending', 'approved', 'rejected') NOT NULL,
    `comment` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApprovalLog` ADD CONSTRAINT `ApprovalLog_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `Agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalLog` ADD CONSTRAINT `ApprovalLog_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `Officer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
