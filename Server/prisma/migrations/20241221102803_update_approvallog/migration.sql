/*
  Warnings:

  - You are about to drop the column `comment` on the `approvallog` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `ApprovalLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `approvallog` DROP COLUMN `comment`,
    ADD COLUMN `reason` VARCHAR(255) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
