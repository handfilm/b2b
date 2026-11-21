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
  Package,
} from 'lucide-react';
import { WingId, buildWhatsAppUrl } from '../config/wings';

interface FloatingRightDockProps {
  onOpenInquiries: () => void;
  onOpenAiAssistant: () => void;
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  inquiryCount?: number;
  activeWing?: WingId | null;
  theme?: 'dark' | 'light';
}

export const FloatingRightDock: React.FC<FloatingRightDockProps> = ({
  onOpenInquiries,
  onOpenAiAssistant,
  onOpenRfq,
  onOpenShippingCalc,
  inquiryCount = 64,
  activeWing = null,
  theme = 'dark',
}) => {
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDark = theme === 'dark';
  const effectiveWing: WingId = activeWing || 'rmg';
  const whatsAppQuoteHref = buildWhatsAppUrl({ wing: effectiveWing, intent: 'quote' });
  const whatsAppSwatchHref = buildWhatsAppUrl({ wing: activeWing || 'swatch', intent: 'swatch' });

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
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="pointer-events-auto flex items-center space-x-1.5 py-2 px-2.5 rounded-l-xl bg-[#E50914] hover:bg-[#ff1a26] text-white shadow-xl shadow-[#E50914]/25 -mr-3 transition-all cursor-pointer group border-y border-l border-white/15"
            title="Expand Quick Sourcing Dock"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black uppercase tracking-wider font-mono pr-1">
              {isBn ? 'কুইক ডক' : 'Quick Dock'}
            </span>
          </button>
        ) : (
          <div
            className={`pointer-events-auto rounded-2xl shadow-2xl p-1.5 flex flex-col items-center space-y-1.5 backdrop-blur-xl border transition-all ${
              isDark
                ? 'bg-[#14161A]/95 border-white/12 text-white shadow-black/80'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-400/25'
            }`}
          >
            {/* Header: Collapse Toggle */}
            <div className="w-full flex items-center justify-between px-1 py-0.5 border-b border-inherit">
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                {isBn ? 'ডক' : 'DESK'}
              </span>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark
                    ? 'hover:bg-white/10 text-zinc-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
                title="Collapse dock to right edge"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. Direct Wing-Attributed WhatsApp Quote */}
            <a
              href={whatsAppQuoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#E50914] hover:bg-[#ff1a26] text-white flex flex-col items-center justify-center shadow-md shadow-[#E50914]/30 hover:scale-105 transition-all cursor-pointer group"
              title={`Direct WhatsApp Quote (${effectiveWing.toUpperCase()} Wing)`}
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">Quote</span>
            </a>

            {/* 2. Book DHL Swatch Kit (3-4d Worldwide) */}
            <a
              href={whatsAppSwatchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#C9A24B]/15 hover:bg-[#C9A24B]/25 border border-[#C9A24B]/40 text-[#E2C275] flex flex-col items-center justify-center transition-all cursor-pointer group"
              title="Book DHL Express Swatch Kit (3–4 days worldwide)"
            >
              <Package className="w-4 h-4 text-[#E2C275]" />
              <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">Swatch</span>
            </a>

            {/* 3. Inquiries / Messages */}
            <button
              type="button"
              onClick={onOpenInquiries}
              className={`relative w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Inquiries & RFQ Messages"
            >
              <FileText className="w-4 h-4 group-hover:text-[#E50914] transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'ইনবক্স' : 'Inbox'}</span>
              <span className="absolute -top-1 -right-1 bg-[#E50914] text-white font-bold text-[9px] px-1 py-0.2 rounded-full min-w-4 text-center shadow-xs">
                {toDigits(inquiryCount)}
              </span>
            </button>

            {/* 4. RFQ Quick Post */}
            <button
              type="button"
              onClick={onOpenRfq}
              className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Post Commercial RFQ"
            >
              <Sparkles className="w-4 h-4 group-hover:text-[#E2C275] transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'আরএফকিউ' : 'RFQ'}</span>
            </button>

            {/* 5. Freight & Escrow */}
            <button
              type="button"
              onClick={onOpenShippingCalc}
              className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Chattogram Port Freight & Escrow Terms"
            >
              <Ship className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
              <span className="text-[8.5px] font-bold mt-0.5 leading-none">{isBn ? 'জাহাজ' : 'Ship'}</span>
            </button>

            {/* 6. Sourcing Assistant */}
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className={`w-11 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer border-t border-white/10 pt-1 ${
                isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="RAWx Sourcing Assistant"
            >
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider">RAWx</span>
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
                ? 'bg-[#14161A]/95 hover:bg-white/10 text-white border-white/15'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </aside>

      {/* Mobile Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`lg:hidden fixed right-4 bottom-20 z-40 w-9 h-9 rounded-full border shadow-xl flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? 'bg-[#14161A]/95 text-white border-white/20'
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
