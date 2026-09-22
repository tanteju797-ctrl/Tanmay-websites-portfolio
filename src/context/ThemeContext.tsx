import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'obsidian' | 'silk-ivory' | 'cyber-neon' | 'monochrome';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  subtitle: string;
  iconBg: string;
  accent: string;
  secondaryAccent: string;
  bgMain: string;
  bgSurface: string;
  bgCard: string;
  bgCardHover: string;
  border: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  isLight: boolean;
  graphGradientStart: string;
  graphGradientEnd: string;
  graphStroke: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Gold',
    subtitle: 'Classic Dark Luxury & Champagne Gold',
    iconBg: '#181B24',
    accent: '#D4AF37',
    secondaryAccent: '#E8D5B5',
    bgMain: '#090A0C',
    bgSurface: '#0E1017',
    bgCard: '#12151E',
    bgCardHover: '#181D29',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(212, 175, 55, 0.4)',
    textPrimary: '#F6F4EE',
    textSecondary: '#C5C9D6',
    textMuted: '#7E8392',
    isLight: false,
    graphGradientStart: '#D4AF37',
    graphGradientEnd: '#E8D5B5',
    graphStroke: '#D4AF37',
  },
  'silk-ivory': {
    id: 'silk-ivory',
    name: 'Silk Ivory',
    subtitle: 'Warm Editorial Linen & Espresso Glass',
    iconBg: '#EFECE6',
    accent: '#B8860B',
    secondaryAccent: '#8C6228',
    bgMain: '#FAF8F5',
    bgSurface: '#F3EFEA',
    bgCard: '#FFFFFF',
    bgCardHover: '#F7F4EE',
    border: 'rgba(0, 0, 0, 0.09)',
    borderHover: 'rgba(184, 134, 11, 0.4)',
    textPrimary: '#181512',
    textSecondary: '#4A453E',
    textMuted: '#857D74',
    isLight: true,
    graphGradientStart: '#B8860B',
    graphGradientEnd: '#D4AF37',
    graphStroke: '#B8860B',
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    subtitle: 'Midnight Navy, Electric Cyan & Violet',
    iconBg: '#0D1322',
    accent: '#00F0FF',
    secondaryAccent: '#A855F7',
    bgMain: '#060913',
    bgSurface: '#0B1120',
    bgCard: '#0F172A',
    bgCardHover: '#16223D',
    border: 'rgba(0, 240, 255, 0.2)',
    borderHover: 'rgba(0, 240, 255, 0.5)',
    textPrimary: '#F0FDF4',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    isLight: false,
    graphGradientStart: '#00F0FF',
    graphGradientEnd: '#A855F7',
    graphStroke: '#00F0FF',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Pure Titanium',
    subtitle: 'High Contrast Minimalist Grayscale',
    iconBg: '#1A1A1A',
    accent: '#FFFFFF',
    secondaryAccent: '#94A3B8',
    bgMain: '#000000',
    bgSurface: '#0D0D0D',
    bgCard: '#141414',
    bgCardHover: '#1F1F1F',
    border: 'rgba(255, 255, 255, 0.12)',
    borderHover: 'rgba(255, 255, 255, 0.35)',
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    isLight: false,
    graphGradientStart: '#FFFFFF',
    graphGradientEnd: '#64748B',
    graphStroke: '#FFFFFF',
  },
};

interface ThemeContextValue {
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('tejas_portfolio_theme');
    if (saved && saved in THEMES) return saved as AppTheme;
    return 'obsidian';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('tejas_portfolio_theme', newTheme);
  };

  const toggleTheme = () => {
    const themeKeys: AppTheme[] = ['obsidian', 'silk-ivory', 'cyber-neon', 'monochrome'];
    const currentIndex = themeKeys.indexOf(theme);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    setTheme(nextTheme);
  };

  const themeConfig = THEMES[theme];

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Set dynamic CSS properties on document root
    root.style.setProperty('--bg-main', themeConfig.bgMain);
    root.style.setProperty('--bg-surface', themeConfig.bgSurface);
    root.style.setProperty('--bg-card', themeConfig.bgCard);
    root.style.setProperty('--bg-card-hover', themeConfig.bgCardHover);
    root.style.setProperty('--border-color', themeConfig.border);
    root.style.setProperty('--border-hover', themeConfig.borderHover);
    root.style.setProperty('--text-primary', themeConfig.textPrimary);
    root.style.setProperty('--text-secondary', themeConfig.textSecondary);
    root.style.setProperty('--text-muted', themeConfig.textMuted);
    root.style.setProperty('--accent', themeConfig.accent);
    root.style.setProperty('--accent-secondary', themeConfig.secondaryAccent);

    if (themeConfig.isLight) {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      document.body.style.backgroundColor = themeConfig.bgMain;
      document.body.style.color = themeConfig.textPrimary;
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
      document.body.style.backgroundColor = themeConfig.bgMain;
      document.body.style.color = themeConfig.textPrimary;
    }
  }, [theme, themeConfig]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, toggleTheme }}>
      <div
        className="transition-colors duration-500 min-h-screen"
        style={{
          backgroundColor: themeConfig.bgMain,
          color: themeConfig.textPrimary,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

