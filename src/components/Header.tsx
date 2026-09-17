import React, { useState } from 'react';
import {
  Globe2,
  Search,
  ShieldCheck,
  FileText,
  Ship,
  Inbox,
  Sparkles,
  Building2,
  ExternalLink,
  Users,
  Factory,
  CheckCircle2,
  Zap,
  LogIn,
  LogOut,
  Layers,
  UserCheck,
  ChevronDown,
  Phone,
  MessageCircle,
  Bot,
} from 'lucide-react';
import {
  CurrencyCode,
  CategoryId,
  PersonaMode,
  LanguageCode,
  AuthUser,
} from '../types';
import { CURRENCIES, CATEGORIES } from '../data/mockData';
import { getTranslation } from '../i18n/translations';

interface HeaderProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
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
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  lang,
  onLanguageChange,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenRfq,
  onOpenShippingCalc,
  onOpenInquiries,
  onOpenAutomation,
  inquiryCount,
  activeView,
  onViewChange,
  persona,
  onPersonaChange,
  apiSource = 'live',
  onForceSync,
  isSyncing = false,
  authUser,
  onOpenAuth,
  onLogout,
  onOpenTechPackStudio,
  activeRfqCount = 3,
  onOpenAiAssistant,
}) => {
  const t = getTranslation(lang);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      {/* Top Nexus Ecosystem & Trust Bar */}
      <div className="bg-[#050505] text-slate-300 text-xs py-1.5 px-4 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Nexus Status & Discrete Ecosystem Cross-Routing */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span
              onClick={onForceSync}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 tracking-wide uppercase cursor-pointer hover:bg-[#ff5500]/20 transition-colors"
              title="Click to force live real-time synchronization"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] mr-1.5 animate-ping"></span>
              {apiSource === 'live' ? t.nexusLive : t.nexusFallback}
              {isSyncing && <span className="ml-1 text-[9px] text-white">...</span>}
            </span>

            {/* Discrete Ecosystem Cross-Links */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                {t.ecosystem}:
              </span>
              <a
                href="https://admin.handsandhead.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center space-x-1 transition-colors group"
                title="Master B2B Operations & Backoffice"
              >
                <span className="group-hover:text-[#ff5500] transition-colors">Admin Nexus</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-[#ff5500]" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://arutemika.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center space-x-1 transition-colors group"
                title="Artisanal Heritage & RAWx Leathercraft"
              >
                <span className="group-hover:text-[#ff5500] transition-colors">RAWx & ARUTEMIKA</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-[#ff5500]" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://rmg.handsandhead.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center space-x-1 transition-colors group"
                title="Specialized RMG & Garment Manufacturing"
              >
                <span className="group-hover:text-[#ff5500] transition-colors">RMG Hub</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-[#ff5500]" />
              </a>
            </div>
          </div>

          {/* Right: Language Toggle, Shipping Matrix & Currency Selector */}
          <div className="flex items-center space-x-3 text-xs">
            {/* EN / বাংলা Language Toggle */}
            <div
              id="language-toggle-group"
              className="flex items-center bg-[#171717] rounded-lg border border-white/10 p-0.5 text-[11px] font-bold"
            >
              <button
                id="lang-btn-en"
                onClick={() => onLanguageChange('EN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  lang === 'EN'
                    ? 'bg-[#ff5500] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-bn"
                onClick={() => onLanguageChange('BN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  lang === 'BN'
                    ? 'bg-[#ff5500] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            <span className="text-slate-800">|</span>

            <button
              onClick={onOpenShippingCalc}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <Ship className="w-3.5 h-3.5 text-[#ff5500]" />
              <span className="hidden sm:inline">{t.freightMatrix}</span>
            </button>

            <span className="text-slate-800">|</span>

            <div className="flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="header-currency-selector"
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-[#171717] text-white rounded-md border border-white/10 px-2 py-0.5 text-xs focus:outline-none focus:border-[#ff5500] cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-5">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div
              id="brand-logo-button"
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => {
                onViewChange('products');
                onSelectCategory('all');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#b83800] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#ff5500]/20 group-hover:scale-105 transition-transform">
                BD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-lg tracking-tight text-white">
                    {t.portalTitle}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30">
                    B2B Portal
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  b2b.handsandhead.com
                </div>
              </div>
            </div>
          </div>

          {/* Persona Switcher: High-Visibility Dual Ecosystem */}
          <div className="hidden sm:flex items-center bg-[#141414] p-1 rounded-xl border border-white/10 shadow-inner shrink-0">
            <button
              id="persona-switcher-buyer"
              onClick={() => onPersonaChange('buyer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'buyer'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${persona === 'buyer' ? 'text-[#ff5500]' : ''}`} />
              <span>Buyer</span>
            </button>

            <button
              id="persona-switcher-seller"
              onClick={() => onPersonaChange('seller')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'seller'
                  ? 'bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Factory</span>
            </button>
          </div>

          {/* Sourcing Search Box (Buyer Mode) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex rounded-xl border border-white/10 focus-within:border-[#ff5500] focus-within:ring-2 focus-within:ring-[#ff5500]/20 bg-[#121212]/80 overflow-hidden transition-all">
              <select
                id="search-category-filter"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as CategoryId)}
                className="bg-[#171717] border-r border-white/10 text-xs font-medium text-slate-300 px-2.5 py-2 focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#121212] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  id="global-product-search-input"
                  type="text"
                  placeholder={
                    persona === 'buyer'
                      ? t.searchPlaceholderBuyer
                      : t.searchPlaceholderSeller
                  }
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs md:text-sm text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="mr-2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    {t.clearFilter}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs: TechPack Studio, Super Automation, Post RFQ, Inquiries, and Auth User Pill */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* AI Instant Trade Assistant with On-Hover Preview */}
            {onOpenAiAssistant && (
              <div className="relative group">
                <button
                  id="header-ai-assistant-button"
                  onClick={onOpenAiAssistant}
                  className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff5500]/15 to-purple-600/15 hover:from-[#ff5500]/25 hover:to-purple-600/25 text-white border border-[#ff5500]/30 text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#ff5500] group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline">AI Trade</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#ff5500] text-white font-mono uppercase font-black">24/7</span>
                </button>
                {/* On-Hover Preview Tooltip */}
                <div className="absolute top-full right-0 mt-2 w-64 p-2.5 rounded-xl bg-[#0e0e0e] border border-white/15 text-white text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                  <div className="font-bold text-[#ff5500] flex items-center space-x-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Instant Sourcing Assistant</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Query FOB price tiers, Accord audits, fabric GSM, and sample turnaround SLA across 2,400+ factories.
                  </p>
                </div>
              </div>
            )}

            {/* TechPack Studio Quick Launcher with On-Hover Preview */}
            <div className="relative group">
              <button
                id="header-techpack-studio-button"
                onClick={onOpenTechPackStudio}
                className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-xl bg-[#ff5500]/10 hover:bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/30 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#ff5500] group-hover:rotate-12 transition-transform" />
                <span className="hidden xl:inline">TechPack</span>
              </button>
              {/* On-Hover Preview Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-60 p-2.5 rounded-xl bg-[#0e0e0e] border border-white/15 text-white text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div className="font-bold text-white flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>CAD & TechPack Studio</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Interactive size grading, Pantone TCX swatch selector, and instant FOB cost calculation.
                </p>
              </div>
            </div>

            {/* Super Automation Desk Trigger with On-Hover Preview */}
            <div className="relative group hidden sm:block">
              <button
                id="header-super-automation-button"
                onClick={onOpenAutomation}
                className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff5500]/15 to-[#ff7700]/20 hover:bg-[#ff5500]/30 text-[#ff5500] border border-[#ff5500]/40 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-[#ff5500] text-[#ff5500] group-hover:scale-110 transition-transform" />
                <span className="hidden 2xl:inline">{t.superAutomation}</span>
              </button>
              {/* On-Hover Preview Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-60 p-2.5 rounded-xl bg-[#0e0e0e] border border-white/15 text-white text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div className="font-bold text-white flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>Super Automation Hub</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Automated ERP synchronization, currency hedge rates, and real-time vessel schedules.
                </p>
              </div>
            </div>

            {/* Post RFQ Button with On-Hover Preview */}
            <div className="relative group">
              <button
                id="header-post-rfq-button"
                onClick={onOpenRfq}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 hover:shadow-[#ff5500]/40 transition-all cursor-pointer truncate"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.postRfq}</span>
                <span className="sm:hidden">RFQ</span>
              </button>
              {/* On-Hover Preview Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-60 p-2.5 rounded-xl bg-[#0e0e0e] border border-white/15 text-white text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div className="font-bold text-white flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>Broadcast Direct RFQ</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Distribute buying requirements to 2,400+ vetted factories for verified competitive quotes.
                </p>
              </div>
            </div>

            {/* Inquiries Drawer Button with On-Hover Preview */}
            <div className="relative group">
              <button
                id="header-inquiries-drawer-button"
                onClick={onOpenInquiries}
                className="relative p-2 rounded-xl border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white bg-[#141414] hover:bg-[#1c1c1c] transition-colors cursor-pointer"
                title="Track Orders, Samples & RFQ Dispatch"
              >
                <Inbox className="w-4 h-4" />
                {inquiryCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff5500] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#0a0a0a]">
                    {inquiryCount}
                  </span>
                )}
              </button>
              {/* On-Hover Tooltip */}
              <div className="absolute top-full right-0 mt-2 w-52 p-2 rounded-xl bg-[#0e0e0e] border border-white/15 text-white text-[11px] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <span className="font-bold text-[#ff5500] block">Orders & Inquiries</span>
                Track dispatched RFQs, custom sample requests, and supplier messages.
              </div>
            </div>

            {/* Auth State: Lean Sign In Button or Authenticated User Pill */}
            {!authUser ? (
              <button
                id="header-auth-signin-button"
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-extrabold shadow-md transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  id="header-user-pill-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#ff5500]/40 text-xs text-white font-bold transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div className="text-left hidden md:block">
                    <span className="text-[9px] text-[#ff5500] font-black uppercase tracking-wider block">
                      {persona === 'buyer' ? `Buyer • ${activeRfqCount} RFQs` : `Console • ${inquiryCount || 5} Inq`}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[100px] block">
                      {authUser.companyName || authUser.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    id="header-user-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in space-y-3"
                  >
                    <div className="border-b border-white/10 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-[#ff5500]/20 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500] font-bold text-xs">
                          {authUser.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-white truncate">{authUser.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{authUser.companyName}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1.5 font-mono">
                        <Phone className="w-3 h-3 text-[#ff5500]" />
                        <span>{authUser.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block px-1">
                        Active Mode Switcher
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onPersonaChange('buyer');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                          persona === 'buyer'
                            ? 'bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>International Buyer</span>
                        {persona === 'buyer' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onPersonaChange('seller');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                          persona === 'seller'
                            ? 'bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>BD Manufacturer / Exporter</span>
                        {persona === 'seller' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Persona Switcher */}
        <div className="mt-2.5 sm:hidden flex items-center bg-[#141414] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => onPersonaChange('buyer')}
            className={`flex-1 py-1 text-xs font-bold rounded-lg ${
              persona === 'buyer' ? 'bg-white text-black' : 'text-slate-400'
            }`}
          >
            {t.buyerPortal}
          </button>
          <button
            onClick={() => onPersonaChange('seller')}
            className={`flex-1 py-1 text-xs font-bold rounded-lg ${
              persona === 'seller' ? 'bg-[#ff5500] text-white' : 'text-slate-400'
            }`}
          >
            {t.manufacturerHub}
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              id="mobile-product-search-input"
              type="text"
              placeholder={persona === 'buyer' ? t.searchPlaceholderBuyer : t.searchPlaceholderSeller}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#141414] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
            />
          </div>
        </div>

        {/* Navigation Tabs (Products vs. Suppliers vs. Customers vs. Export Insights) */}
        <div className="flex items-center justify-between border-t border-white/[0.08] mt-2.5 pt-2">
          <nav className="flex space-x-1 sm:space-x-2 text-xs font-bold overflow-x-auto pb-1 sm:pb-0">
            <button
              id="nav-tab-products"
              onClick={() => onViewChange('products')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeView === 'products'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {t.wholesaleCatalog}
            </button>
            <button
              id="nav-tab-suppliers"
              onClick={() => onViewChange('suppliers')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeView === 'suppliers'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.verifiedFactories}</span>
            </button>
            <button
              id="nav-tab-customers"
              onClick={() => onViewChange('customers')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeView === 'customers'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.globalCustomers}</span>
            </button>
            <button
              id="nav-tab-insights"
              onClick={() => onViewChange('insights')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeView === 'insights'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>{t.bdExportAdvantage}</span>
            </button>
            <button
              id="nav-tab-techpack-launcher"
              onClick={onOpenTechPackStudio}
              className="px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors cursor-pointer text-[#ff5500] hover:bg-[#ff5500]/10 border border-[#ff5500]/30 font-extrabold"
            >
              <Layers className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>TechPack Studio (CAD)</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
            <span className="text-white">{t.escrowBadge}</span>
            <span className="text-slate-700">•</span>
            <span>{t.incotermsBadge}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
