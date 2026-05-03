"use client";

import { useEffect, useRef, useState } from "react";
import DropTeaser from "@/components/DropTeaser";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-out will-change-[opacity,transform] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const drops = [
  {
    id: "drop_01",
    label: "DROP_01",
    status: "LIVE",
    date: "2026.05",
    description: "The founding drop. Hackerman Hoodie, Zero-Day Tee, Root Access Crewneck, CLDN Cap, Exploit Coffee Mug.",
    items: 5,
    active: true,
  },
  {
    id: "drop_02",
    label: "DROP_02",
    status: "INCOMING",
    date: "????.??",
    description: "Signal detected. Details classified. Subscribe to get notified.",
    items: null,
    active: false,
  },
];

export default function DropsPage() {
  return (
    <div className="w-full flex flex-col bg-[#0a0a0a] text-[#00ff41] uppercase tracking-widest">

      {/* HERO */}
      <section className="relative w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="absolute top-6 left-6 md:top-8 md:left-8 text-[#00ff41]/30 text-[11px] flex flex-col gap-1">
          <div>{">"} ls ./drops</div>
          <div>{">"} loading drop_manifest...</div>
        </div>

        <FadeIn className="flex flex-col items-center text-center z-10">
          <h1
            className="text-[#00ff41] font-bold leading-none tracking-[0.1em]"
            style={{ fontSize: "clamp(64px, 13vw, 140px)" }}
          >
            DROPS
          </h1>
          <p className="text-[#00ff41]/40 text-[13px] tracking-[0.3em] mt-6">
            {"// "} limited. intentional. non-negotiable.
          </p>
        </FadeIn>

        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-[#00ff41]/15 text-[10px]">
          {drops.length} drop(s) on record
        </div>
      </section>

      {/* DROP LIST */}
      <section className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-12">
        <div className="flex justify-between items-end border-b border-[#00ff41]/15 pb-4 mb-4">
          <div className="text-[#00ff41]/40 text-[12px] tracking-[0.2em]">{">"} cat drops.log</div>
          <div className="text-[#00ff41]/25 text-[11px]">{drops.length} entries</div>
        </div>

        {drops.map((drop, i) => (
          <FadeIn key={drop.id} delay={i * 150}>
            <div className={`border ${drop.active ? "border-[#00ff41]/40 hover:border-[#00ff41]" : "border-[#00ff41]/10"} transition-colors duration-300 p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6`}>
              <div className="flex-shrink-0 flex flex-col gap-2 min-w-[140px]">
                <div className="text-[#00ff41] font-bold text-[22px] tracking-[0.1em]">{drop.label}</div>
                <div className={`text-[11px] tracking-[0.2em] px-2 py-1 border inline-block w-fit ${drop.active ? "border-[#00ff41] text-[#00ff41]" : "border-[#00ff41]/20 text-[#00ff41]/30"}`}>
                  [{drop.status}]
                </div>
                <div className="text-[#00ff41]/30 text-[11px] tracking-widest mt-1">{drop.date}</div>
              </div>

              <div className="flex-grow border-t border-[#00ff41]/10 md:border-t-0 md:border-l md:pl-8 pt-4 md:pt-0 flex flex-col gap-4">
                <p className="text-[#00ff41]/60 text-[13px] leading-[2] normal-case">{drop.description}</p>
                {drop.items !== null && (
                  <div className="text-[#00ff41]/25 text-[11px]">{drop.items} items released</div>
                )}
                {drop.active ? (
                  <a
                    href="/#shop"
                    className="border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-3 text-[11px] tracking-widest hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200 w-fit mt-2"
                  >
                    [shop_drop_01]
                  </a>
                ) : null}
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* DROP_02 TEASER */}
      <section className="w-full bg-[#050505] py-20 md:py-32 uppercase tracking-widest">
        <DropTeaser />
      </section>

    </div>
  );
}
