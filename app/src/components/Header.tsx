import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../lib/cart'

export default function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center gap-x-4 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-black" />
            Cardapio Digital
          </Link>
        </h2>

        <div className="flex items-center gap-x-4 text-sm font-semibold">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Cardapio
          </Link>
          <Link
            to="/produtos"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Produtos
          </Link>
          <Link
            to="/pedidos"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Pedidos
          </Link>
          <Link
            to="/checkout"
            className="nav-link relative inline-flex items-center gap-1.5"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {count > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--lagoon-deep)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
