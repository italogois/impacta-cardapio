export const createCupomSchema = {
  body: {
    type: "object",
    required: ["codigo", "descricao", "tipoDesconto", "valorDesconto", "limiteUso"],
    properties: {
      codigo: { type: "string", minLength: 1 },
      descricao: { type: "string" },
      tipoDesconto: { type: "string", enum: ["percentual", "valor"] },
      valorDesconto: { type: "number", exclusiveMinimum: 0 },
      limiteUso: { type: "number", minimum: 1 },
      validoAte: { type: "string", format: "date-time" },
      ativo: { type: "boolean" },
    },
  },
} as const;

export const updateCupomSchema = {
  body: {
    type: "object",
    properties: {
      codigo: { type: "string" },
      descricao: { type: "string" },
      tipoDesconto: { type: "string", enum: ["percentual", "valor"] },
      valorDesconto: { type: "number", exclusiveMinimum: 0 },
      limiteUso: { type: "number", minimum: 1 },
      validoAte: { type: "string", format: "date-time" },
      ativo: { type: "boolean" },
    },
  },
} as const;

export const cupomParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
} as const;
