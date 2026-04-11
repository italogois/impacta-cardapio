const BASE_URL = 'http://localhost:3333'

export interface Item {
  id: number
  nome: string
  descricao: string
  imagem: string
  valor: number
  categoria: string
}

export type ItemInput = Omit<Item, 'id'>

export async function fetchItens(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/itens`)
  if (!res.ok) throw new Error('Erro ao buscar itens')
  return res.json()
}

export async function createItem(data: ItemInput): Promise<Item> {
  const res = await fetch(`${BASE_URL}/itens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar item')
  return res.json()
}

export async function updateItem(
  id: number,
  data: Partial<ItemInput>,
): Promise<Item> {
  const res = await fetch(`${BASE_URL}/itens/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar item')
  return res.json()
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/itens/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Erro ao excluir item')
}

export type FormaPagamento = 'dinheiro' | 'credito' | 'debito' | 'pix'

export interface PedidoItemInput {
  itemId: number
  quantidade: number
}

export interface PedidoInput {
  nomeCliente: string
  formaPagamento: FormaPagamento
  itens: PedidoItemInput[]
}

export interface PedidoItemResponse {
  id: number
  pedidoId: number
  itemId: number
  quantidade: number
  valorUnit: number
  item?: Item
}

export interface Pedido {
  id: number
  nomeCliente: string
  total: number
  formaPagamento: string
  criadoEm: string
  itens: PedidoItemResponse[]
}

export async function fetchPedidos(): Promise<Pedido[]> {
  const res = await fetch(`${BASE_URL}/pedidos`)
  if (!res.ok) throw new Error('Erro ao buscar pedidos')
  return res.json()
}

export async function criarPedido(data: PedidoInput): Promise<Pedido> {
  const res = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar pedido')
  return res.json()
}
