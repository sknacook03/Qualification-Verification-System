/*
  Warnings:

  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pageview` DROP FOREIGN KEY `PageView_student_id_fkey`;

-- DropTable
DROP TABLE `student`;

-- CreateTable
CREATE TABLE `ESS_Student` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `year_no` INTEGER NOT NULL,
    `semester_no` INTEGER NOT NULL,
    `student_no` VARCHAR(191) NOT NULL,
    `std_year_no` INTEGER NOT NULL,
    `prefix_name` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lname` VARCHAR(191) NOT NULL,
    `cca` INTEGER NULL,
    `gpa` DOUBLE NULL,
    `status_graduate` INTEGER NULL,
    `graduate_date` DATETIME(3) NULL,
    `deg_name` VARCHAR(191) NULL,
    `honors` VARCHAR(191) NULL,
    `thesis_topic_th` VARCHAR(191) NULL,
    `thesis_topic_en` VARCHAR(191) NULL,
    `dept_code` INTEGER NULL,
    `curr_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ESS_Student_student_no_key`(`student_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageView` ADD CONSTRAINT `PageView_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `ESS_Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
