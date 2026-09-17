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
  HelpCircle,
} from 'lucide-react';
import { CurrencyCode, CategoryId } from '../types';
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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      {/* Top Banner: Export Announcement & Trust Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Verified Exporters
            </span>
            <span className="text-neutral-400 hidden md:inline">
              World’s #1 Green LEED Garment Factories • Direct from Chattogram & Mongla Ports
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-neutral-300 hover:text-white cursor-pointer transition-colors"
                 onClick={onOpenShippingCalc}>
              <Ship className="w-3.5 h-3.5 text-emerald-400" />
              <span>Port Freight Matrix</span>
            </div>
            <span className="text-neutral-700">|</span>
            <div className="flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-neutral-400" />
              <select
                id="header-currency-selector"
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-neutral-800 text-neutral-100 rounded border border-neutral-700 px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div
              id="brand-logo-button"
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => {
                onViewChange('products');
                onSelectCategory('all');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                BD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-neutral-900">
                    Made in BD
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    B2B Export
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  b2b.handsandhead.com
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Search Box */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="flex rounded-lg border border-neutral-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 bg-white overflow-hidden transition-all">
              <select
                id="search-category-filter"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as CategoryId)}
                className="bg-neutral-50 border-r border-neutral-200 text-xs font-medium text-neutral-700 px-3 py-2.5 focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  id="global-product-search-input"
                  type="text"
                  placeholder="Search products, HS codes (e.g. 6109), raw materials, or certified mills..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs md:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="mr-2 text-xs text-neutral-400 hover:text-neutral-700 px-1.5 py-0.5 rounded"
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
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Post RFQ</span>
            </button>

            <button
              id="header-inquiries-drawer-button"
              onClick={onOpenInquiries}
              className="relative p-2 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              title="View Inquiries & Sample Requests"
            >
              <Inbox className="w-5 h-5" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {inquiryCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              id="mobile-product-search-input"
              type="text"
              placeholder="Search products, HS code, or factory..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Navigation Tabs (Products vs. Suppliers vs. Export Insights) */}
        <div className="flex items-center justify-between border-t border-neutral-100 mt-2.5 pt-2">
          <nav className="flex space-x-1 sm:space-x-4 text-xs font-semibold text-neutral-600">
            <button
              id="nav-tab-products"
              onClick={() => onViewChange('products')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'products'
                  ? 'bg-neutral-900 text-white'
                  : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              Wholesale Products
            </button>
            <button
              id="nav-tab-suppliers"
              onClick={() => onViewChange('suppliers')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${
                activeView === 'suppliers'
                  ? 'bg-neutral-900 text-white'
                  : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Factories</span>
            </button>
            <button
              id="nav-tab-insights"
              onClick={() => onViewChange('insights')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${
                activeView === 'insights'
                  ? 'bg-neutral-900 text-white'
                  : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>BD Export Advantage</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-neutral-700">100% Trade Assurance</span>
            <span>•</span>
            <span>Bank LC / Escrow Guaranteed</span>
          </div>
        </div>
      </div>
    </header>
  );
};
