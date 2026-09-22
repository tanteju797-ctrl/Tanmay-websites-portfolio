import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface NavigationProps {
  onOpenContact: () => void;
  activeSection: string;
}

export default function Navigation({ onOpenContact, activeSection }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { themeConfig } = useTheme();
  const { soundEnabled, toggleSound, isAudioPlaying, playClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'WORK', href: '#work', id: 'work' },
    { name: 'PROCESS', href: '#process', id: 'process' },
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'REVIEWS', href: '#testimonials', id: 'testimonials' },
    { name: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#090A0C]/75 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="nav-brand-logo"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-3 select-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1C1F26] to-[#121419] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-[#E5C97B]/50 group-hover:scale-105">
              <span className="font-serif italic text-lg text-[#E8D5B5] tracking-tighter">t&h</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-[0.15em] uppercase text-[#E8E6E1] group-hover:text-white transition-colors">
                tanmay & himself
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase font-sans -mt-0.5 font-medium">
                AI Website Developer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#13161C]/60 border border-white/[0.07] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  onClick={(e) => {
                    playClick('soft');
                    handleScrollTo(e, link.href);
                  }}
                  className={`relative px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 rounded-full ${
                    isActive ? 'text-[#090A0C] font-semibold' : 'text-[#A2A6B2] hover:text-[#E8E6E1]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-[#E8D5B5] rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Action CTA & Audio & Theme Selector */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Ambient Sound Toggle with Equalizer Visualizer */}
            <button
              id="nav-sound-toggle-button"
              onClick={() => {
                toggleSound();
                if (!soundEnabled) {
                  playClick('chime');
                }
              }}
              title={soundEnabled ? 'Ambient Cinematic Audio: ON (Click to Mute)' : 'Ambient Cinematic Audio: OFF (Click to Enable)'}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-mono transition-all duration-300 ${
                soundEnabled
                  ? 'bg-[#151821] border-white/20 text-[#E8D5B5] shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]'
                  : 'bg-[#101217]/80 border-white/10 text-[#6B7280] hover:text-white hover:border-white/20'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <div className="flex items-end gap-[2px] h-3 w-4">
                    <span
                      className={`w-[2px] rounded-full bg-[#D4AF37] transition-all duration-150 ${
                        isAudioPlaying ? 'h-3 animate-pulse' : 'h-1.5'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full bg-[#D4AF37] transition-all duration-150 ${
                        isAudioPlaying ? 'h-3.5 animate-bounce' : 'h-2.5'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full bg-[#D4AF37] transition-all duration-150 ${
                        isAudioPlaying ? 'h-2 animate-pulse' : 'h-1'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">AUDIO</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">MUTED</span>
                </>
              )}
            </button>

            <ThemeSelector variant="compact" />
            <button
              id="nav-cta-button"
              data-cursor="build"
              onClick={() => {
                playClick('chime');
                onOpenContact();
              }}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8D5B5] to-[#D4AF37] text-[#090A0C] font-medium text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#090A0C]/70" />
              <span>LET'S BUILD</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-[#171A21] border border-white/10 text-[#E8E6E1] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#090A0C]/95 backdrop-blur-2xl md:hidden pt-28 px-8 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="font-serif text-3xl text-[#E8E6E1] hover:text-[#E8D5B5] tracking-wide flex items-center justify-between border-b border-white/[0.06] pb-4"
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-mono text-[#8E929E]">0{idx + 1}</span>
                </motion.a>
              ))}
            </div>

            <div className="pt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-xs font-mono text-[#A2A6B2] uppercase tracking-wider">Cinematic Audio</span>
                <button
                  onClick={() => {
                    toggleSound();
                    if (!soundEnabled) playClick('chime');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    soundEnabled
                      ? 'bg-[#E8D5B5] text-[#090A0C] font-semibold'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>ENABLED</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>MUTED</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  playClick('chime');
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#E8D5B5] to-[#D4AF37] text-[#090A0C] font-semibold tracking-wider text-sm uppercase flex items-center justify-center gap-2 shadow-lg"
              >
                <span>LET'S BUILD</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-[#8E929E] tracking-widest font-sans uppercase">
                tanmay & himself • Independent Digital Creator
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
