import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, CalendarRange, Coins, ReceiptText, Tag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchPedidos, type Pedido } from '../lib/api'

export const Route = createFileRoute('/relatorio-vendas')({
  component: RelatorioVendas,
})

const LABEL_PAGAMENTO: Record<string, string> = {
  pix: 'Pix',
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  dinheiro: 'Dinheiro',
}

function formatarBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(valor: string) {
  return new Date(valor).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function RelatorioVendas() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetchPedidos()
      .then(setPedidos)
      .catch(() => setErro('Erro ao carregar relatório de vendas.'))
      .finally(() => setLoading(false))
  }, [])

  const resumo = useMemo(() => {
    const totalPedidos = pedidos.length
    const faturamento = pedidos.reduce((acc, pedido) => acc + pedido.total, 0)
    const descontos = pedidos.reduce((acc, pedido) => acc + pedido.desconto, 0)
    const ticketMedio = totalPedidos > 0 ? faturamento / totalPedidos : 0

    const porPagamento = Object.entries(LABEL_PAGAMENTO).map(
      ([valor, label]) => {
        const pedidosDoTipo = pedidos.filter(
          (pedido) => pedido.formaPagamento === valor,
        )
        const total = pedidosDoTipo.reduce(
          (acc, pedido) => acc + pedido.total,
          0,
        )

        return {
          valor,
          label,
          quantidade: pedidosDoTipo.length,
          total,
        }
      },
    )

    const pedidosComCupom = pedidos.filter(
      (pedido) => pedido.cupom?.codigo,
    ).length

    return {
      totalPedidos,
      faturamento,
      descontos,
      ticketMedio,
      porPagamento,
      pedidosComCupom,
    }
  }, [pedidos])

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <BarChart3 className="h-7 w-7 text-[var(--lagoon-deep)]" />
        <div>
          <h1 className="display-title text-2xl">Relatório de vendas</h1>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            Visão consolidada dos pedidos realizados.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-center text-[var(--sea-ink-soft)]">Carregando...</p>
      )}

      {erro && <p className="text-center text-red-500">{erro}</p>}

      {!loading && !erro && pedidos.length === 0 && (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="text-[var(--sea-ink-soft)]">
            Nenhum pedido encontrado para montar o relatório.
          </p>
        </div>
      )}

      {!loading && !erro && pedidos.length > 0 && (
        <div className="flex flex-col gap-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="island-shell rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Faturamento
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                {formatarBRL(resumo.faturamento)}
              </p>
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                Total líquido dos pedidos.
              </p>
            </article>

            <article className="island-shell rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <ReceiptText className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Pedidos
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                {resumo.totalPedidos}
              </p>
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                Registros analisados no período atual.
              </p>
            </article>

            <article className="island-shell rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <CalendarRange className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Ticket médio
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                {formatarBRL(resumo.ticketMedio)}
              </p>
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                Média de valor por pedido.
              </p>
            </article>

            <article className="island-shell rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Tag className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Descontos
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--lagoon-deep)]">
                {formatarBRL(resumo.descontos)}
              </p>
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                {resumo.pedidosComCupom} pedidos com cupom aplicado.
              </p>
            </article>
          </section>

          <section className="island-shell rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                  Resumo por pagamento
                </h2>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Distribuição de pedidos por forma de pagamento.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {resumo.porPagamento.map((item) => (
                <div
                  key={item.valor}
                  className="rounded-2xl border border-[var(--line)] bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-bold text-[var(--sea-ink)]">
                    {item.quantidade} pedidos
                  </p>
                  <p className="text-sm text-[var(--sea-ink-soft)]">
                    {formatarBRL(item.total)} em vendas
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="island-shell overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                    <th className="px-4 py-3">Pedido</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Pagamento</th>
                    <th className="px-4 py-3">Subtotal</th>
                    <th className="px-4 py-3">Desconto</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Cupom</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="border-b border-[var(--line)] last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--sea-ink)]">
                        #{pedido.id}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                        {pedido.nomeCliente}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                        {formatarData(pedido.criadoEm)}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink)]">
                        {LABEL_PAGAMENTO[pedido.formaPagamento] ??
                          pedido.formaPagamento}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink)]">
                        {formatarBRL(pedido.subtotal)}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink)]">
                        {pedido.desconto > 0
                          ? `-${formatarBRL(pedido.desconto)}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[var(--lagoon-deep)]">
                        {formatarBRL(pedido.total)}
                      </td>
                      <td className="px-4 py-3 text-[var(--sea-ink-soft)]">
                        {pedido.cupom?.codigo ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
