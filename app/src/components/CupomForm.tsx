import type { Cupom } from '../lib/api'
import { useState } from 'react'

interface Props {
  initialData?: Partial<Cupom>
  onSubmit: (data: Partial<Cupom>) => void
  onCancel: () => void
  error?: string
}

export default function CupomForm({
  initialData,
  onSubmit,
  onCancel,
  error,
}: Props) {
  const [codigo, setCodigo] = useState(initialData?.codigo ?? '')
  const [descricao, setDescricao] = useState(initialData?.descricao ?? '')
  const [tipoDesconto, setTipoDesconto] = useState<'percentual' | 'valor'>(
    (initialData?.tipoDesconto as any) ?? 'percentual',
  )
  const [valorDesconto, setValorDesconto] = useState(
    initialData?.valorDesconto?.toString() ?? '',
  )
  const [limiteUso, setLimiteUso] = useState(
    initialData?.limiteUso?.toString() ?? '1',
  )
  const [validoAte, setValidoAte] = useState(
    initialData?.validoAte?.slice(0, 16) ?? '',
  )
  const [ativo, setAtivo] = useState(initialData?.ativo ?? true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      codigo: codigo.toUpperCase(),
      descricao,
      tipoDesconto,
      valorDesconto: parseFloat(valorDesconto),
      limiteUso: parseInt(limiteUso, 10),
      validoAte: validoAte ? new Date(validoAte).toISOString() : undefined,
      ativo,
    })
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none transition focus:border-black'
  const labelClass = 'mb-1 block text-sm font-medium text-[var(--sea-ink)]'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Código</label>
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={inputClass}
          rows={3}
        />
      </div>
      <div>
        <label className={labelClass}>Tipo de desconto</label>
        <select
          value={tipoDesconto}
          onChange={(e) => setTipoDesconto(e.target.value as any)}
          className={inputClass}
        >
          <option value="percentual">Percentual (%)</option>
          <option value="valor">Valor (R$)</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Valor do desconto</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={valorDesconto}
          onChange={(e) => setValorDesconto(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Limite de uso</label>
        <input
          type="number"
          min="1"
          value={limiteUso}
          onChange={(e) => setLimiteUso(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Valido até (opcional)</label>
        <input
          type="datetime-local"
          value={validoAte}
          onChange={(e) => setValidoAte(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="ativo"
          type="checkbox"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
        />
        <label htmlFor="ativo" className="text-sm text-[var(--sea-ink)]">
          Ativo
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-semibold text-[var(--sea-ink-soft)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-full border border-gray-300 bg-black px-5 py-2 text-sm font-semibold text-white"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}
