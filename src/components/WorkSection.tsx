import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Sparkles, Filter, ExternalLink, Globe } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import LoopingVideoShowcase from './LoopingVideoShowcase';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { Project } from '../types';

interface WorkSectionProps {
  onOpenProject: (project: Project) => void;
}

export default function WorkSection({ onOpenProject }: WorkSectionProps) {
  const [filter, setFilter] = useState<'All' | 'Concept' | 'Selected Work' | 'Experimental Project'>('All');
  const { themeConfig } = useTheme();
  const { playClick, playWorkHover } = useSound();

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === 'All') return true;
    return p.type === filter;
  });

  return (
    <section
      id="work"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: 'transparent',
        borderColor: themeConfig.border,
        color: themeConfig.textPrimary,
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.accent }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px]" style={{ backgroundColor: themeConfig.accent }} />
              <span className="text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: themeConfig.accent }}>
                Portfolio / Interactive Cinema
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight" style={{ color: themeConfig.textPrimary }}>
              Some of my <br />
              <span className="italic" style={{ color: themeConfig.secondaryAccent }}>
                works.
              </span>
            </h2>
          </div>

          {/* Filter pill tabs */}
          <div
            className="flex items-center gap-1.5 p-1.5 rounded-full border backdrop-blur-md self-start md:self-auto overflow-x-auto max-w-full"
            style={{
              backgroundColor: `${themeConfig.bgSurface}CC`,
              borderColor: themeConfig.border,
            }}
          >
            <Filter className="w-3.5 h-3.5 ml-2 hidden sm:block" style={{ color: themeConfig.textMuted }} />
            {(['All', 'Concept', 'Selected Work', 'Experimental Project'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  playClick('soft');
                  setFilter(type);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all ${
                  filter === type
                    ? 'font-bold shadow-md'
                    : 'hover:text-white'
                }`}
                style={
                  filter === type
                    ? {
                        backgroundColor: themeConfig.accent,
                        color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                      }
                    : {
                        color: themeConfig.textSecondary,
                      }
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onOpen={() => {
                playClick('chime');
                onOpenProject(project);
              }}
              onHover={() => playWorkHover(idx)}
              themeConfig={themeConfig}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: () => void;
  onHover: () => void;
  themeConfig: ReturnType<typeof useTheme>['themeConfig'];
}

// Sub-component for individual 3D interactive project cards with real-time looping video
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onOpen, onHover, themeConfig }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [6, -6]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-6, 6]), { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    onHover();
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        backgroundColor: `${themeConfig.bgCard}F2`,
        borderColor: themeConfig.border,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      data-cursor="project"
      data-cursor-text={project.title}
      className="group relative rounded-[28px] p-6 sm:p-8 border backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-2xl flex flex-col justify-between"
    >
      {/* Top Meta info */}
      <div className="flex items-center justify-between pb-5 border-b" style={{ borderColor: themeConfig.border }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.accent }} />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: themeConfig.textMuted }}>
            {project.type}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold" style={{ color: themeConfig.accent }}>
          0{index + 1}
        </span>
      </div>

      {/* Main Video Looping Stage */}
      <div className="my-6 relative rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: themeConfig.border }}>
        <LoopingVideoShowcase
          type={project.videoType || 'generic'}
          videoUrl={project.videoUrl}
          badge={project.videoBadge || '60 FPS LOOP'}
          accentColor={themeConfig.accent}
          aspectRatio="aspect-[16/10]"
        />

        {/* Floating tech tag & live url badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div
            className="px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider backdrop-blur-md"
            style={{
              backgroundColor: `${themeConfig.bgMain}CC`,
              borderColor: themeConfig.border,
              color: themeConfig.textPrimary,
            }}
          >
            {project.category}
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto px-3 py-1 rounded-full border text-[10px] font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md hover:scale-105 transition-all shadow-md"
              style={{
                backgroundColor: `${themeConfig.accent}EE`,
                borderColor: themeConfig.accent,
                color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
              }}
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Title & Arrow CTA */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-3xl transition-colors" style={{ color: themeConfig.textPrimary }}>
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-light" style={{ color: themeConfig.textSecondary }}>
              {project.tagline}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 group-hover:scale-110"
            style={{
              backgroundColor: themeConfig.bgSurface,
              borderColor: themeConfig.border,
              color: themeConfig.accent,
            }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Tag List */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono" style={{ borderColor: themeConfig.border }}>
          <div className="flex items-center gap-2" style={{ color: themeConfig.textMuted }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
            <span>Interactive Case Study</span>
          </div>
          <span className="font-medium transition-colors" style={{ color: themeConfig.accent }}>
            Explore Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

