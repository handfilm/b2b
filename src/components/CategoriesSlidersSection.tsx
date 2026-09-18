import React, { useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  Star,
  Shirt,
  Leaf,
  Footprints,
  Home,
  Coffee,
  Fish,
  Pill,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { CategoryId, Product, CurrencyConfig } from '../types';
import { CATEGORIES } from '../data/mockData';
import { FEDERATED_DIVISIONS } from '../data/divisions';
import { SEED_SHOP_HANDSANDHEAD, SEED_ARUTEMIKA_HANDSANDHEAD } from '../data/unlimitedCatalog';

interface CategoriesSlidersSectionProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedDivision?: string;
  onSelectDivision?: (slug: string) => void;
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onInquire: (product: Product) => void;
  onOpenAiAssistant: (product?: Product) => void;
  onExploreFactories: () => void;
  theme?: 'dark' | 'light';
}

export const CategoriesSlidersSection: React.FC<CategoriesSlidersSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDivision = 'all',
  onSelectDivision,
  currency,
  onSelectProduct,
  onRequestSample,
  onInquire,
  onOpenAiAssistant,
  onExploreFactories,
  theme = 'dark',
}) => {
  const shopSliderRef = useRef<HTMLDivElement>(null);
  const arutemikaSliderRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Consolidated Bento Grid: Left Pavilion Showcase + Middle/Right Product Card Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: "Federated Pavilion Showcase" */}
        <div
          className={`lg:col-span-3 rounded-2xl border shadow-xs p-3.5 flex flex-col justify-between ${
            isDark ? 'bg-[#141414] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div>
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-inherit mb-1.5">
              <div className="flex items-center space-x-1.5 font-extrabold text-sm">
                <Star className="w-4 h-4 text-[#e11d48] fill-[#e11d48]" />
                <span>Specialized Sourcing Hubs</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10">
                9 Nodes
              </span>
            </div>

            <nav className="space-y-1 pt-1">
              {FEDERATED_DIVISIONS.slice(1, 8).map((div) => {
                const isActive = selectedDivision === div.slug;
                return (
                  <button
                    key={div.slug}
                    onClick={() => {
                      if (onSelectDivision) onSelectDivision(div.slug);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-[#e11d48] text-white font-bold shadow-xs'
                        : isDark
                        ? 'hover:bg-white/5 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold truncate text-[11px]">{div.divisionTitle}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        {div.tagline}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform text-slate-400 group-hover:translate-x-0.5 ${
                        isActive ? 'text-white' : ''
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Verified Mill Sourcing Callout */}
          <div className="mt-3 pt-3 border-t border-inherit px-1">
            <div
              className={`rounded-xl p-2.5 border text-[11px] space-y-1 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-[#10b981]">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>5,000+ Bonded EPB Mills</span>
              </div>
              <p className="text-[10px] leading-tight text-slate-400">
                Direct export customs clearance from Chattogram Port with 50% JIT Escrow & Bank L/C.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE & RIGHT COLUMNS: Product Card Sliders */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SLIDER 1: Commercial Knit & Denim (shop.handsandhead.com) */}
          <div
            className={`rounded-2xl border shadow-xs p-3.5 flex flex-col justify-between relative group/slider ${
              isDark ? 'bg-[#141414] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#e11d48] tracking-wider flex items-center space-x-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                    <span>shop.handsandhead.com</span>
                  </div>
                  <h3 className="font-extrabold text-sm mt-0.5">Commercial Knit & Denim</h3>
                </div>

                {/* Slider nav arrows */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => scrollSlider(shopSliderRef, 'left')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollSlider(shopSliderRef, 'right')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track */}
              <div
                ref={shopSliderRef}
                className="flex space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {SEED_SHOP_HANDSANDHEAD.slice(0, 4).map((p) => {
                  const lowestPrice = p.priceTiers[p.priceTiers.length - 1].priceUSD;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className={`w-40 shrink-0 rounded-xl p-2 border transition-all cursor-pointer group/card shadow-2xs hover:shadow-md ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#e11d48]'
                          : 'bg-slate-50 hover:bg-white border-slate-200/80 hover:border-[#e11d48]'
                      }`}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-black/20 group/img">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1 left-1 bg-[#e11d48] text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono z-10 transition-opacity duration-200 group-hover/card:opacity-0">
                          Direct
                        </span>
                        {/* Subtle Animated Glassmorphic Tooltip on Product Image Border */}
                        <div
                          role="tooltip"
                          className="absolute top-1 inset-x-1 z-20 pointer-events-none opacity-0 -translate-y-1 scale-95 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:scale-100 transition-all duration-200 ease-out"
                        >
                          <div className="backdrop-blur-md bg-black/80 border border-white/20 border-t-[#e11d48] border-t-2 rounded-md p-1.5 shadow-xl text-white">
                            <div className="flex items-center justify-between text-[8px] font-bold">
                              <span className="truncate text-white font-extrabold max-w-[80px]">
                                {p.divisionTitle || 'RMG Knits'}
                              </span>
                              <span className="text-[#10b981] font-mono flex items-center space-x-0.5 shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5 text-[#10b981]" />
                                <span>Verified</span>
                              </span>
                            </div>
                            <div className="text-[7.5px] text-emerald-300 font-mono truncate mt-0.5">
                              {p.certifications?.[0] || 'OEKO-TEX 100'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#10b981] font-semibold truncate">
                        ✔ {p.deliveryDate || 'Oct 24 delivery'}
                      </div>
                      <div className="font-extrabold text-xs line-clamp-1 group-hover/card:text-[#ff1e42] transition-colors mt-0.5">
                        {p.title}
                      </div>
                      <div className="mt-1 flex items-baseline space-x-1">
                        <span className="font-black text-sm text-[#10b981] font-mono">
                          {currency.symbol}{(lowestPrice * currency.rate).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ {p.unit.toLowerCase().replace(/s$/, '')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        MOQ: {p.moq} {p.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Fast production SLA</span>
              <span
                onClick={() => onSelectCategory('rmg-apparel')}
                className="text-[#ff1e42] font-bold hover:underline cursor-pointer flex items-center space-x-0.5"
              >
                <span>View catalog</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* SLIDER 2: Artisanal & Heritage Line (arutemika.handsandhead.com) */}
          <div
            className={`rounded-2xl border shadow-xs p-3.5 flex flex-col justify-between relative group/slider ${
              isDark ? 'bg-[#141414] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider flex items-center space-x-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>arutemika.handsandhead.com</span>
                  </div>
                  <h3 className="font-extrabold text-sm mt-0.5">Artisanal & Heritage Line</h3>
                </div>

                {/* Slider nav arrows */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => scrollSlider(arutemikaSliderRef, 'left')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollSlider(arutemikaSliderRef, 'right')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track */}
              <div
                ref={arutemikaSliderRef}
                className="flex space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {SEED_ARUTEMIKA_HANDSANDHEAD.slice(0, 4).map((p) => {
                  const lowestPrice = p.priceTiers[p.priceTiers.length - 1].priceUSD;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className={`w-40 shrink-0 rounded-xl p-2 border transition-all cursor-pointer group/card shadow-2xs hover:shadow-md ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-500'
                          : 'bg-slate-50 hover:bg-white border-slate-200/80 hover:border-amber-500'
                      }`}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-black/20 group/img">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono z-10 transition-opacity duration-200 group-hover/card:opacity-0">
                          Artisan
                        </span>
                        {/* Subtle Animated Glassmorphic Tooltip on Product Image Border */}
                        <div
                          role="tooltip"
                          className="absolute top-1 inset-x-1 z-20 pointer-events-none opacity-0 -translate-y-1 scale-95 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:scale-100 transition-all duration-200 ease-out"
                        >
                          <div className="backdrop-blur-md bg-black/80 border border-white/20 border-t-amber-500 border-t-2 rounded-md p-1.5 shadow-xl text-white">
                            <div className="flex items-center justify-between text-[8px] font-bold">
                              <span className="truncate text-white font-extrabold max-w-[80px]">
                                {p.divisionTitle || 'Arutemika Atelier'}
                              </span>
                              <span className="text-[#10b981] font-mono flex items-center space-x-0.5 shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5 text-[#10b981]" />
                                <span>LWG Gold</span>
                              </span>
                            </div>
                            <div className="text-[7.5px] text-amber-300 font-mono truncate mt-0.5">
                              {p.certifications?.[0] || 'Artisan Heritage'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#10b981] font-semibold truncate">
                        ✔ {p.deliveryDate || 'Nov 12 delivery'}
                      </div>
                      <div className="font-extrabold text-xs line-clamp-1 group-hover/card:text-amber-500 transition-colors mt-0.5">
                        {p.title}
                      </div>
                      <div className="mt-1 flex items-baseline space-x-1">
                        <span className="font-black text-sm text-[#10b981] font-mono">
                          {currency.symbol}{(lowestPrice * currency.rate).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ {p.unit.toLowerCase().replace(/s$/, '')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        MOQ: {p.moq} {p.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Authentic Bengal Mastercraft</span>
              <span
                onClick={() => onSelectCategory('handicrafts-brass')}
                className="text-amber-500 font-bold hover:underline cursor-pointer flex items-center space-x-0.5"
              >
                <span>View crafts</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* SLIDER 3: RAWx BOT AGENTIC SOURCING BANNER */}
          <div className="bg-gradient-to-br from-[#121212] via-[#161616] to-[#1f0f14] text-white rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group border border-[#e11d48]/30">
            {/* Ambient Crimson Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e11d48]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#10b981]/15 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-xs font-mono">
                <Sparkles className="w-3 h-3 text-white" />
                <span>RAWx SOURCING BOT</span>
              </div>

              <h4 className="text-base font-black text-white leading-snug">
                AI-Powered. Instant factory match. Smart quotes.
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with LEED-certified Bangladesh factories using RAWx Bot to negotiate FOB Chattogram pricing, lead times, and custom TechPack CAD.
              </p>

              {/* Verified Badges */}
              <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                  <span>5-minute verified quote responses</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                  <span>CAD TechPack & Pantone swatches</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3">
              <button
                onClick={() => onOpenAiAssistant()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white font-extrabold text-xs shadow-md shadow-[#e11d48]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer group-hover:scale-102"
              >
                <span>Launch RAWx Bot</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
