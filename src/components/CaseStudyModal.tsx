import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, CheckCircle2, Layers, Cpu, Sparkles, MonitorPlay, ExternalLink, Globe } from 'lucide-react';
import LoopingVideoShowcase from './LoopingVideoShowcase';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../types';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact: (projectTitle?: string) => void;
}

export default function CaseStudyModal({
  project,
  onClose,
  onOpenContact,
}: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'prototype' | 'specs'>('overview');
  const { themeConfig } = useTheme();

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        id="case-study-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        <motion.div
          id="case-study-modal-container"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl border rounded-[30px] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          style={{
            backgroundColor: themeConfig.bgCard,
            borderColor: themeConfig.border,
            color: themeConfig.textPrimary,
          }}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between p-6 sm:p-8 border-b backdrop-blur-md sticky top-0 z-20"
            style={{
              backgroundColor: `${themeConfig.bgSurface}F2`,
              borderColor: themeConfig.border,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: themeConfig.textMuted }}>
                  {project.type} • {project.year}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl" style={{ color: themeConfig.textPrimary }}>
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Navigation Tabs inside modal */}
            <div
              className="hidden sm:flex items-center gap-1.5 p-1 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: themeConfig.bgMain,
                borderColor: themeConfig.border,
              }}
            >
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeTab === 'overview'
                    ? 'font-bold shadow-md'
                    : 'hover:text-white'
                }`}
                style={
                  activeTab === 'overview'
                    ? {
                        backgroundColor: themeConfig.accent,
                        color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                      }
                    : {
                        color: themeConfig.textSecondary,
                      }
                }
              >
                Case Study
              </button>
              <button
                onClick={() => setActiveTab('prototype')}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeTab === 'prototype'
                    ? 'font-bold shadow-md'
                    : 'hover:text-white'
                }`}
                style={
                  activeTab === 'prototype'
                    ? {
                        backgroundColor: themeConfig.accent,
                        color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                      }
                    : {
                        color: themeConfig.textSecondary,
                      }
                }
              >
                Live Cinema
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeTab === 'specs'
                    ? 'font-bold shadow-md'
                    : 'hover:text-white'
                }`}
                style={
                  activeTab === 'specs'
                    ? {
                        backgroundColor: themeConfig.accent,
                        color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                      }
                    : {
                        color: themeConfig.textSecondary,
                      }
                }
              >
                Architecture
              </button>
            </div>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="case-study-live-site-btn"
                  className="px-4 py-2 rounded-full font-mono text-xs font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: themeConfig.accent,
                    color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                  }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                id="close-case-study-modal"
                onClick={onClose}
                className="p-2.5 rounded-full border transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                  color: themeConfig.textPrimary,
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-10">
            {activeTab === 'overview' && (
              <>
                {/* Hero Showcase Real-time Video Loop */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: themeConfig.border }}>
                  <LoopingVideoShowcase
                    type={project.videoType || 'generic'}
                    videoUrl={project.videoUrl}
                    badge={project.videoBadge || '60 FPS MASTER'}
                    accentColor={themeConfig.accent}
                    aspectRatio="aspect-[21/9] sm:aspect-[2.2/1]"
                  />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none z-10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] block mb-1 font-bold" style={{ color: themeConfig.accent }}>
                        {project.category}
                      </span>
                      <h4 className="font-serif text-3xl sm:text-4xl text-white">
                        {project.title}
                      </h4>
                    </div>
                    <div
                      className="px-4 py-1.5 rounded-full border text-xs font-mono backdrop-blur-md"
                      style={{
                        backgroundColor: `${themeConfig.bgMain}EE`,
                        borderColor: themeConfig.border,
                        color: themeConfig.accent,
                      }}
                    >
                      Role: {project.role}
                    </div>
                  </div>
                </div>

                {/* Problem vs Solution Editorial Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div
                    className="p-7 rounded-2xl border"
                    style={{
                      backgroundColor: themeConfig.bgSurface,
                      borderColor: themeConfig.border,
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest block mb-2 font-bold" style={{ color: themeConfig.accent }}>
                      01 / The Challenge
                    </span>
                    <h5 className="font-serif text-2xl mb-3" style={{ color: themeConfig.textPrimary }}>
                      Design Complexity
                    </h5>
                    <p className="text-sm leading-relaxed font-light" style={{ color: themeConfig.textSecondary }}>
                      {project.challenge}
                    </p>
                  </div>

                  <div
                    className="p-7 rounded-2xl border"
                    style={{
                      backgroundColor: themeConfig.bgSurface,
                      borderColor: themeConfig.border,
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest block mb-2 font-bold" style={{ color: themeConfig.accent }}>
                      02 / The Solution
                    </span>
                    <h5 className="font-serif text-2xl mb-3" style={{ color: themeConfig.textPrimary }}>
                      Precision Execution
                    </h5>
                    <p className="text-sm leading-relaxed font-light" style={{ color: themeConfig.textSecondary }}>
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Color Palette & Materiality */}
                <div
                  className="p-7 rounded-2xl border"
                  style={{
                    backgroundColor: themeConfig.bgSurface,
                    borderColor: themeConfig.border,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: themeConfig.accent }}>
                      Color Palette & Materiality
                    </span>
                    <span className="text-xs font-mono" style={{ color: themeConfig.textMuted }}>5 Color Harmony</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {project.palette.map((color) => (
                      <div key={color} className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-full h-12 rounded-xl border border-white/20 shadow-inner"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono uppercase" style={{ color: themeConfig.textMuted }}>
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables & Tech Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest block mb-4 font-bold" style={{ color: themeConfig.accent }}>
                      ● Deliverables
                    </span>
                    <div className="space-y-2.5">
                      {project.deliverables.map((deliv) => (
                        <div key={deliv} className="flex items-center gap-2.5 text-sm" style={{ color: themeConfig.textPrimary }}>
                          <CheckCircle2 className="w-4 h-4" style={{ color: themeConfig.accent }} />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest block mb-4 font-bold" style={{ color: themeConfig.accent }}>
                      ● Technologies Used
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3.5 py-1.5 rounded-full border text-xs font-mono"
                          style={{
                            backgroundColor: themeConfig.bgCard,
                            borderColor: themeConfig.border,
                            color: themeConfig.accent,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'prototype' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: themeConfig.bgSurface, borderColor: themeConfig.border }}>
                  <LoopingVideoShowcase
                    type={project.videoType || 'generic'}
                    videoUrl={project.videoUrl}
                    badge="60 FPS FULL RUNTIME SIMULATION"
                    accentColor={themeConfig.accent}
                    aspectRatio="aspect-[16/9]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.metrics?.map((m) => (
                    <div
                      key={m.label}
                      className="p-6 rounded-2xl border text-center"
                      style={{
                        backgroundColor: themeConfig.bgSurface,
                        borderColor: themeConfig.border,
                      }}
                    >
                      <span className="font-serif text-4xl block mb-1 font-semibold" style={{ color: themeConfig.accent }}>
                        {m.value}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: themeConfig.textMuted }}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="p-6 rounded-2xl border flex items-center gap-4"
                  style={{
                    backgroundColor: themeConfig.bgSurface,
                    borderColor: themeConfig.border,
                  }}
                >
                  <Cpu className="w-8 h-8 shrink-0" style={{ color: themeConfig.accent }} />
                  <div>
                    <h5 className="text-sm font-semibold" style={{ color: themeConfig.textPrimary }}>Production Engine</h5>
                    <p className="text-xs mt-1" style={{ color: themeConfig.textSecondary }}>
                      Engineered for zero-layout-shift and sub-second cold starts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer CTA */}
          <div
            className="p-6 sm:p-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: `${themeConfig.bgSurface}F2`,
              borderColor: themeConfig.border,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: themeConfig.textMuted }}>
              <Layers className="w-4 h-4" style={{ color: themeConfig.accent }} />
              <span>Have a similar project requirement?</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border shadow-lg hover:scale-105 transition-all"
                  style={{
                    backgroundColor: themeConfig.bgMain,
                    borderColor: themeConfig.accent,
                    color: themeConfig.accent,
                  }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenContact(project.title);
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                  color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discuss Similar Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

