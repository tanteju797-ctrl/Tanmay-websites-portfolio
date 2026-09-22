import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Sparkles,
  Layout,
  Code2,
  PlayCircle,
  Layers,
  RefreshCw,
  Gauge,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { SERVICES } from '../data/portfolioData';
import { Service } from '../types';
import MotionPerformanceDashboard from './MotionPerformanceDashboard';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);
  const [themeMode, setThemeMode] = useState<'all' | 'dark' | 'ivory'>('all');

  const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];

  const filteredServices = SERVICES.filter((s) => {
    if (themeMode === 'all') return true;
    return s.theme === themeMode;
  });

  return (
    <section
      id="services"
      className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#090A0C] border-t border-white/[0.05] overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#E8D5B5]/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#D4AF37]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
                Capabilities & Offerings
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F6F4EE] tracking-tight">
              Bespoke digital <br />
              <span className="italic text-[#E8D5B5]">capabilities.</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#12141A] border border-white/[0.08] backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => setThemeMode('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                themeMode === 'all'
                  ? 'bg-[#E8D5B5] text-[#090A0C] font-semibold'
                  : 'text-[#8E929E] hover:text-[#E8E6E1]'
              }`}
            >
              All (06)
            </button>
            <button
              onClick={() => setThemeMode('ivory')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                themeMode === 'ivory'
                  ? 'bg-[#F6F4EE] text-[#090A0C] font-semibold'
                  : 'text-[#8E929E] hover:text-[#E8E6E1]'
              }`}
            >
              Ivory Studio
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                themeMode === 'dark'
                  ? 'bg-[#1C2028] text-[#E8D5B5] border border-white/15'
                  : 'text-[#8E929E] hover:text-[#E8E6E1]'
              }`}
            >
              Obsidian Dark
            </button>
          </div>
        </div>

        {/* Main Interactive Layout: Split list + Dynamic Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Service Rows */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {filteredServices.map((service) => {
              const isSelected = service.id === activeServiceId;
              return (
                <div
                  key={service.id}
                  id={`service-row-${service.id}`}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onClick={() => {
                    setActiveServiceId(service.id);
                    onSelectService(service);
                  }}
                  data-cursor="pointer"
                  className={`group relative rounded-2xl p-6 transition-all duration-500 cursor-pointer border ${
                    isSelected
                      ? service.theme === 'ivory'
                        ? 'bg-[#F6F4EE] text-[#090A0C] border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                        : 'bg-[#141720] text-[#E8E6E1] border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                      : 'bg-[#0E1015]/80 text-[#8E929E] border-white/[0.05] hover:bg-[#13161D] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 sm:gap-7">
                      {/* Number */}
                      <span
                        className={`text-sm sm:text-base font-mono transition-transform duration-300 group-hover:translate-x-1 ${
                          isSelected
                            ? service.theme === 'ivory'
                              ? 'text-[#090A0C] font-bold'
                              : 'text-[#D4AF37] font-bold'
                            : 'text-[#616674]'
                        }`}
                      >
                        {service.number}
                      </span>

                      {/* Title */}
                      <h3
                        className={`font-serif text-xl sm:text-2xl md:text-3xl transition-colors ${
                          isSelected
                            ? service.theme === 'ivory'
                              ? 'text-[#090A0C]'
                              : 'text-[#F6F4EE]'
                            : 'text-[#C5C9D4] group-hover:text-[#E8E6E1]'
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    {/* Arrow Button */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? service.theme === 'ivory'
                            ? 'bg-[#090A0C] text-[#F6F4EE] rotate-45'
                            : 'bg-[#E8D5B5] text-[#090A0C] rotate-45'
                          : 'bg-[#181B22] text-[#8E929E] group-hover:bg-[#202530] group-hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Expanded detail when active */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-current/10">
                          <p
                            className={`text-xs sm:text-sm leading-relaxed ${
                              service.theme === 'ivory' ? 'text-[#3E424D]' : 'text-[#9FA3B2]'
                            }`}
                          >
                            {service.shortDesc}
                          </p>

                          {/* Deliverables pill tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
                                  service.theme === 'ivory'
                                    ? 'bg-[#090A0C]/10 text-[#090A0C]'
                                    : 'bg-white/10 text-[#E8D5B5]'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Abstract Service Visualizer (Inspired by Reference Images) */}
          <div className="lg:col-span-5 sticky top-28">
            <div
              className={`rounded-3xl p-7 sm:p-8 transition-all duration-700 relative overflow-hidden ${
                activeService.theme === 'ivory'
                  ? 'glass-panel-ivory text-[#090A0C]'
                  : 'glass-panel-dark text-[#E8E6E1]'
              }`}
            >
              {/* Header inside visual card */}
              <div className="flex items-center justify-between pb-4 border-b border-current/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-70">
                  OUR SERVICE • {activeService.number}
                </span>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {/* Title & Headline */}
              <div className="my-6">
                <h4 className="font-serif text-3xl sm:text-4xl leading-tight">
                  {activeService.title}
                </h4>
                <p className="text-xs sm:text-sm mt-3 leading-relaxed opacity-80">
                  {activeService.fullDesc}
                </p>
              </div>

              {/* Dynamic Interactive Visual Component depending on service type */}
              <div className="my-6 rounded-2xl p-5 bg-black/[0.04] dark:bg-white/[0.03] border border-current/10">
                <ServiceVisualizer type={activeService.visualType} theme={activeService.theme} />
              </div>

              {/* Deliverable Checkmarks */}
              <div className="space-y-2.5 pt-4 border-t border-current/10">
                <span className="text-[10px] font-mono uppercase tracking-widest block opacity-70 mb-3">
                  ● What's Included
                </span>
                {activeService.deliverables.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => onSelectService(activeService)}
                  className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                    activeService.theme === 'ivory'
                      ? 'bg-[#090A0C] text-[#F6F4EE] hover:bg-[#1F232B]'
                      : 'bg-gradient-to-r from-[#E8D5B5] to-[#D4AF37] text-[#090A0C] hover:opacity-95 shadow-lg'
                  }`}
                >
                  <span>Inquire About {activeService.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for dynamic interactive service visuals
function ServiceVisualizer({
  type,
  theme,
}: {
  type: Service['visualType'];
  theme: 'dark' | 'ivory';
}) {
  const isDark = theme === 'dark';

  switch (type) {
    case 'design':
      return (
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between text-xs font-mono opacity-80">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#D4AF37]" />
              <span>Canvas Architecture</span>
            </div>
            <span>Fluid Grid 12-Col</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className={`h-14 rounded-xl border flex items-center justify-center font-serif text-lg ${isDark ? 'bg-[#181C25] border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
              Aa
            </div>
            <div className={`h-14 rounded-xl border flex flex-col justify-center px-3 text-[10px] font-mono ${isDark ? 'bg-[#181C25] border-white/10 text-[#C5A880]' : 'bg-white border-black/10 text-[#9C7F58]'}`}>
              <span>4.5:1 Contrast</span>
              <span className="opacity-60">WCAG AA</span>
            </div>
            <div className={`h-14 rounded-xl border flex items-center justify-center ${isDark ? 'bg-[#181C25] border-white/10' : 'bg-white border-black/10'}`}>
              <div className="w-6 h-6 rounded-full border border-[#D4AF37] animate-pulse" />
            </div>
          </div>
        </div>
      );

    case 'development':
      return (
        <div className="flex flex-col gap-2 font-mono text-[11px] py-1">
          <div className="flex items-center justify-between text-xs opacity-70 mb-1">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Engineered in React & TypeScript</span>
            </div>
            <span className="text-[#D4AF37]">60 FPS</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[#E8E6E1]">
            <span className="text-[#C5A880]">const</span> studio = <span className="text-[#89D185]">&apos;tejas &amp; himself&apos;</span>;
            <br />
            <span className="text-[#6CB8F6]">await</span> render(&apos;60fps-masterpiece&apos;);
          </div>
        </div>
      );

    case 'motion':
      return (
        <MotionPerformanceDashboard theme={theme} />
      );

    case 'uiux':
      return (
        <div className="flex flex-col gap-2.5 py-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-80">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Design Tokens & Tokens</span>
            </div>
            <span>Figma Linked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 py-2 px-3 rounded-lg bg-black/10 dark:bg-white/10 text-center text-xs font-mono">
              Radius: 24px
            </div>
            <div className="flex-1 py-2 px-3 rounded-lg bg-black/10 dark:bg-white/10 text-center text-xs font-mono">
              Blur: 20px
            </div>
          </div>
        </div>
      );

    case 'redesign':
      return (
        <div className="flex flex-col gap-2.5 py-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-80">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>Before &amp; After Optimization</span>
            </div>
            <span className="text-[#D4AF37] font-bold">+280% Uplift</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-300">
              Legacy: 3.4s load
            </div>
            <div className="p-2.5 rounded-lg bg-green-950/20 border border-green-500/20 text-green-300 font-semibold">
              Modern: 0.3s load
            </div>
          </div>
        </div>
      );

    case 'seo':
      return (
        <div className="flex flex-col gap-2 py-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-80">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#D4AF37]" />
              <span>Lighthouse Core Vitals</span>
            </div>
            <span className="text-[#D4AF37] font-bold">100 / 100</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono text-center">
            <div className="p-2 rounded-lg bg-black/20 border border-current/10">Perf: 100</div>
            <div className="p-2 rounded-lg bg-black/20 border border-current/10">A11y: 100</div>
            <div className="p-2 rounded-lg bg-black/20 border border-current/10">SEO: 100</div>
            <div className="p-2 rounded-lg bg-black/20 border border-current/10">B.P.: 100</div>
          </div>
        </div>
      );
  }
}
