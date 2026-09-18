import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Sparkles,
  ArrowUp,
  FileText,
  Ship,
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick Access Dock"
      className="fixed right-3 bottom-8 z-40 flex flex-col items-center space-y-2"
    >
      <div
        className={`rounded-2xl shadow-2xl p-1.5 flex flex-col items-center space-y-1.5 backdrop-blur-md border ${
          isDark
            ? 'bg-[#141414]/90 border-white/10 text-white'
            : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        {/* 1. Messages / Inquiries Icon with Badge */}
        <button
          onClick={onOpenInquiries}
          className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
            isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Inquiries & RFQ Messages"
        >
          <MessageCircle className="w-5 h-5 group-hover:text-[#e11d48]" />
          <span className="text-[9px] font-bold mt-0.5 leading-none">Chat</span>
          <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white font-bold text-[9px] px-1 py-0.2 rounded-full min-w-4 text-center shadow-xs">
            {inquiryCount}
          </span>
        </button>

        {/* 2. AI Agent / Sourcing Agent */}
        <button
          onClick={onOpenAiAssistant}
          className="w-10 h-10 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white flex flex-col items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer group"
          title="AI Agent / Sourcing AI (Instant specs & quotes)"
        >
          <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="text-[8.5px] font-black uppercase tracking-tighter mt-0.5">Agent</span>
        </button>

        {/* 3. RFQ Quick Post */}
        <button
          onClick={onOpenRfq}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
            isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Post a Commercial RFQ"
        >
          <FileText className="w-4 h-4 group-hover:text-[#10b981]" />
          <span className="text-[9px] font-bold mt-0.5 leading-none">RFQ</span>
        </button>

        {/* 4. Shipping Calculator / Trade Assurance */}
        <button
          onClick={onOpenShippingCalc}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
            isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Chattogram Port Freight & Bank L/C Assurance"
        >
          <Ship className="w-4 h-4 group-hover:text-[#10b981]" />
          <span className="text-[9px] font-bold mt-0.5 leading-none">Ship</span>
        </button>
      </div>

      {/* 5. Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`w-10 h-10 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer animate-in fade-in ${
            isDark
              ? 'bg-[#141414] hover:bg-white/10 text-white border-white/10'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
};
