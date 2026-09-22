import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import profilePhoto from '../assets/images/regenerated_image_1788078673298.png';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-28 sm:py-36 px-6 sm:px-8 bg-transparent border-t border-white/[0.05] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1F2533]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Pre-title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
            Philosophy & Vision
          </span>
        </div>

        {/* Large Editorial Headline & Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-[#F6F4EE] tracking-tight"
            >
              “I am an AI website developer. <br />
              <span className="italic text-[#E8D5B5]">Building next-generation digital flagships.”</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-xl sm:text-2xl text-[#A6ABB8] font-light leading-relaxed max-w-2xl"
            >
              I leverage modern AI-accelerated workflows, full-stack technologies, and refined motion systems to build bespoke websites that elevate brands and deliver measurable results.
            </motion.p>
          </div>

          {/* Right side floating studio & creator card */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#12151C]/90 border border-white/[0.08] backdrop-blur-xl relative max-w-sm w-full shadow-2xl"
            >
              {/* Creator Photo + Status Row */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.08]">
                <div className="relative group flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_4px_20px_rgba(212,175,55,0.15)] bg-[#181C24]">
                    <img
                      src={profilePhoto}
                      alt="Tanmay - AI Website Developer"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#12151C] flex items-center justify-center border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">AI DEVELOPER</span>
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <h4 className="font-serif text-lg text-[#F6F4EE] leading-tight">Tanmay</h4>
                  <p className="text-[11px] text-[#8E929E] mt-0.5 font-mono">AI Website Developer</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#D4AF37]">STUDIO MANIFESTO</span>
              </div>
              <p className="text-xs text-[#8E929E] leading-relaxed font-sans">
                Harnessing modern AI-assisted engineering and artisanal design to ship lightning-fast, custom websites with pristine quality and zero fluff.
              </p>
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#6C717E] uppercase">
                <span>EST. 2025</span>
                <span>OPEN TO WORK</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

