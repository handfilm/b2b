import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  Package,
  Layers,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Building2,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { CategoryId, B2BProduct, PriceTier } from '../../types';
import { publishProductToCatalog } from '../../services/nexusApi';
import { generateVolumePriceLadder } from '../../utils/syncTransformers';

interface ProductUploadFormProps {
  onProductPublished?: (newProduct: B2BProduct) => void;
  onNavigateHome?: () => void;
  supplierName?: string;
}

const CATEGORY_OPTIONS: Array<{ id: CategoryId; name: string; icon: string }> = [
  { id: 'rmg-apparel', name: 'RMG & Knitwear (Garments)', icon: '👕' },
  { id: 'jute-eco', name: 'Golden Jute & Eco Diversified', icon: '🌿' },
  { id: 'leather-footwear', name: 'Leather Goods & Footwear', icon: '👞' },
  { id: 'home-textiles', name: 'Home Textiles & Terry Towels', icon: '🛏️' },
  { id: 'ceramics-tableware', name: 'Ceramics & Tableware', icon: '🍽️' },
  { id: 'agro-seafood', name: 'Agro & Black Tiger Shrimp', icon: '🦐' },
  { id: 'pharmaceuticals', name: 'Active Pharma Ingredients', icon: '💊' },
  { id: 'handicrafts-brass', name: 'Handicrafts & Nakshi Kantha', icon: '🏺' },
];

