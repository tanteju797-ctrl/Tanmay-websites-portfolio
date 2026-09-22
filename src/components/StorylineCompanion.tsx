import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronRight,
  MessageSquare,
  Smile,
  Zap,
  Flame,
  Bot,
  Minimize2,
  Maximize2,
  Compass,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CompanionCharacter } from '../types';

interface StorylinePhase {
  id: string;
  name: string;
  pose: string;
  expression: string;
  avatarIcon: string;
  title: string;
  quip: string;
  details: string;
  position: { x: string; y: string; side: 'left' | 'right' };
}

const STORYLINE_PHASES: StorylinePhase[] = [
  {
    id: 'hero',
    name: 'Arrival in the Cosmos',
    pose: 'floating-hover',
    expression: 'excited-wink',
    avatarIcon: '🚀',
    title: 'WELCOME TO THE DIMENSION',
    quip: "Hey! I'm Tejas's digital familiar. Welcome to our creative universe! Scroll down to experience the journey ✨",
    details: 'Hover over cards to see physics in action, or switch themes using the dock!',
    position: { x: 'right-6 sm:right-12', y: 'top-32 sm:top-36', side: 'right' },
  },
  {
    id: 'about',
    name: 'The Philosophy Chamber',
    pose: 'deep-thinker',
    expression: 'creative-focus',
    avatarIcon: '💡',
    title: 'OBSESSIVE DIGITAL CRAFT',
    quip: "Rule #1: Zero cookie-cutter templates! We sculpt digital flagships with raw intention and soul 🧐",
    details: 'Every millisecond of animation and typography step is mathematically tuned.',
    position: { x: 'left-6 sm:left-12', y: 'top-1/3', side: 'left' },
  },
  {
    id: 'services',
    name: 'Motion & Interaction Lab',
    pose: 'maestro-conductor',
    expression: 'playful-grin',
    avatarIcon: '🎵',
    title: 'KINETIC SUPERPOWERS',
    quip: "Motion is not decoration—motion IS the experience! Feel that 120 FPS harmonic rebound ⚡",
    details: 'From custom UI/UX design to WebGL GPU shaders and spring kinetics.',
    position: { x: 'right-6 sm:right-12', y: 'top-1/2', side: 'right' },
  },
  {
    id: 'dashboard',
    name: 'Physics & Kinematics Engine',
    pose: 'scientist-tinkering',
    expression: 'laser-focus',
    avatarIcon: '🧪',
    title: 'HARMONIC SPRING DUEL',
    quip: "Check out our live physics lab below! Move the sliders to tweak our gravity and bounciness 🕹️",
    details: 'Compare robotic linear easing with momentum-preserving harmonic springs.',
    position: { x: 'left-6 sm:left-12', y: 'top-1/2', side: 'left' },
  },
  {
    id: 'work',
    name: 'The Living Archive',
    pose: 'cinema-popcorn',
    expression: 'heart-eyes',
    avatarIcon: '🍿',
    title: '60 FPS LOOPING WORLDS',
    quip: "Grab some popcorn! Every project here has its own real-time looping video world 🎬",
    details: 'Click any project to enter an immersive full-screen interactive case study.',
    position: { x: 'right-6 sm:right-12', y: 'top-1/3', side: 'right' },
  },
  {
    id: 'process',
    name: 'The 5-Stage Warp Sequence',
    pose: 'rocket-surfing',
    expression: 'thumbs-up',
    avatarIcon: '⚡',
    title: 'DISCOVERY TO DEPLOYMENT',
    quip: "5-stage launch sequence: Discovery → Spatial Wireframing → Kinetic Code → 120 FPS Launch! 🚀",
    details: 'Zero friction, transparent milestones, and ultra-fast turnaround.',
    position: { x: 'left-6 sm:left-12', y: 'top-1/2', side: 'left' },
  },
  {
    id: 'about-me',
    name: 'Behind the Screen',
    pose: 'gaming-chill',
    expression: 'cozy-smile',
    avatarIcon: '☕',
    title: 'CHAI & SYNTHWAVE',
    quip: "The mind behind the pixels: 100% handcrafted code, lo-fi beats, and relentless curiosity 🎧",
    details: 'Click nodes on the Skill Constellation on the right to inspect tech proficiencies.',
    position: { x: 'right-6 sm:right-12', y: 'top-1/3', side: 'right' },
  },
  {
    id: 'testimonials',
    name: 'Voices of India',
    pose: 'celebration-confetti',
    expression: 'excited-wink',
    avatarIcon: '🇮🇳',
    title: 'VERIFIED FOUNDER REVIEWS',
    quip: "From Bengaluru to Mumbai & Delhi NCR, read what top Indian founders and directors say! ⭐",
    details: 'Filter reviews by region or click cards on the right to inspect verified metrics.',
    position: { x: 'left-6 sm:left-12', y: 'top-1/2', side: 'left' },
  },
  {
    id: 'contact',
    name: 'Ignite Collaboration',
    pose: 'celebration-confetti',
    expression: 'super-hype',
    avatarIcon: '🎉',
    title: 'READY TO BUILD LEGENDARY?',
    quip: "Your project deserves to look this good. Click 'Start a Project' and let's create magic! 🌟",
    details: 'Currently open for Q2/Q3 client commissions and design partnerships.',
    position: { x: 'right-6 sm:right-12', y: 'bottom-28', side: 'right' },
  },
];

