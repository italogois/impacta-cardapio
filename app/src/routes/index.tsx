import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchItens, type Item } from '../lib/api'

export const Route = createFileRoute('/')({ component: Cardapio })

function Cardapio() {
  const [itens, setItens] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetchItens()
      .then(setItens)
      .catch(() => setErro('Erro ao carregar o cardapio.'))
      .finally(() => setLoading(false))
  }, [])

  const categorias = itens.reduce<Record<string, Item[]>>((acc, item) => {
    const cat = item.categoria || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      {loading && (
        <p className="text-center text-[var(--sea-ink-soft)]">Carregando...</p>
      )}

      {erro && <p className="text-center text-red-500">{erro}</p>}

      {!loading && !erro && itens.length === 0 && (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="text-[var(--sea-ink-soft)]">
            Nenhum item no cardapio ainda.
          </p>
        </div>
      )}

      {Object.entries(categorias).map(([categoria, items]) => (
        <section key={categoria} className="mb-10">
          <h2 className="island-kicker mb-4 text-sm">{categoria}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="island-shell feature-card rise-in overflow-hidden rounded-2xl"
                style={{ animationDelay: `${index * 90 + 80}ms` }}
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="mb-1 text-base font-semibold text-[var(--sea-ink)]">
                    {item.nome}
                  </h3>
                  <p className="mb-3 text-sm text-[var(--sea-ink-soft)]">
                    {item.descricao}
                  </p>
                  <p className="text-lg font-bold text-[var(--lagoon-deep)]">
                    {item.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
