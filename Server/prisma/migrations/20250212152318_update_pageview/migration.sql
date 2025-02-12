/*
  Warnings:

  - A unique constraint covering the columns `[agency_id,student_id]` on the table `PageView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PageView_agency_id_student_id_key` ON `PageView`(`agency_id`, `student_id`);
