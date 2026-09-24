import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Package,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Globe2,
  FileCheck
} from 'lucide-react';
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogProducts,
  getCatalogProductBySlug,
  getSubcategoriesForCategory
} from '../data/b2bCatalogService';
import { B2bCatalogCategory, B2bCatalogProduct, CurrencyConfig } from '../types';
import { B2bCatalogCard } from '../components/B2bCatalogCard';
import { B2bProductDetailModal } from '../components/B2bProductDetailModal';

interface B2bCatalogPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currency: CurrencyConfig;
  onRequestSample: (product: B2bCatalogProduct) => void;
  onRequestTechPack: (product: B2bCatalogProduct) => void;
  onAddToCart?: (product: B2bCatalogProduct) => void;
}

export const B2bCatalogPage: React.FC<B2bCatalogPageProps> = ({
  currentPath,
  onNavigate,
  currency,
  onRequestSample,
  onRequestTechPack,
  onAddToCart,
}) => {
  // Categories from decoupled data layer
  const categories = useMemo(() => getCatalogCategories(), []);

  // Parse path: /catalog, /catalog/[category], /catalog/[category]/[slug]
  const pathParts = useMemo(() => {
    const clean = currentPath.split('?')[0];
    const segments = clean.split('/').filter(Boolean); // ['catalog', 't-shirts', 'slug']
    return {
      isCatalog: segments[0] === 'catalog',
      categorySlug: segments[1] || 'all',
      productSlug: segments[2] || null,
    };
  }, [currentPath]);

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(pathParts.categorySlug);
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'moq-asc'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<B2bCatalogProduct | null>(null);

  // Sync state when currentPath changes (e.g. user hits back/forward or route change)
  useEffect(() => {
    const cat = pathParts.categorySlug || 'all';
    setActiveCategorySlug(cat);

    // If a product slug is in the URL, open its modal
    if (pathParts.productSlug) {
      const prod = getCatalogProductBySlug(cat, pathParts.productSlug);
      if (prod) {
        setActiveModalProduct(prod);
      }
    } else {
      setActiveModalProduct(null);
    }
  }, [currentPath, pathParts]);

  // Subcategories for current category
  const subcategories = useMemo(() => {
    return getSubcategoriesForCategory(activeCategorySlug);
  }, [activeCategorySlug]);

  // Filtered products list
  const products = useMemo(() => {
    return getCatalogProducts({
      categorySlug: activeCategorySlug,
      subcategorySlug: activeSubcategorySlug !== 'all' ? activeSubcategorySlug : undefined,
      query: searchQuery,
      sortBy: sortBy === 'featured' ? undefined : sortBy,
    });
  }, [activeCategorySlug, activeSubcategorySlug, searchQuery, sortBy]);

  // Handle top-level category switcher click
  const handleSelectCategory = (catSlug: string) => {
    setActiveCategorySlug(catSlug);
    setActiveSubcategorySlug('all');
    onNavigate(`/catalog/${catSlug}`);
  };

  // Handle subcategory filter click
  const handleSelectSubcategory = (subSlug: string) => {
    setActiveSubcategorySlug(subSlug);
  };

  // Open product detail and push route /catalog/[category]/[slug]
  const handleSelectProduct = (product: B2bCatalogProduct) => {
    setActiveModalProduct(product);
    onNavigate(`/catalog/${product.categorySlug}/${product.slug}`);
  };

  // Close modal and revert route to /catalog/[category]
  const handleCloseModal = () => {
    setActiveModalProduct(null);
    onNavigate(`/catalog/${activeCategorySlug}`);
  };

  const activeCategoryObj = categories.find((c) => c.slug === activeCategorySlug) || categories[0];

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 pb-20">
      {/* Hero / Pavilion Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#141926] via-[#10141f] to-[#0d1017] pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs & Tenant Tag */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>b2b.handsandhead.com</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">Catalog Pavilion</span>
            <span>•</span>
            <span className="text-white font-bold">{activeCategoryObj.name}</span>
          </div>

          {/* Heading & Value Prop */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {activeCategoryObj.title || 'Direct Factory B2B Export Catalog'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeCategoryObj.description ||
                  'Factory-direct sourcing with Tokyo Standard export QC certification, low MOQs, and instant TechPack generation.'}
              </p>
            </div>

            {/* Quick Sourcing Assurance Badges */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-emerald-400">TOKYO STANDARD</div>
                  <div className="text-[10px] text-slate-400">100% Export QC Inspected</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-rose-400">SAMPLE ON DEMAND</div>
                  <div className="text-[10px] text-slate-400">3-5 Day DHL Air Courier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Level Category Switcher */}
          {/* Required: (All, T-Shirts, Accessories, Leather Bags) */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shrink-0 flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-xl shadow-rose-950/60 ring-2 ring-rose-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.slug === 't-shirts' && (
                      <span className="px-2 py-0.5 rounded-full bg-black/40 text-rose-200 text-xs font-mono font-black">
                        28 Club Kits
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Subcategories Filter Chips & Search/Sort Bar */}
        <div className="space-y-4">
          {/* Subcategories Chips Bar (e.g. for T-Shirts: Club Football, Heavyweight Oversized, etc.) */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-mono text-slate-400 uppercase mr-1 shrink-0">Subcategory:</span>
              <button
                type="button"
                onClick={() => handleSelectSubcategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeSubcategorySlug === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                All {activeCategoryObj.name}
              </button>

              {subcategories.map((sub) => {
                const isSubActive = activeSubcategorySlug === sub.slug;
                return (
                  <button
                    key={sub.id || sub.slug}
                    type="button"
                    onClick={() => handleSelectSubcategory(sub.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSubActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {sub.count && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSubActive ? 'bg-slate-950 text-emerald-400' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {sub.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Input & Sort Controls */}
          <div className="p-3 rounded-2xl bg-[#141824] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search styles, clubs, fabric GSM, HS code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results count & Sort dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs">
              <span className="text-slate-400 font-mono">
                Showing <strong className="text-white">{products.length}</strong> styles
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort products by"
                  className="bg-black/50 border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="featured">Featured Export</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="moq-asc">MOQ: Lowest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/10 p-8 space-y-4">
            <Package className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products found in this selection</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Try adjusting your subcategory filter or search query, or clear your filters to view all products.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveSubcategorySlug('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <B2bCatalogCard
                key={product.id}
                product={product}
                currency={currency}
                onSelectProduct={handleSelectProduct}
                onRequestSample={onRequestSample}
                onRequestTechPack={onRequestTechPack}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal for /catalog/[category]/[slug] */}
      <B2bProductDetailModal
        product={activeModalProduct}
        currency={currency}
        isOpen={Boolean(activeModalProduct)}
        onClose={handleCloseModal}
        onRequestSample={onRequestSample}
        onRequestTechPack={onRequestTechPack}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
