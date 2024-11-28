/*
  Warnings:

  - Added the required column `role` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Made the column `telephone_number` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `certificate` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status_approve` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `approve_by` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Made the column `first_name` on table `officer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `officer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `agency` DROP FOREIGN KEY `Agency_approve_by_fkey`;

-- AlterTable
ALTER TABLE `agency` ADD COLUMN `role` ENUM('admin', 'agency') NOT NULL,
    MODIFY `telephone_number` VARCHAR(191) NOT NULL,
    MODIFY `certificate` VARCHAR(191) NOT NULL,
    MODIFY `status_approve` ENUM('pending', 'approved', 'rejected') NOT NULL,
    MODIFY `approve_by` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `officer` ADD COLUMN `role` ENUM('admin', 'agency') NOT NULL,
    MODIFY `first_name` VARCHAR(191) NOT NULL,
    MODIFY `last_name` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_approve_by_fkey` FOREIGN KEY (`approve_by`) REFERENCES `Officer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
