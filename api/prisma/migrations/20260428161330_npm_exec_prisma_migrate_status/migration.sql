-- AlterTable
ALTER TABLE `Pedido` ADD COLUMN `cupomId` INTEGER NULL,
    ADD COLUMN `desconto` DOUBLE NOT NULL DEFAULT 0,
    ALTER COLUMN `subtotal` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Cupom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tipoDesconto` VARCHAR(191) NOT NULL,
    `valorDesconto` DOUBLE NOT NULL,
    `limiteUso` INTEGER NOT NULL,
    `validoAte` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Cupom_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_cupomId_fkey` FOREIGN KEY (`cupomId`) REFERENCES `Cupom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
