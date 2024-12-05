/*
  Warnings:

  - You are about to drop the column `status_after` on the `approvallog` table. All the data in the column will be lost.
  - You are about to drop the column `status_before` on the `approvallog` table. All the data in the column will be lost.
  - Added the required column `status_approve` to the `ApprovalLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `approvallog` DROP COLUMN `status_after`,
    DROP COLUMN `status_before`,
    ADD COLUMN `status_approve` ENUM('pending', 'approved', 'rejected') NOT NULL,
    MODIFY `comment` VARCHAR(255) NULL;
