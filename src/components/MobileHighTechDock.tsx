import React, { useRef, useEffect } from 'react';
import {
  Shirt,
  Shield,
  Wrench,
  MessageCircle,
  Package,
} from 'lucide-react';
import { WingId, buildWhatsAppUrl } from '../config/wings';

interface MobileHighTechDockProps {
  activeView: 'products' | 'suppliers' | 'customers' | 'insights';
  onViewChange: (view: 'products' | 'suppliers' | 'customers' | 'insights') => void;
  onOpenAiAssistant?: () => void;
  onOpenRfq?: () => void;
  onOpenPipeline?: () => void;
  activeWing?: WingId | null;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
  onHeightChange?: (height: number) => void;
}

export const MobileHighTechDock: React.FC<MobileHighTechDockProps> = ({
  activeView,
  onViewChange,
  activeWing = null,
  onNavigate,
  theme = 'dark',
  onHeightChange,
}) => {
  const isDark = theme === 'dark';
  const navRef = useRef<HTMLElement>(null);

  const effectiveWing: WingId = activeWing || 'rmg';
  const whatsAppQuoteHref = buildWhatsAppUrl({ wing: effectiveWing, intent: 'quote' });
  const whatsAppSwatchHref = buildWhatsAppUrl({ wing: activeWing || 'swatch', intent: 'swatch' });

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const measureHeight = () => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0) {
          document.documentElement.style.setProperty(
            '--mobile-dock-height',
            `${Math.round(rect.height)}px`
          );
          onHeightChange?.(rect.height);
        }
      }
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(() => {
      measureHeight();
    });
    resizeObserver.observe(el);
    window.addEventListener('resize', measureHeight);
    window.addEventListener('orientationchange', measureHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureHeight);
      window.removeEventListener('orientationchange', measureHeight);
    };
  }, [onHeightChange]);

  const goWing = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      onViewChange('products');
    }
  };

  return (
    <nav
      ref={navRef}
      id="mobile-high-tech-dock"
      aria-label="Mobile B2B Wing & WhatsApp Dock"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden px-2.5 pb-2.5 pt-1 pointer-events-none"
    >
      <div
        className={`pointer-events-auto max-w-md mx-auto rounded-2xl border shadow-2xl backdrop-blur-xl px-1.5 py-1.5 flex items-center justify-around transition-all ${
          isDark
            ? 'bg-[#0A0B0D]/95 border-white/15 text-white shadow-black/90'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-400/30'
        }`}
      >
        {/* 1. RMG Wing */}
        <button
          type="button"
          onClick={() => goWing('/rmg')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeWing === 'rmg' || (!activeWing && activeView === 'products')
              ? 'text-[#E50914] font-black bg-[#E50914]/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Shirt className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">RMG</span>
        </button>

        {/* 2. Leather & Jacket Wing */}
        <button
          type="button"
          onClick={() => goWing('/leather')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeWing === 'leather'
              ? 'text-[#E2C275] font-black bg-[#C9A24B]/15'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Leather</span>
        </button>

        {/* 3. Primary Center CTA: Wing-Attributed WhatsApp Quote */}
        <a
          href={whatsAppQuoteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative -top-1.5 flex flex-col items-center justify-center group"
          title={`WhatsApp Instant Quote (${effectiveWing.toUpperCase()} Wing)`}
        >
          <div className="w-11 h-11 rounded-full bg-[#E50914] hover:bg-[#ff1a26] shadow-lg shadow-[#E50914]/40 flex items-center justify-center transition-transform group-active:scale-95 border border-white/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9.5px] font-black text-white mt-0.5 uppercase tracking-wider">
            Quote
          </span>
        </a>

        {/* 4. Hardware Wing */}
        <button
          type="button"
          onClick={() => goWing('/hardware')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeWing === 'hardware'
              ? 'text-[#E2C275] font-black bg-[#C9A24B]/15'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">316L</span>
        </button>

        {/* 5. Swatch Kit (3-4d DHL Express) */}
        <a
          href={whatsAppSwatchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all text-[#E2C275] hover:bg-[#C9A24B]/10"
          title="Book Swatch Kit (3–4d DHL Worldwide)"
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight font-bold">Swatches</span>
        </a>
      </div>
    </nav>
  );
};
