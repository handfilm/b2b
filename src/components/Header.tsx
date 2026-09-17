import React from 'react';
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
} from 'lucide-react';
import { CurrencyCode, CategoryId, PersonaMode } from '../types';
import { CURRENCIES, CATEGORIES } from '../data/mockData';

interface HeaderProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onOpenInquiries: () => void;
  inquiryCount: number;
  activeView: 'products' | 'suppliers' | 'insights';
  onViewChange: (view: 'products' | 'suppliers' | 'insights') => void;
  persona: PersonaMode;
  onPersonaChange: (p: PersonaMode) => void;
  apiSource?: 'live' | 'fallback';
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  selectedCategory,
  onSelectCategory,
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
  apiSource = 'live',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      {/* Top Nexus Ecosystem & Trust Bar */}
      <div className="bg-[#050505] text-slate-300 text-xs py-1.5 px-4 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Nexus Status & Discrete Ecosystem Cross-Routing */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] mr-1.5 animate-ping"></span>
              Nexus {apiSource === 'live' ? 'Live Connected' : 'Fail-Safe Sync'}
            </span>

            {/* Discrete Ecosystem Cross-Links */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Ecosystem:</span>
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

          {/* Right: Shipping Matrix & Currency Selector */}
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={onOpenShippingCalc}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <Ship className="w-3.5 h-3.5 text-[#ff5500]" />
              <span className="hidden sm:inline">Port Freight Matrix</span>
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
                    Made in BD
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
          <div className="hidden sm:flex items-center bg-[#141414] p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              id="persona-switcher-buyer"
              onClick={() => onPersonaChange('buyer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'buyer'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${persona === 'buyer' ? 'text-[#ff5500]' : ''}`} />
              <span>Buyer Portal</span>
            </button>

            <button
              id="persona-switcher-seller"
              onClick={() => onPersonaChange('seller')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                persona === 'seller'
                  ? 'bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Manufacturer Hub</span>
            </button>
          </div>

          {/* Sourcing Search Box (Buyer Mode) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex rounded-xl border border-white/10 focus-within:border-[#ff5500] focus-within:ring-2 focus-within:ring-[#ff5500]/20 bg-[#121212]/80 overflow-hidden transition-all">
              <select
                id="search-category-filter"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as CategoryId)}
                className="bg-[#171717] border-r border-white/10 text-xs font-medium text-slate-300 px-3 py-2.5 focus:outline-none cursor-pointer max-w-[150px] truncate"
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
                      ? 'Search HS codes (e.g. 6109), products, or bonded mills...'
                      : 'Search buyer RFQs, tech packs, or buyer companies...'
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
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              id="header-post-rfq-button"
              onClick={onOpenRfq}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#ff5500]/25 hover:shadow-[#ff5500]/40 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Post RFQ</span>
            </button>

            <button
              id="header-inquiries-drawer-button"
              onClick={onOpenInquiries}
              className="relative p-2.5 rounded-xl border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white bg-[#141414] hover:bg-[#1c1c1c] transition-colors cursor-pointer"
              title="Track Orders, Samples & RFQ Dispatch"
            >
              <Inbox className="w-4 h-4" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff5500] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#0a0a0a]">
                  {inquiryCount}
                </span>
              )}
            </button>
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
            Buyer Portal
          </button>
          <button
            onClick={() => onPersonaChange('seller')}
            className={`flex-1 py-1 text-xs font-bold rounded-lg ${
              persona === 'seller' ? 'bg-[#ff5500] text-white' : 'text-slate-400'
            }`}
          >
            Manufacturer Hub
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              id="mobile-product-search-input"
              type="text"
              placeholder="Search HS codes, products, or mills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/10 bg-[#141414] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
            />
          </div>
        </div>

        {/* Navigation Tabs (Products vs. Suppliers vs. Export Insights) */}
        <div className="flex items-center justify-between border-t border-white/[0.08] mt-2.5 pt-2">
          <nav className="flex space-x-1 sm:space-x-2 text-xs font-bold">
            <button
              id="nav-tab-products"
              onClick={() => onViewChange('products')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'products'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Wholesale Catalog
            </button>
            <button
              id="nav-tab-suppliers"
              onClick={() => onViewChange('suppliers')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeView === 'suppliers'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified EPB Factories</span>
            </button>
            <button
              id="nav-tab-insights"
              onClick={() => onViewChange('insights')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeView === 'insights'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>BD Export Advantage</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
            <span className="text-white">50% Advance JIT Escrow</span>
            <span className="text-slate-700">•</span>
            <span>ICC Incoterms 2020</span>
          </div>
        </div>
      </div>
    </header>
  );
};
