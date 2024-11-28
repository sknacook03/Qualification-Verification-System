/*
  Warnings:

  - Made the column `address` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subdistrict` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postal_code` on table `agency` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `agency` MODIFY `address` VARCHAR(191) NOT NULL DEFAULT '-',
    MODIFY `subdistrict` VARCHAR(191) NOT NULL DEFAULT '-',
    MODIFY `district` VARCHAR(191) NOT NULL DEFAULT '-',
    MODIFY `province` VARCHAR(191) NOT NULL DEFAULT '-',
    MODIFY `postal_code` VARCHAR(191) NOT NULL DEFAULT '-';
