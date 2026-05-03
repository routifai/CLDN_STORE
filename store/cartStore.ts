import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cartId: string | null;
  itemCount: number;
  checkoutUrl: string | null;
  setCart: (cartId: string, itemCount: number, checkoutUrl: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      itemCount: 0,
      checkoutUrl: null,
      setCart: (cartId, itemCount, checkoutUrl) => set({ cartId, itemCount, checkoutUrl }),
      clearCart: () => set({ cartId: null, itemCount: 0, checkoutUrl: null }),
    }),
    {
      name: 'nerd-merch-cart',
    }
  )
);
