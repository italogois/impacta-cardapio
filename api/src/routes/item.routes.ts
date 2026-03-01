import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client.js";
import {
  createItemSchema,
  updateItemSchema,
  itemParamsSchema,
} from "../schemas/item.schema.js";

interface ItemBody {
  nome: string;
  descricao: string;
  imagem: string;
  valor: number;
  categoria: string;
}

interface ItemParams {
  id: number;
}

export async function itemRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.post<{ Body: ItemBody }>(
    "/itens",
    { schema: createItemSchema },
    async (request, reply) => {
      const item = await prisma.item.create({ data: request.body });
      return reply.status(201).send(item);
    }
  );

  app.get("/itens", async () => {
    const itens = await prisma.item.findMany();
    return itens;
  });

  app.get<{ Params: ItemParams }>(
    "/itens/:id",
    { schema: itemParamsSchema },
    async (request, reply) => {
      const item = await prisma.item.findUnique({
        where: { id: request.params.id },
      });

      if (!item) {
        return reply.status(404).send({ message: "Item não encontrado" });
      }

      return item;
    }
  );

  app.put<{ Params: ItemParams; Body: Partial<ItemBody> }>(
    "/itens/:id",
    { schema: { ...itemParamsSchema, ...updateItemSchema } },
    async (request, reply) => {
      const item = await prisma.item.update({
        where: { id: request.params.id },
        data: request.body,
      });
      return item;
    }
  );

  app.delete<{ Params: ItemParams }>(
    "/itens/:id",
    { schema: itemParamsSchema },
    async (request, reply) => {
      await prisma.item.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    }
  );
}
