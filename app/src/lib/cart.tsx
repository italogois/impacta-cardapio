import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Item } from './api'

export interface CartItem {
  itemId: number
  nome: string
  valor: number
  imagem: string
  quantidade: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Item) => void
  increment: (itemId: number) => void
  decrement: (itemId: number) => void
  removeItem: (itemId: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'impacta-cardapio-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true)
  }, [])

  // Persist on change (after hydration, to avoid clobbering stored data)
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Item) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.itemId === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.itemId === item.id
            ? { ...ci, quantidade: ci.quantidade + 1 }
            : ci,
        )
      }
      return [
        ...prev,
        {
          itemId: item.id,
          nome: item.nome,
          valor: item.valor,
          imagem: item.imagem,
          quantidade: 1,
        },
      ]
    })
  }, [])

  const increment = useCallback((itemId: number) => {
    setItems((prev) =>
      prev.map((ci) =>
        ci.itemId === itemId ? { ...ci, quantidade: ci.quantidade + 1 } : ci,
      ),
    )
  }, [])

  const decrement = useCallback((itemId: number) => {
    setItems((prev) =>
      prev
        .map((ci) =>
          ci.itemId === itemId
            ? { ...ci, quantidade: ci.quantidade - 1 }
            : ci,
        )
        .filter((ci) => ci.quantidade > 0),
    )
  }, [])

  const removeItem = useCallback((itemId: number) => {
    setItems((prev) => prev.filter((ci) => ci.itemId !== itemId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = useMemo(
    () => items.reduce((sum, ci) => sum + ci.valor * ci.quantidade, 0),
    [items],
  )

  const count = useMemo(
    () => items.reduce((sum, ci) => sum + ci.quantidade, 0),
    [items],
  )

  const value: CartContextValue = {
    items,
    addItem,
    increment,
    decrement,
    removeItem,
    clear,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de <CartProvider>')
  }
  return ctx
}
