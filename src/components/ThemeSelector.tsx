import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles, Moon, Sun, Terminal } from 'lucide-react';
import { useTheme, THEMES, AppTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'inline' | 'compact' | 'floating';
  className?: string;
}

export default function ThemeSelector({
  variant = 'dropdown',
  className = '',
}: ThemeSelectorProps) {
  const { theme, themeConfig, setTheme } = useTheme();
  const { playClick } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.values(THEMES);

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/20 dark:bg-white/5 border border-current/10 backdrop-blur-md ${className}`}>
        {themeList.map((t) => {
          const isSelected = t.id === theme;
          return (
            <button
              key={t.id}
              onClick={() => {
                playClick('chime');
                setTheme(t.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 ${
                isSelected
                  ? 'bg-current/15 font-bold shadow-sm'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
              style={{
                color: isSelected ? t.accent : undefined,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: t.accent }}
              />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => {
            playClick('soft');
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-current/15 text-xs font-mono transition-all hover:scale-105 active:scale-95 ${className}`}
          style={{
            borderColor: themeConfig.accent,
            color: themeConfig.accent,
          }}
          title="Change Theme Palette"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">{themeConfig.name}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 z-50 w-64 rounded-2xl p-2 shadow-2xl border backdrop-blur-2xl"
                style={{
                  backgroundColor: themeConfig.bgCard,
                  borderColor: themeConfig.border,
                }}
              >
                <div className="px-3 py-2 border-b border-current/10 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                    Theme Atmosphere
                  </span>
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  {themeList.map((t) => {
                    const isSelected = t.id === theme;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          playClick('chime');
                          setTheme(t.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-current/10 font-semibold'
                            : 'opacity-75 hover:opacity-100 hover:bg-current/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex items-center justify-center shrink-0"
                            style={{ backgroundColor: t.accent }}
                          />
                          <div>
                            <div className="text-xs font-mono">{t.name}</div>
                            <div className="text-[9px] opacity-60 leading-tight">
                              {t.subtitle}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: t.accent }} />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Floating Quick Dock Trigger
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-14 right-0 z-50 w-72 rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border backdrop-blur-2xl"
              style={{
                backgroundColor: themeConfig.bgCard,
                borderColor: themeConfig.border,
                color: themeConfig.textPrimary,
              }}
            >
              <div className="px-3 py-2 border-b border-current/10 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Select Aesthetic Theme
                  </span>
                </div>
                <span className="text-[9px] font-mono opacity-50">4 PALETTES</span>
              </div>

              <div className="space-y-1.5">
                {themeList.map((t) => {
                  const isSelected = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        playClick('chime');
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-current/10 shadow-sm border border-current/10'
                          : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center shadow-inner shrink-0"
                          style={{ backgroundColor: t.accent }}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black/80" />}
                        </div>
                        <div>
                          <div className="text-xs font-mono font-semibold">{t.name}</div>
                          <div className="text-[10px] opacity-60 leading-tight">
                            {t.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase"
                          style={{ backgroundColor: `${t.accent}20`, color: t.accent }}
                        >
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Pill */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClick('soft');
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] border backdrop-blur-xl transition-all duration-300 font-mono text-xs font-semibold group"
        style={{
          backgroundColor: themeConfig.bgCard,
          borderColor: themeConfig.accent,
          color: themeConfig.textPrimary,
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: themeConfig.accent }}
        />
        <span>Theme: {themeConfig.name}</span>
        <Palette className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" style={{ color: themeConfig.accent }} />
      </motion.button>
    </div>
  );
}
