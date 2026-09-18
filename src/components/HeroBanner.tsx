import React, { useState } from 'react';
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
} from 'lucide-react';
import { MarketplaceStats, LanguageCode, AuthUser } from '../types';

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

  const isDark = theme === 'dark';

  const trendingTags = [
    'Heavyweight 240 GSM Combed Tee',
    'Raw Indigo Selvedge Denim',
    'Golden Jute Tote & Burlap',
    'Full-Grain Leather Footwear',
    'Fine Bone China Dinnerware',
    'FOB Chattogram Port',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(tempSearch);
    if (onPerformSearch) onPerformSearch(tempSearch);
  };

  const handleTagClick = (tag: string) => {
    setTempSearch(tag);
    onSearchChange(tag);
    if (onPerformSearch) onPerformSearch(tag);
  };

  return (
    <div
      className={`pt-6 pb-4 px-4 border-b transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-[#0d0d0d] via-[#111111] to-[#0a0a0a] border-white/10 text-white'
          : 'bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* 1. Mode Switcher Tabs above Big Search (Alibaba Style) */}
        <div
          className={`flex items-center justify-center sm:justify-start space-x-1 sm:space-x-3 border-b pb-2 ${
            isDark ? 'border-white/10' : 'border-slate-200/80'
          }`}
        >
          {/* RAWx AI Mode Tab */}
          <button
            type="button"
            onClick={() => {
              onHeroTabChange('ai');
              onOpenAiAssistant();
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeHeroTab === 'ai'
                ? 'bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/25 ring-2 ring-[#e11d48]/40'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>RAWx Trade Agent</span>
            <span className="text-[10px] bg-black/40 text-white px-1.5 py-0.2 rounded font-mono font-black">
              24/7
            </span>
          </button>

          {/* Products Tab */}
          <button
            type="button"
            onClick={() => onHeroTabChange('products')}
            className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer relative ${
              activeHeroTab === 'products'
                ? 'text-[#ff1e42] font-black'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Wholesale Products</span>
            {activeHeroTab === 'products' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#e11d48] rounded-full" />
            )}
          </button>

          {/* BD Exporters Tab */}
          <button
            type="button"
            onClick={() => onHeroTabChange('suppliers')}
            className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer relative flex items-center space-x-1 ${
              activeHeroTab === 'suppliers'
                ? 'text-[#ff1e42] font-black'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Verified EPB Mills</span>
            {activeHeroTab === 'suppliers' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#e11d48] rounded-full" />
            )}
          </button>

          {/* Global Buyer Tab */}
          <button
            type="button"
            onClick={() => onHeroTabChange('customers')}
            className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer relative flex items-center space-x-1 ${
              activeHeroTab === 'customers'
                ? 'text-[#ff1e42] font-black'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Global Buyers</span>
            {activeHeroTab === 'customers' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#e11d48] rounded-full" />
            )}
          </button>
        </div>

        {/* 2. Big Executive Search Bar with RAWx AI Search Option */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className={`rounded-full border-2 transition-all shadow-xl flex items-center p-1.5 ${
              isDark
                ? isAiModeEnabled
                  ? 'bg-[#141414] border-[#e11d48] ring-4 ring-[#e11d48]/20'
                  : 'bg-[#141414] border-white/20 hover:border-[#e11d48] focus-within:border-[#e11d48] ring-4 ring-black/40'
                : isAiModeEnabled
                ? 'bg-white border-[#e11d48] ring-4 ring-red-100 shadow-red-100'
                : 'bg-white border-slate-800 hover:border-[#e11d48] focus-within:border-[#e11d48] ring-4 ring-slate-100'
            }`}
          >
            {/* Visual Image Search Lens */}
            <button
              type="button"
              onClick={() => setIsImageSearchModalOpen(true)}
              className="p-2 sm:px-3 text-slate-400 hover:text-[#e11d48] transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
              title="Visual Search: Upload photo or garment spec"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[11px] font-bold hidden sm:inline">Lens</span>
            </button>

            {/* Vertical Separator */}
            <div className={`h-6 w-px shrink-0 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

            {/* Search Input */}
            <div className="flex-1 px-3 min-w-0">
              <input
                type="text"
                value={tempSearch}
                onChange={(e) => {
                  setTempSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder={
                  isAiModeEnabled
                    ? 'RAWx Bot: "Find 240 GSM organic combed tees with FOB Chattogram under $3.00"'
                    : 'Search 50,000+ export products, fabrics, HS codes, or certified mills...'
                }
                className={`w-full text-xs sm:text-sm focus:outline-none bg-transparent ${
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
                className="p-1 text-slate-400 hover:text-white mr-2 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* RAWx AI Search Mode Toggle Pill */}
            <button
              type="button"
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
              <span>RAWx Assist</span>
            </button>

            {/* Big Executive Crimson Search Button */}
            <button
              type="submit"
              className="bg-[#e11d48] hover:bg-[#ff1e42] text-white px-6 sm:px-8 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-[#e11d48]/25 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-[11px]">
            <span className="font-semibold text-slate-400">Popular:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10 hover:border-[#e11d48]/50'
                    : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#e11d48] border-slate-200/80 hover:border-red-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Welcome Strip & Quick Action Bar */}
        <div
          className={`pt-2 flex flex-col md:flex-row items-center justify-between gap-3 border-t text-xs ${
            isDark ? 'border-white/10' : 'border-slate-200/60'
          }`}
        >
          {/* Left: User Welcome */}
          <div className="flex items-center space-x-2 font-medium">
            <span className="text-slate-400">Welcome to Made in BD B2B Portal,</span>
            <span className="font-extrabold text-[#e11d48] uppercase font-mono">
              {authUser ? authUser.name : 'VERIFIED BUYER'}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]" title="Active Sourcing Gateway" />
          </div>

          {/* Right: Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRfq}
              className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-[#e11d48]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#e11d48] text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Post RFQ</span>
            </button>

            <button
              onClick={() => onHeroTabChange('products')}
              className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-[#10b981]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#10b981] text-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Top Ranking</span>
            </button>

            <button
              onClick={onOpenTechPackStudio}
              className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-[#10b981]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#10b981] text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#10b981]" />
              <span>TechPack CAD</span>
            </button>

            <button
              onClick={onOpenShippingCalc}
              className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-[#10b981]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#10b981] text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Bank L/C & Escrow</span>
            </button>
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
