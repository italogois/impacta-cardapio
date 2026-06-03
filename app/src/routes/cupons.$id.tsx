import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchCupom, type Cupom } from '../lib/api'

export const Route = createFileRoute('/cupons/$id')({ component: CupomDetail })

function CupomDetail({ params }: any) {
  const [cupom, setCupom] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  async function load() {
    try {
      setLoading(true)
      setErro('')
      const data = await fetchCupom(Number(params.id))
      setCupom(data)
    } catch {
      setErro('Erro ao carregar cupom')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [params.id])

  if (loading)
    return (
      <main className="page-wrap px-4 pb-8 pt-8">
        <p>Carregando...</p>
      </main>
    )
  if (erro)
    return (
      <main className="page-wrap px-4 pb-8 pt-8">
        <p className="text-red-500">{erro}</p>
      </main>
    )
  if (!cupom)
    return (
      <main className="page-wrap px-4 pb-8 pt-8">
        <p>Cupom não encontrado</p>
      </main>
    )

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <h1 className="display-title text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
        {cupom.codigo}
      </h1>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="island-shell p-6">
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
            Resumo
          </h3>
          <p className="mt-2 text-[var(--sea-ink)]">{cupom.descricao}</p>
          <p className="mt-2 text-[var(--sea-ink)]">
            Desconto:{' '}
            {cupom.tipoDesconto === 'percentual'
              ? `${cupom.valorDesconto}%`
              : `R$ ${cupom.valorDesconto.toFixed(2)}`}
          </p>
          <p className="mt-2 text-[var(--sea-ink)]">
            Usos: {cupom._count?.pedidos ?? 0} de {cupom.limiteUso}
          </p>
          <p className="mt-2 text-[var(--sea-ink)]">
            Valido até:{' '}
            {cupom.validoAte
              ? new Date(cupom.validoAte).toLocaleString()
              : 'Indefinido'}
          </p>
          <p className="mt-2 text-[var(--sea-ink)]">
            Status: {cupom.ativo ? 'Ativo' : 'Inativo'}
          </p>
        </div>
        <div className="island-shell p-6">
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
            Histórico de usos
          </h3>
          {cupom.pedidos && cupom.pedidos.length > 0 ? (
            <table className="w-full text-left text-sm mt-4">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {cupom.pedidos.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--line)] last:border-0"
                  >
                    <td className="px-4 py-3">{p.nomeCliente}</td>
                    <td className="px-4 py-3">
                      {new Date(p.criadoEm).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {p.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 text-[var(--sea-ink-soft)]">
              Nenhum cliente utilizou ainda.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
