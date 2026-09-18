import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  Award,
  Layers,
  Sparkles,
  FileText,
  Send,
  Clock,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onRequestSample?: (product: Product) => void;
  onInquire: (product: Product) => void;
  onOpenAiAssistant?: (product: Product) => void;
  onAddToTechPack?: (product: Product) => void;
  onProcureDirect?: (product: Product) => void;
  theme?: 'dark' | 'light';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onRequestSample,
  onInquire,
  onOpenAiAssistant,
  onAddToTechPack,
  onProcureDirect,
  theme = 'dark',
}) => {
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);

  const handleOutboundSourcing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProcureDirect) {
      onProcureDirect(product);
      return;
    }
    const target =
      product.targetRoutingUrl ||
      `https://${product.sourceDomain || 'b2b.handsandhead.com'}/order?sku=${encodeURIComponent(
        product.sku || product.id
      )}&ref=b2b_portal&utm_source=b2b_hub`;
    try {
      window.open(target, '_blank', 'noopener,noreferrer');
    } catch {
      onInquire(product);
    }
  };

  // Available fabric / color swatches for Shein/Etsy instant selector
  const swatches: { name: string; hex: string }[] = product.colorVariants?.length
    ? product.colorVariants.map((c) => ({ name: c.name, hex: c.hex }))
    : [
        { name: 'Raw Natural', hex: '#f4f0ea' },
        { name: 'Pitch Black', hex: '#111827' },
        { name: 'Forest Green', hex: '#166534' },
        { name: 'Deep Crimson', hex: '#991b1b' },
      ];

  const lowestPriceUSD = product.priceTiers?.[product.priceTiers.length - 1]?.priceUSD ?? product.priceTiers?.[0]?.priceUSD ?? 3.5;
  const highestPriceUSD = product.priceTiers?.[0]?.priceUSD ?? lowestPriceUSD;
  const lowestConverted = (lowestPriceUSD * currency.rate).toFixed(2);
  const highestConverted = (highestPriceUSD * currency.rate).toFixed(2);

  // Exact GSM or fabric spec description
  const gsmSpec = product.materials?.[0]
    ? `${product.materials[0]} • Export Lot`
    : '100% Ring-Spun Combed Cotton • 220 GSM';

  const categoryLabel = product.category || product.categoryId.replace('-', ' ').toUpperCase();

  const isDark = theme === 'dark';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 ${
        isDark
          ? 'bg-[#141414] border border-white/10 hover:border-[#e11d48]/70 shadow-lg hover:shadow-2xl hover:shadow-[#e11d48]/10'
          : 'bg-white border border-slate-200 hover:border-[#e11d48]/60 shadow-xs hover:shadow-xl'
      }`}
    >
      {/* 1. DEFAULT STATE: Square Product Image & Minimalistic Clean Framing */}
      <img
        src={product.images[0]}
        alt={product.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      {/* Top Gradient & Minimal Provenance Pill */}
      <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-start justify-between pointer-events-none z-10">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
            {product.provenance || product.divisionTitle || categoryLabel}
          </span>
          {product.artisanDirect && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/90 text-slate-950 font-mono flex items-center space-x-0.5">
              <Award className="w-2.5 h-2.5" />
              <span>Artisan</span>
            </span>
          )}
        </div>

        {product.bestseller && (
          <span className="bg-[#e11d48] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider font-mono flex items-center space-x-1">
            <Flame className="w-2.5 h-2.5 fill-current" />
            <span>BESTSELLER</span>
          </span>
        )}
      </div>

      {/* Default State Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
        <p className="text-white text-xs sm:text-sm font-extrabold truncate drop-shadow-md">
          {product.title}
        </p>

        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-sm sm:text-base font-black text-[#10b981] font-mono">
              {currency.symbol}
              {lowestConverted}
            </span>
            {highestConverted !== lowestConverted && (
              <span className="text-[10px] text-slate-300 font-mono">
                - {currency.symbol}
                {highestConverted}
              </span>
            )}
            <span className="text-[10px] text-slate-300">/ {product.unit.toLowerCase().replace(/s$/, '')}</span>
          </div>

          <span className="text-[10px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
            MOQ: {product.moq} {product.unit}
          </span>
        </div>
      </div>

      {/* 2. ON HOVER: SHEIN/ETSY RICH OPERATIONAL OVERLAY (Smooth CSS transition) */}
      <div
        className="absolute inset-0 p-4 bg-[#0a0a0a]/92 backdrop-blur-md flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 text-white"
        onClick={(e) => {
          // Allow card click to trigger full drawer unless an action button is clicked
        }}
      >
        {/* Top Operational Specs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#10b981]" />
              <span>Verified EPB Specs</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              HS: {product.hsCode || '6109.10'}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-black line-clamp-2 text-white leading-tight">
            {product.title}
          </h4>

          {/* Exact GSM / Fabric Breakdown */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-snug">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Material & Weight</span>
            <span className="font-medium text-slate-200">{gsmSpec}</span>
          </div>
        </div>

        {/* Middle: Swatches & Pricing Tiers */}
        <div className="space-y-2.5 my-1">
          {/* Swatches */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="uppercase font-bold">Variants / Swatches</span>
              <span className="text-slate-300 font-medium">{swatches[selectedSwatchIndex]?.name}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {swatches.slice(0, 5).map((sw, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSwatchIndex(idx);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform cursor-pointer relative flex items-center justify-center ${
                    selectedSwatchIndex === idx
                      ? 'scale-110 border-[#10b981] ring-2 ring-[#10b981]/50'
                      : 'border-white/30 hover:scale-105'
                  }`}
                  style={{ backgroundColor: sw.hex }}
                  title={sw.name}
                >
                  {selectedSwatchIndex === idx && (
                    <Check className={`w-2.5 h-2.5 ${sw.hex === '#f8fafc' || sw.hex === '#f4f0ea' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
              <span className="text-[9px] text-slate-400 font-mono ml-1">+more</span>
            </div>
          </div>

          {/* Volume Price Tiers */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Volume Price Ladder</span>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              {product.priceTiers.slice(0, 3).map((tier, i) => (
                <div key={i} className="p-1 rounded bg-white/5 border border-white/10">
                  <div className="text-[9px] text-slate-400 font-sans">{tier.minQty.toLocaleString()}+ pcs</div>
                  <div className="text-[11px] font-bold text-[#10b981]">
                    {currency.symbol}{(tier.priceUSD * currency.rate).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Lead Time */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#10b981]" />
              <span>Production: <strong>25-35 Days</strong></span>
            </span>
            <span>Sample: <strong>4-7 Days</strong></span>
          </div>
        </div>

        {/* Bottom Quick-Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToTechPack) {
                onAddToTechPack(product);
              } else {
                onSelectProduct(product);
              }
            }}
            className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
            title="Export Spec to CAD TechPack Studio"
          >
            <FileText className="w-3 h-3 text-[#10b981]" />
            <span className="truncate">TechPack Spec</span>
          </button>

          <button
            type="button"
            onClick={handleOutboundSourcing}
            className="py-2 px-2.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
            title="Procure Direct on Dedicated Node"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="truncate">Procure Direct</span>
          </button>
        </div>
      </div>
    </div>
  );
};
