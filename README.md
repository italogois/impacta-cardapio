# Cardapio - Impacta

Sistema de cardapio digital com API REST e interface web.

## Tecnologias

**API:** Fastify, Prisma, MySQL, TypeScript

**App:** React, TanStack Router, Tailwind CSS, Vite, TypeScript

## Pre-requisitos

- [Node.js](https://nodejs.org/) (v20+)
- [Docker](https://www.docker.com/) (para o banco de dados MySQL)

## Como rodar

### 1. Banco de dados

Suba o container MySQL via Docker Compose:

```bash
cd api
docker compose up -d
```

Isso cria um banco `cardapio` rodando na porta `3306`.

### 2. API

```bash
cd api
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

A API estara disponivel em `http://localhost:3333`.

#### Endpoints

| Metodo | Rota         | Descricao             |
| ------ | ------------ | --------------------- |
| GET    | `/itens`     | Lista todos os itens  |
| GET    | `/itens/:id` | Busca um item por ID  |
| POST   | `/itens`     | Cria um novo item     |
| PUT    | `/itens/:id` | Atualiza um item      |
| DELETE | `/itens/:id` | Remove um item        |

### 3. App (frontend)

Em outro terminal:

```bash
cd app
npm install
npm run dev
```

O app estara disponivel em `http://localhost:3000`.
