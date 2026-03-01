import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'
import {
  fetchItens,
  createItem,
  updateItem,
  deleteItem,
  type Item,
  type ItemInput,
} from '../lib/api'

export const Route = createFileRoute('/produtos')({ component: ProdutosPage })

function ProdutosPage() {
  const [itens, setItens] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [erroSubmit, setErroSubmit] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmItem, setConfirmItem] = useState<Item | null>(null)

  async function loadItens() {
    try {
      setLoading(true)
      setErro('')
      const data = await fetchItens()
      setItens(data)
    } catch {
      setErro('Erro ao carregar itens.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItens()
  }, [])

  function openCreate() {
    setEditingItem(null)
    setErroSubmit('')
    setModalOpen(true)
  }

  function openEdit(item: Item) {
    setEditingItem(item)
    setErroSubmit('')
    setModalOpen(true)
  }

  async function handleSubmit(data: ItemInput) {
    try {
      setErroSubmit('')
      if (editingItem) {
        await updateItem(editingItem.id, data)
      } else {
        await createItem(data)
      }
      setModalOpen(false)
      loadItens()
    } catch {
      setErroSubmit('Erro ao salvar item.')
    }
  }

  function handleDeleteClick(item: Item) {
    setConfirmItem(item)
    setConfirmOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!confirmItem) return
    try {
      await deleteItem(confirmItem.id)
      setConfirmOpen(false)
      setConfirmItem(null)
      loadItens()
    } catch {
      setConfirmOpen(false)
      setConfirmItem(null)
      setErro('Erro ao excluir item.')
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display-title text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
          Produtos
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Cadastrar
        </button>
      </div>

      {loading && (
        <p className="text-center text-[var(--sea-ink-soft)]">Carregando...</p>
      )}

      {erro && (
        <p className="text-center text-red-500">{erro}</p>
      )}

      {!loading && !erro && itens.length === 0 && (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="text-[var(--sea-ink-soft)]">
            Nenhum produto cadastrado.
          </p>
        </div>
      )}

      {!loading && !erro && itens.length > 0 && (
        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  <th className="px-4 py-3">Imagem</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="hidden px-4 py-3 md:table-cell">Descricao</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--line)] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--sea-ink)]">
                      {item.nome}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-[var(--sea-ink-soft)] md:table-cell">
                      {item.descricao}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink)]">
                      {item.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--sea-ink-soft)] sm:table-cell">
                      {item.categoria}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(item)}
                          className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-red-100 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Produto' : 'Cadastrar Produto'}
      >
        <ProductForm
          key={editingItem?.id ?? 'new'}
          initialData={
            editingItem
              ? {
                  nome: editingItem.nome,
                  descricao: editingItem.descricao,
                  imagem: editingItem.imagem,
                  valor: editingItem.valor,
                  categoria: editingItem.categoria,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          error={erroSubmit}
        />
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar exclusao"
      >
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Tem certeza que deseja excluir{' '}
          <strong className="text-[var(--sea-ink)]">
            {confirmItem?.nome}
          </strong>
          ? Esta acao nao pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="rounded-full border border-red-200 bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </main>
  )
}
