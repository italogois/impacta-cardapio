import {
  createPedidoSchema,
  pedidoParamsSchema,
} from "../schemas/pedido.schema.js";

import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client.js";

interface PedidoItemInput {
  itemId: number;
  quantidade: number;
}

interface PedidoBody {
  nomeCliente: string;
  formaPagamento: string;
  itens: PedidoItemInput[];
}

interface PedidoParams {
  id: number;
}

export async function pedidoRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
) {
  app.post<{ Body: PedidoBody }>(
    "/pedidos",
    { schema: createPedidoSchema },
    async (request, reply) => {
      const { nomeCliente, formaPagamento, itens } = request.body;
      const codigoCupom = (request.body as any).codigoCupom;

      const itemIds = itens.map((i) => i.itemId);
      const itensDb = await prisma.item.findMany({
        where: { id: { in: itemIds } },
      });

      if (itensDb.length !== itemIds.length) {
        return reply
          .status(404)
          .send({ message: "Um ou mais itens não foram encontrados" });
      }

      const itensDbById = new Map(itensDb.map((i) => [i.id, i]));

      let subtotal = 0;
      const linhas = itens.map((linha) => {
        const itemDb = itensDbById.get(linha.itemId)!;
        const linhaSubtotal = itemDb.valor * linha.quantidade;
        subtotal += linhaSubtotal;
        return {
          itemId: linha.itemId,
          quantidade: linha.quantidade,
          valorUnit: itemDb.valor,
        };
      });

      if (codigoCupom) {
        const result = await prisma.$transaction(async (tx) => {
          const cupom = await tx.cupom.findUnique({
            where: { codigo: codigoCupom },
            include: { _count: { select: { pedidos: true } } },
          });

          if (!cupom) {
            return reply.status(400).send({ message: "Cupom não encontrado" });
          }
          if (!cupom.ativo) {
            return reply.status(400).send({ message: "Cupom inativo" });
          }
          if (cupom.validoAte && new Date(cupom.validoAte) < new Date()) {
            return reply.status(400).send({ message: "Cupom expirado" });
          }
          if (cupom._count && cupom._count.pedidos >= cupom.limiteUso) {
            return reply.status(400).send({ message: "Cupom esgotado" });
          }

          let desconto = 0;
          if (cupom.tipoDesconto === "percentual") {
            desconto = (subtotal * cupom.valorDesconto) / 100;
          } else {
            desconto = cupom.valorDesconto;
          }
          if (desconto > subtotal) desconto = subtotal;

          const total = subtotal - desconto;

          const pedido = await tx.pedido.create({
            data: {
              nomeCliente,
              formaPagamento,
              subtotal,
              desconto,
              total,
              cupomId: cupom.id,
              itens: { create: linhas },
            },
            include: { itens: true },
          });

          return pedido;
        });

        if (!result || (result as any).statusCode) return;
        return reply.status(201).send(result);
      }

      const pedido = await prisma.pedido.create({
        data: {
          nomeCliente,
          formaPagamento,
          subtotal,
          desconto: 0,
          total: subtotal,
          itens: { create: linhas },
        },
        include: { itens: true },
      });

      return reply.status(201).send(pedido);
    }
  );

  app.get("/pedidos", async () => {
    const pedidos = await prisma.pedido.findMany({
      include: { itens: { include: { item: true } }, cupom: { select: { codigo: true } } },
      orderBy: { criadoEm: "desc" },
    });
    return pedidos;
  });

  app.get<{ Params: PedidoParams }>(
    "/pedidos/:id",
    { schema: pedidoParamsSchema },
    async (request, reply) => {
      const pedido = await prisma.pedido.findUnique({
        where: { id: request.params.id },
        include: { itens: { include: { item: true } }, cupom: { select: { codigo: true } } },
      });

      if (!pedido) {
        return reply.status(404).send({ message: "Pedido não encontrado" });
      }

      return pedido;
    }
  );
}
