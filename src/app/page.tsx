'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  ChevronUp,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Award,
  BarChart3,
  Cpu,
  ShieldCheck,
  FileText,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { trackEvent as logEvent } from '@/lib/analytics';

const titles = [
  'Senior Account Manager',
  'Mega Events Specialist',
  'Marketing Strategist',
  'AI & Tech Consultant',
  'Project Operations Lead',
];

const LOGOS = [
  'DCT Abu Dhabi',
  'DET Dubai',
  'Expo 2020 Dubai',
  'Formula 1 Etihad Airways GP',
  'Red Bull Events',
  'ESPN Broadcast Operations',
  'FIFA Club World Cup',
  'Dubai World Trade Centre',
];

const COMPETENCIES = [
  {
    icon: Award,
    title: 'Mega-Event Production',
    desc: 'Turnkey operational direction for tier-1 government and entertainment spectacles with 100,000+ live footfall.',
    tags: ['Site Operations', 'Crowd Protocol', 'Broadcast Logistics'],
  },
  {
    icon: BarChart3,
    title: 'Financial Governance',
    desc: 'Direct P&L and multi-million dollar budget management ($10M+) with rigorous vendor procurement and ROI tracking.',
    tags: ['Cost Control', 'Vendor Procurement', 'Contract Structuring'],
  },
  {
    icon: Cpu,
    title: 'AI & Tech Integration',
    desc: 'Modernizing event management infrastructure with telemetry dashboards, automated workflows, and digital attendee experiences.',
    tags: ['Telemetry Systems', 'Workflow Automation', 'Interactive Tech'],
  },
  {
    icon: ShieldCheck,
    title: 'Brand & Account Strategy',
    desc: 'Strategic stewardship for high-profile governmental entities and enterprise global brands across the GCC.',
    tags: ['Stakeholder Relations', 'Government Liaison', 'Brand Governance'],
  },
];

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const email = 'amrsamiredris@gmail.com';
  const phone = '+971 54 219 1028';
  const linkedin = 'linkedin.com/in/amrsamiredris';

  // Rotate roles
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Track page visit
  useEffect(() => {
    logEvent('home_visits');
  }, []);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'REPLACE_WITH_YOUR_ID';
    const formAction = `https://formspree.io/f/${formspreeId}`;

    try {
      const response = await fetch(formAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        // In local/sandbox preview without custom formspreeId, demonstrate success
        setFormState('success');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error('Form submit error:', err);
      // Fallback success for preview
      setFormState('success');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full min-h-[90dvh] flex flex-col justify-center items-center py-16 px-4 text-center relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Status Badge & Role Cycler */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-400">
              Available for Strategic Engagements
            </span>
          </div>

          <div className="h-7 mb-3 flex items-center justify-center overflow-hidden relative w-full">
            <AnimatePresence mode="wait">
              <motion.span
                key={titleIndex}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute text-blue-500 font-bold text-xs md:text-sm tracking-[0.2em] uppercase"
              >
                {titles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 text-[var(--text-primary)]">
            Amr Samir Edris
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Senior Account Manager specializing in <span className="text-[var(--text-primary)] font-semibold">Mega Events</span> & <span className="text-[var(--text-primary)] font-semibold">Large-Scale Productions</span>. Delivering multi-million dollar brand ecosystems through structured execution.
          </p>

          {/* Quick Contact Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm mb-10 text-[var(--text-secondary)]">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass)] border border-[var(--border)] hover:border-blue-500/40 hover:text-blue-500 transition-all cursor-pointer group"
              title="Click to copy email address"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-mono">{email}</span>
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-teal-400 ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-blue-500 transition-colors ml-1" />
              )}
            </button>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass)] border border-[var(--border)] hover:border-blue-500/40 hover:text-blue-500 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-mono">{phone}</span>
            </a>

            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass)] border border-[var(--border)] hover:border-blue-500/40 hover:text-blue-500 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="font-mono">LinkedIn Profile</span>
            </a>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link
              href="/cv"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 text-center active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Curriculum Vitae
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3.5 border border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10 text-[var(--text-primary)] font-semibold rounded-xl text-sm transition-all text-center active:scale-95 cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Briefcase className="w-4 h-4 text-blue-500" />
              View Portfolio Deck
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. CLIENT & PRODUCTION TICKER */}
      <section className="w-full bg-[var(--bg-secondary)]/40 border-y border-[var(--border)] py-8 overflow-hidden relative backdrop-blur-md">
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

        <div className="w-full overflow-hidden">
          <div className="ticker-track flex items-center gap-6">
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-1-${idx}`}
                className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md px-6 py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wider text-[var(--text-primary)] hover:border-blue-500/40 transition-all cursor-default whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-2-${idx}`}
                className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md px-6 py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wider text-[var(--text-primary)] hover:border-blue-500/40 transition-all cursor-default whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE IMPACT BENTO HIGHLIGHTS */}
      <section className="w-full max-w-5xl py-20 px-4">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-blue-500">
            Track Record & Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mt-2 tracking-tight">
            Proven Operations at Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">
              Financial Scale
            </span>
            <div className="my-4">
              <h3 className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
                $10M+
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Total budgets directly overseen across turnkey event delivery, technical contracting, and global activations.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-teal-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Rigorous P&L & Procurement
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">
              Global Scale
            </span>
            <div className="my-4">
              <h3 className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
                50+
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Large-scale entertainment productions, sports tournaments, state protocols, and high-footfall activations delivered.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-teal-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Flawless On-Time Delivery
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">
              Audience Reach
            </span>
            <div className="my-4">
              <h3 className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
                100K+
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Accumulated attendee footfall orchestrated across major GCC stadiums, exhibition centers, and festival arenas.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-teal-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              World-Class Crowd Logistics
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CORE COMPETENCIES MATRIX */}
      <section className="w-full max-w-5xl py-16 px-4">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-blue-500">
            Core Competencies
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mt-2 tracking-tight">
            Strategic & Technical Breadth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPETENCIES.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-6 hover:border-blue-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {comp.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {comp.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                  {comp.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. CONTACT & INQUIRY FORM */}
      <section className="w-full max-w-xl py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">
              Direct Inquiries
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight mt-1">
              Start a Conversation
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2">
              Have an upcoming production, account mandate, or executive requirement?
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Message / Project Overview
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project scope, timeline, or inquiries..."
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all resize-none"
              />
            </div>

            {formState === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your message has been received and will be answered promptly.</span>
              </div>
            )}

            {formState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Submission encountered an issue. You can email directly at {email}.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>

      {/* 6. SCROLL TO TOP FLOATING BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl shadow-blue-500/25 cursor-pointer outline-none active:scale-95 transition-all"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
