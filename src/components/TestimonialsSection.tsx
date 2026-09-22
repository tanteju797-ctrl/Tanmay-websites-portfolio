import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Building,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  state: string;
  avatar: string;
  quote: string;
  rating: number;
  metric: string;
  metricDesc: string;
  category: 'Fintech & SaaS' | 'D2C & Luxury' | '3D & Creative' | 'Enterprise';
  region: 'Bengaluru & South' | 'Mumbai & West' | 'Delhi NCR & North';
  verifiedTag: string;
  projectBudgetTier: string;
}

const INDIAN_TESTIMONIALS: Testimonial[] = [
  {
    id: 'ind-1',
    name: 'Aarav Singhania',
    role: 'Founder',
    company: 'Veloce Studio',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote:
      'Bhai Tanmay ne landing page ekdum solid banaya! Design super clean hai aur phone pe fast load hoti hai. Queries double ho gayi pehle hafte me.',
    rating: 4.9,
    metric: '2x Inquiries',
    metricDesc: 'Organic website leads',
    category: 'Fintech & SaaS',
    region: 'Bengaluru & South',
    verifiedTag: 'Startup Founder',
    projectBudgetTier: '₹20K – ₹35K',
  },
  {
    id: 'ind-2',
    name: 'Priyanka Sengupta',
    role: 'Brand Owner',
    company: 'Aura Skin India',
    city: 'Mumbai',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    quote:
      'Super responsive and delivered on time. Website looks very clean and premium. Jo changes bole the sab acche se incorporate kiye.',
    rating: 4.8,
    metric: 'Fast Loading',
    metricDesc: 'Smooth mobile experience',
    category: 'D2C & Luxury',
    region: 'Mumbai & West',
    verifiedTag: 'D2C Founder',
    projectBudgetTier: '₹25K – ₹45K',
  },
  {
    id: 'ind-3',
    name: 'Devansh Kulkarni',
    role: 'Co-Founder',
    company: 'Kala Media Labs',
    city: 'Pune',
    state: 'Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote:
      'Animations ka kaam genuinely mast tha. First call me hi vibe samajh li aur 4 din ke andar prototype ready kar diya.',
    rating: 4.9,
    metric: '4-Day Delivery',
    metricDesc: 'Zero delays in handoff',
    category: '3D & Creative',
    region: 'Mumbai & West',
    verifiedTag: 'Agency Partner',
    projectBudgetTier: '₹15K – ₹30K',
  },
  {
    id: 'ind-4',
    name: 'Rohan Mehra',
    role: 'Tech Lead',
    company: 'Zenith Labs',
    city: 'Gurugram',
    state: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    quote:
      'Clean code, clear communication, and very genuine pricing. Har milestone pe proper updates mile. Will definitely work again.',
    rating: 4.7,
    metric: '100% On-Time',
    metricDesc: 'Clean frontend codebase',
    category: 'Enterprise',
    region: 'Delhi NCR & North',
    verifiedTag: 'Product Lead',
    projectBudgetTier: '₹20K – ₹40K',
  },
  {
    id: 'ind-5',
    name: 'Ananya Nambiar',
    role: 'Creative Director',
    company: 'Nivara Studio',
    city: 'Hyderabad',
    state: 'Telangana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    quote:
      'Website aesthetic is top notch! Clients love the look and feel. Tanmay is easy to work with and always gives good design suggestions.',
    rating: 4.8,
    metric: 'High Conversion',
    metricDesc: 'Better client feedback',
    category: 'D2C & Luxury',
    region: 'Bengaluru & South',
    verifiedTag: 'Studio Lead',
    projectBudgetTier: '₹15K – ₹25K',
  },
  {
    id: 'ind-6',
    name: 'Vikramaditya Bose',
    role: 'Partner',
    company: 'Indus Ventures',
    city: 'Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    quote:
      'Great work ethics and very patient with revisions. Modern and minimal portfolio ready ho gaya bilkul hassle-free.',
    rating: 4.6,
    metric: 'Zero Hassle',
    metricDesc: 'Smooth revision cycles',
    category: 'Enterprise',
    region: 'Bengaluru & South',
    verifiedTag: 'Verified Client',
    projectBudgetTier: '₹25K – ₹48K',
  },
];

interface TestimonialsSectionProps {
  onOpenProjectModal: (service?: string) => void;
}

