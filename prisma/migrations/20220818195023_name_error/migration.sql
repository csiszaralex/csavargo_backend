/*
  Warnings:

  - You are about to drop the column `oztaly` on the `csoport` table. All the data in the column will be lost.
  - Added the required column `osztaly` to the `Csoport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `csoport` DROP COLUMN `oztaly`,
    ADD COLUMN `osztaly` VARCHAR(191) NOT NULL;
