import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client.js";
import {
  createPedidoSchema,
  pedidoParamsSchema,
} from "../schemas/pedido.schema.js";

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

      let total = 0;
      const linhas = itens.map((linha) => {
        const itemDb = itensDbById.get(linha.itemId)!;
        const subtotal = itemDb.valor * linha.quantidade;
        total += subtotal;
        return {
          itemId: linha.itemId,
          quantidade: linha.quantidade,
          valorUnit: itemDb.valor,
        };
      });

      const pedido = await prisma.pedido.create({
        data: {
          nomeCliente,
          formaPagamento,
          total,
          itens: { create: linhas },
        },
        include: { itens: true },
      });

      return reply.status(201).send(pedido);
    }
  );

  app.get("/pedidos", async () => {
    const pedidos = await prisma.pedido.findMany({
      include: { itens: { include: { item: true } } },
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
        include: { itens: { include: { item: true } } },
      });

      if (!pedido) {
        return reply.status(404).send({ message: "Pedido não encontrado" });
      }

      return pedido;
    }
  );
}
