"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCart({ variantId }: { variantId: string }) {
  const [loading, setLoading] = useState(false);
  const { cartId, setCart } = useCartStore();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (cartId) {
        // Add to existing cart
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId,
            lines: [{ merchandiseId: variantId, quantity: 1 }],
          }),
        });
        const cart = await res.json();
        if (cart && cart.lines) {
          const count = cart.lines.edges.reduce((sum: number, edge: { node: { quantity: number } }) => sum + edge.node.quantity, 0);
          setCart(cart.id, count, cart.checkoutUrl);
        }
      } else {
        // Create new cart
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: variantId, quantity: 1 }],
          }),
        });
        const cart = await res.json();
        if (cart && cart.lines) {
          const count = cart.lines.edges.reduce((sum: number, edge: { node: { quantity: number } }) => sum + edge.node.quantity, 0);
          setCart(cart.id, count, cart.checkoutUrl);
        }
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "[PROCESSING...]" : "[ADD_TO_CART]"}
    </button>
  );
}
