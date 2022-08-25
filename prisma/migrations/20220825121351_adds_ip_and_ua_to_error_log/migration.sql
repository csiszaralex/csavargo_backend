/*
  Warnings:

  - Added the required column `ip` to the `Hiba` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ua` to the `Hiba` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hiba` ADD COLUMN `ip` VARCHAR(191) NOT NULL,
    ADD COLUMN `ua` VARCHAR(191) NOT NULL;
