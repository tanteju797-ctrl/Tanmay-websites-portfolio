import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { PROCESS_STEPS } from '../data/portfolioData';

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative py-28 sm:py-36 px-6 sm:px-8 bg-transparent border-t border-white/[0.05] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#D4AF37]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
                Methodology & Workflow
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F6F4EE] tracking-tight">
              From raw concept <br />
              <span className="italic text-[#E8D5B5]">to digital masterpiece.</span>
            </h2>
          </div>
          <p className="text-sm text-[#8E929E] max-w-sm font-light leading-relaxed">
            A disciplined 5-stage creative process engineered to eliminate friction, maintain momentum, and ensure extraordinary visual quality.
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent z-0" />

          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="relative z-10 flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-[#10131A]/90 border border-white/[0.07] hover:border-[#D4AF37]/40 backdrop-blur-xl group transition-all duration-500 hover:-translate-y-1.5"
            >
              <div>
                {/* Step Number Circle */}
                <div className="w-12 h-12 rounded-full bg-[#181C25] border border-white/15 flex items-center justify-center font-mono text-sm font-bold text-[#E8D5B5] group-hover:bg-[#E8D5B5] group-hover:text-[#090A0C] group-hover:border-transparent transition-all duration-300 shadow-md mb-6">
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-2xl text-[#F6F4EE] mb-2 group-hover:text-[#E8D5B5] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-[#C5A880] mb-4">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[#8E929E] leading-relaxed font-light mb-6">
                  {step.details}
                </p>
              </div>

              {/* Focus Points list */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#6B707E] block mb-2">
                  Key Milestones
                </span>
                {step.focusPoints.map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-[11px] text-[#A6ABB8]">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Guarantee Note */}
        <div className="mt-16 p-6 rounded-2xl bg-[#12151D]/60 border border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E929E]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Weekly interactive video walkthroughs & asynchronous staging links included.</span>
          </div>
          <span className="text-[#E8E6E1]">Pacing: Typically 2 to 4 Weeks</span>
        </div>
      </div>
    </section>
  );
}
