/*
  Warnings:

  - You are about to drop the column `username` on the `officer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Officer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Officer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Officer_username_key` ON `officer`;

-- AlterTable
ALTER TABLE `officer` DROP COLUMN `username`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Officer_email_key` ON `Officer`(`email`);
