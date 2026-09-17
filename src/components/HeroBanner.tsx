import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building2,
  Ship,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { BANGLADESH_EXPORT_STATS } from '../data/mockData';

interface HeroBannerProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onExploreFactories: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
  onExploreFactories,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-emerald-950 text-white overflow-hidden border-b border-neutral-800">
      {/* Decorative subtle ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official B2B Export Gateway for Bangladesh</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Direct Sourcing from <span className="text-emerald-400">Bangladesh’s Premier</span> Export Manufacturers
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Connect directly with verified RMG, organic cotton, biodegradable golden jute, premium Savar leather, and fine ceramics factories. Verified compliance, Letter of Credit security, and FOB/CIF shipping from Chattogram Port.
            </p>

            {/* Value Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-neutral-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Middleman Margins</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>220+ LEED Green Mills</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>OEKO-TEX & GOTS Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Private Label OEM/ODM</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sample Approval in 7 Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bank LC & Escrow Protection</span>
              </div>
            </div>

            {/* Sourcing CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                id="hero-rfq-cta-button"
                onClick={onOpenRfq}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm shadow-md transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Sourcing RFQ</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-factories-button"
                onClick={onExploreFactories}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm border border-neutral-700 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-neutral-400" />
                <span>Browse Certified Mills</span>
              </button>

              <button
                id="hero-freight-button"
                onClick={onOpenShippingCalc}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-transparent hover:bg-neutral-800/60 text-neutral-300 hover:text-white font-medium text-sm border border-neutral-700 transition-colors cursor-pointer"
              >
                <Ship className="w-4 h-4 text-emerald-400" />
                <span>Ocean Freight Matrix</span>
              </button>
            </div>
          </div>

          {/* Bangladesh Export Highlight Card */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-5 shadow-xl backdrop-blur-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-300">
                    Trade Benchmark
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  FY 2024-2025
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-neutral-950/60 rounded-lg p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium">Export Volume</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {BANGLADESH_EXPORT_STATS.annualExportUSD}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Worldwide Shipments</div>
                </div>

                <div className="bg-neutral-950/60 rounded-lg p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium">Global RMG Rank</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {BANGLADESH_EXPORT_STATS.globalRmgRank}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Apparel Supplier</div>
                </div>

                <div className="bg-neutral-950/60 rounded-lg p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium">Green Factories</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {BANGLADESH_EXPORT_STATS.leedGreenFactories}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">USGBC Certified</div>
                </div>

                <div className="bg-neutral-950/60 rounded-lg p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium">Destinations</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {BANGLADESH_EXPORT_STATS.activeExportDestinations}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Global Trade Partners</div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Direct Seaports:</span>
                <span className="text-neutral-200 font-semibold">Chattogram • Mongla</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
