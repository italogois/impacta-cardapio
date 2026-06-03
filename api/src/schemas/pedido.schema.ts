export const createPedidoSchema = {
  body: {
    type: "object",
    required: ["nomeCliente", "formaPagamento", "itens"],
    properties: {
      nomeCliente: { type: "string", minLength: 1 },
      formaPagamento: {
        type: "string",
        enum: ["dinheiro", "credito", "debito", "pix"],
      },
      codigoCupom: { type: "string" },
      itens: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["itemId", "quantidade"],
          properties: {
            itemId: { type: "number" },
            quantidade: { type: "number", minimum: 1 },
          },
        },
      },
    },
  },
} as const;

export const pedidoParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
} as const;
