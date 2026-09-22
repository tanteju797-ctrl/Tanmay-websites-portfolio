import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Sparkles, Activity, Layers, Code, Play } from 'lucide-react';
import HeroCanvas from './HeroCanvas';
import LoopingVideoShowcase from './LoopingVideoShowcase';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { Project } from '../types';

interface HeroSectionProps {
  onOpenProject: (project: Project) => void;
  onOpenContact: () => void;
  featuredProject: Project;
}

export default function HeroSection({
  onOpenProject,
  onOpenContact,
  featuredProject,
}: HeroSectionProps) {
  const { themeConfig } = useTheme();
  const { playWorkHover, playClick, isAudioPlaying } = useSound();

  // 3D Card Parallax on mouse hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sound chime synthesizer for ambient luxury feedback
  const handlePlayAmbientChime = () => {
    playWorkHover(0);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-6 sm:px-8 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: 'transparent',
        color: themeConfig.textPrimary,
      }}
    >
      {/* 3D WebGL Canvas Layer */}
      <HeroCanvas interactive={true} />

      {/* Film grain and atmospheric gradients */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-[1]" />
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1] opacity-30"
        style={{ backgroundColor: themeConfig.accent }}
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none z-[1] opacity-20"
        style={{ backgroundColor: themeConfig.secondaryAccent }}
      />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Status Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md mb-6"
            style={{
              backgroundColor: `${themeConfig.bgCard}CC`,
              borderColor: themeConfig.border,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono" style={{ color: themeConfig.accent }}>
              AI Website Developer • Available for Commissions
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[1.02] tracking-[-0.02em]"
              style={{ color: themeConfig.textPrimary }}
            >
              My selected <br />
              <span className="italic font-normal relative" style={{ color: themeConfig.secondaryAccent }}>
                projects.
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[1px]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${themeConfig.accent}, transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </span>
            </motion.h1>
          </div>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-lg sm:text-xl font-light max-w-xl leading-relaxed"
            style={{ color: themeConfig.textSecondary }}
          >
            I am an AI website developer crafting bespoke, high-performance web experiences. Combining AI-accelerated development with fluid motion kinetics, tailored UI/UX, and precision engineering.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <button
              id="hero-primary-cta"
              data-cursor="build"
              onClick={() => {
                playClick('chime');
                onOpenContact();
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
              }}
            >
              <span>Start a Project</span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                style={{
                  backgroundColor: themeConfig.isLight ? '#181512' : '#090A0C',
                  color: themeConfig.accent,
                }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <a
              id="hero-secondary-cta"
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                playClick('soft');
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full border text-xs sm:text-sm font-medium tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: `${themeConfig.bgCard}B3`,
                borderColor: themeConfig.border,
                color: themeConfig.textPrimary,
              }}
            >
              <span>Explore Work</span>
            </a>

            {/* Micro Audio Chime Button */}
            <button
              onClick={handlePlayAmbientChime}
              title="Experience harmonic resonance"
              className="p-3.5 rounded-full border transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: themeConfig.bgCard,
                borderColor: themeConfig.border,
                color: themeConfig.accent,
              }}
            >
              <Sparkles className={`w-4 h-4 ${isAudioPlaying ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>

          {/* Editorial Capabilities Marquee snippet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 pt-6 border-t flex flex-wrap items-center gap-6 sm:gap-8 text-[11px] tracking-[0.2em] uppercase font-mono"
            style={{
              borderColor: themeConfig.border,
              color: themeConfig.textMuted,
            }}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
              <span>UI/UX & Design Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
              <span>WebGL & React</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
              <span>Motion Choreography</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Interactive Floating Glass Card Deck with Real-time Looping Video Showcase */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative perspective-1000">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            {/* Ambient Backing Glow */}
            <div
              className="absolute -inset-4 rounded-[36px] blur-2xl pointer-events-none opacity-40"
              style={{
                background: `radial-gradient(circle, ${themeConfig.accent} 0%, transparent 70%)`,
              }}
            />

            {/* Main Featured Project Card (Obsidian Glass Aesthetic with Looping Video) */}
            <div
              id="hero-featured-card"
              data-cursor="project"
              data-cursor-text={featuredProject.title}
              onMouseEnter={() => playWorkHover(0)}
              onClick={() => {
                playClick('chime');
                onOpenProject(featuredProject);
              }}
              className="relative rounded-[26px] p-6 sm:p-7 border backdrop-blur-2xl shadow-2xl cursor-pointer group transition-all duration-500"
              style={{
                backgroundColor: `${themeConfig.bgCard}F2`,
                borderColor: themeConfig.border,
              }}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: themeConfig.border }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.accent }} />
                  <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: themeConfig.textMuted }}>
                    Featured Interactive Showcase
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold" style={{ color: themeConfig.accent }}>
                  01
                </span>
              </div>

              {/* Card Body with Real-time 60FPS Looping Video Showcase */}
              <div className="my-5 relative rounded-2xl overflow-hidden shadow-lg">
                <LoopingVideoShowcase
                  type={featuredProject.videoType || 'chai'}
                  badge={featuredProject.videoBadge || '60 FPS KINETIC LOOP'}
                  accentColor={themeConfig.accent}
                  aspectRatio="aspect-[16/10]"
                />
              </div>

              {/* Title & Description */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl transition-colors" style={{ color: themeConfig.textPrimary }}>
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: themeConfig.textSecondary }}>
                    {featuredProject.tagline}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 group-hover:scale-110"
                  style={{
                    backgroundColor: themeConfig.bgSurface,
                    borderColor: themeConfig.border,
                    color: themeConfig.accent,
                  }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Performance Indicator Bar inside Card */}
              <div className="mt-5 pt-4 border-t flex items-center justify-between text-[11px] font-mono" style={{ borderColor: themeConfig.border }}>
                <div className="flex items-center gap-2" style={{ color: themeConfig.textMuted }}>
                  <Activity className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                  <span>Performance Rating</span>
                </div>
                <span className="font-semibold" style={{ color: themeConfig.accent }}>
                  99.8%
                </span>
              </div>
            </div>

            {/* Satellite Floating Glass Card: Typography Specimen */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 -left-6 sm:-left-10 px-4 py-3 rounded-2xl border shadow-2xl hidden sm:flex items-center gap-3 select-none pointer-events-none z-20 backdrop-blur-xl"
              style={{
                backgroundColor: `${themeConfig.bgCard}F2`,
                borderColor: themeConfig.border,
                color: themeConfig.textPrimary,
              }}
            >
              <div
                className="w-8 h-8 rounded-xl font-serif italic text-base flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  color: themeConfig.accent,
                }}
              >
                Aa
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold font-serif leading-tight">Editorial Serif</span>
                <span className="text-[9px] font-mono tracking-wider opacity-70">Kinetic Typography</span>
              </div>
            </motion.div>

            {/* Satellite Floating Glass Card: Core Performance Metric */}
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-6 -right-4 sm:-right-8 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 select-none pointer-events-none z-20 backdrop-blur-xl"
              style={{
                backgroundColor: `${themeConfig.bgCard}F2`,
                borderColor: themeConfig.border,
                color: themeConfig.textPrimary,
              }}
            >
              <div
                className="w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center border"
                style={{
                  backgroundColor: `${themeConfig.accent}22`,
                  borderColor: themeConfig.accent,
                  color: themeConfig.accent,
                }}
              >
                98+
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium leading-tight">Lighthouse Speed</span>
                <span className="text-[9px] font-mono" style={{ color: themeConfig.textMuted }}>
                  Sub-second TTFB
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono" style={{ color: themeConfig.textMuted }}>
          SCROLL TO EXPLORE
        </span>
        <div className="w-4 h-7 rounded-full border flex justify-center p-1" style={{ borderColor: themeConfig.border }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full"
            style={{ backgroundColor: themeConfig.accent }}
          />
        </div>
      </motion.div>
    </section>
  );
}