export default function StorylineCompanion() {
  const { themeConfig } = useTheme();
  const [character, setCharacter] = useState<CompanionCharacter>('anime-duo');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [isAcrobaticJumping, setIsAcrobaticJumping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [extraQuipIndex, setExtraQuipIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(false);

  // Sound Synth for cute companion sound effects
  const playCompanionChime = (frequency = 659.25) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } catch {
      // Audio might be muted
    }
  };

  // Scroll detection to update storyline phase seamlessly
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      if (progress < 0.13) setActivePhaseIndex(0); // Hero
      else if (progress < 0.26) setActivePhaseIndex(1); // About
      else if (progress < 0.42) setActivePhaseIndex(2); // Services
      else if (progress < 0.58) setActivePhaseIndex(3); // Dashboard
      else if (progress < 0.74) setActivePhaseIndex(4); // Work
      else if (progress < 0.86) setActivePhaseIndex(5); // Process
      else if (progress < 0.94) setActivePhaseIndex(6); // About Me
      else setActivePhaseIndex(7); // Contact
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPhase = STORYLINE_PHASES[activePhaseIndex];

  // Click Companion: Acrobatics & Confetti
  const handleCompanionClick = () => {
    setIsAcrobaticJumping(true);
    setConfettiBurst(true);
    playCompanionChime(880);
    setTimeout(() => setIsAcrobaticJumping(false), 800);
    setTimeout(() => setConfettiBurst(false), 1200);
    setExtraQuipIndex((prev) => prev + 1);
  };

  // Extra fun quips when clicked
  const funClickQuips = [
    "Wheee! 360° backflip executed with zero frame drops! ✨",
    "Did you know? Every pixel on this website is custom handcrafted without templates!",
    "Poke me again and I might launch a fireworks party in your browser! 🎆",
    "Tip: You can switch between me, Tom & Jerry, or the Celestial Dragon anytime!",
    "Looking for a full-stack masterwork? Tejas is ready for your project! 🚀",
  ];

  const displayQuip =
    extraQuipIndex > 0
      ? funClickQuips[(extraQuipIndex - 1) % funClickQuips.length]
      : currentPhase.quip;

  return (
    <div className="fixed z-40 pointer-events-none inset-0 overflow-hidden">
      {/* Floating Storyline Anchor Node */}
      <motion.div
        animate={{
          x: currentPhase.position.side === 'left' ? 24 : window.innerWidth > 768 ? window.innerWidth - 330 : window.innerWidth - 260,
          y: activePhaseIndex * 36 + (activePhaseIndex % 2 === 0 ? 110 : 160),
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 120,
          mass: 0.9,
        }}
        className="absolute pointer-events-auto flex flex-col items-center select-none origin-bottom-right"
        style={{ width: '240px' }}
      >
        {/* The Animated Cartoon Character Stage */}
        <div className="relative group cursor-pointer" onClick={handleCompanionClick}>
          {/* Confetti Explosion particles */}
          {confettiBurst && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1.5,
                    x: (Math.cos((i * Math.PI * 2) / 12) * 90),
                    y: (Math.sin((i * Math.PI * 2) / 12) * 90),
                  }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute text-sm"
                >
                  {['✨', '⭐', '🎉', '💫', '⚡', '🌟'][i % 6]}
                </motion.span>
              ))}
            </div>
          )}

          {/* Character Container with 3D Flip & Hover Bounce */}
          <motion.div
            animate={{
              rotate: isAcrobaticJumping ? 360 : [0, -3, 3, 0],
              y: isAcrobaticJumping ? -30 : [0, -6, 0],
              scale: isAcrobaticJumping ? 1.2 : 1,
            }}
            transition={{
              rotate: { duration: isAcrobaticJumping ? 0.6 : 4, repeat: isAcrobaticJumping ? 0 : Infinity, ease: 'easeInOut' },
              y: { duration: isAcrobaticJumping ? 0.6 : 3, repeat: isAcrobaticJumping ? 0 : Infinity, ease: 'easeInOut' },
            }}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1.5 relative flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] border-2 backdrop-blur-xl transition-all"
            style={{
              backgroundColor: `${themeConfig.bgCard}EE`,
              borderColor: themeConfig.accent,
            }}
          >
            {/* Dynamic Character Renderers */}
            {character === 'anime-duo' && (
              <AnimeBoyCompanion phase={currentPhase} accent={themeConfig.accent} isLight={themeConfig.isLight} />
            )}
            {character === 'tom-jerry' && (
              <TomJerryCompanion phase={currentPhase} accent={themeConfig.accent} isLight={themeConfig.isLight} />
            )}
            {character === 'celestial-dragon' && (
              <CelestialDragonCompanion phase={currentPhase} accent={themeConfig.accent} isLight={themeConfig.isLight} />
            )}
            {character === 'cyber-pilot' && (
              <CyberPilotCompanion phase={currentPhase} accent={themeConfig.accent} isLight={themeConfig.isLight} />
            )}

            {/* Glowing Celestial Halo */}
            <div
              className="absolute -inset-1 rounded-full blur-md opacity-40 -z-10 animate-pulse"
              style={{ backgroundColor: themeConfig.accent }}
            />

            {/* Click to Play Badge */}
            <div className="absolute -bottom-1.5 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[8px] font-mono tracking-wider text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity">
              TAP ME!
            </div>
          </motion.div>
        </div>

        {/* Character Cast Switcher Dock */}
        <div
          className="mt-2.5 flex items-center gap-1 p-0.5 rounded-full backdrop-blur-xl border shadow-lg"
          style={{
            backgroundColor: `${themeConfig.bgSurface}EE`,
            borderColor: themeConfig.border,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCharacter('anime-duo');
              playCompanionChime(523.25);
            }}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 transition-all ${
              character === 'anime-duo'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Anime Creative Boy & Cosmo Familiar"
          >
            <span>👦 Anime</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCharacter('tom-jerry');
              playCompanionChime(659.25);
            }}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 transition-all ${
              character === 'tom-jerry'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Tom & Jerry Relatable Slapstick Duo"
          >
            <span>🐱 Tom</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCharacter('celestial-dragon');
              playCompanionChime(783.99);
            }}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 transition-all ${
              character === 'celestial-dragon'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Mythical Celestial Dragon"
          >
            <span>🐉 Dragon</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCharacter('cyber-pilot');
              playCompanionChime(987.77);
            }}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 transition-all ${
              character === 'cyber-pilot'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Cyber Mech Pilot & Droid"
          >
            <span>🤖 Bot</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 1. Anime Creative Boy & Cosmo Sprite Avatar Renderer
function AnimeBoyCompanion({ phase, accent, isLight }: { phase: StorylinePhase; accent: string; isLight: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="animeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floating Cosmo Celestial Familiar orbiting boy */}
      <motion.g
        animate={{
          x: [15, 65, 20, 15],
          y: [-15, -5, -25, -15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="20" cy="15" r="9" fill={accent} opacity="0.9" />
        <circle cx="17" cy="13" r="2" fill="#FFFFFF" />
        <circle cx="23" cy="13" r="2" fill="#FFFFFF" />
        <path d="M 18 17 Q 20 19 22 17" stroke="#000" strokeWidth="1" fill="none" />
        {/* Familiar Little Wings */}
        <ellipse cx="10" cy="14" rx="4" ry="2" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 10 14)" />
        <ellipse cx="30" cy="14" rx="4" ry="2" fill="#FFFFFF" opacity="0.7" transform="rotate(20 30 14)" />
      </motion.g>

      {/* Boy Body & Stylish Creative Jacket */}
      <path d="M 28 85 Q 50 70 72 85 L 75 100 L 25 100 Z" fill="#1C1F2B" stroke={accent} strokeWidth="1.5" />
      <path d="M 45 78 L 50 88 L 55 78 Z" fill={accent} />

      {/* Head / Face */}
      <circle cx="50" cy="48" r="24" fill="#FCE5CD" />

      {/* Cool Spiky Anime Hair */}
      <path
        d="M 24 45 Q 20 22 45 18 Q 65 14 78 30 Q 82 45 76 52 Q 68 32 50 30 Q 32 30 24 45 Z"
        fill="#232733"
      />
      <path d="M 38 22 Q 44 8 56 16 Q 64 6 72 20 Z" fill="#2D3244" />

      {/* Dynamic Expression Eyes & Accessories based on Story Phase */}
      {phase.pose === 'deep-thinker' ? (
        // Golden Glasses + Thinking Expression
        <g>
          <circle cx="41" cy="48" r="6" stroke={accent} strokeWidth="2" fill="none" />
          <circle cx="59" cy="48" r="6" stroke={accent} strokeWidth="2" fill="none" />
          <line x1="47" y1="48" x2="53" y2="48" stroke={accent} strokeWidth="2" />
          <circle cx="41" cy="48" r="2" fill="#232733" />
          <circle cx="59" cy="48" r="2" fill="#232733" />
          <path d="M 46 58 Q 50 56 54 58" stroke="#8A4B38" strokeWidth="1.5" fill="none" />
        </g>
      ) : phase.pose === 'maestro-conductor' ? (
        // VR Headset / Neon Visor
        <g>
          <rect x="32" y="42" width="36" height="12" rx="4" fill="#0E121E" stroke={accent} strokeWidth="2" />
          <line x1="36" y1="48" x2="64" y2="48" stroke={accent} strokeWidth="2" />
          <path d="M 44 60 Q 50 64 56 60" stroke="#8A4B38" strokeWidth="2" fill="none" />
        </g>
      ) : phase.pose === 'cinema-popcorn' ? (
        // 3D Cinema Glasses
        <g>
          <rect x="33" y="44" width="15" height="9" rx="2" fill="#EF4444" opacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="52" y="44" width="15" height="9" rx="2" fill="#3B82F6" opacity="0.8" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="48" y1="48" x2="52" y2="48" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="50" cy="59" r="3" fill="#8A4B38" />
        </g>
      ) : (
        // Normal Expressive Anime Eyes
        <g>
          {/* Left Eye */}
          <ellipse cx="40" cy="47" rx="4" ry="5" fill="#1C1F2B" />
          <circle cx="39" cy="45" r="1.5" fill="#FFFFFF" />
          {/* Right Eye (Winking or Star) */}
          {phase.expression === 'excited-wink' ? (
            <path d="M 56 48 Q 61 44 64 48" stroke="#1C1F2B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <g>
              <ellipse cx="60" cy="47" rx="4" ry="5" fill="#1C1F2B" />
              <circle cx="59" cy="45" r="1.5" fill="#FFFFFF" />
            </g>
          )}
          {/* Cheerful Smile */}
          <path d="M 45 57 Q 50 62 55 57" stroke="#8A4B38" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Cute Blush */}
          <ellipse cx="34" cy="53" rx="3" ry="1.5" fill="#FF8A80" opacity="0.6" />
          <ellipse cx="66" cy="53" rx="3" ry="1.5" fill="#FF8A80" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

// 2. Tom & Jerry Cartoon Slapstick Duo Renderer
function TomJerryCompanion({ phase, accent, isLight }: { phase: StorylinePhase; accent: string; isLight: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Cartoon Cat (Tom) Head & Big Whiskers */}
      <g>
        {/* Cat Ears */}
        <polygon points="25,30 18,10 38,22" fill="#5A6577" stroke="#333" strokeWidth="1.5" />
        <polygon points="27,27 22,15 35,22" fill="#FFB7B2" />
        <polygon points="75,30 82,10 62,22" fill="#5A6577" stroke="#333" strokeWidth="1.5" />
        <polygon points="73,27 78,15 65,22" fill="#FFB7B2" />

        {/* Cat Face */}
        <ellipse cx="50" cy="50" rx="30" ry="26" fill="#6B778D" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="50" cy="58" rx="20" ry="16" fill="#F4F4F6" />

        {/* Cat Eyes */}
        <ellipse cx="40" cy="42" rx="7" ry="9" fill="#FFF885" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="60" cy="42" rx="7" ry="9" fill="#FFF885" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="42" cy="43" rx="3" ry="5" fill="#222" />
        <ellipse cx="58" cy="43" rx="3" ry="5" fill="#222" />

        {/* Cat Red Nose & Smile */}
        <ellipse cx="50" cy="52" rx="4" ry="3" fill="#E65C5C" />
        <path d="M 50 55 L 50 60 Q 42 66 38 60 M 50 60 Q 58 66 62 60" stroke="#333" strokeWidth="2" fill="none" />

        {/* Whiskers */}
        <line x1="25" y1="52" x2="8" y2="50" stroke="#FFF" strokeWidth="1.5" />
        <line x1="25" y1="56" x2="8" y2="58" stroke="#FFF" strokeWidth="1.5" />
        <line x1="75" y1="52" x2="92" y2="50" stroke="#FFF" strokeWidth="1.5" />
        <line x1="75" y1="56" x2="92" y2="58" stroke="#FFF" strokeWidth="1.5" />
      </g>

      {/* Little Witty Mouse (Jerry) Peeking on top of Cat's Head! */}
      <motion.g
        animate={{
          y: [-2, 3, -2],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Mouse Ears */}
        <circle cx="40" cy="12" r="7" fill="#8D5B4C" stroke="#333" strokeWidth="1" />
        <circle cx="40" cy="12" r="4" fill="#FFC7C7" />
        <circle cx="60" cy="12" r="7" fill="#8D5B4C" stroke="#333" strokeWidth="1" />
        <circle cx="60" cy="12" r="4" fill="#FFC7C7" />

        {/* Mouse Head */}
        <ellipse cx="50" cy="20" rx="10" ry="8" fill="#A8715A" stroke="#333" strokeWidth="1" />
        {/* Mouse Eyes & Snout */}
        <ellipse cx="47" cy="18" rx="2" ry="3" fill="#FFF" />
        <circle cx="47" cy="18" r="1" fill="#000" />
        <ellipse cx="53" cy="18" rx="2" ry="3" fill="#FFF" />
        <circle cx="53" cy="18" r="1" fill="#000" />
        <circle cx="50" cy="22" r="1.5" fill="#000" />
      </motion.g>
    </svg>
  );
}

// 3. Mythical Celestial Golden Dragon Companion
function CelestialDragonCompanion({ phase, accent, isLight }: { phase: StorylinePhase; accent: string; isLight: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Coiling Celestial Dragon Body */}
      <motion.path
        d="M 20 70 Q 15 40 40 30 Q 70 20 80 50 Q 85 80 55 85 Q 30 85 25 65 Q 20 45 45 45"
        fill="none"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
        animate={{
          strokeDashoffset: [0, 100],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Dragon Head with Golden Horns */}
      <g transform="translate(45, 32)">
        {/* Antlers / Horns */}
        <path d="M 0 0 Q -10 -15 -18 -12 M 0 0 Q -6 -20 -4 -25" stroke="#FFF" strokeWidth="2" fill="none" />
        <path d="M 12 0 Q 22 -15 30 -12 M 12 0 Q 18 -20 16 -25" stroke="#FFF" strokeWidth="2" fill="none" />

        {/* Snout & Whiskers */}
        <ellipse cx="6" cy="8" rx="14" ry="10" fill={accent} stroke="#090A0C" strokeWidth="1.5" />
        <circle cx="1" cy="4" r="3" fill="#FFF" />
        <circle cx="1" cy="4" r="1.5" fill="#B91C1C" />
        <circle cx="11" cy="4" r="3" fill="#FFF" />
        <circle cx="11" cy="4" r="1.5" fill="#B91C1C" />

        {/* Long Celestial Whiskers */}
        <motion.path
          d="M -4 10 Q -20 15 -28 30"
          stroke="#FFF"
          strokeWidth="1.5"
          fill="none"
          animate={{ d: ['M -4 10 Q -20 15 -28 30', 'M -4 10 Q -24 20 -26 35', 'M -4 10 Q -20 15 -28 30'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M 16 10 Q 32 15 40 30"
          stroke="#FFF"
          strokeWidth="1.5"
          fill="none"
          animate={{ d: ['M 16 10 Q 32 15 40 30', 'M 16 10 Q 36 20 38 35', 'M 16 10 Q 32 15 40 30'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </g>

      {/* Floating Mystic Pearl of Wisdom */}
      <motion.g
        animate={{
          scale: [0.9, 1.2, 0.9],
          y: [0, -5, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="65" r="8" fill="#FFFFFF" />
        <circle cx="50" cy="65" r="12" fill={accent} opacity="0.4" />
      </motion.g>
    </svg>
  );
}

// 4. Cyber-Chibi Mech Pilot & Droid
function CyberPilotCompanion({ phase, accent, isLight }: { phase: StorylinePhase; accent: string; isLight: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Jetpack Exhaust Flames */}
      <motion.path
        d="M 35 75 Q 40 95 40 85 M 65 75 Q 60 95 60 85"
        stroke="#00F0FF"
        strokeWidth="3"
        fill="none"
        animate={{ strokeWidth: [2, 5, 2] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* Cyber Bot Helmet */}
      <rect x="25" y="25" width="50" height="46" rx="14" fill="#131826" stroke={accent} strokeWidth="2.5" />

      {/* LED Visor Screen */}
      <rect x="30" y="34" width="40" height="22" rx="6" fill="#060912" />

      {/* Dynamic LED Pixel Expression */}
      <g fill={accent}>
        {phase.expression === 'laser-focus' ? (
          // Concentric Targeting Reticle
          <g>
            <circle cx="42" cy="45" r="4" fill="none" stroke={accent} strokeWidth="1.5" />
            <circle cx="58" cy="45" r="4" fill="none" stroke={accent} strokeWidth="1.5" />
            <circle cx="42" cy="45" r="1.5" />
            <circle cx="58" cy="45" r="1.5" />
          </g>
        ) : (
          // Joyful Pixel Eyes ^^
          <g>
            <path d="M 37 46 L 41 42 L 45 46" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 55 46 L 59 42 L 63 46" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </g>

      {/* Antenna & Signal Beacon */}
      <line x1="50" y1="25" x2="50" y2="12" stroke={accent} strokeWidth="2" />
      <circle cx="50" cy="10" r="4" fill="#FF0055" className="animate-ping" />
      <circle cx="50" cy="10" r="3" fill="#FF0055" />
    </svg>
  );
}
