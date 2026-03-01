export const createItemSchema = {
  body: {
    type: "object",
    required: ["nome", "descricao", "imagem", "valor", "categoria"],
    properties: {
      nome: { type: "string" },
      descricao: { type: "string" },
      imagem: { type: "string" },
      valor: { type: "number" },
      categoria: { type: "string" },
    },
  },
} as const;

export const updateItemSchema = {
  body: {
    type: "object",
    properties: {
      nome: { type: "string" },
      descricao: { type: "string" },
      imagem: { type: "string" },
      valor: { type: "number" },
      categoria: { type: "string" },
    },
  },
} as const;

export const itemParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
} as const;
