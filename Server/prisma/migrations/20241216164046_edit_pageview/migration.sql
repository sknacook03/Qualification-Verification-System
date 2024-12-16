/*
  Warnings:

  - You are about to drop the column `ip_address` on the `pageview` table. All the data in the column will be lost.
  - You are about to drop the column `page_url` on the `pageview` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `pageview` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `PageView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pageview` DROP COLUMN `ip_address`,
    DROP COLUMN `page_url`,
    DROP COLUMN `user_agent`,
    ADD COLUMN `action_type` ENUM('VIEW', 'EXPORT', 'PRINT') NOT NULL DEFAULT 'VIEW',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
