-- CreateTable
CREATE TABLE `Agency` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `agency_name` VARCHAR(191) NOT NULL,
    `telephone_number` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `subdistrict` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `type_id` BIGINT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `certificate` VARCHAR(191) NULL,
    `status_approve` ENUM('pending', 'approved', 'rejected') NULL,
    `approve_by` BIGINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agency_email_key`(`email`),
    UNIQUE INDEX `Agency_telephone_number_key`(`telephone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeAgency` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TypeAgency_type_name_key`(`type_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Officer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Officer_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageView` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `agency_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `page_url` VARCHAR(191) NOT NULL,
    `faculty` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `TypeAgency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageView` ADD CONSTRAINT `PageView_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `Agency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageView` ADD CONSTRAINT `PageView_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
