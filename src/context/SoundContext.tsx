import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playWorkHover: (index?: number) => void;
  playScrollTransition: (sectionName?: string) => void;
  playClick: (type?: 'soft' | 'sharp' | 'chime') => void;
  playModalOpen: () => void;
  playModalClose: () => void;
  playThemeSwitch: () => void;
  isAudioPlaying: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tejas_portfolio_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastScrollSoundTime = useRef<number>(0);
  const lastHoverSoundTime = useRef<number>(0);
  const activeOscillators = useRef<OscillatorNode[]>([]);

  // Initialize or resume AudioContext
  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem('tejas_portfolio_sound', JSON.stringify(enabled));
    } catch {
      // ignore localStorage errors
    }
    if (enabled) {
      getAudioContext();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // User gesture unlock for modern browsers
  useEffect(() => {
    const handleFirstGesture = () => {
      if (soundEnabled) {
        getAudioContext();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [soundEnabled]);

  // Visual pulse indicator for audio playing
  const triggerAudioIndicator = (durationMs = 400) => {
    setIsAudioPlaying(true);
    setTimeout(() => setIsAudioPlaying(false), durationMs);
  };

  /**
   * 1. Cinematic Work Hover Sound
   * Harmonic glass chime with warm, organic resonance and slight frequency shimmer
   */
  const playWorkHover = (index = 0) => {
    if (!soundEnabled) return;
    const now = Date.now();
    // Throttle slightly to prevent sonic clutter (140ms)
    if (now - lastHoverSoundTime.current < 140) return;
    lastHoverSoundTime.current = now;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const notes = [
        [523.25, 783.99, 1046.5],  // C5, G5, C6 (Pristine)
        [587.33, 880.0, 1174.66],  // D5, A5, D6 (Airy)
        [659.25, 987.77, 1318.51], // E5, B5, E6 (Luminous)
        [783.99, 1174.66, 1567.98],// G5, D6, G6 (Celestial)
        [698.46, 1046.5, 1396.91], // F5, C6, F6 (Ethereal)
        [880.0, 1318.51, 1760.0],  // A5, E6, A6 (Golden)
      ];

      const chord = notes[index % notes.length];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.028, ctx.currentTime + 0.03);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
      masterGain.connect(ctx.destination);

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Micro pitch shimmer
        osc.frequency.exponentialRampToValueAtTime(freq * 1.015, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.5);

        const subGain = (1 / (i + 1.2)) * 0.7;
        noteGain.gain.setValueAtTime(subGain, ctx.currentTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(ctx.currentTime + i * 0.015);
        osc.stop(ctx.currentTime + 0.68);
      });

      triggerAudioIndicator(350);
    } catch {
      // Audio playback failsafe
    }
  };

  /**
   * 2. Cinematic Scroll Transition Sound
   * Deep atmospheric dimensional sweep (low-pass sub + harmonic airy swell)
   */
  const playScrollTransition = (sectionName?: string) => {
    if (!soundEnabled) return;
    const now = Date.now();
    // Debounce scroll sounds (minimum 850ms between section swells)
    if (now - lastScrollSoundTime.current < 850) return;
    lastScrollSoundTime.current = now;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const sectionFrequencies: Record<string, { base: number; peak: number }> = {
        hero: { base: 130.81, peak: 196.0 },     // C3 -> G3
        about: { base: 146.83, peak: 220.0 },    // D3 -> A3
        services: { base: 164.81, peak: 246.94 },// E3 -> B3
        dashboard: { base: 174.61, peak: 261.63 },// F3 -> C4
        work: { base: 196.0, peak: 293.66 },     // G3 -> D4
        process: { base: 220.0, peak: 329.63 },  // A3 -> E4
        'about-me': { base: 246.94, peak: 369.99 },// B3 -> F#4
        contact: { base: 261.63, peak: 392.0 },  // C4 -> G4
      };

      const key = sectionName?.toLowerCase() || 'hero';
      const config = sectionFrequencies[key] || { base: 146.83, peak: 220.0 };

      // 1. Sub-bass & resonant fundamental
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.8);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(config.base, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(config.peak, ctx.currentTime + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(config.base * 0.9, ctx.currentTime + 0.85);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(config.base * 1.5, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(config.peak * 1.5, ctx.currentTime + 0.35);

      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.032, ctx.currentTime + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.88);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.9);
      osc2.stop(ctx.currentTime + 0.9);

      triggerAudioIndicator(500);
    } catch {
      // Audio failsafe
    }
  };

  /**
   * 3. Subtle Tactile UI Interaction Clicks & Chimes
   */
  const playClick = (type: 'soft' | 'sharp' | 'chime' = 'soft') => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'soft') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'sharp') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.07);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      triggerAudioIndicator(200);
    } catch {
      // Audio failsafe
    }
  };

  /**
   * 4. Modal Open Ethereal Chord
   */
  const playModalOpen = () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const freqs = [392.0, 493.88, 587.33, 783.99]; // G Major 7th
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      masterGain.connect(ctx.destination);

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f * 1.02, ctx.currentTime + 0.4);
        osc.connect(masterGain);
        osc.start(ctx.currentTime + i * 0.03);
        osc.stop(ctx.currentTime + 0.75);
      });

      triggerAudioIndicator(400);
    } catch {
      // Audio failsafe
    }
  };

  /**
   * 5. Modal Close Damped Resonance
   */
  const playModalClose = () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.0, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(196.0, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);

      triggerAudioIndicator(200);
    } catch {
      // Audio failsafe
    }
  };

  /**
   * 6. Theme Switch Cinematic Shimmer
   */
  const playThemeSwitch = () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const freqs = [440, 554.37, 659.25, 880, 1108.73];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      masterGain.connect(ctx.destination);

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.connect(masterGain);
        osc.start(ctx.currentTime + i * 0.02);
        osc.stop(ctx.currentTime + 0.55);
      });

      triggerAudioIndicator(350);
    } catch {
      // Audio failsafe
    }
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        playWorkHover,
        playScrollTransition,
        playClick,
        playModalOpen,
        playModalClose,
        playThemeSwitch,
        isAudioPlaying,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
