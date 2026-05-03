"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartNav() {
  const { itemCount, checkoutUrl } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>[CART: 0]</span>;
  }

  if (checkoutUrl && itemCount > 0) {
    return (
      <a href={checkoutUrl} className="hover:text-white hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#00ff41]">
        [CART: {itemCount}]
      </a>
    );
  }

  return <span>[CART: {itemCount}]</span>;
}
