import {
  createCupomSchema,
  cupomParamsSchema,
  updateCupomSchema,
} from "../schemas/cupom.schema.js";

import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma/client.js";

interface CupomBody {
  codigo: string;
  descricao: string;
  tipoDesconto: string;
  valorDesconto: number;
  limiteUso: number;
  validoAte?: string;
  ativo?: boolean;
}

interface CupomParams {
  id: number;
}

export async function cupomRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.post<{ Body: CupomBody }>(
    "/cupons",
    { schema: createCupomSchema },
    async (request, reply) => {
      const body = request.body;
      const cupom = await prisma.cupom.create({ data: body as any });
      return reply.status(201).send(cupom);
    }
  );

  app.get("/cupons", async () => {
    const cupons = await prisma.cupom.findMany({
      include: { _count: { select: { pedidos: true } } },
      orderBy: { criadoEm: "desc" },
    });
    return cupons;
  });

  app.get<{ Params: CupomParams }>(
    "/cupons/:id",
    { schema: cupomParamsSchema },
    async (request, reply) => {
      const cupom = await prisma.cupom.findUnique({
        where: { id: request.params.id },
        include: {
          pedidos: {
            select: { id: true, nomeCliente: true, total: true, criadoEm: true, formaPagamento: true },
            orderBy: { criadoEm: "desc" },
          },
          _count: { select: { pedidos: true } },
        },
      });

      if (!cupom) return reply.status(404).send({ message: "Cupom não encontrado" });
      return cupom;
    }
  );

  app.put<{ Params: CupomParams; Body: Partial<CupomBody> }>(
    "/cupons/:id",
    { schema: { ...cupomParamsSchema, ...updateCupomSchema } },
    async (request, reply) => {
      const cupom = await prisma.cupom.update({
        where: { id: request.params.id },
        data: request.body as any,
      });
      return cupom;
    }
  );

  app.delete<{ Params: CupomParams }>(
    "/cupons/:id",
    { schema: cupomParamsSchema },
    async (request, reply) => {
      try {
        await prisma.cupom.delete({ where: { id: request.params.id } });
        return reply.status(204).send();
      } catch (err: any) {
        if (err && err.code === "P2003") {
          return reply
            .status(409)
            .send({ message: "Cupom já foi utilizado; desative em vez de excluir." });
        }
        throw err;
      }
    }
  );

  app.get<{ Params: { codigo: string } }>(
    "/cupons/validar/:codigo",
    async (request, reply) => {
      const codigo = request.params.codigo;
      const cupom = await prisma.cupom.findUnique({
        where: { codigo },
        include: { _count: { select: { pedidos: true } } },
      });

      if (!cupom) return { valido: false, motivo: "cupom_nao_encontrado" };
      if (!cupom.ativo) return { valido: false, motivo: "cupom_inativo" };
      if (cupom.validoAte && new Date(cupom.validoAte) < new Date()) {
        return { valido: false, motivo: "cupom_expirado" };
      }
      if (cupom._count && cupom._count.pedidos >= cupom.limiteUso) {
        return { valido: false, motivo: "cupom_esgotado" };
      }

      return { valido: true, cupom };
    }
  );
}
