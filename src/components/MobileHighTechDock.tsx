import React, { useRef, useEffect } from 'react';
import {
  Layers,
  Building2,
  Users,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useNexosSync } from '../context/NexosSyncContext';

interface MobileHighTechDockProps {
  activeView: 'products' | 'suppliers' | 'customers' | 'insights';
  onViewChange: (view: 'products' | 'suppliers' | 'customers' | 'insights') => void;
  onOpenAiAssistant?: () => void;
  onOpenRfq?: () => void;
  onOpenPipeline?: () => void;
  theme?: 'dark' | 'light';
  onHeightChange?: (height: number) => void;
}

export const MobileHighTechDock: React.FC<MobileHighTechDockProps> = ({
  activeView,
  onViewChange,
  onOpenAiAssistant,
  onOpenRfq,
  onOpenPipeline,
  theme = 'dark',
  onHeightChange,
}) => {
  const isDark = theme === 'dark';
  const { metrics, syncStatus } = useNexosSync();
  const navRef = useRef<HTMLElement>(null);

  // Dynamically measure dock height on mount, resize, and DOM updates
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const measureHeight = () => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0) {
          // Set CSS custom property for global stylesheets / layout containers
          document.documentElement.style.setProperty('--mobile-dock-height', `${Math.round(rect.height)}px`);
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

  return (
    <nav
      ref={navRef}
      id="mobile-high-tech-dock"
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden px-3 pb-3 pt-1 pointer-events-none"
    >
      <div
        className={`pointer-events-auto max-w-md mx-auto rounded-2xl border shadow-2xl backdrop-blur-xl px-2 py-1.5 flex items-center justify-around transition-all ${
          isDark
            ? 'bg-[#0b0e14]/90 border-white/15 text-white shadow-black/90'
            : 'bg-white/90 border-slate-200 text-slate-900 shadow-slate-400/30'
        }`}
      >
        {/* 1. Products Catalog */}
        <button
          type="button"
          onClick={() => onViewChange('products')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'products'
              ? 'text-[#e11d48] font-bold bg-[#e11d48]/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </button>

        {/* 2. Verified Mills (3,105+) */}
        <button
          type="button"
          onClick={() => onViewChange('suppliers')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
            activeView === 'suppliers'
              ? 'text-[#10b981] font-bold bg-[#10b981]/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">3,105 Mills</span>
          <span className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#10b981]" />
        </button>

        {/* 3. Central AI Assistant Orb (Center Action) */}
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="relative -top-2 flex flex-col items-center justify-center cursor-pointer group"
          title="Open RAWx AI Trade Assistant"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#ff1e42] p-0.5 shadow-lg shadow-[#e11d48]/40 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0b0e14] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#ff1e42] animate-pulse" />
            </div>
          </div>
          <span className="text-[9.5px] font-black text-[#ff1e42] mt-0.5 uppercase tracking-wider">
            RAWx AI
          </span>
        </button>

        {/* 4. Buyers Network (15,420+) */}
        <button
          type="button"
          onClick={() => onViewChange('customers')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === 'customers'
              ? 'text-blue-400 font-bold bg-blue-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">15k Buyers</span>
        </button>

        {/* 5. NexOS Live Sync Bus Inspector */}
        <button
          type="button"
          onClick={onOpenPipeline}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative text-slate-400 hover:text-[#ff1e42]"
          title="NexOS Live Sync Pipeline"
        >
          <Cpu className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[10px] tracking-tight text-amber-400 font-medium">Sync Bus</span>
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
        </button>
      </div>
    </nav>
  );
};
