"use client";

import { useEffect, useRef, useState } from "react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

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

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col bg-[#0a0a0a] text-[#00ff41] uppercase tracking-widest selection:bg-[#00ff41] selection:text-[#0a0a0a]">
      
      {/* SECTION 1 — OPENING STATEMENT */}
      <section className="relative w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 md:p-8">
        
        {/* Top left */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-col gap-1 text-[#00ff41]/30 text-[11px]">
          <div>{'>'} accessing cldn.manifest...</div>
          <div>{'>'} decrypting origin_story.exe...</div>
        </div>

        {/* Center massive opening line */}
        <div className="flex flex-col items-center text-center z-10">
          <FadeIn>
            <div className="font-bold leading-[1.4em] text-[#00ff41] flex flex-col items-center" style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
              <div>THE WORLD RUNS ON OUR CODE.</div>
              <div>WE NEVER HAD A UNIFORM.</div>
              <div className="flex items-center">
                UNTIL NOW.
                <span className="inline-block w-[clamp(18px,3vw,36px)] h-[clamp(36px,6vw,72px)] bg-[#00ff41] animate-[blink_1.1s_step-end_infinite] ml-4"></span>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="mt-12 flex flex-col gap-2 text-[#00ff41]/50 text-[14px] tracking-[0.2em] leading-[1.9]">
              <div>{"//"} this is not a clothing brand</div>
              <div>{"//"} this is a declaration</div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom right */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-[#00ff41]/15 text-[10px]">
          manifest_v1.0 — classified
        </div>
      </section>

      {/* SECTION 2 — THE STORY */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-[120px] flex">
        
        {/* Left side label */}
        <div className="hidden lg:block relative w-[100px] flex-shrink-0">
          <div className="sticky top-32 text-[#00ff41]/20 text-[11px] tracking-[0.4em] origin-top-left -rotate-90 translate-y-[200px] whitespace-nowrap">
            origin_story.txt
          </div>
        </div>

        {/* Right side content */}
        <div className="flex-grow w-full max-w-[680px] mx-auto flex flex-col gap-12 lg:ml-0 text-[#00ff41]/70 leading-[2]" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
          
          <FadeIn>
            <p>
              <span className="text-[#00ff41] font-bold opacity-100">I am an engineer, just like many of you.</span><br/>
              We write the code that powers the world.<br/>
              We architect the systems that move billions.<br/>
              <span className="text-[#00ff41] font-bold opacity-100">We debug at 2am so it doesn&apos;t break at 9.</span>
            </p>
          </FadeIn>

          <FadeIn>
            <div className="bg-[#0d0d0d] border-l-2 border-[#00ff41] p-6 md:p-8 my-4 font-mono text-[14px] md:text-[16px] leading-[1.8] text-[#00ff41]/80">
              $ whoami<br/>
              {'>'} engineers. builders. creators. <span className="text-[#00ff41] font-bold opacity-100">the quiet ones</span><br/>
              &nbsp;&nbsp;building the future while the world sleeps.
            </div>
          </FadeIn>

          <FadeIn>
            <p>
              And yet —<br/>
              Nothing we wear represents what we do.<br/>
              We don&apos;t just consume the future.<br/>
              <span className="text-[#00ff41] font-bold opacity-100">We write it.</span>
            </p>
          </FadeIn>

          <FadeIn>
            <p className="text-[1.1em] text-[#00ff41] opacity-100 font-medium py-4">
              So we built CLDN.<br/>
              Not another clothing brand.<br/>
              A flag for the builders.<br/>
              <span className="text-[#00ff41] font-bold opacity-100">A proof of work.</span>
            </p>
          </FadeIn>

          <FadeIn>
            <p>
              Every drop is a <span className="text-[#00ff41] font-bold opacity-100">commit.</span><br/>
              Every piece is a <span className="text-[#00ff41] font-bold opacity-100">pull request</span> to the culture.<br/>
              We don&apos;t follow trends.<br/>
              <span className="text-[#00ff41] font-bold opacity-100">We push them.</span>
            </p>
          </FadeIn>

          <FadeIn>
            <div className="relative py-8">
              {/* Scanline effect wrapper */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)' }}></div>
              <p className="text-[#00ff41] opacity-100 font-bold leading-[1.3] relative z-10" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>
                WHEN YOU WEAR CLDN —<br/>
                YOU ARE NOT WEARING A BRAND.<br/>
                YOU ARE WEARING A PROOF OF WORK.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <p className="text-[#00ff41]/40 text-[12px] tracking-[0.3em] leading-[2] mt-4">
              {"//"} for the engineers. the architects. the debuggers at dawn.<br/>
              {"//"} the ai builders. the ones who ship.<br/>
              {"//"} this is yours. you earned it.
            </p>
          </FadeIn>

        </div>
      </section>

    </div>
  );
}
