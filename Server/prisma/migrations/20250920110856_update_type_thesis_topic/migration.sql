-- DropForeignKey
ALTER TABLE `agency` DROP FOREIGN KEY `Agency_approve_by_fkey`;

-- DropForeignKey
ALTER TABLE `agency` DROP FOREIGN KEY `Agency_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `approvallog` DROP FOREIGN KEY `ApprovalLog_agency_id_fkey`;

-- DropForeignKey
ALTER TABLE `approvallog` DROP FOREIGN KEY `ApprovalLog_officer_id_fkey`;

-- DropForeignKey
ALTER TABLE `pageview` DROP FOREIGN KEY `PageView_agency_id_fkey`;

-- DropForeignKey
ALTER TABLE `pageview` DROP FOREIGN KEY `PageView_student_id_fkey`;

-- AddForeignKey
ALTER TABLE `agency` ADD CONSTRAINT `agency_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `typeagency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agency` ADD CONSTRAINT `agency_approve_by_fkey` FOREIGN KEY (`approve_by`) REFERENCES `officer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvallog` ADD CONSTRAINT `approvallog_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvallog` ADD CONSTRAINT `approvallog_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `officer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pageview` ADD CONSTRAINT `pageview_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pageview` ADD CONSTRAINT `pageview_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `ESS_Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `agency` RENAME INDEX `Agency_email_key` TO `agency_email_key`;

-- RenameIndex
ALTER TABLE `agency` RENAME INDEX `Agency_telephone_number_key` TO `agency_telephone_number_key`;

-- RenameIndex
ALTER TABLE `officer` RENAME INDEX `Officer_email_key` TO `officer_email_key`;

-- RenameIndex
ALTER TABLE `pageview` RENAME INDEX `PageView_agency_id_student_id_key` TO `pageview_agency_id_student_id_key`;

-- RenameIndex
ALTER TABLE `passwordreset` RENAME INDEX `PasswordReset_email_key` TO `passwordreset_email_key`;

-- RenameIndex
ALTER TABLE `typeagency` RENAME INDEX `TypeAgency_type_name_key` TO `typeagency_type_name_key`;
