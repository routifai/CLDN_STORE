"use client";

import Image from "next/image";
import { PointerEvent, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface TiltImageProps {
  src: string;
  alt: string;
}

export default function TiltImage({ src, alt }: TiltImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [coords, setCoords] = useState({
    x: 50,
    y: 50,
    active: false,
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 18;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0) scale(1.025)`;
      cardRef.current.style.transition = "transform 80ms ease-out";
      setCoords({
        x: Math.round(x * 100),
        y: Math.round(y * 100),
        active: true,
      });
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)";
      cardRef.current.style.transition = "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      setCoords((current) => ({ ...current, active: false }));
    });
  };

  return (
    <div
      className="relative h-full w-full overflow-visible"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={() => setIsZoomed(true)}
        className="relative h-full w-full cursor-crosshair bg-[#050505]"
        style={{
          transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)",
          transformStyle: "preserve-3d",
          transition: "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div
          className="absolute inset-3 border border-[#00ff41]/10 bg-[#0a0a0a]"
          style={{ transform: "translateZ(-70px) translate(18px, 18px)" }}
        />
        <div
          className="absolute inset-2 border border-[#00ff41]/15 bg-[#070707]"
          style={{ transform: "translateZ(-40px) translate(10px, 10px)" }}
        />

        <div
          className="absolute inset-0 border border-[#00ff41]/30 bg-[#050505]"
          style={{ transform: "translateZ(0)" }}
        />

        <div
          className="absolute inset-4 overflow-hidden border border-[#00ff41]/20 bg-[#0a0a0a]"
          style={{ transform: "translateZ(46px)", transformStyle: "preserve-3d" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-all duration-300 grayscale hover:grayscale-0"
            style={{ transform: "translateZ(24px) scale(1.02)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.28)_50%)] bg-[length:100%_4px]"
            style={{ transform: "translateZ(52px)" }}
          />
        </div>

        <div
          className="pointer-events-none absolute left-8 top-8 text-[9px] uppercase tracking-[0.25em] text-[#00ff41]/50"
          style={{ transform: "translateZ(50px)" }}
        >
          render_mode: pseudo_3d
        </div>
        <div
          className="pointer-events-none absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.25em] text-[#00ff41]/40"
          style={{ transform: "translateZ(50px)" }}
        >
          x:{coords.x.toString().padStart(2, "0")} y:{coords.y.toString().padStart(2, "0")}
        </div>
        <div
          className={`pointer-events-none absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.25em] transition-opacity duration-200 ${
            coords.active ? "text-[#00ff41]/70 opacity-100" : "text-[#00ff41]/25 opacity-60"
          }`}
          style={{ transform: "translateZ(50px)" }}
        >
          [{coords.active ? "tracking" : "idle"}]
        </div>

        <div
          className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-[#00ff41]/80"
          style={{ transform: "translateZ(60px)" }}
        />
        <div
          className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-[#00ff41]/80"
          style={{ transform: "translateZ(60px)" }}
        />
        <div
          className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-[#00ff41]/80"
          style={{ transform: "translateZ(60px)" }}
        />
        <div
          className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-[#00ff41]/80"
          style={{ transform: "translateZ(60px)" }}
        />
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {mounted && isZoomed && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm cursor-zoom-out p-4 md:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] border border-[#00ff41]/40 bg-[#050505] flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.1)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Header */}
            <div className="w-full h-8 border-b border-[#00ff41]/40 bg-[#00ff41]/5 flex items-center justify-between px-4">
              <div className="text-[#00ff41] text-[10px] tracking-widest uppercase">
                {">"} image_viewer.exe — {alt}
              </div>
              <div
                className="text-[#00ff41] hover:text-[#0a0a0a] hover:bg-[#00ff41] px-3 h-full flex items-center justify-center text-[10px] tracking-widest cursor-pointer transition-colors"
                onClick={() => setIsZoomed(false)}
              >
                [X] CLOSE
              </div>
            </div>

            {/* Terminal Body / Image */}
            <div className="relative flex-grow w-full h-full p-2">
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain p-4 md:p-12"
                sizes="100vw"
                priority
              />
            </div>

            {/* Terminal Footer */}
            <div className="w-full h-6 border-t border-[#00ff41]/40 bg-[#00ff41]/5 flex items-center px-4 text-[#00ff41]/50 text-[9px] tracking-widest uppercase">
              STATUS: RENDERED | ZOOM: 100% | PRESS ESC TO EXIT
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
