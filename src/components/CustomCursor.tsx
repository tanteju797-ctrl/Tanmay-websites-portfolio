import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export type CursorMode = 'default' | 'pointer' | 'project' | 'drag' | 'build' | 'hidden';

export default function CustomCursor() {
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [customText, setCustomText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect fine pointer device (desktop / mouse)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    if (!mediaQuery.matches) return;

    document.body.classList.add('has-custom-cursor');

    let currentMode: CursorMode = 'default';
    let currentText = '';

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible((prev) => (prev ? prev : true));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Global listener for data-cursor attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = (cursorTarget.getAttribute('data-cursor') || 'default') as CursorMode;
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        if (currentMode !== mode || currentText !== text) {
          currentMode = mode;
          currentText = text;
          setCursorMode(mode);
          setCustomText(text);
        }
        return;
      }

      // Check standard interactive elements
      const isInteractive = Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      );

      const targetMode: CursorMode = isInteractive ? 'pointer' : 'default';
      if (currentMode !== targetMode || currentText !== '') {
        currentMode = targetMode;
        currentText = '';
        setCursorMode(targetMode);
        setCustomText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Precision center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            cursorMode === 'default'
              ? 'w-1.5 h-1.5'
              : cursorMode === 'project'
              ? 'w-0 h-0 opacity-0'
              : 'w-2 h-2 opacity-80'
          }`}
        />
      </motion.div>

      {/* Trailing follower ring & contextual badge */}
      <motion.div
        id="custom-cursor-follower"
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center font-sans select-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {cursorMode === 'default' && (
          <motion.div
            className="w-8 h-8 rounded-full border border-white/25 transition-all duration-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          />
        )}

        {cursorMode === 'pointer' && (
          <motion.div
            className="w-12 h-12 rounded-full border border-[#E5C97B]/60 bg-[#E5C97B]/10 backdrop-blur-[2px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{ type: 'spring', damping: 20 }}
          />
        )}

        {cursorMode === 'project' && (
          <motion.div
            className="w-24 h-24 rounded-full bg-[#E8D5B5] text-[#090A0C] flex flex-col items-center justify-center shadow-2xl font-medium tracking-wider text-[11px] uppercase border border-white/40"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            <span className="font-semibold">{customText || 'VIEW'}</span>
            <span className="text-[13px] leading-none mt-0.5">↗</span>
          </motion.div>
        )}

        {cursorMode === 'drag' && (
          <motion.div
            className="w-16 h-16 rounded-full bg-[#1A1D24]/90 border border-white/20 text-[#E8E6E1] text-[10px] tracking-widest uppercase flex items-center justify-center backdrop-blur-md"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            DRAG
          </motion.div>
        )}

        {cursorMode === 'build' && (
          <motion.div
            className="w-20 h-20 rounded-full bg-[#E5C97B] text-[#090A0C] flex items-center justify-center font-semibold text-[10px] tracking-widest uppercase shadow-xl"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
          >
            START
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
