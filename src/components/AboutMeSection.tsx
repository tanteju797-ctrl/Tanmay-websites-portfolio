import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, Code, Film, Compass } from 'lucide-react';
import { SKILL_NODES } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { SkillNode } from '../types';

export default function AboutMeSection() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(SKILL_NODES[0]);
  const { themeConfig } = useTheme();

  return (
    <section
      id="about-me"
      className="relative py-28 sm:py-36 px-6 sm:px-8 border-t overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: 'transparent',
        borderColor: themeConfig.border,
        color: themeConfig.textPrimary,
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.accent }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px]" style={{ backgroundColor: themeConfig.accent }} />
          <span className="text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: themeConfig.accent }}>
            The Creator
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Creator Bio & Ethos */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight" style={{ color: themeConfig.textPrimary }}>
              Behind the <br />
              <span className="italic" style={{ color: themeConfig.secondaryAccent }}>screen.</span>
            </h2>

            <p className="mt-6 text-xl font-serif italic" style={{ color: themeConfig.textPrimary }}>
              “I am an AI website developer — building intelligent, bespoke websites and dynamic digital experiences.”
            </p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed font-light" style={{ color: themeConfig.textSecondary }}>
              Operating at the intersection of AI-assisted engineering, modern web technologies, and refined UI/UX design. I partner with founders, creators, and ambitious businesses to develop high-performance digital flagships that convert and inspire.
            </p>

            {/* Creator Values Checklist */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                }}
              >
                <Film className="w-5 h-5 mb-2" style={{ color: themeConfig.accent }} />
                <span className="text-xs font-semibold block" style={{ color: themeConfig.textPrimary }}>AI-Driven Velocity</span>
                <span className="text-[11px] mt-0.5 block" style={{ color: themeConfig.textMuted }}>Rapid, intelligent iteration</span>
              </div>
              <div
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                }}
              >
                <Code className="w-5 h-5 mb-2" style={{ color: themeConfig.accent }} />
                <span className="text-xs font-semibold block" style={{ color: themeConfig.textPrimary }}>Zero Generic Fluff</span>
                <span className="text-[11px] mt-0.5 block" style={{ color: themeConfig.textMuted }}>Handcrafted codebases</span>
              </div>
            </div>

            {/* Micro Terminal Quote */}
            <div
              className="mt-8 p-4 rounded-2xl border flex items-center gap-3 w-full"
              style={{
                backgroundColor: themeConfig.bgSurface,
                borderColor: themeConfig.border,
              }}
            >
              <Terminal className="w-4 h-4 shrink-0" style={{ color: themeConfig.accent }} />
              <span className="text-xs font-mono" style={{ color: themeConfig.textSecondary }}>
                AI Website Developer crafting tailored web solutions with intent.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Visual Skill Constellation Network */}
          <div className="lg:col-span-6">
            <div
              className="rounded-3xl p-6 sm:p-8 border backdrop-blur-xl shadow-2xl relative"
              style={{
                backgroundColor: `${themeConfig.bgCard}F2`,
                borderColor: themeConfig.border,
              }}
            >
              {/* Header inside constellation */}
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: themeConfig.border }}>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4" style={{ color: themeConfig.accent }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: themeConfig.textPrimary }}>
                    Interactive Skill Constellation
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold" style={{ color: themeConfig.accent }}>
                  CLICK NODE TO INSPECT
                </span>
              </div>

              {/* Interactive Node Graph Area */}
              <div
                className="relative my-6 h-[280px] sm:h-[320px] rounded-2xl border overflow-hidden flex items-center justify-center"
                style={{
                  backgroundColor: themeConfig.bgMain,
                  borderColor: themeConfig.border,
                }}
              >
                {/* Connecting SVG lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {SKILL_NODES.map((node) =>
                    node.related.map((relId) => {
                      const relNode = SKILL_NODES.find((n) => n.id === relId);
                      if (!relNode) return null;
                      const isConnected = selectedSkill.id === node.id || selectedSkill.id === relId;
                      return (
                        <line
                          key={`${node.id}-${relId}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${relNode.x}%`}
                          y2={`${relNode.y}%`}
                          stroke={isConnected ? themeConfig.accent : '#2A2E3B'}
                          strokeWidth={isConnected ? '1.5' : '1'}
                          strokeDasharray={isConnected ? 'none' : '4 4'}
                          className="transition-all duration-500"
                        />
                      );
                    })
                  )}
                </svg>

                {/* Floating Interactive Skill Nodes */}
                {SKILL_NODES.map((node) => {
                  const isSelected = selectedSkill.id === node.id;
                  return (
                    <motion.button
                      key={node.id}
                      onClick={() => setSelectedSkill(node)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: isSelected ? themeConfig.accent : themeConfig.bgSurface,
                        color: isSelected ? (themeConfig.isLight ? '#FFFFFF' : '#090A0C') : themeConfig.textSecondary,
                        borderColor: isSelected ? themeConfig.accent : themeConfig.border,
                      }}
                      className="group z-10 px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 border transition-all duration-300 shadow-md"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: isSelected ? (themeConfig.isLight ? '#FFFFFF' : '#090A0C') : themeConfig.accent,
                        }}
                      />
                      <span className={isSelected ? 'font-bold' : ''}>{node.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Active Skill Inspector Card */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: themeConfig.textPrimary }}>
                      {selectedSkill.name}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold"
                      style={{
                        backgroundColor: `${themeConfig.accent}22`,
                        color: themeConfig.accent,
                      }}
                    >
                      {selectedSkill.level}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: themeConfig.textMuted }}>
                    Domain: {selectedSkill.category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-light" style={{ color: themeConfig.textSecondary }}>
                  {selectedSkill.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

