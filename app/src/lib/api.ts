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
