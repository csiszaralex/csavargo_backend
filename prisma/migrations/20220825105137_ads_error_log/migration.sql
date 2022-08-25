-- CreateTable
CREATE TABLE `Hiba` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `link` VARCHAR(191) NOT NULL,
    `leiras` VARCHAR(191) NOT NULL,
    `eloidezes` VARCHAR(191) NOT NULL,
    `csoportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hiba` ADD CONSTRAINT `Hiba_csoportId_fkey` FOREIGN KEY (`csoportId`) REFERENCES `Csoport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
