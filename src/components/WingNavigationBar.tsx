import React from 'react';
import { MessageCircle, Package } from 'lucide-react';
import { B2B_WINGS, WingId, buildWhatsAppUrl } from '../config/wings';

interface WingNavigationBarProps {
  activeWing: WingId | null;
  currentPath: string;
  onNavigate: (path: string) => void;
  theme?: 'dark' | 'light';
}

export const WingNavigationBar: React.FC<WingNavigationBarProps> = ({
  activeWing,
  currentPath,
  onNavigate,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const isOverview = !activeWing && !currentPath.startsWith('/catalog') && !currentPath.startsWith('/buyer') && !currentPath.startsWith('/seller');
  const swatchWaUrl = buildWhatsAppUrl({
    wing: activeWing || 'swatch',
    intent: 'swatch',
  });

  return (
    <nav
      aria-label="Unified B2B Manufacturing Wings"
      className={`w-full border-b transition-colors ${
        isDark
          ? 'bg-[#0A0B0D] border-white/10 text-zinc-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 flex items-center justify-between gap-4">
        {/* Instant-Switching Wing Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] ${
              isOverview
                ? 'bg-[#E50914] text-white shadow-sm'
                : isDark
                ? 'bg-[#14161A] text-zinc-300 hover:text-white border border-white/10 hover:border-white/25'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            All Wings
          </button>

          {B2B_WINGS.map((wing) => {
            const isActive = activeWing === wing.id;
            const isGoldAccent = wing.accentTone === 'gold';

            return (
              <button
                key={wing.id}
                type="button"
                onClick={() => onNavigate(wing.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] ${
                  isActive
                    ? isGoldAccent
                      ? 'bg-[#C9A24B] text-[#0A0B0D] font-bold shadow-sm'
                      : 'bg-[#E50914] text-white font-bold shadow-sm'
                    : isDark
                    ? 'bg-[#14161A] text-zinc-300 hover:text-white border border-white/10 hover:border-[#C9A24B]/50'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{wing.navLabel}</span>
                <span
                  className={`font-mono text-[10px] hidden sm:inline ${
                    isActive
                      ? isGoldAccent
                        ? 'text-[#0A0B0D]/80'
                        : 'text-white/85'
                      : isDark
                      ? 'text-zinc-500'
                      : 'text-slate-400'
                  }`}
                >
                  {wing.path}
                </span>
              </button>
            );
          })}
        </div>

        {/* High-Intent Swatch Kit Direct WhatsApp CTA */}
        <a
          href={swatchWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 min-h-[38px] px-4 py-1.5 rounded-lg border border-[#C9A24B]/50 bg-[#14161A] hover:bg-[#1C1F26] text-[#E2C275] hover:text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
          title="Book 3–4 Day DHL Express Swatch Kit via WhatsApp"
        >
          <Package className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span>Book Swatch Kit (3–4d DHL)</span>
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
        </a>
      </div>
    </nav>
  );
};
