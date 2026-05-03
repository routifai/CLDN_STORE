'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Cart } from '@/lib/types';

const CART_ID_KEY = 'shopify_cart_id';

interface CartContextValue {
  cartId: string | null;
  cart: Cart | null;
  itemCount: number;
  isOpen: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) return;

    console.log('[CartContext] rehydrating cart from localStorage:', stored);
    setCartId(stored);

    fetch(`/api/cart/${encodeURIComponent(stored)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Cart | null) => {
        if (data) {
          console.log('[CartContext] cart rehydrated:', data);
          setCart(data);
        } else {
          // Cart expired or invalid — clear it
          localStorage.removeItem(CART_ID_KEY);
          setCartId(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null);
      });
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      console.log('[CartContext] addItem', { variantId, quantity, cartId });

      if (cartId) {
        const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = (await res.json()) as Cart;
        setCart(data);
      } else {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = (await res.json()) as { cartId: string; cart: Cart };
        localStorage.setItem(CART_ID_KEY, data.cartId);
        setCartId(data.cartId);
        setCart(data.cart);
        console.log('[CartContext] new cart created:', data.cartId);
      }
    },
    [cartId]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      console.log('[CartContext] removeItem', { lineId });
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      });
      const data = (await res.json()) as Cart;
      setCart(data);
    },
    [cartId]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      console.log('[CartContext] updateItem', { lineId, quantity });
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity }),
      });
      const data = (await res.json()) as Cart;
      setCart(data);
    },
    [cartId]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        itemCount: cart?.totalQuantity ?? 0,
        isOpen,
        addItem,
        removeItem,
        updateItem,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
