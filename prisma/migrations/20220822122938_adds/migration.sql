-- CreateTable
CREATE TABLE `Feladat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feladat` VARCHAR(191) NOT NULL,
    `megoldas` VARCHAR(191) NOT NULL DEFAULT '',
    `qrId` INTEGER NOT NULL,

    UNIQUE INDEX `Feladat_feladat_key`(`feladat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feladat` ADD CONSTRAINT `Feladat_qrId_fkey` FOREIGN KEY (`qrId`) REFERENCES `Qr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
