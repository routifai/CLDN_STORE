"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCart({ variantId }: { variantId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");
  const { cartId, setCart } = useCartStore();

  const handleAddToCart = async () => {
    setStatus("loading");
    try {
      let res: Response;
      if (cartId) {
        res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId,
            lines: [{ merchandiseId: variantId, quantity: 1 }],
          }),
        });
      } else {
        res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: variantId, quantity: 1 }],
          }),
        });
      }

      const cart = await res.json();
      if (!res.ok || cart.error) throw new Error(cart.error || "Failed");

      const count = cart.totalQuantity ?? cart.lines?.edges?.reduce(
        (sum: number, edge: { node: { quantity: number } }) => sum + edge.node.quantity, 0
      ) ?? 0;
      setCart(cart.id, count, cart.checkoutUrl);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Error adding to cart", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const label =
    status === "loading" ? "[PROCESSING...]" :
    status === "added"   ? "[ADDED_TO_CART ✓]" :
    status === "error"   ? "[ERROR — RETRY]" :
    "[ADD_TO_CART]";

  return (
    <button
      onClick={handleAddToCart}
      disabled={status === "loading"}
      className="w-full border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
