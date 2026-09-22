import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Monitor,
  ShoppingBag,
  User,
  Rocket,
  Sliders,
  Clock,
  Headphones,
  Mail,
  Phone,
  Lock,
  Award,
  ArrowRight,
  ArrowUpRight,
  Download,
  FileDown,
  Calendar,
  Loader2,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveBookingToSupabase, SUPABASE_PROJECT_ID, BookingResult } from '../lib/supabase';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function ProjectModal({
  isOpen,
  onClose,
  initialService = '',
}: ProjectModalProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Advanced Website');
  const [selectedBudget, setSelectedBudget] = useState<string>('₹25K – ₹50K');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Morning (10:00 AM – 1:00 PM)');
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    if (initialService) {
      setSelectedType(initialService);
    }
  }, [initialService]);

  const projectTypes = [
    { id: 'Basic Website', label: 'Basic Website', icon: Monitor },
    { id: 'Advanced Website', label: 'Advanced Website', icon: Monitor },
    { id: 'E-commerce Store', label: 'E-commerce Store', icon: ShoppingBag },
    { id: 'Portfolio Website', label: 'Portfolio Website', icon: User },
    { id: 'Landing Page', label: 'Landing Page', icon: Rocket },
    { id: 'Custom Project', label: 'Custom Project', icon: Sliders },
  ];

  const budgetOptions = [
    '₹2K – ₹4K',
    '₹4K – ₹10K',
    '₹10K – ₹25K',
    '₹25K – ₹50K',
  ];

  const timeSlots = [
    'Morning (10:00 AM – 1:00 PM)',
    'Afternoon (2:00 PM – 5:00 PM)',
    'Evening (6:00 PM – 9:00 PM)',
    'Flexible / As per availability',
  ];

  const handleBudgetSelect = (b: string) => {
    setSelectedBudget(b);
    if (b === '₹2K – ₹4K') {
      setSelectedType('Basic Website');
    }
  };

  const handleDownloadRequest = () => {
    const briefContent = `=====================================================
TEJAS DESIGN & DIGITAL STUDIO — WEBSITE REQUEST BRIEF
=====================================================
Generated On: ${new Date().toLocaleString()}
Studio Contact: tanteju797@gmail.com | +91 8284024020
Supabase Project: ${SUPABASE_PROJECT_ID}

1. CLIENT CONTACT
-----------------------------------------------------
Name:  ${name.trim() || 'Client (Pending input)'}
Email: ${email.trim() || 'Pending input'}
Phone: ${phone.trim() || 'Not specified'}

2. PROJECT & APPOINTMENT SPECIFICATIONS
-----------------------------------------------------
Project Type:     ${selectedType}
Budget Bracket:   ${selectedBudget}
Preferred Date:   ${preferredDate || 'Earliest available'}
Preferred Time:   ${preferredTime}
Target Timeline:  2-4 Weeks
Assurance:        100% Confidential & On-Time Delivery

3. PROJECT DESCRIPTION & REQUIREMENTS
-----------------------------------------------------
${message.trim() || 'Custom website design, high performance, and interactive digital experience.'}
=====================================================`;

    const blob = new Blob([briefContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Website-Appointment-${(name || 'Brief').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    try {
      const result = await saveBookingToSupabase({
        name,
        email,
        phone,
        project_type: selectedType,
        budget: selectedBudget,
        message,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        timeline: '2-4 Weeks',
        status: 'new',
        source: 'website_project_modal',
      });

      setSubmissionResult(result);
      setIsSubmitted(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#E8D5B5', '#10B981', '#F6F4EE', '#252932', '#C5A880'],
      });
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="project-inquiry-modal"
        className="fixed inset-0 z-50 overflow-y-auto bg-[#07080A]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[#0B0D12] border border-white/[0.12] rounded-[28px] sm:rounded-[36px] shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.08] bg-[#0E1017]/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E8D5B5] font-semibold">
                Book Appointment & Start Project
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#151821] hover:bg-[#202533] border border-white/10 text-[#E8E6E1] transition-all hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-10">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-3">
                  <Check className="w-3.5 h-3.5" />
                  <span>Appointment Confirmed & Synced</span>
                </div>
                <h4 className="font-serif text-3xl sm:text-4xl text-white mb-3">Appointment Details Received</h4>
                <p className="text-sm text-[#9CA0B0] max-w-lg mb-8 leading-relaxed font-light">
                  Thank you, <span className="text-white font-medium">{name}</span>. Your website appointment and project brief have been securely registered. We&apos;ll be in touch shortly.
                </p>

                <div className="p-5 rounded-2xl bg-[#12151E] border border-white/10 mb-8 max-w-lg w-full text-left font-mono text-xs space-y-2.5">
                  <div className="flex justify-between"><span className="text-[#8E929E]">Discipline:</span><span className="text-white font-semibold">{selectedType}</span></div>
                  <div className="flex justify-between"><span className="text-[#8E929E]">Budget:</span><span className="text-white font-semibold">{selectedBudget}</span></div>
                  <div className="flex justify-between"><span className="text-[#8E929E]">Preferred Slot:</span><span className="text-[#E8D5B5] font-semibold">{preferredDate || 'Earliest'} ({preferredTime.split('(')[0].trim()})</span></div>
                  <div className="flex justify-between"><span className="text-[#8E929E]">Client Contact:</span><span className="text-white font-semibold">{email}</span></div>
                  {phone && <div className="flex justify-between"><span className="text-[#8E929E]">Phone:</span><span className="text-white font-semibold">{phone}</span></div>}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleDownloadRequest}
                    className="px-6 py-3 rounded-full bg-[#151822] border border-[#D4AF37]/40 text-[#E8D5B5] font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 hover:border-[#D4AF37] transition-all flex items-center gap-2"
                  >
                    {downloaded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Downloaded Successfully</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#D4AF37]" />
                        <span>Download Appointment Brief</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 rounded-full bg-[#E8D5B5] text-[#090A0C] font-semibold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
                  >
                    Return to Portfolio
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Header Hero Banner */}
                <div className="relative rounded-3xl p-8 sm:p-12 border border-white/[0.08] bg-[#0E1118] overflow-hidden">
                  <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#D4AF37]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
                    <div className="max-w-xl">
                      <span className="text-[11px] font-mono uppercase tracking-[0.3em] font-semibold text-[#D4AF37] block mb-3">
                        LET&apos;S BUILD TOGETHER
                      </span>
                      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F6F4EE] tracking-tight leading-[1.08]">
                        Book an appointment <br />
                        <span className="italic text-[#E8D5B5]">& start your project</span>
                      </h2>
                      <p className="text-sm sm:text-base text-[#9CA0B0] mt-4 leading-relaxed font-light max-w-xl">
                        Fill in your project specifications and schedule a consultation. We&apos;ll review your requirements and respond within 24 hours.
                      </p>
                    </div>

                    {/* Download Website Request Button with Icon */}
                    <div className="shrink-0 flex items-center">
                      <button
                        type="button"
                        id="download-website-request-btn"
                        onClick={handleDownloadRequest}
                        title="Download a copy of your website request specification brief (.txt)"
                        className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-mono transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-[0.97] ${
                          downloaded
                            ? 'bg-[#162719] border-emerald-500/60 text-emerald-300'
                            : 'bg-[#151822]/90 border-[#D4AF37]/30 text-[#E8D5B5] hover:bg-[#1C212E] hover:border-[#D4AF37]'
                        }`}
                      >
                        {downloaded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold">Request Downloaded!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-[#D4AF37] group-hover:translate-y-0.5 transition-transform" />
                            <span>Download Brief</span>
                            <FileDown className="w-3.5 h-3.5 text-[#8E929E] opacity-70" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Trust Highlights */}
                  <div className="relative z-10 flex flex-wrap items-center gap-6 sm:gap-8 mt-6 pt-6 border-t border-white/[0.08] text-xs font-mono text-[#B0B4C3]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>Fast Response (&lt; 24h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span>Custom Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      <span>100% Confidential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Guaranteed Delivery</span>
                    </div>
                  </div>
                </div>

                {/* 2. Stepper Progress Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-white/[0.08]">
                  {[
                    { num: '01', title: 'Your Details', active: true },
                    { num: '02', title: 'Project Info', active: true },
                    { num: '03', title: 'Budget & Features', active: true },
                    { num: '04', title: 'Schedule & Submit', active: true },
                  ].map((step, idx) => (
                    <div key={step.num} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-sm font-bold text-[#D4AF37]">
                          {step.num}
                        </span>
                        <div className={`h-[2px] flex-1 rounded-full ${idx <= 2 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                      </div>
                      <span className="text-[11px] font-mono text-[#8E929E]">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 3. Main 2-Column Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column (8 cols): Form */}
                  <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10">
                    {/* Step 01: Tell us about yourself */}
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-2xl font-bold text-[#E8D5B5]">01</span>
                        <div>
                          <h3 className="font-serif text-2xl text-[#F6F4EE]">Tell us about yourself</h3>
                          <p className="text-xs text-[#8E929E] font-light mt-0.5">Let&apos;s start with your contact information.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="text-xs font-mono text-[#C5A880] block mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[#12151E] border border-white/10 text-sm text-[#F6F4EE] placeholder:text-[#525766] focus:outline-none focus:border-[#D4AF37] transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-[#C5A880] block mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-[#12151E] border border-white/10 text-sm text-[#F6F4EE] placeholder:text-[#525766] focus:outline-none focus:border-[#D4AF37] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-[#8E929E] block mb-2">
                          Phone Number (Optional / WhatsApp)
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 8284024020"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#12151E] border border-white/10 text-sm text-[#F6F4EE] placeholder:text-[#525766] focus:outline-none focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                    </div>

                    {/* Step 02: Your Project */}
                    <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-2xl font-bold text-[#E8D5B5]">02</span>
                        <div>
                          <h3 className="font-serif text-2xl text-[#F6F4EE]">Your Project</h3>
                          <p className="text-xs text-[#8E929E] font-light mt-0.5">What type of solution do you need?</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        {projectTypes.map((item) => {
                          const IconComponent = item.icon;
                          const isSelected = selectedType === item.id;
                          return (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => setSelectedType(item.id)}
                              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all duration-300 ${
                                isSelected
                                  ? 'bg-[#151924] border-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]'
                                  : 'bg-[#12151E] border-white/10 text-[#8E929E] hover:text-white hover:border-white/20'
                              }`}
                            >
                              <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#D4AF37]' : 'text-[#8E929E]'}`} />
                              <span className="text-xs font-mono font-medium">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 03: Your Budget */}
                    <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-2xl font-bold text-[#E8D5B5]">03</span>
                        <div>
                          <h3 className="font-serif text-2xl text-[#F6F4EE]">Estimated Budget</h3>
                          <p className="text-xs text-[#8E929E] font-light mt-0.5">
                            Select an approximate budget bracket for your project.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {budgetOptions.map((b) => {
                          const isSelected = selectedBudget === b;
                          return (
                            <button
                              type="button"
                              key={b}
                              onClick={() => handleBudgetSelect(b)}
                              className={`px-5 py-3 rounded-full border text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-[#E8D5B5] text-[#090A0C] font-bold border-white shadow-md scale-[1.03]'
                                  : 'bg-[#12151E] border-white/10 text-[#A6ABB8] hover:text-white hover:border-white/20'
                              }`}
                            >
                              <span>{b}</span>
                              {b === '₹4K – ₹10K' && isSelected && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#090A0C] text-[#E8D5B5] font-sans font-normal">
                                  → Basic Website
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 04: Appointment Schedule & Description */}
                    <div className="space-y-6 pt-6 border-t border-white/[0.08]">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-2xl font-bold text-[#E8D5B5]">04</span>
                        <div>
                          <h3 className="font-serif text-2xl text-[#F6F4EE]">Appointment & Requirements</h3>
                          <p className="text-xs text-[#8E929E] font-light mt-0.5">Choose your preferred consultation time and brief description.</p>
                        </div>
                      </div>

                      {/* Appointment Date & Time Slots */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#0E1118] border border-white/[0.08]">
                        <div>
                          <label className="text-xs font-mono text-[#C5A880] flex items-center gap-1.5 mb-2">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Preferred Date (Optional)</span>
                          </label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 text-sm text-[#F6F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-[#C5A880] flex items-center gap-1.5 mb-2">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Preferred Time Slot</span>
                          </label>
                          <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 text-sm text-[#F6F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot} className="bg-[#0E1118] text-white">
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="relative pt-1">
                        <label className="text-xs font-mono text-[#8E929E] block mb-2">
                          Project Brief & Description
                        </label>
                        <textarea
                          rows={4}
                          maxLength={500}
                          placeholder="Tell us about your project goals, preferred design style, key pages..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#12151E] border border-white/10 text-sm text-[#F6F4EE] placeholder:text-[#525766] focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                        />
                        <span className="absolute bottom-3 right-4 text-[10px] font-mono text-[#6A6E7D]">
                          {message.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E8D5B5] to-[#D4AF37] text-[#090A0C] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#090A0C]" />
                            <span>Booking Session...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm & Book Appointment</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Right Column (4 cols): Why Work With Us & Support */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Why Work With Us Card */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-[#0E1118] border border-white/[0.08]">
                      <h4 className="font-serif text-xl text-[#F6F4EE] mb-5">Why Work With Us?</h4>
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Modern & Clean Design',
                            desc: 'We build websites that look great and perform even better.',
                            icon: Award,
                          },
                          {
                            title: 'Fully Responsive',
                            desc: 'Your website will work perfectly on all devices.',
                            icon: Monitor,
                          },
                          {
                            title: 'On-Time Delivery',
                            desc: 'We respect your time and commitments.',
                            icon: Clock,
                          },
                          {
                            title: 'Ongoing Support',
                            desc: "We're here even after the launch.",
                            icon: Headphones,
                          },
                        ].map((feat) => {
                          const FeatIcon = feat.icon;
                          return (
                            <div key={feat.title} className="flex items-start gap-3.5">
                              <div className="p-2 rounded-xl bg-[#141721] border border-white/10 text-[#D4AF37] shrink-0 mt-0.5">
                                <FeatIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-semibold text-white">{feat.title}</h5>
                                <p className="text-[11px] text-[#8E929E] mt-0.5 leading-relaxed font-light">{feat.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Need Help Card */}
                    <div className="p-6 rounded-3xl bg-[#0E1118] border border-white/[0.08]">
                      <h4 className="font-serif text-lg text-white mb-1">Need Help?</h4>
                      <p className="text-xs text-[#8E929E] mb-4 font-light leading-relaxed">
                        Have questions or need a custom solution? Feel free to reach out directly.
                      </p>

                      <div className="space-y-2.5 text-xs font-mono text-[#A6ABB8]">
                        <a
                          href="mailto:tanteju797@gmail.com"
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141721] border border-white/10 hover:border-[#D4AF37]/50 hover:text-white transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>tanteju797@gmail.com</span>
                        </a>
                        <a
                          href="tel:+918284024020"
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141721] border border-white/10 hover:border-[#D4AF37]/50 hover:text-white transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>+91 8284024020</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
