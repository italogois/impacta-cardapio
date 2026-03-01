import { useState } from 'react'
import type { ItemInput } from '../lib/api'

interface ProductFormProps {
  initialData?: ItemInput
  onSubmit: (data: ItemInput) => void
  onCancel: () => void
  error?: string
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  error,
}: ProductFormProps) {
  const [nome, setNome] = useState(initialData?.nome ?? '')
  const [descricao, setDescricao] = useState(initialData?.descricao ?? '')
  const [imagem, setImagem] = useState(initialData?.imagem ?? '')
  const [valor, setValor] = useState(initialData?.valor?.toString() ?? '')
  const [categoria, setCategoria] = useState(initialData?.categoria ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      nome,
      descricao,
      imagem,
      valor: parseFloat(valor),
      categoria,
    })
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none transition focus:border-black'
  const labelClass = 'mb-1 block text-sm font-medium text-[var(--sea-ink)]'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Descricao</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={inputClass}
          rows={3}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Imagem (URL)</label>
        <input
          type="url"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Categoria</label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-full border border-gray-300 bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}
