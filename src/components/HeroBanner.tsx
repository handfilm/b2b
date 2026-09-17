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
  Zap,
} from 'lucide-react';
import { MarketplaceStats, LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';

interface HeroBannerProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onExploreFactories: () => void;
  onOpenAutomation?: () => void;
  stats?: MarketplaceStats;
  lang?: LanguageCode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
  onExploreFactories,
  onOpenAutomation,
  stats,
  lang = 'EN',
}) => {
  const t = getTranslation(lang);
  return (
    <div className="relative bg-[#0a0a0a] text-white overflow-hidden border-b border-white/10">
      {/* Subtle Electric Orange Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#ff5500]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official B2B Export Gateway • b2b.handsandhead.com</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {lang === 'BN' ? (
                <>
                  বাংলাদেশের <span className="text-[#ff5500]">শীর্ষস্থানীয় রপ্তানিকারকদের</span> সাথে সরাসরি পাইকারি বাণিজ্য
                </>
              ) : (
                <>
                  Direct Sourcing from <span className="text-[#ff5500]">Bangladesh’s Premier</span> Export Manufacturers
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              {lang === 'BN'
                ? '২,৪০০+ ভেরিফায়েড ইপিবি বন্ডেড আরএমজি মিল, অর্গানিক কটন, সোনালী পাট, প্রিমিয়াম চামড়া ও ফাইন সিরামিকের সরাসরি উৎস। ৫০% অগ্রিম জেআইটি এসক্রো এবং চট্টগ্রাম বন্দর থেকে এফওবি/সিআইএফ লজিস্টিক সুবিধা।'
                : 'Connect directly with 2,400+ verified EPB bonded RMG mills, organic cotton, biodegradable golden jute, premium Savar crust leather, and fine tableware ceramics. 50% advance JIT escrow protection and FOB/CIF shipping from Chattogram Port.'}
            </p>

            {/* Value Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>Zero Middleman Margins</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>220+ LEED Green Mills</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>OEKO-TEX & GOTS Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>Custom OEM/ODM Tech Packs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>Courier Samples in 4-6 Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>Bank LC & 50% JIT Escrow</span>
              </div>
            </div>

            {/* Sourcing CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                id="hero-rfq-cta-button"
                onClick={onOpenRfq}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-bold text-sm shadow-xl shadow-[#ff5500]/25 transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.postRfq}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-factories-button"
                onClick={onExploreFactories}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#171717] hover:bg-[#222222] text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{t.verifiedFactories}</span>
              </button>

              <button
                id="hero-freight-button"
                onClick={onOpenShippingCalc}
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <Ship className="w-4 h-4 text-[#ff5500]" />
                <span>{t.freightMatrix}</span>
              </button>

              {onOpenAutomation && (
                <button
                  id="hero-automation-button"
                  onClick={onOpenAutomation}
                  className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-[#ff5500]/15 hover:bg-[#ff5500]/25 text-[#ff5500] font-bold text-sm border border-[#ff5500]/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-[#ff5500]" />
                  <span>{t.superAutomation}</span>
                </button>
              )}
            </div>
          </div>

          {/* Bangladesh Export Highlight Card */}
          <div className="lg:col-span-4">
            <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#ff5500]" />
                  <span className="text-xs uppercase font-black tracking-wider text-white">
                    Nexus Trade Metrics
                  </span>
                </div>
                <span className="text-[10px] font-black text-[#ff5500] bg-[#ff5500]/10 px-2.5 py-0.5 rounded-full border border-[#ff5500]/30 font-mono">
                  LIVE BENCHMARK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121212] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Export Volume</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {stats?.annualExportUSD || '$55.5 Billion'}
                  </div>
                  <div className="text-[10px] text-[#ff5500] mt-0.5 font-mono">Worldwide Shipments</div>
                </div>

                <div className="bg-[#121212] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Global RMG Rank</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    #2 Worldwide
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Apparel Supplier</div>
                </div>

                <div className="bg-[#121212] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Green Factories</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {stats?.leedGreenFactories || '220+ LEED'}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">USGBC Certified</div>
                </div>

                <div className="bg-[#121212] rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Verified Units</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {stats?.verifiedExporters ? `${stats.verifiedExporters.toLocaleString()}+` : '2,480+'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Bonded Exporters</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct Container Dispatch:</span>
                <span className="text-white font-mono font-bold">Chattogram • Mongla</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
