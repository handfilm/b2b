import React, { useRef, useEffect } from 'react';
import { Loader2, Sparkles, Filter, RefreshCw, Layers } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, CurrencyConfig } from '../types';

interface CatalogGridProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onRequestSample?: (product: Product) => void;
  onInquire: (product: Product) => void;
  onOpenAiAssistant?: (product: Product) => void;
  onAddToTechPack?: (product: Product) => void;
  onProcureDirect?: (product: Product) => void;
  theme?: 'dark' | 'light';
  emptyAction?: () => void;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  products,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  currency,
  onSelectProduct,
  onRequestSample,
  onInquire,
  onOpenAiAssistant,
  onAddToTechPack,
  onProcureDirect,
  theme = 'dark',
  emptyAction,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === 'dark';

  // IntersectionObserver for auto-infinite scrolling
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '350px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, isLoadingMore, hasMore, isLoading]);

  // Glassmorphic Skeleton Loader (1:1 Square Grid)
  if (isLoading && products.length === 0) {
    return (
      <div
        id="catalog-grid-skeleton-loading"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4"
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[#121212]/50 border border-white/10 backdrop-blur-md animate-pulse p-4 flex flex-col justify-between shadow-xl"
          >
            {/* Top Skeleton Badges */}
            <div className="flex items-center justify-between">
              <div className="w-16 h-5 rounded-md bg-white/10" />
              <div className="w-12 h-5 rounded-md bg-[#e11d48]/20" />
            </div>

            {/* Middle Skeleton Visual Placeholder */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Layers className="w-6 h-6 text-white/20 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Bottom Skeleton Content Ladder */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="h-3.5 rounded bg-white/15 w-3/4" />
              <div className="flex items-center justify-between">
                <div className="h-3 rounded bg-white/10 w-1/3" />
                <div className="h-4 rounded bg-[#10b981]/20 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!isLoading && products.length === 0) {
    return (
      <div
        id="catalog-grid-empty-state"
        className={`py-16 text-center space-y-3 rounded-2xl border shadow-xs ${
          isDark
            ? 'bg-[#141414] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-400 mx-auto flex items-center justify-center">
          <Filter className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base">No matching export products found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try clearing your search query or reset your domain feed filter to discover verified Bangladesh products.
        </p>
        {emptyAction && (
          <div className="pt-2">
            <button
              onClick={emptyAction}
              className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="catalog-grid-container" className="space-y-4">
      {/* 1:1 Aspect Ratio Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={currency}
            onSelectProduct={onSelectProduct}
            onRequestSample={onRequestSample}
            onInquire={onInquire}
            onOpenAiAssistant={onOpenAiAssistant}
            onAddToTechPack={onAddToTechPack}
            onProcureDirect={onProcureDirect}
            theme={theme}
          />
        ))}
      </div>

      {/* Infinite Scroll Sentinel & Glassmorphic Loader */}
      <div
        ref={sentinelRef}
        id="catalog-infinite-sentinel"
        className="py-8 flex flex-col items-center justify-center space-y-2"
      >
        {isLoadingMore && (
          <div
            className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-full border shadow-xs animate-in fade-in backdrop-blur-md ${
              isDark
                ? 'bg-[#121212]/80 border-white/15 text-white'
                : 'bg-white/80 border-slate-200 text-slate-600'
            }`}
          >
            <Loader2 className="w-4 h-4 animate-spin text-[#e11d48]" />
            <span>Hydrating catalog from federated Cloud SQL &amp; Firestore...</span>
          </div>
        )}

        {!isLoadingMore && hasMore && (
          <button
            onClick={onLoadMore}
            className={`px-5 py-2 rounded-full border text-xs font-bold shadow-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#141414] hover:bg-white/10 border-white/20 text-white hover:text-[#ff1e42]'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-[#e11d48]'
            }`}
          >
            Load Next 24 Export Lots
          </button>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-[11px] font-mono text-slate-500 py-2">
            ✓ Federated catalog fully synchronized ({products.length} active lots)
          </div>
        )}
      </div>
    </div>
  );
};
