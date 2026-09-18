import React, { useState } from 'react';
import {
  Globe2,
  Search,
  Camera,
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
  Zap,
} from 'lucide-react';
import {
  CurrencyCode,
  CategoryId,
  PersonaMode,
  LanguageCode,
  AuthUser,
} from '../types';
import { CURRENCIES } from '../data/mockData';
import { FEDERATED_DIVISIONS } from '../data/divisions';
import { getTranslation } from '../i18n/translations';

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
  onOpenAutomation: () => void;
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
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  lang,
  onLanguageChange,
  selectedCategory,
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
  onOpenAiAssistant,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const isDark = theme === 'dark';

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
    // Also synchronize selectedCategory where applicable
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
      id="main-header"
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-white/10 text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* =========================================================================
          TIER 1: TOP STRIP (Ultra-compact, dark glass)
          ========================================================================= */}
      <div
        id="header-top-strip"
        className={`text-xs py-1.5 px-4 border-b transition-colors ${
          isDark
            ? 'bg-[#111111]/90 border-white/10 text-slate-300'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: NexOS Sync indicator (green dot) + Ecosystem links */}
          <div className="flex items-center space-x-3 truncate">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="font-mono text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                NEXOS FAIL-SAFE SYNC
              </span>
            </div>

            <span className="text-slate-500 hidden sm:inline">|</span>

            {/* Ecosystem links */}
            <div className="hidden sm:flex items-center space-x-3 text-[11px] truncate text-slate-400">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Ecosystem:</span>
              <a
                href="https://admin.handsandhead.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff1e42] transition-colors flex items-center space-x-0.5 font-semibold"
                title="Admin Control Nexus"
              >
                <span>Admin Nexus</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>•</span>
              <a
                href="https://shop.handsandhead.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff1e42] transition-colors flex items-center space-x-0.5 font-semibold"
                title="D2C Commercial Portal"
              >
                <span>D2C Portal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>•</span>
              <a
                href="https://rmg.handsandhead.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff1e42] transition-colors flex items-center space-x-0.5 font-semibold"
                title="Commercial Knit & Denim Cluster"
              >
                <span>Commercial Knit &amp; Denim</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>•</span>
              <a
                href="https://arutemika.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff1e42] transition-colors flex items-center space-x-0.5 font-semibold"
                title="Flagship Leather Atelier"
              >
                <span>Leather Atelier</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Right: Theme Toggle + Language Toggle + Currency + Port Freight Matrix */}
          <div className="flex items-center space-x-2.5 shrink-0 text-xs">
            {/* Dark / Light Theme Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                id="header-theme-toggle"
                onClick={onToggleTheme}
                className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                }`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span className="text-[11px] font-bold">Dark</span>
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
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
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
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  lang === 'BN'
                    ? 'bg-[#e11d48] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Port Freight Matrix */}
            <button
              type="button"
              id="header-freight-matrix-btn"
              onClick={onOpenShippingCalc}
              className="hidden md:flex items-center space-x-1 text-slate-400 hover:text-[#10b981] transition-colors cursor-pointer font-medium text-[11px]"
              title="Open Port Freight Matrix & Customs Calculator"
            >
              <Ship className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Port Freight Matrix</span>
            </button>

            {/* Currency Selector [USD $] */}
            <div className="relative">
              <button
                type="button"
                id="header-currency-btn"
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer border ${
                  isDark
                    ? 'bg-black/50 border-white/10 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Globe2 className="w-3 h-3 text-slate-400" />
                <span>{currentCurrency} ({CURRENCIES[currentCurrency]?.symbol || '$'})</span>
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
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: PRIMARY NAVBAR (One unified row)
          ========================================================================= */}
      <div
        id="header-primary-navbar"
        className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 sm:gap-4"
      >
        {/* Left: Logo with "&" inside red circle beside "Made in BD" + Persona Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          <div
            id="brand-logo"
            onClick={() => {
              onViewChange('products');
              handleDivisionClick('all');
              onSearchChange('');
            }}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            title="Made in BD - B2B Bangladesh Wholesale Export Portal"
          >
            {/* Red circle badge with ONLY "&" */}
            <div className="w-9 h-9 rounded-full bg-[#e11d48] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 group-hover:bg-[#ff1e42] transition-all shrink-0">
              &amp;
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`font-black text-xl tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Made in BD
              </span>
              <span className="hidden sm:inline text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/30 font-mono tracking-wider">
                B2B PORTAL
              </span>
            </div>
          </div>

          {/* Persona Switcher: [Buyer Portal] / [Manufacturer Hub] */}
          <div
            id="persona-switcher"
            className={`hidden md:flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-[#141414] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              id="persona-buyer-btn"
              onClick={() => onPersonaChange('buyer')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                persona === 'buyer'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Buyer Portal</span>
            </button>
            <button
              type="button"
              id="persona-seller-btn"
              onClick={() => onPersonaChange('seller')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                persona === 'seller'
                  ? 'bg-[#10b981] text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-3 h-3" />
              <span>Manufacturer Hub</span>
            </button>
          </div>
        </div>

        {/* Center: Central Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-2 hidden lg:flex items-center"
        >
          <div
            className={`w-full flex items-center rounded-xl border transition-all ${
              isDark
                ? 'bg-[#141414] border-white/15 focus-within:border-[#e11d48]'
                : 'bg-slate-50 border-slate-300 focus-within:border-[#e11d48]'
            }`}
          >
            {/* Visual Search / Lens button */}
            <button
              type="button"
              onClick={() => {
                onSearchChange('selvedge organic leather');
                setSearchInput('selvedge organic leather');
              }}
              className={`p-2.5 border-r cursor-pointer transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white border-white/10 hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
              }`}
              title="RAWx Visual Lens / Spec Match"
            >
              <Camera className="w-4 h-4 text-[#10b981]" />
            </button>

            {/* Textual input */}
            <input
              type="text"
              id="global-search-input"
              placeholder="Search 50,000+ export products, fabrics, HS codes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`flex-1 px-3 py-2 text-xs focus:outline-none bg-transparent ${
                isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />

            {/* Crimson Red "RAWx Search" button */}
            <button
              type="submit"
              id="global-search-submit-btn"
              className="px-4 py-2 bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black rounded-r-xl transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
              title="Run Sourcing Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>RAWx Search</span>
            </button>
          </div>
        </form>

        {/* Right Actions: [RAWx Bot] [TechPack Studio] [Post RFQ] [Inquiries] [Sign In / Profile] */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* 1. RAWx Bot (24/7 AI Sourcing Assistant) */}
          <button
            type="button"
            id="header-rawx-bot-btn"
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white text-xs font-black shadow-md shadow-[#e11d48]/20 flex items-center space-x-1.5 cursor-pointer transition-all shrink-0"
            title="Launch RAWx Bot Trade Agent"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="hidden sm:inline">RAWx Bot</span>
          </button>

          {/* 2. TechPack Studio */}
          <button
            type="button"
            id="header-techpack-studio-btn"
            onClick={onOpenTechPackStudio}
            className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Open Interactive TechPack Studio"
          >
            <FileText className="w-3.5 h-3.5 text-[#10b981]" />
            <span>TechPack Studio</span>
          </button>

          {/* 3. Post RFQ */}
          <button
            type="button"
            id="header-post-rfq-btn"
            onClick={onOpenRfq}
            className="px-3 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#22c55e] text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center space-x-1 shadow-sm shrink-0"
            title="Post Commercial RFQ for 5,000+ Mills"
          >
            <span>Post RFQ</span>
          </button>

          {/* 4. Inquiries / Messages */}
          <button
            type="button"
            id="header-inquiries-btn"
            onClick={onOpenInquiries}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Inquiries & RFQ Messages"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full min-w-4 text-center">
              {inquiryCount > 0 ? inquiryCount : 4}
            </span>
          </button>

          {/* 5. User Account / Sign In */}
          {authUser ? (
            <div className="relative">
              <button
                type="button"
                id="header-user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-black">
                  {authUser.name.charAt(0)}
                </div>
                <span className="max-w-[70px] truncate">{authUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className={`absolute right-0 top-full mt-1 w-52 rounded-xl shadow-2xl border p-2 z-50 animate-in fade-in ${
                    isDark ? 'bg-[#141414] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-inherit text-xs">
                    <p className="font-bold">{authUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{authUser.email}</p>
                    <span className="text-[9px] font-mono font-bold text-[#10b981] mt-0.5 block">
                      Role: {authUser.role === 'buyer' ? 'Global Buyer' : 'Manufacturer'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout?.();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#ff1e42] font-bold hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-1.5 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
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
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TIER 3: SECONDARY PAVILION BAR (Single cohesive rail beneath header - NO duplicates)
          ========================================================================= */}
      <div
        id="header-pavilion-rail"
        className={`border-t py-2 px-4 overflow-x-auto no-scrollbar transition-colors ${
          isDark
            ? 'bg-[#0e0e0e] border-white/10'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Horizontal scrollable pills with active indicators */}
          <div className="flex items-center space-x-2 shrink-0 overflow-x-auto no-scrollbar py-0.5">
            {FEDERATED_DIVISIONS.map((div) => {
              const isActive = selectedDivision === div.slug;
              return (
                <button
                  key={div.slug}
                  type="button"
                  id={`pavilion-pill-${div.slug}`}
                  onClick={() => handleDivisionClick(div.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/20 font-black'
                      : isDark
                      ? 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title={`${div.divisionTitle}: ${div.tagline}`}
                >
                  <span>{div.pavilionLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Quick view switchers for Verified Mills & Global Buyers (Right side of rail) */}
          <div className="hidden xl:flex items-center space-x-2 shrink-0 border-l border-inherit pl-3">
            <button
              type="button"
              onClick={() => onViewChange('suppliers')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                activeView === 'suppliers'
                  ? 'bg-[#10b981] text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="EPB Certified Mills"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Exporters</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('customers')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                activeView === 'customers'
                  ? 'bg-[#10b981] text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Global Sourcing Buyers"
            >
              <Users className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Buyers</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
