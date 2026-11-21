import React from 'react';
import {
  ShieldCheck,
  Globe2,
  Building2,
  ExternalLink,
  ArrowRight,
  MessageCircle,
  Package,
  Truck,
  Clock,
  CreditCard,
} from 'lucide-react';
import {
  B2B_WINGS,
  GLOBAL_TRUST_GUARANTEES,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
} from '../config/wings';
import { EcosystemOsBadge } from './EcosystemOsBadge';

interface FooterProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onOpenTechPackStudio?: () => void;
  onOpenAiAssistant?: () => void;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
  onOpenTechPackStudio,
  onNavigate,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const handleRoute = (e: React.MouseEvent, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer
      id="main-footer"
      className={`text-xs border-t mt-12 font-sans transition-colors ${
        isDark
          ? 'bg-[#0A0B0D] text-zinc-300 border-white/10'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {/* 1. Manufacturing Guarantees Strip */}
      <div
        className={`border-b py-5 px-4 transition-colors ${
          isDark ? 'bg-[#0F1115] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {GLOBAL_TRUST_GUARANTEES.map((item, idx) => {
            const icons = [Package, Clock, Truck, ShieldCheck];
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={item.label}
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark
                    ? 'bg-[#14161A] border-white/10'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-lg border border-[#C9A24B]/30 bg-[#C9A24B]/10 text-[#E2C275] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-zinc-400 font-medium">{item.label}</div>
                  <div className={`font-extrabold text-sm tabular-nums mt-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {item.value}
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug mt-0.5">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main 4-Column Unified Portal Navigation */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Unified B2B Wings (Single Domain, Zero Fragmentation) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#E50914]" />
              <h4 className={`font-bold text-xs tracking-wide ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Unified B2B Wings
              </h4>
            </div>

            <div className="space-y-1.5">
              {B2B_WINGS.map((wing) => (
                <a
                  key={wing.id}
                  href={wing.path}
                  onClick={(e) => handleRoute(e, wing.path)}
                  className={`group flex items-center justify-between p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-[#14161A] border-white/10 hover:border-[#C9A24B]/50 text-zinc-300 hover:text-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-medium truncate">{wing.navLabel}</span>
                  <span className="font-mono text-[10px] text-[#C9A24B] shrink-0 ml-2">
                    {wing.path}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Wing-Attributed WhatsApp Export Desks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <h4 className={`font-bold text-xs tracking-wide ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Direct WhatsApp Export Desks
              </h4>
            </div>

            <div className="space-y-1.5">
              {[
                { label: 'RMG Heavyweight Quote', wing: 'rmg' as const, intent: 'quote' as const },
                { label: 'Leather & Jacket Atelier Quote', wing: 'leather' as const, intent: 'quote' as const },
                { label: '316L / 516SS Hardware Quote', wing: 'hardware' as const, intent: 'quote' as const },
                { label: 'Book Swatch Kit (3–4d DHL)', wing: 'swatch' as const, intent: 'swatch' as const },
              ].map((cta) => (
                <a
                  key={cta.label}
                  href={buildWhatsAppUrl({ wing: cta.wing, intent: cta.intent })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-[#14161A] border-white/10 hover:border-emerald-500/50 text-zinc-300 hover:text-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate">{cta.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </a>
              ))}
              <div className="pt-1 font-mono text-[11px] text-zinc-400">
                Direct Dhaka Desk: <span className="text-zinc-200">{WHATSAPP_DISPLAY}</span>
              </div>
            </div>
          </div>

          {/* Column 3: International Export Corridors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#C9A24B]" />
              <h4 className={`font-bold text-xs tracking-wide ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Global Buyer Corridors
              </h4>
            </div>

            <div className="space-y-1.5">
              {[
                { region: 'United States (NY / LA)', transit: '3–4d DHL · 26–32d Sea' },
                { region: 'Saudi Arabia (Riyadh / Jeddah)', transit: '3–4d DHL · 14d Sea' },
                { region: 'Bahrain & GCC Hub', transit: '3–4d DHL · 12–14d Sea' },
                { region: 'European Union (GSP Duty-Free)', transit: '3–4d DHL · 22–26d Sea' },
              ].map((lane) => (
                <div
                  key={lane.region}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isDark
                      ? 'bg-[#14161A] border-white/10 text-zinc-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate font-medium">{lane.region}</span>
                  <span className="font-mono text-[10px] text-[#C9A24B] shrink-0 ml-2 tabular-nums">
                    {lane.transit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Commercial Tools & Statutory */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#E50914]" />
              <h4 className={`font-bold text-xs tracking-wide ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Commercial Tools &amp; Compliance
              </h4>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={onOpenRfq}
                className={`w-full group flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer text-left ${
                  isDark
                    ? 'bg-[#14161A] border-white/10 hover:border-[#E50914]/60 text-zinc-300 hover:text-white'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>Submit Formal Production RFQ</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
              </button>

              {onOpenTechPackStudio && (
                <button
                  type="button"
                  onClick={onOpenTechPackStudio}
                  className={`w-full group flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer text-left ${
                    isDark
                      ? 'bg-[#14161A] border-white/10 hover:border-[#C9A24B]/60 text-zinc-300 hover:text-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Build CAD TechPack Spec Sheet</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                </button>
              )}

              <button
                type="button"
                onClick={onOpenShippingCalc}
                className={`w-full group flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer text-left ${
                  isDark
                    ? 'bg-[#14161A] border-white/10 hover:border-white/25 text-zinc-300 hover:text-white'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>FOB Chattogram &amp; Air Freight Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              <a
                href="https://www.bgmea.com.bd"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-[#14161A] border-white/10 hover:border-white/25 text-zinc-400 hover:text-white'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>BGMEA / EPB / Savar CETP Verified</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Clean Bottom Bar with Persistent Ecosystem OS Badge */}
      <div
        id="footer-bottom-strip"
        className={`border-t py-4 px-4 pb-[calc(var(--mobile-dock-height,84px)+env(safe-area-inset-bottom,0px)+1.25rem)] lg:pb-4 transition-colors ${
          isDark ? 'bg-[#07080A] border-white/10' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-zinc-200">HANDS &amp; HEAD × RAWx</span>
            <span aria-hidden="true">·</span>
            <span>b2b.handsandhead.com</span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Dhaka Direct Manufacturing</span>
          </div>

          <EcosystemOsBadge variant="inline" />
        </div>
      </div>
    </footer>
  );
};
