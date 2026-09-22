import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Copy, Check, Mail, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  onOpenProjectModal: () => void;
}

export default function ContactSection({ onOpenProjectModal }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'tejasXextreme@gamil.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { name: 'X / Twitter', url: 'https://twitter.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'ReadCV', url: 'https://read.cv' },
    { name: 'Dribbble', url: 'https://dribbble.com' },
  ];

  return (
    <section
      id="contact"
      className="relative py-32 sm:py-44 px-6 sm:px-8 bg-transparent border-t border-white/[0.06] overflow-hidden"
    >
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/[0.03] rounded-full blur-[220px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#13161D] border border-white/[0.08] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
            Start a Collaboration
          </span>
        </motion.div>

        {/* Huge Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] text-[#F6F4EE] tracking-tight"
        >
          Have an idea? <br />
          <span className="italic text-[#E8D5B5]">Let&apos;s make it real.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl text-[#A6ABB8] font-light max-w-xl mx-auto leading-relaxed"
        >
          Currently accepting selected client commissions for website design, full-stack development, and bespoke motion experiences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Main Inquiry Trigger */}
          <button
            id="contact-primary-cta"
            data-cursor="build"
            onClick={onOpenProjectModal}
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-[#E8D5B5] via-[#DFD3BE] to-[#D4AF37] text-[#090A0C] font-semibold text-xs sm:text-sm tracking-widest uppercase shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>Start a Project</span>
            <div className="w-6 h-6 rounded-full bg-[#090A0C] text-[#E8D5B5] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Copy Email Button */}
          <button
            onClick={copyEmail}
            className="w-full sm:w-auto px-7 py-5 rounded-full bg-[#141720] hover:bg-[#1C202B] text-[#E8E6E1] border border-white/10 text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2.5"
          >
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <span>{emailAddress}</span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400 ml-1" />
            ) : (
              <Copy className="w-4 h-4 text-[#8E929E] ml-1" />
            )}
          </button>
        </motion.div>

        {/* Social Links List */}
        <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-wrap justify-center gap-6 sm:gap-10">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono tracking-widest uppercase text-[#8E929E] hover:text-[#E8D5B5] transition-colors flex items-center gap-1.5"
            >
              <span>{social.name}</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
