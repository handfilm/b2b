import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  Clock,
  Layers,
  FileCheck,
  CheckCircle2,
  Building2,
  Share2,
  Check,
  Truck,
  Globe2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { B2bCatalogProduct, CurrencyConfig } from '../types';

interface B2bProductDetailModalProps {
  product: B2bCatalogProduct | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  onRequestSample: (product: B2bCatalogProduct) => void;
  onRequestTechPack: (product: B2bCatalogProduct) => void;
  onAddToCart?: (product: B2bCatalogProduct) => void;
}

export const B2bProductDetailModal: React.FC<B2bProductDetailModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onRequestSample,
  onRequestTechPack,
  onAddToCart,
}) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  const priceConv = (product.price * currency.rate).toFixed(2);
  const currentImg = product.images?.[selectedImgIdx] || product.images?.[0] || '/football_club (1).jpg';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-[#11141c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161a24]/90">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold uppercase">b2b.handsandhead.com</span>
            <span>/</span>
            <span className="text-slate-300 capitalize">{product.categorySlug}</span>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px]">{product.slug}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Copy deep link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share URL'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Interactive Angle Viewer */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner group/modalImg">
              <div className="absolute inset-0 animate-pulse bg-neutral-900 pointer-events-none" />
              <img
                src={currentImg}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover/modalImg:scale-102"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/catalog/club-football/club-${String(product.id.replace(/\D/g, '') || '01').padStart(2, '0')}.jpg`;
                }}
              />

              {/* Floating badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{product.exportComplianceStatus || 'Tokyo Standard'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-black shadow-md">
                  <Package className="w-4 h-4 text-slate-950" />
                  <span>{product.moqBadge || `MOQ: ${product.moq} pcs`}</span>
                </div>
              </div>

              {/* Angle indicator badge top right */}
              {product.images && product.images.length > 1 && (
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-semibold shadow-lg">
                    <Eye className="w-3 h-3 text-rose-400" />
                    <span>
                      {selectedImgIdx === 0
                        ? 'Front Cut'
                        : selectedImgIdx === 1
                        ? product.frontPrint ? `Print: ${product.frontPrint}` : 'Chest Graphic'
                        : selectedImgIdx === 2
                        ? product.club ? `${product.club} #` : 'Back View'
                        : 'QC & Spec'}
                    </span>
                    <span className="text-white/40 text-[10px]">
                      {selectedImgIdx + 1}/{product.images.length}
                    </span>
                  </span>
                </div>
              )}

              {/* Navigation Chevrons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous angle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next angle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImgIdx((prev) => (prev + 1) % product.images.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImgIdx === idx ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Factory Credentials Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-bold text-white">{product.supplierName}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  Verified Mill
                </span>
              </div>
              <p className="text-xs text-slate-400">{product.supplierLocation}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.complianceBadges?.map((badge, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & CTAs */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                    {product.subdivision || product.subcategorySlug.replace(/-/g, ' ')}
                  </span>
                  {product.brand && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-[11px] font-black font-mono text-rose-300 uppercase tracking-wide">
                      Brand: {product.brand}
                    </span>
                  )}
                  {product.club && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950/90 border border-blue-500/50 text-[11px] font-bold font-mono text-blue-300 tracking-tight">
                      Club: {product.club}
                    </span>
                  )}
                  {product.frontPrint && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-bold font-mono text-amber-300">
                      Front Print: {product.frontPrint}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                  {product.title}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Price Tier Grid */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase block">Wholesale Export Pricing</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-emerald-400 tracking-tight">
                        {currency.symbol}{priceConv}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/ {product.unit || 'pc'} FOB</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono block">Sample Fee</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {currency.symbol}{((product.samplePriceUSD || 30) * currency.rate).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Volume Tier Table */}
                {product.priceTiers && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-center">
                    {product.priceTiers.map((tier, i) => (
                      <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} pcs` : `${tier.minQty}+ pcs`}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {currency.symbol}{(tier.priceUSD * currency.rate).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color swatches */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                    Export Colorways & Lab Dips
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colorVariants.map((col, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="font-semibold text-slate-200">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Technical Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.specifications?.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block">{spec.label}</span>
                      <span className="font-bold text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Port of Loading</span>
                    <span className="font-bold text-slate-200">{product.portOfLoading || 'Chattogram Port (CGP)'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Production Lead Time</span>
                    <span className="font-bold text-emerald-400 font-mono">{product.leadTimeDays} Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons Footer */}
            <div className="pt-6 border-t border-white/10 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onRequestSample(product)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/50 hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Request TechPack / Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRequestTechPack(product)}
                  className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Customize TechPack Spec</span>
                </button>
              </div>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Add to B2B Sourcing RFQ List</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
