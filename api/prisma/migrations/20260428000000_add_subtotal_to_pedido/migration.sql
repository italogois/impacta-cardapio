-- AlterTable
ALTER TABLE `Pedido`
    ADD COLUMN `subtotal` DOUBLE NOT NULL DEFAULT 0 AFTER `nomeCliente`;
