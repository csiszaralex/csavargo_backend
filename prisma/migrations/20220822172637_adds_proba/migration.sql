-- CreateTable
CREATE TABLE `Proba` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proba` VARCHAR(191) NOT NULL,
    `mikor` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `csoportId` INTEGER NOT NULL,
    `feladatId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Proba` ADD CONSTRAINT `Proba_csoportId_fkey` FOREIGN KEY (`csoportId`) REFERENCES `Csoport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proba` ADD CONSTRAINT `Proba_feladatId_fkey` FOREIGN KEY (`feladatId`) REFERENCES `Feladat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
