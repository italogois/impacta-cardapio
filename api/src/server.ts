import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { itemRoutes } from "./routes/item.routes.js";
import { pedidoRoutes } from "./routes/pedido.routes.js";

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cardapio",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

itemRoutes(app, prisma);
pedidoRoutes(app, prisma);

app.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
