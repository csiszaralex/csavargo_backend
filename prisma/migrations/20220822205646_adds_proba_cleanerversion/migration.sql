/*
  Warnings:

  - Added the required column `cleanProba` to the `Proba` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `proba` ADD COLUMN `cleanProba` VARCHAR(191) NOT NULL;
