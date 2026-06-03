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
  codigoCupom?: string
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
  subtotal: number
  desconto: number
  total: number
  formaPagamento: string
  criadoEm: string
  itens: PedidoItemResponse[]
  cupom?: { codigo: string }
}

export interface Cupom {
  id: number
  codigo: string
  descricao: string
  tipoDesconto: 'percentual' | 'valor'
  valorDesconto: number
  limiteUso: number
  validoAte?: string
  ativo: boolean
  criadoEm: string
}

export interface CupomComUsos extends Cupom {
  _count: { pedidos: number }
}

export interface ValidacaoCupom {
  valido: boolean
  motivo?: string
  cupom?: Cupom & { _count?: { pedidos: number } }
}

export async function fetchCupons(): Promise<CupomComUsos[]> {
  const res = await fetch(`${BASE_URL}/cupons`)
  if (!res.ok) throw new Error('Erro ao buscar cupons')
  return res.json()
}

export async function fetchCupom(id: number): Promise<Cupom & { pedidos?: any[]; _count?: { pedidos: number } }> {
  const res = await fetch(`${BASE_URL}/cupons/${id}`)
  if (!res.ok) throw new Error('Erro ao buscar cupom')
  return res.json()
}

export async function createCupom(data: Partial<Cupom>): Promise<Cupom> {
  const res = await fetch(`${BASE_URL}/cupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar cupom')
  return res.json()
}

export async function updateCupom(id: number, data: Partial<Cupom>): Promise<Cupom> {
  const res = await fetch(`${BASE_URL}/cupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar cupom')
  return res.json()
}

export async function deleteCupom(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/cupons/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao excluir cupom')
}

export async function validarCupom(codigo: string): Promise<ValidacaoCupom> {
  const res = await fetch(`${BASE_URL}/cupons/validar/${encodeURIComponent(codigo)}`)
  if (!res.ok) throw new Error('Erro ao validar cupom')
  return res.json()
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
