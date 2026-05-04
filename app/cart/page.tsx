"use client";

import { useEffect, useState, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import type { Cart, CartLine } from "@/lib/types";

export default function CartPage() {
  const { cartId, checkoutUrl, setCart, clearCart } = useCartStore();
  const [cart, setLocalCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!cartId) { setLoading(false); return; }
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`);
      if (!res.ok) { clearCart(); setLoading(false); return; }
      const data: Cart = await res.json();
      setLocalCart(data);
      setCart(data.id, data.totalQuantity, data.checkoutUrl);
    } catch {
      clearCart();
    } finally {
      setLoading(false);
    }
  }, [cartId, setCart, clearCart]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const updateQuantity = async (line: CartLine, delta: number) => {
    if (!cartId) return;
    const newQty = line.quantity + delta;
    setUpdatingLineId(line.id);
    try {
      if (newQty <= 0) {
        const res = await fetch("/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId, lineId: line.id }),
        });
        const updated: Cart = await res.json();
        setLocalCart(updated);
        setCart(updated.id, updated.totalQuantity, updated.checkoutUrl);
        if (updated.totalQuantity === 0) clearCart();
      } else {
        const res = await fetch("/api/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId, lineId: line.id, quantity: newQty }),
        });
        const updated: Cart = await res.json();
        setLocalCart(updated);
        setCart(updated.id, updated.totalQuantity, updated.checkoutUrl);
      }
    } finally {
      setUpdatingLineId(null);
    }
  };

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  const subtotal = lines.reduce((sum, line) => {
    return sum + parseFloat(line.merchandise.price.amount) * line.quantity;
  }, 0);

  const currency = lines[0]?.merchandise.price.currencyCode ?? "CAD";

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-12 font-mono">
        <div className="text-[#00ff41]/50 animate-pulse tracking-widest text-sm">
          {">"} LOADING_CART...
        </div>
      </div>
    );
  }

  if (!cartId || lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-12 font-mono flex flex-col gap-6">
        <div className="border-b border-[#00ff41]/30 pb-2">
          <h1 className="text-xl font-bold tracking-widest uppercase">{">"} CART_EMPTY</h1>
        </div>
        <p className="text-[#00ff41]/50 text-sm tracking-widest">No items in cart.</p>
        <Link
          href="/#shop"
          className="text-sm tracking-widest hover:underline text-[#00ff41]/70 hover:text-[#00ff41]"
        >
          {"<"} RETURN_TO_SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-12 font-mono flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-[#00ff41]/30 pb-2 flex justify-between items-end">
        <h1 className="text-xl font-bold tracking-widest uppercase">
          {">"} CART<span className="animate-blink">_</span>
        </h1>
        <Link href="/#shop" className="text-sm opacity-60 hover:opacity-100 hover:underline hidden md:block">
          {"<"} cd ..
        </Link>
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-4">
        {lines.map((line) => {
          const isUpdating = updatingLineId === line.id;
          const price = parseFloat(line.merchandise.price.amount) * line.quantity;
          return (
            <div
              key={line.id}
              className="border border-[#00ff41]/20 p-4 flex flex-col gap-3"
            >
              <div className="flex items-start gap-4">
                {/* Product thumbnail */}
                <Link
                  href={`/products/${line.merchandise.product.handle}`}
                  className="shrink-0 border border-[#00ff41]/20 hover:border-[#00ff41]/60 transition-colors overflow-hidden bg-[#0a0a0a]"
                  style={{ width: 120, height: 120 }}
                >
                  {line.merchandise.product.featuredImage ? (
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#00ff41]/20 text-[9px] tracking-widest">
                      [IMG]
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="text-[13px] font-bold tracking-widest uppercase hover:underline"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    <div className="text-[11px] text-[#00ff41]/50 tracking-widest uppercase">
                      VARIANT: {line.merchandise.title}
                    </div>
                  </div>
                  <div className="text-[13px] tracking-widest whitespace-nowrap">
                    {currency} {price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-3 text-[12px] tracking-widest">
                <span className="text-[#00ff41]/40 uppercase">QTY:</span>
                <div className="flex items-center border border-[#00ff41]/30">
                  <button
                    onClick={() => updateQuantity(line, -1)}
                    disabled={isUpdating}
                    className="px-3 py-1 hover:bg-[#00ff41]/10 disabled:opacity-30 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 border-x border-[#00ff41]/30 min-w-[40px] text-center">
                    {isUpdating ? "…" : line.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(line, +1)}
                    disabled={isUpdating}
                    className="px-3 py-1 hover:bg-[#00ff41]/10 disabled:opacity-30 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => updateQuantity(line, -line.quantity)}
                  disabled={isUpdating}
                  className="text-[#00ff41]/30 hover:text-red-400 transition-colors text-[10px] tracking-widest ml-2 disabled:opacity-30"
                >
                  [REMOVE]
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order summary */}
      <div className="border border-[#00ff41]/30 p-4 flex flex-col gap-3">
        <div className="border-b border-[#00ff41]/20 pb-2 font-bold tracking-widest text-[13px]">
          --- ORDER_SUMMARY ---
        </div>
        <div className="flex justify-between text-[12px] tracking-widest">
          <span className="text-[#00ff41]/50">SUBTOTAL</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[12px] tracking-widest">
          <span className="text-[#00ff41]/50">SHIPPING</span>
          <span className="text-[#00ff41]/50">CALCULATED AT CHECKOUT</span>
        </div>
        <div className="flex justify-between text-[12px] tracking-widest">
          <span className="text-[#00ff41]/50">TAX</span>
          <span className="text-[#00ff41]/50">CALCULATED AT CHECKOUT</span>
        </div>
        <div className="border-t border-[#00ff41]/20 pt-3 flex justify-between font-bold text-[14px] tracking-widest">
          <span>TOTAL (EST.)</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="flex flex-col gap-3">
        <a
          href={checkoutUrl ?? "#"}
          className="w-full border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-4 text-[12px] uppercase tracking-widest text-center hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none"
        >
          {">"} PROCEED_TO_CHECKOUT
        </a>
        <Link
          href="/#shop"
          className="text-center text-[11px] tracking-widest text-[#00ff41]/40 hover:text-[#00ff41]/70 transition-colors"
        >
          {"<"} CONTINUE_SHOPPING
        </Link>
      </div>

      <div className="md:hidden">
        <Link href="/#shop" className="text-sm hover:underline opacity-60">
          {"<"} cd ..
        </Link>
      </div>
    </div>
  );
}
