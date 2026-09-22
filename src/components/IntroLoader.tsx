import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [stage, setStage] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 250);  // Logo + line
    const timer2 = setTimeout(() => setStage(2), 700);  // Brand name
    const timer3 = setTimeout(() => setStage(3), 1300); // Shimmer & reveal
    const timer4 = setTimeout(() => {
      setIsFinished(true);
      onComplete();
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          id="intro-brand-reveal"
          className="fixed inset-0 z-[100] bg-[#07080A] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Subtle noise and light glow */}
          <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E5C97B]/5 blur-[120px] pointer-events-none" />

          {/* Central Reveal Container */}
          <div className="relative flex flex-col items-center justify-center text-center px-6">
            {/* Monogram */}
            <motion.div
              className="font-serif italic text-4xl sm:text-5xl text-[#E8D5B5] tracking-tighter mb-4"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              t&h
            </motion.div>

            {/* Expanding thin champagne line */}
            <motion.div
              className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: stage >= 1 ? 160 : 0,
                opacity: stage >= 1 ? 0.9 : 0,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Brand Title */}
            <div className="overflow-hidden mt-5">
              <motion.h1
                className="font-serif text-xl sm:text-2xl tracking-[0.25em] uppercase text-[#E8E6E1]"
                initial={{ y: 35, opacity: 0 }}
                animate={{
                  y: stage >= 2 ? 0 : 35,
                  opacity: stage >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                tejas & himself
              </motion.h1>
            </div>

            {/* Role descriptor */}
            <motion.p
              className="text-[10px] sm:text-xs tracking-[0.35em] text-[#9A9DA6] uppercase mt-2 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 0.8 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Digital Creator • Website Builder
            </motion.p>
          </div>

          {/* Bottom loading indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono">
              INITIALIZING STUDIO
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
