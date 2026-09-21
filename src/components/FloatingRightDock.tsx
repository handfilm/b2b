import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import {
  MessageCircle,
  Sparkles,
  ArrowUp,
  FileText,
  Ship,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface FloatingRightDockProps {
  onOpenInquiries: () => void;
  onOpenAiAssistant: () => void;
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  inquiryCount?: number;
  theme?: 'dark' | 'light';
}

export const FloatingRightDock: React.FC<FloatingRightDockProps> = ({
  onOpenInquiries,
  onOpenAiAssistant,
  onOpenRfq,
  onOpenShippingCalc,
  inquiryCount = 64,
  theme = 'dark',
}) => {
  const { t, toDigits, lang } = useI18n();
  const isBn = lang === 'BN';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Floating Right Dock (Hidden on mobile to keep vertical mode clean) */}
      <aside
        id="floating-right-dock"
        aria-label="Quick Access Dock"
        className="hidden lg:flex fixed right-3 bottom-8 z-40 flex-col items-end space-y-2 pointer-events-none"
      >
        {isCollapsed ? (
          /* Minimized State: Sleek Edge Tab that doesn't block content */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="pointer-events-auto flex items-center space-x-1.5 py-2 px-2.5 rounded-l-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] text-white shadow-xl shadow-[#e11d48]/25 hover:shadow-[#e11d48]/40 -mr-3 transition-all cursor-pointer group border-y border-l border-white/20"
            title="Expand Quick Sourcing Dock"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider font-mono pr-1">
              {isBn ? 'কুইক ডক' : 'Quick Dock'}
            </span>
            {inquiryCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            )}
          </button>
        ) : (
          /* Expanded Dock: Highly Crafted Glassmorphism Container with Collapse Button */
          <div
            className={`pointer-events-auto rounded-2xl shadow-2xl p-1.5 flex flex-col items-center space-y-1.5 backdrop-blur-xl border transition-all ${
              isDark
                ? 'bg-[#10141e]/95 border-white/15 text-white shadow-black/80'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-400/25'
            }`}
          >
            {/* Header: Collapse Toggle */}
            <div className="w-full flex items-center justify-between px-1 py-0.5 border-b border-inherit">
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {isBn ? 'ডক' : 'Dock'}
              </span>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark
                    ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
                title="Collapse dock to right edge"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. Messages / Inquiries Icon with Badge */}
            <button
              type="button"
              onClick={onOpenInquiries}
              className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Inquiries & RFQ Messages"
            >
              <MessageCircle className="w-4.5 h-4.5 group-hover:text-[#e11d48] transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'চ্যাট' : 'Chat'}</span>
              <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white font-bold text-[9px] px-1 py-0.2 rounded-full min-w-4 text-center shadow-xs">
                {toDigits(inquiryCount)}
              </span>
            </button>

            {/* 2. AI Agent / Sourcing Agent */}
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white flex flex-col items-center justify-center shadow-md shadow-[#e11d48]/25 hover:scale-105 transition-all cursor-pointer group"
              title="RAWx Sourcing AI Agent (Instant specs & quotes)"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">{isBn ? 'এআই' : 'Agent'}</span>
            </button>

            {/* 3. RFQ Quick Post */}
            <button
              type="button"
              onClick={onOpenRfq}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Post Commercial RFQ for 5,000+ Mills"
            >
              <FileText className="w-4.5 h-4.5 group-hover:text-[#10b981] transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'আরএফকিউ' : 'RFQ'}</span>
            </button>

            {/* 4. Shipping Calculator / Trade Assurance */}
            <button
              type="button"
              onClick={onOpenShippingCalc}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Chattogram Port Freight & Escrow Terms"
            >
              <Ship className="w-4.5 h-4.5 group-hover:text-[#10b981] transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'জাহাজ' : 'Ship'}</span>
            </button>
          </div>
        )}

        {/* Desktop Scroll to Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className={`pointer-events-auto w-9 h-9 rounded-full border shadow-lg flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-[#141414]/90 hover:bg-white/10 text-white border-white/15'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </aside>

      {/* Mobile Scroll to Top Button (Positioned safely above bottom dock) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`lg:hidden fixed right-4 bottom-20 z-40 w-9 h-9 rounded-full border shadow-xl flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? 'bg-[#10141e]/90 text-white border-white/20'
              : 'bg-white text-slate-800 border-slate-200 shadow-slate-400/30'
          }`}
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
};
