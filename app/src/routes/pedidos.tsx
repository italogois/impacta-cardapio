import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchPedidos, type Pedido } from '../lib/api'
import { ClipboardList } from 'lucide-react'

export const Route = createFileRoute('/pedidos')({ component: Pedidos })

const LABEL_PAGAMENTO: Record<string, string> = {
  pix: 'Pix',
  credito: 'Cartao de Credito',
  debito: 'Cartao de Debito',
  dinheiro: 'Dinheiro',
}

function formatarBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetchPedidos()
      .then(setPedidos)
      .catch(() => setErro('Erro ao carregar pedidos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <div className="mb-8 flex items-center gap-3">
        <ClipboardList className="h-7 w-7 text-[var(--lagoon-deep)]" />
        <h1 className="display-title text-2xl">Pedidos</h1>
      </div>

      {loading && (
        <p className="text-center text-[var(--sea-ink-soft)]">Carregando...</p>
      )}

      {erro && <p className="text-center text-red-500">{erro}</p>}

      {!loading && !erro && pedidos.length === 0 && (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="text-[var(--sea-ink-soft)]">Nenhum pedido realizado.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {pedidos.map((pedido) => (
          <article key={pedido.id} className="island-shell rounded-2xl p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-[var(--sea-ink)]">
                  {pedido.nomeCliente}
                </p>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  Pedido #{pedido.id} &middot;{' '}
                  {new Date(pedido.criadoEm).toLocaleString('pt-BR')}
                </p>
                {pedido.cupom?.codigo && (
                  <p className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Cupom aplicado: {pedido.cupom.codigo}
                  </p>
                )}
              </div>
              <div className="text-right">
                {pedido.cupom?.codigo && pedido.desconto > 0 && (
                  <p className="mb-1 text-xs text-[var(--sea-ink-soft)]">
                    Subtotal {formatarBRL(pedido.subtotal)} · Desconto -
                    {formatarBRL(pedido.desconto)}
                  </p>
                )}
                <p className="text-lg font-bold text-[var(--lagoon-deep)]">
                  {formatarBRL(pedido.total)}
                </p>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  {LABEL_PAGAMENTO[pedido.formaPagamento] ??
                    pedido.formaPagamento}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-3">
              <p className="island-kicker mb-2 text-xs">Itens</p>
              <ul className="flex flex-col gap-1">
                {pedido.itens.map((linha) => (
                  <li
                    key={linha.id}
                    className="flex items-center justify-between text-sm text-[var(--sea-ink)]"
                  >
                    <span>
                      {linha.quantidade}x{' '}
                      {linha.item?.nome ?? `Item #${linha.itemId}`}
                    </span>
                    <span className="text-[var(--sea-ink-soft)]">
                      {(linha.valorUnit * linha.quantidade).toLocaleString(
                        'pt-BR',
                        { style: 'currency', currency: 'BRL' },
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
