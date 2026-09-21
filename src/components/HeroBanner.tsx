import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkles,
  Camera,
  ShieldCheck,
  Building2,
  Users,
  FileText,
  Ship,
  TrendingUp,
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  X,
  Upload,
  Flame,
  Tag,
  Layers,
  BadgeCheck,
  Package,
} from 'lucide-react';
import { MarketplaceStats, LanguageCode, AuthUser } from '../types';
import { useI18n } from '../context/I18nContext';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeHeroTab: 'ai' | 'products' | 'suppliers' | 'customers';
  onHeroTabChange: (tab: 'ai' | 'products' | 'suppliers' | 'customers') => void;
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onOpenTechPackStudio: () => void;
  onOpenAiAssistant: () => void;
  authUser?: AuthUser | null;
  lang?: LanguageCode;
  onPerformSearch?: (query: string) => void;
  theme?: 'dark' | 'light';
}

interface PopularSearchItem {
  id: string;
  query: string;
  category: string;
  badge: string;
  fobHighlight: string;
  volume: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  activeHeroTab,
  onHeroTabChange,
  onOpenRfq,
  onOpenShippingCalc,
  onOpenTechPackStudio,
  onOpenAiAssistant,
  authUser,
  lang = 'EN',
  onPerformSearch,
  theme = 'dark',
}) => {
  const [isAiModeEnabled, setIsAiModeEnabled] = useState(false);
  const [isImageSearchModalOpen, setIsImageSearchModalOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [isBuyerBadgeHovered, setIsBuyerBadgeHovered] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  const { t, toDigits, lang: currentLang } = useI18n();
  const isBn = currentLang === 'BN';

  const popularSearches: PopularSearchItem[] = [
    {
      id: 'p1',
      query: 'Heavyweight 240 GSM Combed Tee',
      category: 'RMG Knits',
      badge: '🔥 High Demand',
      fobHighlight: 'FOB $2.40 - $3.20',
      volume: '14.2k searches',
    },
    {
      id: 'p2',
      query: 'Raw Indigo Selvedge Denim 14oz',
      category: 'Denim & Woven',
      badge: '⚡ Direct Mill',
      fobHighlight: 'FOB $8.50 - $12.00',
      volume: '9.8k searches',
    },
    {
      id: 'p3',
      query: 'Golden Jute Tote & Shopping Burlap',
      category: 'Eco Jute',
      badge: '🌿 100% Eco',
      fobHighlight: 'FOB $0.85 - $1.65',
      volume: '8.1k searches',
    },
    {
      id: 'p4',
      query: 'Full-Grain Leather Formal & Boots',
      category: 'Leather Goods',
      badge: '🛡️ LWG Gold',
      fobHighlight: 'FOB $18.00 - $32.00',
      volume: '6.5k searches',
    },
    {
      id: 'p5',
      query: 'Fine Bone China Dinnerware & Cups',
      category: 'Ceramics',
      badge: '🍽️ Export Grade',
      fobHighlight: 'FOB $1.20 - $4.50',
      volume: '5.4k searches',
    },
    {
      id: 'p6',
      query: 'GOTS Certified Organic Interlock',
      category: 'Sustainable RMG',
      badge: '🍃 OEKO-TEX 100',
      fobHighlight: 'FOB $3.10 - $4.20',
      volume: '7.3k searches',
    },
    {
      id: 'p7',
      query: 'FOB Chattogram Port Sea Freight',
      category: 'Logistics Matrix',
      badge: '🚢 3.2d Berth Sync',
      fobHighlight: 'FCL & LCL Escrow',
      volume: '11.0k searches',
    },
  ];

  const quickFilterPills = [
    '240 GSM Jersey',
    'Selvedge Denim',
    'Jute Tote Bag',
    'Leather Shoes',
    'Ceramic Tableware',
    'LEED Platinum Mills',
    'FOB Chattogram',
  ];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    onSearchChange(tempSearch);
    if (onPerformSearch) onPerformSearch(tempSearch);
  };

  const handleSelectSearchItem = (query: string) => {
    setTempSearch(query);
    onSearchChange(query);
    if (onPerformSearch) onPerformSearch(query);
    setIsSearchFocused(false);
  };

  return (
    <div
      className={`pt-5 pb-3 px-4 border-b transition-colors relative z-20 ${
        isDark
          ? 'bg-gradient-to-b from-[#0d0d0d] via-[#111111] to-[#0a0a0a] border-white/10 text-white'
          : 'bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] border-slate-200 text-slate-800'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 space-y-3.5">
        {/* 1. Heart of the Website: Centered Mode Switcher Highlight Tabs (AI Mode, Products, Exporters, Buyers) */}
        <div
          id="hero-mode-tabs"
          className={`flex items-center justify-center flex-wrap gap-2 sm:gap-3 border-b pb-3 pt-1 ${
            isDark ? 'border-white/10' : 'border-slate-200/80'
          }`}
        >
          {/* AI Mode Tab - Next Level Craft */}
          <motion.button
            type="button"
            id="tab-ai-mode"
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onHeroTabChange('ai');
              onOpenAiAssistant();
            }}
            className={`relative px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center space-x-2 shadow-lg ${
              activeHeroTab === 'ai'
                ? 'bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#ff1e42] text-white shadow-[#e11d48]/40 ring-2 ring-white/30'
                : isDark
                ? 'bg-gradient-to-r from-red-950/40 via-[#161616] to-[#121212] border border-[#e11d48]/50 text-white hover:border-[#ff1e42] shadow-md shadow-[#e11d48]/15'
                : 'bg-white border-2 border-[#e11d48]/60 text-slate-900 hover:border-[#e11d48] shadow-md'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="tracking-tight">{isBn ? 'এআই মোড' : 'AI Mode'}</span>
            <span className="text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-black/40 text-emerald-300 border border-emerald-400/40">
              {isBn ? 'নেক্সট-জেন' : 'Agent Next-Gen'}
            </span>
          </motion.button>

          {/* Products Tab */}
          <motion.button
            type="button"
            id="tab-products"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onHeroTabChange('products')}
            className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 border shadow-xs ${
              activeHeroTab === 'products'
                ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-md shadow-[#e11d48]/30 font-black ring-2 ring-[#e11d48]/30'
                : isDark
                ? 'bg-[#161616] hover:bg-white/10 text-slate-200 border-white/15'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-[#e11d48]" />
            <span>{isBn ? 'পণ্যসমূহ' : 'Products'}</span>
            <span className="text-[10px] opacity-70 font-mono">{toDigits('50,000+')}</span>
          </motion.button>

          {/* Exporters Tab */}
          <motion.button
            type="button"
            id="tab-exporters"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onHeroTabChange('suppliers')}
            className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 border shadow-xs ${
              activeHeroTab === 'suppliers'
                ? 'bg-[#10b981] text-slate-950 border-[#10b981] shadow-md shadow-[#10b981]/30 font-black ring-2 ring-[#10b981]/30'
                : isDark
                ? 'bg-[#161616] hover:bg-white/10 text-slate-200 border-white/15'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#10b981]" />
            <span>{isBn ? 'রপ্তানিকারক' : 'Exporters'}</span>
            <span className="text-[10px] opacity-70 font-mono">{toDigits('5,000+')}</span>
          </motion.button>

          {/* Buyers Tab */}
          <motion.button
            type="button"
            id="tab-buyers"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onHeroTabChange('customers')}
            className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 border shadow-xs ${
              activeHeroTab === 'customers'
                ? 'bg-[#10b981] text-slate-950 border-[#10b981] shadow-md shadow-[#10b981]/30 font-black ring-2 ring-[#10b981]/30'
                : isDark
                ? 'bg-[#161616] hover:bg-white/10 text-slate-200 border-white/15'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#10b981]" />
            <span>{isBn ? 'ক্রেতাসমূহ' : 'Buyers'}</span>
            <span className="text-[10px] opacity-70 font-mono">{isBn ? `${toDigits(140)}+ দেশ` : '140+ Countries'}</span>
          </motion.button>
        </div>

        {/* 2. Bigger, Dynamic Executive Search Bar with Hover Glow & Interactive Click Card */}
        <div ref={searchContainerRef} className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto relative">
          <motion.form
            onSubmit={handleSearchSubmit}
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`rounded-full border-2 transition-all duration-300 shadow-xl flex items-center p-2 sm:p-2.5 ${
              isDark
                ? isSearchFocused
                  ? 'bg-[#151924] border-[#e11d48] ring-4 ring-[#e11d48]/25 shadow-2xl shadow-[#e11d48]/15'
                  : isAiModeEnabled
                  ? 'bg-[#141414] border-[#e11d48] ring-4 ring-[#e11d48]/20'
                  : 'bg-[#141414] hover:bg-[#161a23] border-white/20 hover:border-[#e11d48]/80 ring-4 ring-black/40'
                : isSearchFocused
                ? 'bg-white border-[#e11d48] ring-4 ring-rose-500/20 shadow-2xl shadow-rose-500/10'
                : isAiModeEnabled
                ? 'bg-white border-[#e11d48] ring-4 ring-red-100 shadow-red-100'
                : 'bg-white hover:bg-slate-50 border-slate-700 hover:border-[#e11d48] ring-4 ring-slate-100'
            }`}
          >
            {/* Visual Image Search Lens */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsImageSearchModalOpen(true)}
              className="p-2 sm:px-3 text-slate-400 hover:text-[#e11d48] transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
              title="Visual Search: Upload photo or garment spec"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[11px] font-bold hidden sm:inline">{isBn ? 'লেন্স' : 'Lens'}</span>
            </motion.button>

            {/* Vertical Separator */}
            <div className={`h-7 w-px shrink-0 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

            {/* Search Input (Clicks/Focus triggers Popular Searches List View Card) */}
            <div className="flex-1 px-3 sm:px-4 min-w-0">
              <input
                type="text"
                value={tempSearch}
                onFocus={() => setIsSearchFocused(true)}
                onClick={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setTempSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder={
                  isAiModeEnabled
                    ? (isBn ? 'এআই এজেন্টকে জিজ্ঞাসা করুন: "২৪০ জিএসএম অর্গানিক টি-শার্ট চট্টগ্রাম এফওবি $৩.০০ এর নিচে"' : 'Ask AI Agent: "Find 240 GSM organic combed tees FOB Chattogram under $3.00"')
                    : (isBn ? '৫০,০০০+ রপ্তানি পণ্য, টেক্সটাইল, এইচএস কোড বা প্রত্যয়িত মিল খুঁজুন...' : 'Search 50,000+ export products, fabrics, HS codes, or certified mills...')
                }
                className={`w-full text-xs sm:text-sm md:text-base font-medium focus:outline-none bg-transparent placeholder:font-normal ${
                  isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Clear Button */}
            {tempSearch && (
              <button
                type="button"
                onClick={() => {
                  setTempSearch('');
                  onSearchChange('');
                }}
                className="p-1.5 text-slate-400 hover:text-white mr-1.5 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* AI Agent Mode Toggle Pill */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const nextState = !isAiModeEnabled;
                setIsAiModeEnabled(nextState);
                if (nextState) {
                  onOpenAiAssistant();
                }
              }}
              className={`hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer mr-2 shrink-0 ${
                isAiModeEnabled
                  ? 'bg-[#10b981] text-slate-950 shadow-xs'
                  : isDark
                  ? 'bg-white/10 hover:bg-white/20 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Assist</span>
            </motion.button>

            {/* Big Crimson Search Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#e11d48] hover:bg-[#ff1e42] text-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md shadow-[#e11d48]/30 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </motion.button>
          </motion.form>

          {/* Automatic Popular Searches List-View Card (Opens on Focus/Click) */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl p-3 sm:p-4 shadow-2xl border backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#0f131c]/98 border-white/15 text-white shadow-black/80'
                    : 'bg-white/98 border-slate-200 text-slate-900 shadow-xl'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit">
                  <div className="flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-[#e11d48]" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Popular & Trending Searches
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      Live EPB Sourcing Catalog
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSearchFocused(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* List View of Popular Searches */}
                <div className="space-y-1 max-h-[290px] overflow-y-auto no-scrollbar">
                  {popularSearches.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ x: 4 }}
                      onClick={() => handleSelectSearchItem(item.query)}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                        isDark
                          ? 'hover:bg-white/10 active:bg-white/15'
                          : 'hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-[11px] font-mono font-bold text-slate-500 w-4 shrink-0 text-center">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold group-hover:text-[#e11d48] transition-colors truncate">
                            {item.query}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span className="text-[#10b981] font-semibold">{item.fobHighlight}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full border border-inherit bg-white/5 text-slate-300">
                          {item.badge}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#e11d48] transition-colors transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Quick Industry Pills Bar at Bottom of Card */}
                <div className="mt-2.5 pt-2 border-t border-inherit flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1 shrink-0">
                    <Tag className="w-3 h-3 text-[#10b981]" />
                    <span>Quick:</span>
                  </span>
                  {quickFilterPills.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handleSelectSearchItem(pill)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border-white/10'
                          : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#e11d48] border-slate-200'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Compact Dynamic Dashboard Strip with Maximum Detail Hover Animations */}
        <div
          id="hero-quick-actions"
          className={`pt-2 flex flex-col md:flex-row items-center justify-between gap-2.5 border-t text-xs ${
            isDark ? 'border-white/10' : 'border-slate-200/60'
          }`}
        >
          {/* 1. VERIFIED BUYER Identity with Deep Detail Hover Card */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setIsBuyerBadgeHovered(true)}
            onMouseLeave={() => setIsBuyerBadgeHovered(false)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all shadow-xs ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[11px] text-slate-400 font-mono uppercase">{isBn ? 'ক্রেতা নোড:' : 'Buyer Node:'}</span>
              <span className="text-xs font-black text-[#e11d48] uppercase font-mono tracking-tight flex items-center space-x-1">
                <span>{authUser ? authUser.name : (isBn ? 'যাচাইকৃত ক্রেতা' : 'VERIFIED BUYER')}</span>
                <BadgeCheck className="w-3.5 h-3.5 text-[#10b981]" />
              </span>
            </motion.div>

            {/* Buyer Badge Hover Card with Maximum Commercial Details */}
            <AnimatePresence>
              {isBuyerBadgeHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none w-80"
                >
                  <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#10b981]/60 rounded-2xl p-3.5 shadow-2xl text-white text-[11px] space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center space-x-1.5 font-bold text-[#10b981]">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs">Tier 1 Enterprise Buyer Node</span>
                      </div>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold">
                        100% Escrow
                      </span>
                    </div>

                    <p className="text-slate-300 leading-snug text-[10.5px]">
                      Authenticated sourcing channel with direct access to 5,000+ EPB bonded mills across Dhaka, Narayanganj &amp; Chattogram.
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10 text-[10px] font-mono">
                      <div className="bg-white/5 rounded-lg p-1.5">
                        <span className="text-slate-400 block text-[9px]">SLA Matching:</span>
                        <span className="font-bold text-emerald-300">Under 2 Hours</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-1.5">
                        <span className="text-slate-400 block text-[9px]">Sample Turnaround:</span>
                        <span className="font-bold text-emerald-300">3-5 Day Express</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Highlights (Post RFQ, Top Ranking, TechPack CAD, Bank L/C & Escrow) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 2. Post RFQ */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredAction('rfq')}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenRfq}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-[#e11d48]/15 border-white/10 hover:border-[#e11d48] text-white'
                    : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-[#e11d48] text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#e11d48]" />
                <span>{isBn ? 'আরএফকিউ পোস্ট' : 'Post RFQ'}</span>
              </motion.button>
              <AnimatePresence>
                {hoveredAction === 'rfq' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-64"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#e11d48]/60 rounded-xl p-3 shadow-2xl text-white text-[10.5px] space-y-1.5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="font-bold text-[#ff1e42] flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Instant RFQ Dispatch</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400">Live 24/7</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        Broadcast tech specifications directly to 5,000+ compliant factories. Receive competitive quotes and FOB rates in 2-4 hours.
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-1 border-t border-white/10">
                        <span>FOB Chattogram</span>
                        <span className="text-emerald-400 font-bold">Free Counter Sample</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Top Ranking */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredAction('ranking')}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onHeroTabChange('products')}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-[#10b981]/15 border-white/10 hover:border-[#10b981] text-white'
                    : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-[#10b981] text-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                <span>{isBn ? 'শীর্ষ র‍্যাঙ্কিং' : 'Top Ranking'}</span>
              </motion.button>
              <AnimatePresence>
                {hoveredAction === 'ranking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-64"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#10b981]/60 rounded-xl p-3 shadow-2xl text-white text-[10.5px] space-y-1.5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="font-bold text-[#10b981] flex items-center space-x-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{isBn ? 'ইপিবি রপ্তানি সূচক' : 'EPB Export Volume Index'}</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-300">{isBn ? 'নিরীক্ষিত' : 'Audited'}</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {isBn ? 'প্রকৃত রপ্তানি কন্টেইনার ভলিউম, ক্রেতা পুনঃঅর্ডার হার (গড় ৯৪.৮%) এবং লিড প্ল্যাটিনাম মানদণ্ডে ক্রমবিন্যস্ত।' : 'Ranked by actual shipped container volume, buyer reorder rates (avg 94.8%), and LEED Platinum/Gold environmental audits.'}
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-1 border-t border-white/10">
                        <span>{isBn ? 'ডেলিভারি এসএলএ' : 'Delivery SLA'}</span>
                        <span className="text-emerald-400 font-bold">{toDigits('99.2%')} {isBn ? 'অন-টাইম' : 'On-Time'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. TechPack CAD */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredAction('cad')}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenTechPackStudio}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-[#10b981]/15 border-white/10 hover:border-[#10b981] text-white'
                    : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-[#10b981] text-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#10b981]" />
                <span>{isBn ? 'ক্যাড টেকপ্যাক' : 'TechPack CAD'}</span>
              </motion.button>
              <AnimatePresence>
                {hoveredAction === 'cad' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-64"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#10b981]/60 rounded-xl p-3 shadow-2xl text-white text-[10.5px] space-y-1.5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="font-bold text-[#10b981] flex items-center space-x-1">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{isBn ? 'ইন্টারেক্টিভ স্পেক স্টুডিও' : 'Interactive CAD Spec Studio'}</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-300">BOM Auto</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {isBn ? 'পোশাকের মাপ, ফ্যাব্রিক জিএসএম, সেলাই সহনশীলতা ও ম্যাটেরিয়াল বিল কনফিগার করুন।' : 'Configure garment grading measurements, fabric weights, stitch tolerances, and Bill of Materials for one-click factory sampling.'}
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-1 border-t border-white/10">
                        <span>{isBn ? 'এক্সপোর্ট ফরম্যাট' : 'Export Formats'}</span>
                        <span className="text-emerald-400 font-bold">PDF, DXF, PLT</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Bank L/C & Escrow */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredAction('escrow')}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenShippingCalc}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-[#10b981]/15 border-white/10 hover:border-[#10b981] text-white'
                    : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-[#10b981] text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                <span>{isBn ? 'ব্যাংক এল/সি ও এসক্রো' : 'Bank L/C & Escrow'}</span>
              </motion.button>
              <AnimatePresence>
                {hoveredAction === 'escrow' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-2 z-50 pointer-events-none w-72"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#10b981]/60 rounded-xl p-3 shadow-2xl text-white text-[10.5px] space-y-1.5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="font-bold text-[#10b981] flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>50% JIT Trade Escrow Guarantee</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-300">SWIFT MT700</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        Zero advance capital risk. Payment tranches unlock only upon Chattogram Port on-board Bill of Lading (B/L) and SGS inspection certificate.
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-1 border-t border-white/10">
                        <span>Supported Ports</span>
                        <span className="text-emerald-400 font-bold">Chattogram &amp; Mongla</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Image Search Modal */}
      {isImageSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border ${
              isDark ? 'bg-[#141414] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#e11d48]" />
                <h3 className="font-bold text-sm">Visual Product & Fabric Search</h3>
              </div>
              <button
                onClick={() => setIsImageSearchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center space-y-2 cursor-pointer transition-colors ${
                isDark
                  ? 'border-white/20 hover:border-[#e11d48] bg-white/5'
                  : 'border-slate-200 hover:border-[#e11d48] bg-slate-50/50'
              }`}
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold">Drop your garment photo or fabric swatch</div>
              <div className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP up to 10MB</div>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-400">Or search sample export categories:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Knitwear T-shirt', 'Selvedge Denim', 'Jute Market Bag', 'Bone China Cup'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setTempSearch(sample);
                      onSearchChange(sample);
                      setIsImageSearchModalOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                        : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#e11d48] border-slate-200'
                    }`}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
