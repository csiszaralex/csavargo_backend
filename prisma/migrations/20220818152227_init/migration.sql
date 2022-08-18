-- CreateTable
CREATE TABLE `Csoport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oztaly` VARCHAR(191) NOT NULL,
    `csoport` INTEGER NOT NULL,
    `kod` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Csoport_kod_key`(`kod`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Qr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kod` VARCHAR(191) NOT NULL,
    `ertek` INTEGER NOT NULL DEFAULT 1,
    `hasznalhato` INTEGER NOT NULL DEFAULT 1,
    `lat` DECIMAL(65, 30) NOT NULL,
    `lng` DECIMAL(65, 30) NOT NULL,

    UNIQUE INDEX `Qr_kod_key`(`kod`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QrCsoport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qrId` INTEGER NOT NULL,
    `csoportId` INTEGER NOT NULL,
    `mikor` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QrCsoport` ADD CONSTRAINT `QrCsoport_qrId_fkey` FOREIGN KEY (`qrId`) REFERENCES `Qr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QrCsoport` ADD CONSTRAINT `QrCsoport_csoportId_fkey` FOREIGN KEY (`csoportId`) REFERENCES `Csoport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
