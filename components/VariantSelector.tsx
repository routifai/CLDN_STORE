"use client";

import { useState } from "react";
import AddToCart from "./AddToCart";
import type { ProductVariant } from "@/lib/types";

interface Props {
  variants: ProductVariant[];
}

export default function VariantSelector({ variants }: Props) {
  const [selected, setSelected] = useState<ProductVariant | null>(
    variants.find((v) => v.availableForSale) ?? variants[0] ?? null
  );

  if (!variants.length) {
    return <div className="text-red-500 text-sm tracking-widest">ERROR: NO_VARIANTS_AVAILABLE</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex justify-between items-center text-xl">
        <span>[PRICE]</span>
        <span>
          {selected?.price.currencyCode} {selected?.price.amount}
        </span>
      </div>

      {/* Size selector */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] tracking-widest text-[#00ff41]/50 uppercase">
          SELECT_SIZE
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const isSelected = selected?.id === v.id;
            const unavailable = !v.availableForSale;
            return (
              <button
                key={v.id}
                onClick={() => !unavailable && setSelected(v)}
                disabled={unavailable}
                className={`
                  px-4 py-2 text-[11px] tracking-widest uppercase border transition-all duration-150
                  ${isSelected
                    ? "border-[#00ff41] bg-[#00ff41] text-[#0a0a0a] font-bold"
                    : unavailable
                    ? "border-[#00ff41]/15 text-[#00ff41]/20 cursor-not-allowed line-through"
                    : "border-[#00ff41]/40 text-[#00ff41]/70 hover:border-[#00ff41] hover:text-[#00ff41]"
                  }
                `}
              >
                {v.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock status */}
      <div className="flex justify-between items-center text-sm opacity-80">
        <span>[STATUS]</span>
        <span className={selected?.availableForSale ? "text-[#00ff41]" : "text-red-500"}>
          {selected?.availableForSale ? "IN_STOCK" : "OUT_OF_STOCK"}
        </span>
      </div>

      {/* Add to cart */}
      {selected?.availableForSale ? (
        <AddToCart variantId={selected.id} />
      ) : (
        <button
          disabled
          className="w-full border border-[#00ff41]/20 text-[#00ff41]/20 px-6 py-3 text-[11px] uppercase tracking-widest cursor-not-allowed"
        >
          [OUT_OF_STOCK]
        </button>
      )}
    </div>
  );
}