const PRESET_IMAGE_TEMPLATES = [
  {
    category: 'rmg-apparel',
    label: '280 GSM French Terry Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  },
  {
    category: 'rmg-apparel',
    label: 'Organic Combed Cotton Tee',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  },
  {
    category: 'leather-footwear',
    label: 'Arutemika Goodyear Leather Boot',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  },
  {
    category: 'jute-eco',
    label: 'Biodegradable Jute Carry Bag',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  },
  {
    category: 'home-textiles',
    label: 'Egyptian Cotton Luxury Bedding',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
  },
];

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  onProductPublished,
  onNavigateHome,
  supplierName = 'Plummy Fashions Ltd. (LEED Platinum)',
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('rmg-apparel');
  const [baseRetailPrice, setBaseRetailPrice] = useState<number | ''>(24.5);
  const [moq, setMoq] = useState<number | ''>(100);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_TEMPLATES[0].url);
  const [fabricGsm, setFabricGsm] = useState('280 GSM Single Jersey 100% Combed Cotton');
  const [hsCode, setHsCode] = useState('6109.10.00');
  const [unit, setUnit] = useState('pcs');
  const [description, setDescription] = useState(
    'Export-grade verified lot manufactured in compliance with BGMEA and Accord standards. High colorfastness, enzyme bio-polished, pre-shrunk finish.'
  );

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedLot, setPublishedLot] = useState<B2BProduct | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live calculation of 3-tier wholesale volume ladder
  const cleanPrice = Number(baseRetailPrice) > 0 ? Number(baseRetailPrice) : 25.0;
  const cleanMoq = Number(moq) > 0 ? Number(moq) : 100;
  const calculatedTiers: PriceTier[] = generateVolumePriceLadder(cleanPrice, cleanMoq);

  /**
   * Pushes form data to federated_catalog in Firestore
   * so it immediately shows up on the main B2B grid
   */
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an export product title.');
      return;
    }
    if (!baseRetailPrice || Number(baseRetailPrice) <= 0) {
      setErrorMsg('Please enter a valid base retail price.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        categoryId,
        baseRetailPrice: Number(baseRetailPrice),
        d2cRetailPriceUSD: Number(baseRetailPrice),
        moq: Number(moq) || 100,
        unit,
        imageUrl: imageUrl.trim() || PRESET_IMAGE_TEMPLATES[0].url,
        images: [imageUrl.trim() || PRESET_IMAGE_TEMPLATES[0].url],
        gsm: fabricGsm,
        hsCode,
        description: description.trim(),
        supplierName,
        sourceDomain: 'shop.handsandhead.com',
        provenance: 'Exporter Self-Service Terminal',
        portOfLoading: 'Chattogram Port (CGP)',
        incoterms: ['FOB', 'CIF'],
        certifications: ['OEKO-TEX 100', 'WRAP Certified', 'BGMEA Compliant'],
      };

      const result = await publishProductToCatalog(payload);

      setPublishedLot(result.product);
      if (onProductPublished) {
        onProductPublished(result.product);
      }
    } catch (err: any) {
      console.error('Failed to publish product:', err);
      setErrorMsg('Upload error: Could not write document to Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setBaseRetailPrice(24.5);
    setMoq(100);
    setPublishedLot(null);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#e11d48]/15 text-[#e11d48] border border-[#e11d48]/30">
              Live Exporter Terminal
            </span>
            <span className="text-xs text-slate-400 font-mono">Chattogram Customs Bonded Node</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Publish Export Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Published lots automatically sync to the global `federated_catalog` and generate a 3-tier Volume Price Ladder.
          </p>
        </div>

        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Preview on B2B Marketplace
          </button>
        )}
      </div>

      {/* Success Notification Alert */}
      {publishedLot && (
        <div className="p-4 rounded-2xl border border-[#10b981]/40 bg-[#10b981]/10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981] text-slate-950 flex items-center justify-center font-black shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-sm text-white flex items-center space-x-2">
                <span>Lot Published Successfully to `federated_catalog`!</span>
                <span className="font-mono text-xs text-[#10b981]">SKU: {publishedLot.sku}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                "{publishedLot.title}" is now broadcasting live to 15,420 international buyers with wholesale volume discounts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Upload Another Item
            </button>
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#22c55e] text-slate-950 text-xs font-black transition-colors cursor-pointer"
              >
                View in Catalog
              </button>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Column Layout: Form + Real-time B2B Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Glassmorphic Upload Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handlePublish}
            className="rounded-2xl border border-white/10 bg-[#121212]/90 backdrop-blur-xl p-6 shadow-2xl space-y-5"
          >
            {/* Field 1: Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Title / Commodity Specification <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 280 GSM Heavyweight Organic French Terry Hoodie"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-[#e11d48] transition-colors"
              />
            </div>

            {/* Field 2: Category Dropdown matching Pavilion tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Pavilion Category <span className="text-[#e11d48]">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#e11d48] cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#181818] text-white">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Minimum Order Quantity (MOQ) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Minimum Order Quantity (MOQ) <span className="text-[#e11d48]">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-[#e11d48]"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-28 px-2.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-bold cursor-pointer"
                  >
                    <option value="pcs">pcs</option>
                    <option value="pairs">pairs</option>
                    <option value="sets">sets</option>
                    <option value="yards">yards</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Field 3: Base Retail Price & Auto-generated Wholesale Ladder */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Base Retail Price (USD) <span className="text-[#e11d48]">*</span>
                </label>
                <span className="text-[11px] font-mono text-[#10b981] font-bold">
                  Auto 3-Tier Wholesale Ladder Active
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={baseRetailPrice}
                  onChange={(e) => setBaseRetailPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="24.50"
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm font-mono font-black placeholder-slate-500 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              {/* Volume Ladder Breakdown Cards */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono">Tier 1 ({cleanMoq}-499)</div>
                  <div className="text-xs font-black text-white font-mono mt-0.5">
                    ${calculatedTiers[0]?.priceUSD.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-[#10b981] font-bold">-20% Wholesale</div>
                </div>

                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono">Tier 2 (500-1999)</div>
                  <div className="text-xs font-black text-white font-mono mt-0.5">
                    ${calculatedTiers[1]?.priceUSD.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-[#10b981] font-bold">-30% Bulk Volume</div>
                </div>

                <div className="p-2 rounded-lg bg-white/5 border border-[#e11d48]/30 bg-[#e11d48]/5">
                  <div className="text-[10px] text-slate-400 font-mono">Tier 3 (2000+)</div>
                  <div className="text-xs font-black text-[#ff1e42] font-mono mt-0.5">
                    ${calculatedTiers[2]?.priceUSD.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-[#ff1e42] font-bold">-40% Full Container</div>
                </div>
              </div>
            </div>

            {/* Field 5: Image URL + Quick Preset Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Product Image URL (1:1 Aspect Ratio) <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#e11d48]"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] text-slate-400 font-mono shrink-0">Quick Presets:</span>
                {PRESET_IMAGE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => {
                      setImageUrl(tpl.url);
                      setCategoryId(tpl.category as CategoryId);
                      if (!title) setTitle(tpl.label);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-colors cursor-pointer border ${
                      imageUrl === tpl.url
                        ? 'bg-[#e11d48] text-white border-[#e11d48]'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Export Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Fabric Weight / Composition
                </label>
                <input
                  type="text"
                  value={fabricGsm}
                  onChange={(e) => setFabricGsm(e.target.value)}
                  placeholder="280 GSM Single Jersey 100% Cotton"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  HS Export Code
                </label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  placeholder="6109.10.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[#e11d48]/25 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing to `federated_catalog`...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publish Export Lot (Live Push to Firestore)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Columns: Real-Time B2B Marketplace Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Live Buyer Portal Card Preview</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#10b981]/20 text-[#10b981]">
                1:1 Aspect Ratio
              </span>
            </div>

            {/* The 1:1 Square Product Card as displayed on B2B Marketplace */}
            <div className="mt-4 rounded-xl border border-white/15 bg-[#181818] p-3 shadow-lg group overflow-hidden">
              {/* 1:1 Aspect Ratio Square Image */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/60 border border-white/5 mb-3">
                <img
                  src={imageUrl || PRESET_IMAGE_TEMPLATES[0].url}
                  alt={title || 'Product preview'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGE_TEMPLATES[0].url;
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs border border-white/10">
                  {categoryId.replace('-', ' ')}
                </span>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#10b981] text-slate-950 font-mono">
                  Verified Mill
                </span>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                  {title || '280 GSM Heavyweight Organic French Terry Hoodie'}
                </h3>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1 truncate">
                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{supplierName}</span>
                </div>

                {/* Pricing Ladder */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Wholesale FOB:</span>
                    <div className="text-sm font-black text-white font-mono">
                      ${calculatedTiers[0]?.priceUSD.toFixed(2)}{' '}
                      <span className="text-[10px] text-slate-400 font-sans">/{unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Container (2k+):</span>
                    <div className="text-xs font-black text-[#10b981] font-mono">
                      ${calculatedTiers[2]?.priceUSD.toFixed(2)} /{unit}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <div className="py-1.5 rounded-lg bg-[#e11d48] text-white text-[11px] font-black text-center">
                    Inquire RFQ
                  </div>
                  <div className="py-1.5 rounded-lg bg-white/10 text-slate-300 text-[11px] font-bold text-center">
                    MOQ: {cleanMoq} {unit}
                  </div>
                </div>
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>HS Code:</span>
                <span className="text-white">{hsCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Fabric / Material:</span>
                <span className="text-white truncate max-w-[180px]">{fabricGsm}</span>
              </div>
              <div className="flex justify-between">
                <span>Port of Loading:</span>
                <span className="text-[#10b981]">Chattogram Port (CGP)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