export default function TestimonialsSection({ onOpenProjectModal }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { themeConfig } = useTheme();
  const { playClick } = useSound();

  const testimonialsList = INDIAN_TESTIMONIALS;
  const activeTestimonial = testimonialsList[activeIndex % testimonialsList.length] || INDIAN_TESTIMONIALS[0];

  useEffect(() => {
    if (!isAutoPlay || testimonialsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsList.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonialsList.length]);

  const handleNext = () => {
    playClick();
    setIsAutoPlay(false);
    setActiveIndex((prev) => (prev + 1) % testimonialsList.length);
  };

  const handlePrev = () => {
    playClick();
    setIsAutoPlay(false);
    setActiveIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const handleSelectTestimonial = (idx: number) => {
    playClick('chime');
    setIsAutoPlay(false);
    setActiveIndex(idx);
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden border-t"
      style={{
        backgroundColor: 'transparent',
        borderColor: `${themeConfig.border}50`,
      }}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Ambient Indian Innovation Hub Glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.accent }}
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ backgroundColor: themeConfig.secondaryAccent }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Badge & Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 shadow-sm"
              style={{
                backgroundColor: themeConfig.bgSurface,
                borderColor: `${themeConfig.accent}40`,
              }}
            >
              <span className="flex h-2 w-2 relative">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: themeConfig.accent }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: themeConfig.accent }}
                />
              </span>
              <span
                className="text-[11px] font-mono uppercase tracking-[0.25em] font-semibold"
                style={{ color: themeConfig.accent }}
              >
                Verified Indian Founder Endorsements
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              Empowering India’s next-gen <br />
              <span className="italic" style={{ color: themeConfig.secondaryAccent }}>
                founders, studios & leaders.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#9CA0B0] mt-4 max-w-2xl font-light leading-relaxed">
              From high-growth startups in Bengaluru and Mumbai to modern brands in Delhi NCR and Hyderabad — crafting digital flagships that inspire confidence and drive verifiable revenue.
            </p>
          </div>

          {/* Action CTAs and Navigation Controls */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="testimonial-prev-arrow"
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="p-3 rounded-full border transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                  color: themeConfig.textPrimary,
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                id="testimonial-next-arrow"
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="p-3 rounded-full border transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: themeConfig.border,
                  color: themeConfig.textPrimary,
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              id="testimonial-start-project-btn"
              onClick={() => onOpenProjectModal()}
              className="px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 shadow-[0_8px_30px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 transition-all"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                color: themeConfig.isLight ? '#FFFFFF' : '#090A0C',
              }}
            >
              <span>Start Your Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Split: Spotlight Card (Left 8 cols) + Client Stack (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Active Featured Testimonial Card */}
          <div className="lg:col-span-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full relative rounded-3xl p-8 sm:p-12 border overflow-hidden flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                style={{
                  backgroundColor: themeConfig.bgSurface,
                  borderColor: `${themeConfig.accent}55`,
                }}
              >
                {/* Background Watermark */}
                <Quote
                  className="absolute -bottom-10 -right-10 w-56 h-56 pointer-events-none opacity-[0.03]"
                  style={{ color: themeConfig.accent }}
                />

                <div>
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    {/* Stars + Rating score */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const isFull = activeTestimonial.rating >= starIndex;
                          const isPartial = !isFull && activeTestimonial.rating >= starIndex - 0.5;
                          return (
                            <motion.div
                              key={starIndex}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: (starIndex - 1) * 0.05 }}
                            >
                              <Star
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  isFull
                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                    : isPartial
                                    ? 'fill-[#D4AF37]/60 text-[#D4AF37]'
                                    : 'fill-transparent text-[#D4AF37]/40'
                                }`}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        {activeTestimonial.rating.toFixed(1)} / 5.0
                      </span>
                    </div>

                    {/* Metric Highlight Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: `${themeConfig.accent}18`,
                        borderColor: `${themeConfig.accent}45`,
                        color: themeConfig.accent,
                      }}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{activeTestimonial.metric}</span>
                    </div>
                  </div>

                  {/* Quote Content */}
                  <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#F6F4EE] leading-relaxed font-normal mb-8 italic">
                    &ldquo;{activeTestimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info + Location + Trust Tags */}
                <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl p-0.5 border shrink-0 overflow-hidden shadow-lg"
                      style={{ borderColor: themeConfig.accent }}
                    >
                      <img
                        src={activeTestimonial.avatar}
                        alt={activeTestimonial.name}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                        <span>{activeTestimonial.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </h4>
                      <p className="text-xs text-[#8E929E] font-mono">
                        {activeTestimonial.role} • <span className="text-white font-semibold">{activeTestimonial.company}</span>
                      </p>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#A6ABB8] mt-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>{activeTestimonial.city}, {activeTestimonial.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#12151E] border border-white/10 text-[#C5C8D4] flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{activeTestimonial.verifiedTag}</span>
                    </span>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#12151E] border border-white/10 text-[#C5A880]">
                      Tier: {activeTestimonial.projectBudgetTier}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive Indian Client Selector Stack */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E929E] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Featured Clients ({testimonialsList.length})</span>
              </span>
              <span className="text-[11px] font-mono text-[#D4AF37]">
                {activeIndex + 1} / {testimonialsList.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {testimonialsList.map((t, idx) => {
                const isSelected = activeTestimonial.id === t.id;
                return (
                  <motion.button
                    type="button"
                    key={t.id}
                    onClick={() => handleSelectTestimonial(idx)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'shadow-xl ring-1'
                        : 'hover:border-white/20 opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${themeConfig.accent}18` : themeConfig.bgSurface,
                      borderColor: isSelected ? themeConfig.accent : themeConfig.border,
                      ringColor: isSelected ? themeConfig.accent : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border"
                        style={{ borderColor: isSelected ? themeConfig.accent : 'transparent' }}
                      >
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-[#D0D4E0]'}`}>
                          {t.name}
                        </h5>
                        <p className="text-[11px] text-[#8E929E] font-mono truncate">
                          {t.company} • <span className="text-[#A6ABB8]">{t.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-mono block font-bold" style={{ color: themeConfig.accent }}>
                        ★ {t.rating.toFixed(1)}
                      </span>
                      <span className="text-[9px] font-mono text-[#7A7E8C]">
                        {t.category}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
