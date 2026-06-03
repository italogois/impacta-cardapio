import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import CupomForm from '../components/CupomForm'
import {
  fetchCupons,
  createCupom,
  updateCupom,
  deleteCupom,
  type CupomComUsos,
} from '../lib/api'

export const Route = createFileRoute('/cupons')({ component: CuponsPage })

function CuponsPage() {
  const [cupons, setCupons] = useState<CupomComUsos[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CupomComUsos | null>(null)
  const [erroSubmit, setErroSubmit] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmCupom, setConfirmCupom] = useState<CupomComUsos | null>(null)

  async function load() {
    try {
      setLoading(true)
      setErro('')
      const data = await fetchCupons()
      setCupons(data)
    } catch {
      setErro('Erro ao carregar cupons.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setErroSubmit('')
    setModalOpen(true)
  }
  function openEdit(c: CupomComUsos) {
    setEditing(c)
    setErroSubmit('')
    setModalOpen(true)
  }

  async function handleSubmit(data: Partial<CupomComUsos>) {
    try {
      setErroSubmit('')
      if (editing) {
        await updateCupom(editing.id, data)
      } else {
        await createCupom(data)
      }
      setModalOpen(false)
      load()
    } catch {
      setErroSubmit('Erro ao salvar cupom.')
    }
  }

  function handleDeleteClick(c: CupomComUsos) {
    setConfirmCupom(c)
    setConfirmOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!confirmCupom) return
    try {
      await deleteCupom(confirmCupom.id)
      setConfirmOpen(false)
      setConfirmCupom(null)
      load()
    } catch {
      setConfirmOpen(false)
      setConfirmCupom(null)
      setErro('Erro ao excluir cupom.')
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display-title text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
          Cupons
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
      {erro && <p className="text-center text-red-500">{erro}</p>}

      {!loading && !erro && cupons.length === 0 && (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="text-[var(--sea-ink-soft)]">Nenhum cupom cadastrado.</p>
        </div>
      )}

      {!loading && !erro && cupons.length > 0 && (
        <div className="island-shell overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  <th className="px-4 py-3">Codigo</th>
                  <th className="px-4 py-3">Descricao</th>
                  <th className="px-4 py-3">Desconto</th>
                  <th className="px-4 py-3">Usos</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {cupons.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[var(--line)] last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--sea-ink)]">
                      {c.codigo}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                      {c.descricao}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink)]">
                      {c.tipoDesconto === 'percentual'
                        ? `${c.valorDesconto}% OFF`
                        : `R$ ${c.valorDesconto.toFixed(2)} OFF`}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink)]">
                      {c._count?.pedidos ?? 0} / {c.limiteUso}
                    </td>
                    <td className="px-4 py-3 text-[var(--sea-ink)]">
                      {c.ativo ? 'Ativo' : 'Inativo'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c)}
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
        title={editing ? 'Editar Cupom' : 'Cadastrar Cupom'}
      >
        <CupomForm
          key={editing?.id ?? 'new'}
          initialData={editing ?? undefined}
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
            {confirmCupom?.codigo}
          </strong>
          ? Esta acao nao pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--sea-ink-soft)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="rounded-full border border-red-200 bg-red-600 px-5 py-2 text-sm font-semibold text-white"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </main>
  )
}
