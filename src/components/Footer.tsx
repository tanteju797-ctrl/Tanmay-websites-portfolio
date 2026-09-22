import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export default function Footer() {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' UTC'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Process', href: '#process' },
    { name: 'About', href: '#about-me' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-transparent text-[#A6ABB8] py-16 px-6 sm:px-8 border-t border-white/[0.06] overflow-hidden">
      {/* Film grain and subtle line */}
      <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col space-y-12 relative z-10">
        {/* Top Row: Brand Monogram + Links */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif italic text-2xl text-[#E8D5B5]">t&h</span>
              <span className="font-serif text-xl tracking-[0.2em] uppercase text-[#F6F4EE]">
                tanmay & himself
              </span>
            </div>
            <p className="text-xs text-[#8E929E] mt-2 font-serif italic max-w-sm">
              “AI website developer building intelligent digital experiences with intent.”
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono tracking-widest uppercase">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#E8D5B5] transition-colors"
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row: Metadata, UTC Time, Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#6F7482]">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} tanmay & himself.</span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>

          {/* Local clock */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[#A6ABB8]">Studio Clock: {timeString}</span>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#12151D] hover:bg-[#1A1D27] border border-white/10 text-[#E8E6E1] transition-all hover:scale-105"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
