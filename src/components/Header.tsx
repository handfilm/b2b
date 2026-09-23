import React, { useState, useEffect, useRef } from 'react';
import {
  Globe2,
  Search,
  FileText,
  Ship,
  Sparkles,
  Building2,
  ExternalLink,
  Users,
  Factory,
  LogIn,
  LogOut,
  ChevronDown,
  MessageCircle,
  Sun,
  Moon,
  ShieldCheck,
  LayoutDashboard,
  Bookmark,
  ShoppingCart,
  Check,
  Package,
} from 'lucide-react';
import { useInquiryCart } from '../context/InquiryCartContext';
import { useI18n } from '../context/I18nContext';
import {
  CurrencyCode,
  CategoryId,
  PersonaMode,
  LanguageCode,
  AuthUser,
} from '../types';
import { CURRENCIES } from '../data/mockData';
import { FEDERATED_DIVISIONS } from '../data/divisions';

interface HeaderProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedDivision?: string;
  onSelectDivision?: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onOpenInquiries: () => void;
  onOpenAutomation?: () => void;
  inquiryCount: number;
  activeView: 'products' | 'suppliers' | 'customers' | 'insights';
  onViewChange: (view: 'products' | 'suppliers' | 'customers' | 'insights') => void;
  persona: PersonaMode;
  onPersonaChange: (p: PersonaMode) => void;
  apiSource?: 'live' | 'fallback';
  onForceSync?: () => void;
  isSyncing?: boolean;
  authUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenTechPackStudio?: () => void;
  activeRfqCount?: number;
  onOpenAiAssistant?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenPipeline?: () => void;
  onNavigateToBuyerDashboard?: (tab?: string) => void;
  onNavigateToSellerDashboard?: () => void;
  onNavigateToCatalog?: (path?: string) => void;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  lang,
  onLanguageChange,
  selectedCategory: _selectedCategory,
  onSelectCategory,
  selectedDivision = 'all',
  onSelectDivision,
  searchQuery,
  onSearchChange,
  onOpenRfq,
  onOpenShippingCalc,
  onOpenInquiries,
  inquiryCount,
  activeView,
  onViewChange,
  persona,
  onPersonaChange,
  authUser,
  onOpenAuth,
  onLogout,
  onOpenTechPackStudio,
  onOpenAiAssistant: _onOpenAiAssistant,
  theme = 'dark',
  onToggleTheme,
  onOpenPipeline,
  onNavigateToBuyerDashboard,
  onNavigateToSellerDashboard,
  onNavigateToCatalog,
  currentPath,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [isRfqMenuOpen, setIsRfqMenuOpen] = useState(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const headerRef = useRef<HTMLElement>(null);

  const { openCart, totalItems: cartCount } = useInquiryCart();
  const { t, toDigits } = useI18n();

  const isDark = theme === 'dark';

  // Sync external searchQuery changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Click outside to close all dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setIsCurrencyMenuOpen(false);
        setIsEcosystemOpen(false);
        setIsRfqMenuOpen(false);
        setIsVerticalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
    if (activeView !== 'products') {
      onViewChange('products');
    }
  };

  const handleDivisionClick = (slug: string) => {
    if (onSelectDivision) {
      onSelectDivision(slug);
    }
    // Synchronize selectedCategory where applicable
    if (slug === 'all') {
      onSelectCategory('all');
    } else if (slug === 'rmg-knits' || slug === 'heavy-outerwear' || slug === 'commercial-blanks') {
      onSelectCategory('rmg-apparel');
    } else if (slug === 'golden-jute') {
      onSelectCategory('jute-eco');
    } else if (
      slug === 'flagship-leather' ||
      slug === 'leather-cuffs' ||
      slug === 'leather-harness' ||
      slug === 'tannery-hides'
    ) {
      onSelectCategory('leather-footwear');
    } else if (slug === 'home-textiles') {
      onSelectCategory('home-textiles');
    }
    if (activeView !== 'products') {
      onViewChange('products');
    }
  };

  return (
    <header
      ref={headerRef}
      id="main-header"
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-white/10 text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* =========================================================================
          TIER 1: TOP STRIP
          ECOSYSTEM (Dropdown) | Light/Dark | EN/বাংলা | USD ($) | RFQ (Dropdown)
          ========================================================================= */}
      <div
        id="header-top-strip"
        className={`text-xs py-1.5 px-3 sm:px-4 border-b transition-colors ${
          isDark
            ? 'bg-[#111111]/90 border-white/10 text-slate-300'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-2 sm:gap-4 px-1 sm:px-2">
          {/* Left: ECOSYSTEM Dropdown Menu */}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onOpenPipeline}
              className="flex items-center space-x-1.5 shrink-0 cursor-pointer group"
              title="Click to inspect NexOS Data Ingestion Pipeline"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
            </button>

            {/* ECOSYSTEM Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                id="header-ecosystem-dropdown-btn"
                onClick={() => setIsEcosystemOpen(!isEcosystemOpen)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="font-extrabold uppercase tracking-wider text-[11px]">ECOSYSTEM</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isEcosystemOpen ? 'rotate-180' : ''}`} />
              </button>

              {isEcosystemOpen && (
                <div
                  onMouseLeave={() => setIsEcosystemOpen(false)}
                  className={`absolute left-0 top-full mt-1 w-56 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in ${
                    isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-inherit">
                    NexOS Ecosystem
                  </div>
                  <div className="py-1 space-y-0.5 text-xs">
                    <a
                      href="https://admin.handsandhead.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsEcosystemOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg font-semibold hover:bg-[#e11d48]/10 hover:text-[#ff1e42] transition-colors"
                    >
                      <span>Admin Nexus</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://shop.handsandhead.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsEcosystemOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg font-semibold hover:bg-[#e11d48]/10 hover:text-[#ff1e42] transition-colors"
                    >
                      <span>D2C Portal</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://rmg.handsandhead.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsEcosystemOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg font-semibold hover:bg-[#e11d48]/10 hover:text-[#ff1e42] transition-colors"
                    >
                      <span>Commercial RMG</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://arutemika.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsEcosystemOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg font-semibold hover:bg-[#e11d48]/10 hover:text-[#ff1e42] transition-colors"
                    >
                      <span>Leather Atelier</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Light/Dark + EN/বাংলা + USD ($) + RFQ Dropdown */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 text-xs">
            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                id="header-theme-toggle"
                onClick={onToggleTheme}
                className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                }`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] sm:text-[11px] font-bold hidden xs:inline sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-slate-700" />
                    <span className="text-[10px] sm:text-[11px] font-bold hidden xs:inline sm:inline">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Language Toggle [EN | বাংলা] */}
            <div
              className={`flex items-center rounded-lg p-0.5 border ${
                isDark ? 'bg-black/50 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                id="header-lang-en"
                onClick={() => onLanguageChange('EN')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                  lang === 'EN'
                    ? 'bg-[#e11d48] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                id="header-lang-bn"
                onClick={() => onLanguageChange('BN')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                  lang === 'BN'
                    ? 'bg-[#e11d48] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Currency Selector [USD ($)] */}
            <div className="relative">
              <button
                type="button"
                id="header-currency-btn"
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className={`flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer border ${
                  isDark
                    ? 'bg-black/50 border-white/10 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Globe2 className="w-3 h-3 text-slate-400" />
                <span>{currentCurrency}</span>
                <span className="hidden sm:inline">({CURRENCIES[currentCurrency]?.symbol || '$'})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div
                  onMouseLeave={() => setIsCurrencyMenuOpen(false)}
                  className={`absolute right-0 top-full mt-1 w-36 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in ${
                    isDark
                      ? 'bg-[#141414] border-white/15 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Currency
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => {
                          onCurrencyChange(curr);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`px-2 py-1 rounded text-xs font-bold text-left transition-colors cursor-pointer ${
                          currentCurrency === curr
                            ? 'bg-[#e11d48] text-white'
                            : isDark
                            ? 'hover:bg-white/10 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {curr} ({CURRENCIES[curr].symbol})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RFQ Dropdown Menu (Contains TechPack, Post RFQ, Freight Matrix) */}
            <div className="relative">
              <button
                type="button"
                id="header-rfq-dropdown-btn"
                onClick={() => setIsRfqMenuOpen(!isRfqMenuOpen)}
                className="flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] sm:text-xs font-black transition-all cursor-pointer shadow-xs"
              >
                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>RFQ</span>
                <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80 transition-transform ${isRfqMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRfqMenuOpen && (
                <div
                  onMouseLeave={() => setIsRfqMenuOpen(false)}
                  className={`absolute right-0 top-full mt-1 w-52 rounded-xl shadow-2xl border p-1.5 z-50 animate-in fade-in ${
                    isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-inherit">
                    Commercial RFQ Suite
                  </div>
                  <div className="py-1 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRfqMenuOpen(false);
                        onOpenTechPackStudio?.();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-2.5 py-2 rounded-lg font-bold hover:bg-[#10b981]/15 hover:text-[#10b981] transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>{t.techPackStudio}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRfqMenuOpen(false);
                        onOpenRfq();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-2.5 py-2 rounded-lg font-bold hover:bg-[#e11d48]/15 hover:text-[#ff1e42] transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
                      <span>{t.postRfq}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRfqMenuOpen(false);
                        onOpenShippingCalc();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-2.5 py-2 rounded-lg font-bold hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Ship className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>{t.feederShipping}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: PRIMARY NAVBAR
          & (Logo) Made in BD | [All Verticals ▾] [ Search... 🔍 ] | Buyer Portal / Mills Hub | Sign In
          ========================================================================= */}
      <div
        id="header-primary-navbar"
        className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2"
      >
        {/* Top / Desktop Main Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
          {/* Left: Logo "&" inside red circle beside "Made in BD" (strictly no b2b portal text) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <div
              id="brand-logo"
              onClick={() => {
                onViewChange('products');
                handleDivisionClick('all');
                onSearchChange('');
              }}
              className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer group shrink-0"
              title="Made in BD"
            >
              {/* Red circle badge with ONLY "&" */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#e11d48] flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-md group-hover:scale-105 group-hover:bg-[#ff1e42] transition-all shrink-0">
                &amp;
              </div>
              <span
                className={`font-black text-base sm:text-xl tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Made in BD
              </span>
            </div>

            {onNavigateToCatalog && (
              <button
                type="button"
                id="header-b2b-catalog-btn"
                onClick={() => onNavigateToCatalog('/catalog')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 sm:space-x-1.5 border shrink-0 ${
                  currentPath?.startsWith('/catalog')
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 border-rose-500 text-white shadow-md shadow-rose-950/40'
                    : isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
                title="B2B Catalog"
              >
                <Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">B2B Catalog</span>
              </button>
            )}
          </div>

          {/* Center: Subtle Verticals Dropdown + Tiny Search Bar (Desktop only, hidden on mobile) */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-2 items-center space-x-1.5">
          {/* Subtle Verticals Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="header-verticals-dropdown-btn"
              onClick={() => setIsVerticalMenuOpen(!isVerticalMenuOpen)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="All Verticals (2,749)"
            >
              <span className="max-w-[130px] truncate">
                {selectedDivision === 'all'
                  ? (lang === 'BN' ? 'সব বিভাগ' : 'All Verticals')
                  : FEDERATED_DIVISIONS.find((d) => d.slug === selectedDivision)?.pavilionLabel || 'Vertical'}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isVerticalMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isVerticalMenuOpen && (
              <div
                onMouseLeave={() => setIsVerticalMenuOpen(false)}
                className={`absolute left-0 top-full mt-1.5 w-64 rounded-xl shadow-2xl border p-1.5 z-50 max-h-80 overflow-y-auto ${
                  isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  {lang === 'BN' ? 'রপ্তানি বিভাগসমূহ' : 'Export Verticals'} ({toDigits(2749)})
                </div>
                {FEDERATED_DIVISIONS.map((div) => {
                  const isSelected = selectedDivision === div.slug;
                  return (
                    <button
                      key={div.slug}
                      type="button"
                      onClick={() => {
                        handleDivisionClick(div.slug);
                        setIsVerticalMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#e11d48] text-white'
                          : isDark
                          ? 'hover:bg-white/10 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{div.pavilionLabel}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tiny Search Bar with magnifier clipart, no extra text */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 min-w-0 flex items-center"
          >
            <div
              className={`w-full flex items-center rounded-xl border transition-all ${
                isDark
                  ? 'bg-[#141414] border-white/15 focus-within:border-[#e11d48]'
                  : 'bg-slate-50 border-slate-300 focus-within:border-[#e11d48]'
              }`}
            >
              <input
                type="text"
                id="global-search-input"
                placeholder={persona === 'buyer' ? t.searchPlaceholderBuyer : t.searchPlaceholderSeller}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`flex-1 min-w-0 px-2.5 py-1.5 text-xs focus:outline-none bg-transparent ${
                  isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />

              {/* Tiny magnifier clipart search button, no extra text */}
              <button
                type="submit"
                id="global-search-submit-btn"
                className="px-2.5 py-1.5 bg-[#e11d48] hover:bg-[#ff1e42] text-white rounded-r-xl transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Buyer Portal / Mills Hub, Inquiries, Cart, Sign In */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Persona Switcher: [Buyer Portal] / [Mills Hub] */}
          <div
            id="persona-switcher"
            className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-[#141414] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              id="persona-buyer-btn"
              onClick={() => onPersonaChange('buyer')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                persona === 'buyer'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.buyerPortal}
            </button>
            <button
              type="button"
              id="persona-seller-btn"
              onClick={() => onPersonaChange('seller')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                persona === 'seller'
                  ? 'bg-[#10b981] text-slate-950 shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-3 h-3" />
              <span>{t.manufacturerHub}</span>
            </button>
          </div>

          {/* Inquiries / Messages */}
          <button
            type="button"
            id="header-inquiries-btn"
            onClick={onOpenInquiries}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Inquiries & RFQ Messages"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white font-bold text-[9px] px-1 py-0.2 rounded-full min-w-4 text-center">
              {inquiryCount > 0 ? inquiryCount : 4}
            </span>
          </button>

          {/* Inquiry Cart */}
          <button
            type="button"
            id="header-inquiry-cart-btn"
            onClick={openCart}
            className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              cartCount > 0
                ? 'bg-[#e11d48]/15 hover:bg-[#e11d48]/25 border-[#e11d48]/50 text-white shadow-md shadow-[#e11d48]/20'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="B2B Inquiry Cart"
          >
            <ShoppingCart className={`w-4 h-4 ${cartCount > 0 ? 'text-[#ff1e42]' : 'text-slate-300'}`} />
            {cartCount > 0 && (
              <span className="bg-[#e11d48] text-white font-bold text-[9px] px-1 py-0.2 rounded-full min-w-4 text-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sign In / Profile */}
          {authUser ? (
            <div className="relative shrink-0">
              <button
                type="button"
                id="header-user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {authUser.name.charAt(0)}
                </div>
                <span className="max-w-[70px] truncate hidden sm:inline">{authUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className={`absolute right-0 top-full mt-1.5 w-60 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in ${
                    isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="px-3 py-2.5 border-b border-inherit text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e11d48] text-white font-black flex items-center justify-center text-xs">
                        {authUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-sm leading-tight truncate">{authUser.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{authUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-inherit">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span className="text-[10px] font-mono font-bold text-[#10b981]">
                        {authUser.role === 'buyer' ? 'Verified Enterprise Buyer' : 'Verified Exporter Mill'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1.5 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onNavigateToBuyerDashboard) {
                          onNavigateToBuyerDashboard('overview');
                        } else {
                          onViewChange('insights');
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>My Sourcing Hub</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] font-mono font-bold">
                        Live
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onNavigateToBuyerDashboard) {
                          onNavigateToBuyerDashboard('orders');
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Orders & Escrow</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                        $142.5k
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onNavigateToBuyerDashboard) {
                          onNavigateToBuyerDashboard('rfqs');
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-[#e11d48]" />
                        <span>RFQs & Live Quotes</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#e11d48]/20 text-[#ff1e42] font-mono">
                        8 Active
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onNavigateToBuyerDashboard) {
                          onNavigateToBuyerDashboard('favorites');
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Saved Products</span>
                    </button>

                    {onNavigateToSellerDashboard && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateToSellerDashboard();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Exporter Console</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-inherit">
                    <button
                      type="button"
                      onClick={() => {
                        onLogout?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#ff1e42] font-bold hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'BN' ? 'সাইন আউট' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="header-sign-in-btn"
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'BN' ? 'সাইন ইন' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Row: All Verticals Dropdown + Search Bar (Cleanly side-by-side, 100% full width, zero collision!) */}
      <div className="flex md:hidden items-center space-x-2 w-full mt-2 pt-1.5 border-t border-white/10 dark:border-white/10 border-slate-200">
        {/* Mobile All Verticals Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            id="header-verticals-dropdown-btn-mobile"
            onClick={() => setIsVerticalMenuOpen(!isVerticalMenuOpen)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
            title="All Verticals (2,749)"
          >
            <span className="max-w-[110px] truncate">
              {selectedDivision === 'all'
                ? (lang === 'BN' ? 'সব বিভাগ' : 'All Verticals')
                : FEDERATED_DIVISIONS.find((d) => d.slug === selectedDivision)?.pavilionLabel || 'Vertical'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isVerticalMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isVerticalMenuOpen && (
            <div
              onMouseLeave={() => setIsVerticalMenuOpen(false)}
              className={`absolute left-0 top-full mt-1.5 w-64 max-w-[85vw] rounded-xl shadow-2xl border p-1.5 z-50 max-h-80 overflow-y-auto ${
                isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                {lang === 'BN' ? 'রপ্তানি বিভাগসমূহ' : 'Export Verticals'} ({toDigits(2749)})
              </div>
              {FEDERATED_DIVISIONS.map((div) => {
                const isSelected = selectedDivision === div.slug;
                return (
                  <button
                    key={`mob-${div.slug}`}
                    type="button"
                    onClick={() => {
                      handleDivisionClick(div.slug);
                      setIsVerticalMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e11d48] text-white'
                        : isDark
                        ? 'hover:bg-white/10 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{div.pavilionLabel}</span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 min-w-0 flex items-center"
        >
          <div
            className={`w-full flex items-center rounded-xl border transition-all ${
              isDark
                ? 'bg-[#141414] border-white/15 focus-within:border-[#e11d48]'
                : 'bg-slate-50 border-slate-300 focus-within:border-[#e11d48]'
            }`}
          >
            <input
              type="text"
              id="global-search-input-mobile"
              placeholder={persona === 'buyer' ? t.searchPlaceholderBuyer : t.searchPlaceholderSeller}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`flex-1 min-w-0 px-2.5 py-1.5 text-xs focus:outline-none bg-transparent ${
                isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              id="global-search-submit-btn-mobile"
              className="px-2.5 py-1.5 bg-[#e11d48] hover:bg-[#ff1e42] text-white rounded-r-xl transition-colors flex items-center justify-center cursor-pointer shrink-0"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
      </div>
    </header>
  );
};
