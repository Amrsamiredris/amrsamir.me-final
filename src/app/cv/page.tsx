'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Loader2, AlertCircle, FileText } from 'lucide-react';
import { usePageTimer } from '@/hooks/usePageTimer';
import { trackEvent as logEvent } from '@/lib/analytics';
import { motion } from 'framer-motion';

export default function CVPage() {
  // Activate page duration telemetry
  usePageTimer('cv');

  const [iframeError, setIframeError] = useState(false);
  const [checking, setChecking] = useState(true);
  const cvUrl = process.env.NEXT_PUBLIC_CV_URL || '/cv.pdf';

  useEffect(() => {
    logEvent('cv_views');

    async function checkPdfExists() {
      try {
        if (!cvUrl.startsWith('http')) {
          const res = await fetch(cvUrl, { method: 'HEAD' });
          if (!res.ok) {
            setIframeError(true);
          }
        }
      } catch (err) {
        console.error('Error checking CV document path:', err);
        setIframeError(true);
      } finally {
        setChecking(false);
      }
    }

    checkPdfExists();
  }, [cvUrl]);

  const handleDownloadClick = () => {
    logEvent('cv_downloads');
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Navigation and Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Curriculum Vitae
          </h1>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1">
            Executive credentials, mega-event production history, and operational leadership overview.
          </p>
        </div>

        {/* Action Download button */}
        <a
          href={cvUrl}
          download="Amr_Samir_Edris_CV.pdf"
          onClick={handleDownloadClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download CV PDF
        </a>
      </div>

      {/* Main Document Viewer Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 min-h-[550px] w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/20 overflow-hidden relative shadow-2xl flex flex-col"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {checking ? (
          <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs text-[var(--text-secondary)] font-medium">Resolving document assets...</p>
            </div>
          </div>
        ) : iframeError ? (
          <div className="flex-1 flex items-center justify-center text-center p-8 bg-[var(--bg-secondary)]/25 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4 max-w-sm">
              <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-[var(--text-primary)] font-bold text-base">Inline Preview Unavailable</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Direct browser PDF preview is not supported on this device. You can download the complete document directly below.
              </p>
              <a
                href={cvUrl}
                download="Amr_Samir_Edris_CV.pdf"
                onClick={handleDownloadClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                <Download className="w-4 h-4" />
                Download CV Directly
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={`${cvUrl}#toolbar=0`}
            className="w-full h-full border-none rounded-2xl flex-1 bg-[var(--bg-primary)]"
            title="Amr Samir Edris CV"
          />
        )}
      </motion.div>
    </div>
  );
}
