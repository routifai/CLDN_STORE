export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#00ff41]/10 p-10 mt-auto uppercase tracking-widest">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 mb-10">
        {/* Left */}
        <div className="flex flex-col">
          <span className="text-[#00ff41]/80 text-[20px] font-bold">CLDN</span>
          <span className="text-[#00ff41]/20 text-[12px] mt-2">{"//"} coded layers, drop notation</span>
        </div>
        
        {/* Center */}
        <div className="flex flex-col items-start md:items-center gap-3">
          <a href="/#shop" className="text-[#00ff41]/40 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">[shop]</a>
          <a href="/#drops" className="text-[#00ff41]/40 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">[drops]</a>
          <a href="/about" className="text-[#00ff41]/40 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">[about]</a>
          <a href="/contact" className="text-[#00ff41]/40 hover:text-[#00ff41] transition-opacity duration-200 text-[12px] tracking-[0.1em]">[contact]</a>
        </div>

        {/* Right */}
        <div className="flex flex-col text-left md:text-right gap-2 md:justify-start">
          <span className="text-[#00ff41]/40 text-[10px] tracking-[0.1em]">{"//"} all systems operational</span>
          <span className="text-[#00ff41]/40 text-[10px] tracking-[0.1em]">{year} coded layers, drop notation ltd.</span>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="pt-6 border-t border-[#00ff41]/10">
        <span className="text-[#00ff41]/15 text-[10px] tracking-[0.1em]">$ cldn --version 1.0.0</span>
      </div>
    </footer>
  );
}