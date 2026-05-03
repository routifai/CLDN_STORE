"use client";

import { useState } from "react";

export default function DropTeaser() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center text-center px-4">
      <div className="text-[#00ff41]/30 text-[11px] tracking-[0.2em] mb-4">
        {'>'} incoming transmission
      </div>
      
      <h2 className="text-[#00ff41]/15 font-bold leading-none mb-8 tracking-[0.1em]" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
        DROP_02
      </h2>
      
      {submitted ? (
        <div className="text-[#00ff41] text-[12px] tracking-[0.2em]">
          {'>'} transmission received. standing by...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <div className="text-[#00ff41]/40 text-[11px] tracking-[0.2em]">
            {"//"} notify me when it drops
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              required
              placeholder="enter_email.exe"
              className="w-full bg-transparent border-b border-[#00ff41]/30 text-[#00ff41] px-0 py-3 text-[12px] tracking-widest outline-none placeholder:text-[#00ff41]/20 focus:border-[#00ff41]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto border border-[#00ff41] bg-transparent text-[#00ff41] px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none flex-shrink-0"
            >
              [transmit]
            </button>
          </div>
        </form>
      )}
    </div>
  );
}