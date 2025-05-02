/*
  Warnings:

  - A unique constraint covering the columns `[student_no]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Student_student_no_key` ON `Student`(`student_no`);
