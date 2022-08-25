/*
  Warnings:

  - You are about to drop the column `csoportId` on the `hiba` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `hiba` DROP FOREIGN KEY `Hiba_csoportId_fkey`;

-- AlterTable
ALTER TABLE `hiba` DROP COLUMN `csoportId`,
    MODIFY `eloidezes` VARCHAR(191) NOT NULL DEFAULT '';
