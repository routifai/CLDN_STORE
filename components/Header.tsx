"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Header() {
  const { itemCount, checkoutUrl } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? itemCount.toString().padStart(2, "0") : "00";

  return (
    <header className="sticky top-0 z-50 w-full h-[64px] bg-[#0a0a0a] border-b border-[#00ff41]/15 uppercase tracking-widest flex items-center justify-between px-4 md:px-8">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#00ff41] opacity-60"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ff41] opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00ff41] opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ff41] opacity-60"></div>

      <div className="flex items-center gap-4">
        {/* Left section */}
        <Link href="/" className="flex items-center">
          <span className="text-[#00ff41] text-[32px] font-bold tracking-[0.15em] leading-none">CLDN</span>
          <span className="inline-block w-[6px] h-[16px] bg-[#00ff41] animate-[blink_1.1s_infinite] ml-1"></span>
        </Link>

        {/* Center section (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 ml-4">
          <div className="w-[1px] h-[32px] bg-[#00ff41]/20"></div>
          <div className="flex flex-col justify-center">
            <div className="text-[#00ff41]/60 text-[11px] tracking-[0.3em] leading-tight">CODED LAYERS</div>
            <div className="text-[#00ff41]/60 text-[11px] tracking-[0.3em] leading-tight">DROP NOTATION</div>
            <div className="text-[#00ff41]/25 text-[9px] tracking-[0.2em] leading-tight mt-1">{"//"} cldn.store</div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 md:gap-6">
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/#shop" className="text-[#00ff41]/50 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">
            [shop]
          </Link>
          <Link href="/#drops" className="text-[#00ff41]/50 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">
            [drops]
          </Link>
          <Link href="/about" className="hidden md:inline-block text-[#00ff41]/50 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">
            [about]
          </Link>
        </nav>
        
        {checkoutUrl && itemCount > 0 ? (
          <a href={checkoutUrl} className="text-[#00ff41]/80 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">
            [cart_{displayCount}]
          </a>
        ) : (
          <button className="text-[#00ff41]/80 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">
            [cart_{displayCount}]
          </button>
        )}
      </div>
    </header>
  );
}