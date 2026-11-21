import React from 'react';
import { ArrowRight, MessageCircle, Package, ShieldCheck, Globe2 } from 'lucide-react';
import {
  B2B_WINGS,
  GLOBAL_TRUST_GUARANTEES,
  buildWhatsAppUrl,
} from '../config/wings';

interface UnifiedWingsOverviewStripProps {
  onNavigate: (path: string) => void;
  onOpenRfq: () => void;
  theme?: 'dark' | 'light';
}

export const UnifiedWingsOverviewStrip: React.FC<UnifiedWingsOverviewStripProps> = ({
  onNavigate,
  onOpenRfq,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const commercialWings = B2B_WINGS.filter((w) => w.id !== 'admin');
  const swatchWaUrl = buildWhatsAppUrl({ wing: 'swatch', intent: 'swatch' });

  return (
    <section
      id="unified-b2b-wings-hub"
      aria-labelledby="b2b-portal-h1"
      className={`border-b transition-colors ${
        isDark
          ? 'bg-[#0A0B0D] border-white/10 text-white'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        {/* Top Industrial Positioning Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#C9A24B]">
              <span>HANDS &amp; HEAD × RAWx</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>b2b.handsandhead.com</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>
                Dhaka Direct Factory Gateway
              </span>
            </div>

            <h1
              id="b2b-portal-h1"
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.15] ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Custom Leather Jacket &amp; Heavyweight Streetwear Manufacturer in Bangladesh
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              One unified commercial portal for international buyers in the USA, Saudi Arabia, Bahrain, and the EU. Select a specialized manufacturing wing below or message our Dhaka export desk directly on WhatsApp.
            </p>
          </div>

          {/* Primary High-Intent CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={swatchWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson min-h-[44px] px-5 py-2.5 rounded-lg text-xs sm:text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book Swatch Kit (3–4d DHL)</span>
            </a>

            <button
              type="button"
              onClick={onOpenRfq}
              className={`min-h-[44px] px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors whitespace-nowrap cursor-pointer ${
                isDark
                  ? 'bg-[#14161A] border-[#C9A24B]/45 text-[#E2C275] hover:border-[#C9A24B] hover:text-white'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              Submit Formal TechPack RFQ
            </button>
          </div>
        </div>

        {/* 4-Column Manufacturing Trust & Specs Guarantee Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {GLOBAL_TRUST_GUARANTEES.map((spec) => (
            <div
              key={spec.label}
              className={`p-3.5 sm:p-4 rounded-xl border ${
                isDark
                  ? 'bg-[#14161A] border-white/10'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {spec.label}
              </div>
              <div className="mt-1 text-base sm:text-lg font-extrabold tracking-tight tabular-nums text-[#E2C275]">
                {spec.value}
              </div>
              <div className={`mt-0.5 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {spec.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Unified 4-Wing Instant Gateway Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {commercialWings.map((wing) => {
            const quoteWaUrl = buildWhatsAppUrl({ wing: wing.id, intent: 'quote' });
            return (
              <article
                key={wing.id}
                className={`group rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isDark
                    ? 'bg-[#14161A] border-white/10 hover:border-[#C9A24B]/55'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* Wing Preview Photo */}
                <button
                  type="button"
                  onClick={() => onNavigate(wing.path)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0B0D] text-left cursor-pointer block"
                >
                  <img
                    src={wing.heroImage}
                    alt={wing.navLabel}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/90 via-[#0A0B0D]/30 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#E2C275]">
                      b2b.handsandhead.com{wing.path}
                    </span>
                    <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                      <span>Enter Wing</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>

                {/* Wing Copy & Direct Actions */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="font-mono tabular-nums text-[#C9A24B]">
                        {wing.trustMetrics[0]?.value}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{wing.trustMetrics[1]?.value} Sampling</span>
                    </div>
                    <h2
                      className={`text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {wing.navLabel}
                    </h2>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {wing.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => onNavigate(wing.path)}
                      className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'bg-white/10 hover:bg-white/15 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Open Wing
                    </button>
                    <a
                      href={quoteWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-3 py-2 rounded-lg bg-[#E50914] hover:bg-[#ff1e2b] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Quote</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Regional Export Readiness Footer Line */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t text-xs ${
            isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-200">
              <Globe2 className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Export Lanes: USA · Saudi Arabia · Bahrain · European Union · Japan</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dhaka Direct-from-Source QC</span>
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="font-mono text-[#E2C275] hover:underline cursor-pointer whitespace-nowrap"
            >
              NexOS Admin Gateway (/admin) →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
