import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { criarPedido, type FormaPagamento } from '../lib/api'
import { useCart } from '../lib/cart'

export const Route = createFileRoute('/checkout')({ component: Checkout })

const formasPagamento: { value: FormaPagamento; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'credito', label: 'Cartão de Crédito' },
  { value: 'debito', label: 'Cartão de Débito' },
  { value: 'pix', label: 'Pix' },
]

function formatarBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Checkout() {
  const navigate = useNavigate()
  const { items, increment, decrement, removeItem, clear, total } = useCart()

  const [nomeCliente, setNomeCliente] = useState('')
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>('dinheiro')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const carrinhoVazio = items.length === 0
  const nomeValido = nomeCliente.trim().length > 0
  const podeFinalizar = !carrinhoVazio && nomeValido && !enviando

  async function finalizar() {
    setErro('')
    setSucesso('')
    setEnviando(true)
    try {
      const pedido = await criarPedido({
        nomeCliente: nomeCliente.trim(),
        formaPagamento,
        itens: items.map((ci) => ({
          itemId: ci.itemId,
          quantidade: ci.quantidade,
        })),
      })
      setSucesso(`Pedido #${pedido.id} realizado com sucesso!`)
      clear()
      setTimeout(() => navigate({ to: '/' }), 1500)
    } catch {
      setErro('Erro ao finalizar o pedido. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">
        Checkout
      </h1>

      {carrinhoVazio ? (
        <div className="island-shell rounded-2xl p-10 text-center">
          <p className="mb-4 text-[var(--sea-ink-soft)]">
            Seu carrinho está vazio.
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white"
          >
            Voltar ao cardápio
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="island-shell rounded-2xl p-5">
            <h2 className="island-kicker mb-4 text-sm">Itens do pedido</h2>
            <ul className="flex flex-col gap-4">
              {items.map((ci) => (
                <li
                  key={ci.itemId}
                  className="flex items-center gap-4 border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0"
                >
                  <img
                    src={ci.imagem}
                    alt={ci.nome}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
                      {ci.nome}
                    </h3>
                    <p className="text-xs text-[var(--sea-ink-soft)]">
                      {formatarBRL(ci.valor)} cada
                    </p>
                    <p className="text-sm font-bold text-[var(--lagoon-deep)]">
                      {formatarBRL(ci.valor * ci.quantidade)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement(ci.itemId)}
                      aria-label="Diminuir quantidade"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--chip-bg)]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {ci.quantidade}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(ci.itemId)}
                      aria-label="Aumentar quantidade"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--chip-bg)]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(ci.itemId)}
                      aria-label="Remover item"
                      className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="island-shell flex h-fit flex-col gap-4 rounded-2xl p-5">
            <div>
              <label
                htmlFor="nomeCliente"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
              >
                Nome do cliente
              </label>
              <input
                id="nomeCliente"
                type="text"
                required
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon-deep)]"
              />
            </div>

            <div>
              <label
                htmlFor="formaPagamento"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
              >
                Forma de pagamento
              </label>
              <select
                id="formaPagamento"
                value={formaPagamento}
                onChange={(e) =>
                  setFormaPagamento(e.target.value as FormaPagamento)
                }
                className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon-deep)]"
              >
                {formasPagamento.map((fp) => (
                  <option key={fp.value} value={fp.value}>
                    {fp.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
              <span className="text-sm font-semibold text-[var(--sea-ink-soft)]">
                Total
              </span>
              <span className="text-xl font-bold text-[var(--lagoon-deep)]">
                {formatarBRL(total)}
              </span>
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}
            {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

            <button
              type="button"
              onClick={finalizar}
              disabled={!podeFinalizar}
              className="w-full rounded-xl bg-[var(--lagoon-deep)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Finalizar pedido'}
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}
