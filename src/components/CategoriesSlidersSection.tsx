import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  MessageSquare,
  FileSpreadsheet,
  Layers,
  Award,
} from 'lucide-react';
import { CategoryId, Product, CurrencyConfig } from '../types';
import { CATEGORIES } from '../data/mockData';
import { FEDERATED_DIVISIONS } from '../data/divisions';
import { SEED_SHOP_HANDSANDHEAD, SEED_ARUTEMIKA_HANDSANDHEAD } from '../data/unlimitedCatalog';
import { useI18n } from '../context/I18nContext';

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
  const hubsTrackRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const sampleAiPrompts = [
    '240 GSM organic tees < $3.00',
    '13.5 oz Raw Selvedge Denim',
    'Goodyear Welted Boots FOB',
    'Jute shopping bags MOQ 200',
  ];

  return (
    <section
      id="categories-sliders-section"
      aria-label="Federated Pavilion Showcase"
      className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 space-y-3.5 sm:space-y-4"
    >
      {/* =========================================================================
          1. SPECIALIZED SOURCING HUBS: Sleek, Dynamic, Responsive Cluster Command Strip
          Adaptive horizontal track with smooth scroll that never compresses or breaks
          ========================================================================= */}
      <div
        id="sourcing-hubs-command-strip"
        className={`rounded-2xl border p-3 sm:p-3.5 transition-colors shadow-xs ${
          isDark
            ? 'bg-[#121620] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Hubs Header: Title + Node Count + Mill Trust Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-inherit">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/25">
              <Star className="w-3.5 h-3.5 fill-[#e11d48] text-[#e11d48]" />
            </span>
            <div>
              <span className="font-extrabold text-xs sm:text-sm tracking-tight">
                {isBn ? 'বিশেষায়িত সোর্সিং হাব' : 'Specialized Sourcing Hubs'}
              </span>
              <span className="text-[10.5px] text-slate-400 ml-2 hidden sm:inline">
                {isBn ? '৮টি সক্রিয় শিল্প রপ্তানি ক্লাস্টার' : '8 Active Industrial Export Clusters'}
              </span>
            </div>
            <span className="text-[9.5px] font-mono font-bold text-[#10b981] px-2 py-0.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 shrink-0">
              {isBn ? '৯টি নোড লাইভ' : '9 Nodes Live'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-medium border ${
                isDark
                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span>
                {isBn ? '৫,০০০+ বন্ডেড ইপিবি মিল • সরাসরি কাস্টমস সিজিপি' : '5,000+ Bonded EPB Mills • Direct Customs CGP'}
              </span>
            </div>

            {selectedDivision !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectDivision && onSelectDivision('all')}
                className="px-2.5 py-1 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[10.5px] font-bold transition-all cursor-pointer shadow-xs"
              >
                {isBn ? 'ফিল্টার রিসেট' : 'Reset Filter'}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Horizontal Cluster Selector Track */}
        <div
          ref={hubsTrackRef}
          className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "All Clusters" Master Pill */}
          <motion.button
            type="button"
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectDivision && onSelectDivision('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center space-x-1.5 ${
              selectedDivision === 'all'
                ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-md shadow-[#e11d48]/25 font-black'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? 'সকল ক্লাস্টার' : 'All Clusters'}</span>
          </motion.button>

          {/* 8 Specific Cluster Nodes */}
          {FEDERATED_DIVISIONS.slice(1, 9).map((div) => {
            const isActive = selectedDivision === div.slug;
            return (
              <motion.button
                key={div.slug}
                type="button"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (onSelectDivision) onSelectDivision(div.slug);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 border flex items-center space-x-2 group ${
                  isActive
                    ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-md shadow-[#e11d48]/25 font-black'
                    : isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-[#e11d48]/50'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-[#e11d48]/50 shadow-2xs'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[11.5px] group-hover:text-white transition-colors">
                    {div.divisionTitle}
                  </span>
                  <span
                    className={`text-[9.5px] font-mono leading-none ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {div.tagline}
                  </span>
                </div>
                <ChevronRight
                  className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. FLAGSHIP PAVILION SHOWCASE: Side-by-Side Spacious Product Sliders
          Roomy 2-Column Grid (Knit & Denim + Artisanal Line) with Next-Level Card Hover
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* -----------------------------------------------------------------------
            SLIDER 1: Commercial Knit & Denim (shop.handsandhead.com)
            ----------------------------------------------------------------------- */}
        <div
          id="pavilion-slider-commercial"
          className={`rounded-2xl border shadow-xs p-3.5 sm:p-4 flex flex-col justify-between relative group/slider transition-colors ${
            isDark ? 'bg-[#121620] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div>
            {/* Slider Header: Domain Badge + Title + Left/Right Nav Arrows */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10.5px] uppercase font-bold text-[#e11d48] tracking-wider flex items-center space-x-1.5 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e11d48] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e11d48]"></span>
                  </span>
                  <span>shop.handsandhead.com</span>
                  <span className="text-[9.5px] text-slate-400 font-normal hidden sm:inline">
                    {isBn ? '• উচ্চ-ঘনত্ব পোশাক' : '• High-Density RMG'}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base mt-0.5 tracking-tight">
                  {isBn ? 'বাণিজ্যিক নিট ও ডেনিম প্যাভিলিয়ন' : 'Commercial Knit & Denim Pavilion'}
                </h3>
              </div>

              {/* Slider nav arrows */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  aria-label="Scroll Knit and Denim Left"
                  onClick={() => scrollSlider(shopSliderRef, 'left')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll Knit and Denim Right"
                  onClick={() => scrollSlider(shopSliderRef, 'right')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track: Roomy, High-Density Product Cards */}
            <div
              ref={shopSliderRef}
              className="flex space-x-3 sm:space-x-3.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SEED_SHOP_HANDSANDHEAD.slice(0, 6).map((p) => {
                const lowestPrice = p.priceTiers[p.priceTiers.length - 1].priceUSD;
                const isCardHovered = hoveredCardId === p.id;

                return (
                  <motion.div
                    key={p.id}
                    id={`slider-card-${p.id}`}
                    whileHover={{ y: -3 }}
                    onMouseEnter={() => setHoveredCardId(p.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => onSelectProduct(p)}
                    className={`w-44 sm:w-48 md:w-52 lg:w-56 shrink-0 rounded-xl p-2.5 border transition-all cursor-pointer group/card shadow-2xs relative flex flex-col justify-between ${
                      isDark
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-[#e11d48]'
                        : 'bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-[#e11d48] shadow-slate-100'
                    }`}
                  >
                    <div>
                      {/* Image Frame with Aspect Square & Badges */}
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-black/20 group/img">
                        <img
                          src={p.images?.[0] || '/catalog/rawx/rawx-denim-jeans-01.jpg'}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/catalog/rawx/rawx-denim-jeans-01.jpg';
                          }}
                        />

                        {/* Top-Left Badge */}
                        <span className="absolute top-1.5 left-1.5 bg-[#e11d48] text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono z-10 shadow-xs">
                          {isBn ? 'সরাসরি মিল' : 'Direct Mill'}
                        </span>

                        {/* Top-Right EPB Verified Indicator */}
                        <span className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-[#10b981] text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded z-10 flex items-center space-x-0.5 border border-emerald-500/30">
                          <ShieldCheck className="w-2.5 h-2.5 text-[#10b981]" />
                          <span>EPB</span>
                        </span>

                        {/* Hover Quick Action Buttons Overlay */}
                        <div className="absolute inset-x-1.5 bottom-1.5 z-20 flex items-center space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                          <button
                            type="button"
                            id={`btn-slider-inquire-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onInquire(p);
                            }}
                            className="flex-1 py-1 px-1.5 rounded-md bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[9.5px] font-bold flex items-center justify-center space-x-1 shadow-md cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{isBn ? 'অনুসন্ধান' : 'Inquire'}</span>
                          </button>
                          <button
                            type="button"
                            id={`btn-slider-ai-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAiAssistant(p);
                            }}
                            className="p-1 rounded-md bg-black/80 hover:bg-black text-white hover:text-rose-300 text-[9.5px] border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
                            title={isBn ? 'র-এক্স এআই দিয়ে ফ্যাক্টরি ম্যাচ করুন' : 'Match factory via RAWx AI'}
                          >
                            <Sparkles className="w-3 h-3 text-[#10b981]" />
                          </button>
                        </div>

                        {/* Animated Glassmorphic Tooltip on Product Image Top */}
                        <div
                          role="tooltip"
                          className="absolute top-1 inset-x-1 z-20 pointer-events-none opacity-0 -translate-y-1 scale-95 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:scale-100 transition-all duration-200 ease-out"
                        >
                          <div className="backdrop-blur-md bg-black/85 border border-white/20 border-t-[#e11d48] border-t-2 rounded-md p-1.5 shadow-xl text-white">
                            <div className="flex items-center justify-between text-[8.5px] font-bold">
                              <span className="truncate text-white font-extrabold max-w-[90px]">
                                {p.divisionTitle || 'RMG Knits'}
                              </span>
                              <span className="text-[#10b981] font-mono flex items-center space-x-0.5 shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5 text-[#10b981]" />
                                <span>{isBn ? 'যাচাইকৃত' : 'Verified'}</span>
                              </span>
                            </div>
                            <div className="text-[8px] text-emerald-300 font-mono truncate mt-0.5">
                              {p.certifications?.[0] || 'OEKO-TEX 100'} • {p.portOfLoading || 'Chattogram (CGP)'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery SLA Guarantee */}
                      <div className="text-[10px] text-[#10b981] font-semibold truncate flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#10b981]" />
                        <span>{p.deliveryDate || 'Oct 24 delivery'}</span>
                      </div>

                      {/* Title: 2-line clamp for full legibility */}
                      <h4 className="font-extrabold text-xs line-clamp-2 group-hover/card:text-[#ff1e42] transition-colors mt-0.5 leading-snug">
                        {p.title}
                      </h4>
                    </div>

                    {/* Price and MOQ Section */}
                    <div className="mt-2 pt-1.5 border-t border-inherit/40">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline space-x-1">
                          <span className="font-black text-sm text-[#10b981] font-mono">
                            {currency.symbol}{toDigits((lowestPrice * currency.rate).toFixed(2))}
                          </span>
                          <span className="text-[10px] text-slate-400">/ {p.unit.toLowerCase().replace(/s$/, '')}</span>
                        </div>
                        <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-inherit">
                          MOQ: {toDigits(p.moq)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Slider Footer */}
          <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-mono">
              {isBn ? 'দ্রুত উৎপাদন ও এফওবি চুক্তি' : 'Fast production & FOB SLA'}
            </span>
            <span
              onClick={() => onSelectCategory('rmg-apparel')}
              className="text-[#ff1e42] font-bold hover:underline cursor-pointer flex items-center space-x-0.5 text-xs"
            >
              <span>{isBn ? 'ক্যাটালগ দেখুন' : 'View catalog'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            SLIDER 2: Artisanal & Heritage Line (arutemika.handsandhead.com)
            ----------------------------------------------------------------------- */}
        <div
          id="pavilion-slider-artisanal"
          className={`rounded-2xl border shadow-xs p-3.5 sm:p-4 flex flex-col justify-between relative group/slider transition-colors ${
            isDark ? 'bg-[#121620] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div>
            {/* Slider Header: Domain Badge + Title + Left/Right Nav Arrows */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10.5px] uppercase font-bold text-amber-500 tracking-wider flex items-center space-x-1.5 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>arutemika.handsandhead.com</span>
                  <span className="text-[9.5px] text-slate-400 font-normal hidden sm:inline">
                    {isBn ? '• ঐতিহ্যবাহী আর্ট স্টুডিও' : '• Mastercraft Atelier'}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base mt-0.5 tracking-tight">
                  {isBn ? 'ঐতিহ্যবাহী কারুশিল্প প্যাভিলিয়ন' : 'Artisanal & Heritage Pavilion'}
                </h3>
              </div>

              {/* Slider nav arrows */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  aria-label="Scroll Artisanal Left"
                  onClick={() => scrollSlider(arutemikaSliderRef, 'left')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll Artisanal Right"
                  onClick={() => scrollSlider(arutemikaSliderRef, 'right')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-2xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track: Roomy, High-Density Product Cards */}
            <div
              ref={arutemikaSliderRef}
              className="flex space-x-3 sm:space-x-3.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SEED_ARUTEMIKA_HANDSANDHEAD.slice(0, 6).map((p) => {
                const lowestPrice = p.priceTiers[p.priceTiers.length - 1].priceUSD;

                return (
                  <motion.div
                    key={p.id}
                    id={`slider-card-${p.id}`}
                    whileHover={{ y: -3 }}
                    onMouseEnter={() => setHoveredCardId(p.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => onSelectProduct(p)}
                    className={`w-44 sm:w-48 md:w-52 lg:w-56 shrink-0 rounded-xl p-2.5 border transition-all cursor-pointer group/card shadow-2xs relative flex flex-col justify-between ${
                      isDark
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-amber-500'
                        : 'bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-amber-500 shadow-slate-100'
                    }`}
                  >
                    <div>
                      {/* Image Frame with Aspect Square & Badges */}
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-black/20 group/img">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80';
                          }}
                        />

                        {/* Top-Left Badge */}
                        <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono z-10 shadow-xs">
                          {isBn ? 'ঐতিহ্যবাহী কারুশিল্প' : 'Artisan Craft'}
                        </span>

                        {/* Top-Right LWG Gold Indicator */}
                        <span className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-amber-400 text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded z-10 flex items-center space-x-0.5 border border-amber-500/30">
                          <Award className="w-2.5 h-2.5 text-amber-400" />
                          <span>LWG</span>
                        </span>

                        {/* Hover Quick Action Buttons Overlay */}
                        <div className="absolute inset-x-1.5 bottom-1.5 z-20 flex items-center space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                          <button
                            type="button"
                            id={`btn-slider-inquire-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onInquire(p);
                            }}
                            className="flex-1 py-1 px-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-[9.5px] font-bold flex items-center justify-center space-x-1 shadow-md cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{isBn ? 'অনুসন্ধান' : 'Inquire'}</span>
                          </button>
                          <button
                            type="button"
                            id={`btn-slider-ai-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAiAssistant(p);
                            }}
                            className="p-1 rounded-md bg-black/80 hover:bg-black text-white hover:text-amber-300 text-[9.5px] border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
                            title={isBn ? 'র-এক্স এআই দিয়ে কারিগর কর্মশালা খুঁজুন' : 'Match artisan workshop via RAWx AI'}
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                          </button>
                        </div>

                        {/* Animated Glassmorphic Tooltip on Product Image Top */}
                        <div
                          role="tooltip"
                          className="absolute top-1 inset-x-1 z-20 pointer-events-none opacity-0 -translate-y-1 scale-95 group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:scale-100 transition-all duration-200 ease-out"
                        >
                          <div className="backdrop-blur-md bg-black/85 border border-white/20 border-t-amber-500 border-t-2 rounded-md p-1.5 shadow-xl text-white">
                            <div className="flex items-center justify-between text-[8.5px] font-bold">
                              <span className="truncate text-white font-extrabold max-w-[90px]">
                                {p.divisionTitle || 'Arutemika Atelier'}
                              </span>
                              <span className="text-amber-400 font-mono flex items-center space-x-0.5 shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                                <span>{isBn ? 'মাস্টারক্র্যাফ্ট' : 'Mastercraft'}</span>
                              </span>
                            </div>
                            <div className="text-[8px] text-amber-300 font-mono truncate mt-0.5">
                              {p.certifications?.[0] || 'Artisan Heritage'} • Bengal Guild
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery SLA Guarantee */}
                      <div className="text-[10px] text-[#10b981] font-semibold truncate flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#10b981]" />
                        <span>{p.deliveryDate || 'Nov 12 delivery'}</span>
                      </div>

                      {/* Title: 2-line clamp for full legibility */}
                      <h4 className="font-extrabold text-xs line-clamp-2 group-hover/card:text-amber-500 transition-colors mt-0.5 leading-snug">
                        {p.title}
                      </h4>
                    </div>

                    {/* Price and MOQ Section */}
                    <div className="mt-2 pt-1.5 border-t border-inherit/40">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline space-x-1">
                          <span className="font-black text-sm text-[#10b981] font-mono">
                            {currency.symbol}{toDigits((lowestPrice * currency.rate).toFixed(2))}
                          </span>
                          <span className="text-[10px] text-slate-400">/ {p.unit.toLowerCase().replace(/s$/, '')}</span>
                        </div>
                        <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-inherit">
                          MOQ: {toDigits(p.moq)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Slider Footer */}
          <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-mono">
              {isBn ? 'খাঁটি বাংলার ঐতিহ্যবাহী কারুশিল্প' : 'Authentic Bengal Mastercraft'}
            </span>
            <span
              onClick={() => onSelectCategory('handicrafts-brass')}
              className="text-amber-500 font-bold hover:underline cursor-pointer flex items-center space-x-0.5 text-xs"
            >
              <span>{isBn ? 'হস্তশিল্প দেখুন' : 'View crafts'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. RAWx BOT AGENTIC SOURCING COMMAND STRIP: Lean, Next-Level Smart Bar
          Pulsing radar glow, live interactive prompt pills, and 1-click factory match
          ========================================================================= */}
      <div
        id="rawx-bot-command-strip"
        className="rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-[#121620] via-[#161c2b] to-[#1f0f18] text-white border border-[#e11d48]/30 shadow-xl relative overflow-hidden group"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-24 bg-[#e11d48]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-24 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Bot Badge + Headline + Interactive Prompts */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider shadow-xs font-mono">
                <Sparkles className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '4s' }} />
                <span>{isBn ? 'র-এক্স সোর্সিং বট' : 'RAWx SOURCING BOT'}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                <span>{isBn ? 'তাৎক্ষণিক মিল ম্যাচিং • ৫ মিনিটে কোটেশন' : 'Instant Mill Match • 5-min quotes'}</span>
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
              {isBn
                ? 'এআই-চালিত ফ্যাক্টরি ম্যাচিং, এফওবি চট্টগ্রাম কোটেশন ও টেকপ্যাক ক্যাড'
                : 'AI-Powered Factory Matching, FOB Chattogram Quotes & TechPack CAD'}
            </h4>

            {/* Quick Prompt Pills: Clickable, launches AI instantly */}
            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10.5px] text-slate-400 font-medium">
                {isBn ? 'জিজ্ঞাসা করুন:' : 'Try asking:'}
              </span>
              {sampleAiPrompts.map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => onOpenAiAssistant()}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#e11d48]/20 hover:border-[#e11d48]/50 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>"{promptText}"</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Verified Trust Stats & Launch Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-2.5 shrink-0">
            <div className="flex items-center space-x-3 text-[10.5px] text-slate-300">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>{isBn ? 'লিড প্ল্যাটিনাম যাচাইকৃত' : 'LEED Platinum Verified'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>{isBn ? '১০০% এসক্রো সুরক্ষা' : '100% Escrow Protection'}</span>
              </div>
            </div>

            <motion.button
              type="button"
              id="btn-launch-rawx-bot"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenAiAssistant()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:from-[#ff1e42] hover:to-[#e11d48] text-white font-extrabold text-xs shadow-lg shadow-[#e11d48]/30 transition-all flex items-center justify-center space-x-2 cursor-pointer group/btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{isBn ? 'র-এক্স বট চালু করুন' : 'Launch RAWx Bot'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
