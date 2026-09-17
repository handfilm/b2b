import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Anchor,
  Leaf,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onInquire: (product: Product) => void;
  onOpenAiAssistant?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onRequestSample,
  onInquire,
  onOpenAiAssistant,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSupplierTooltip, setShowSupplierTooltip] = useState(false);

  // Calculate price range
  const lowestPriceUSD = product.priceTiers[product.priceTiers.length - 1].priceUSD;
  const highestPriceUSD = product.priceTiers[0].priceUSD;

  const lowestConverted = (lowestPriceUSD * currency.rate).toFixed(2);
  const highestConverted = (highestPriceUSD * currency.rate).toFixed(2);

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSupplierTooltip(false);
      }}
      className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-[#ff5500]/50 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-[#ff5500]/10"
    >
      {/* Product Image & On-Hover Specs Overlay */}
      <div
        className="relative aspect-4/3 bg-[#171717] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="bg-black/85 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border border-white/10 shadow-xs">
            HS {product.hsCode}
          </span>
          {product.ecoFriendly && (
            <span className="bg-[#ff5500]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-xs">
              <Leaf className="w-2.5 h-2.5 mr-0.5" />
              <span>Eco</span>
            </span>
          )}
        </div>

        {/* Quick View Top-Right Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-7 h-7 rounded-xl bg-black/75 backdrop-blur-md text-white flex items-center justify-center border border-white/15 hover:border-[#ff5500] hover:text-[#ff5500] hover:scale-110 transition-all cursor-pointer shadow-md"
            title="Open Detailed Tech Specs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* ON-HOVER RICH PREVIEW OVERLAY: Slips in on mouse hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/40 backdrop-blur-xs p-3 flex flex-col justify-between transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top of Preview */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#ff5500] uppercase bg-[#ff5500]/15 px-2 py-0.5 rounded border border-[#ff5500]/30">
              Quick Specs Preview
            </span>
            <span className="text-[10px] text-slate-300 font-mono flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#ff5500]" />
              <span>{product.leadTimeDays}d Lead</span>
            </span>
          </div>

          {/* Middle: Live Volume Pricing Tiers Matrix */}
          <div className="space-y-1.5 my-auto">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Wholesale Tier Tiers:
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
              {product.priceTiers.slice(0, 3).map((tier, i) => (
                <div key={i} className="bg-white/10 p-1.5 rounded-lg text-center border border-white/10">
                  <div className="text-slate-300 truncate">{(tier.minQty ?? (tier as any).minQuantity ?? 0).toLocaleString()}+ {product.unit}</div>
                  <div className="font-extrabold text-[#ff5500] text-[11px]">
                    {currency.symbol}{(tier.priceUSD * currency.rate).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Material Specification */}
            {product.materials && product.materials.length > 0 && (
              <div className="text-[11px] text-slate-200 truncate pt-1">
                <span className="text-slate-400 text-[10px] block font-mono">Fabric / Composition:</span>
                <span className="font-semibold text-white truncate block">{product.materials.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Bottom Action in Preview */}
          <div className="flex items-center justify-between pt-1 border-t border-white/15 text-[11px]">
            <span className="text-slate-300 flex items-center space-x-1">
              <Anchor className="w-3 h-3 text-[#ff5500]" />
              <span className="truncate">{product.portOfLoading}</span>
            </span>
            <span className="text-white font-bold hover:text-[#ff5500] flex items-center space-x-1 underline cursor-pointer">
              <Eye className="w-3 h-3" />
              <span>Full Specs</span>
            </span>
          </div>
        </div>

        {/* Bottom Bar: Loading Port (when not hovering) */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/75 to-transparent p-2 text-[11px] text-slate-300 flex items-center justify-between transition-opacity duration-200 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <span className="flex items-center space-x-1 truncate">
            <Anchor className="w-3 h-3 text-[#ff5500] shrink-0" />
            <span className="truncate text-[11px]">{product.portOfLoading}</span>
          </span>
          <span className="font-mono text-[#ff5500] font-bold text-[10px] shrink-0 ml-1">
            {product.incoterms.join('/')}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Supplier Info with on-hover preview popover */}
          <div className="relative flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div
              className="flex items-center space-x-1 truncate relative"
              onMouseEnter={() => setShowSupplierTooltip(true)}
              onMouseLeave={() => setShowSupplierTooltip(false)}
            >
              <span
                className="font-semibold text-slate-200 truncate hover:text-[#ff5500] cursor-pointer transition-colors text-xs"
                onClick={() => onSelectProduct(product)}
              >
                {product.supplierName}
              </span>
              {product.supplierVerified && (
                <span title="Verified Exporter" className="inline-flex items-center cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                </span>
              )}

              {/* On-Hover Supplier Preview Tooltip */}
              {showSupplierTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#111] text-white p-2.5 rounded-xl border border-white/15 shadow-2xl z-30 pointer-events-none text-left">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{product.supplierName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>Export Rating: ★ {product.supplierRating}</span>
                    <span className="text-[#ff5500] font-bold">Verified</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">
                    Port: {product.portOfLoading} • SLA Guaranteed
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#ff5500] font-bold flex items-center space-x-0.5 font-mono shrink-0">
              <span>★</span>
              <span>{product.supplierRating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-extrabold text-white text-sm line-clamp-2 leading-snug cursor-pointer group-hover:text-[#ff5500] transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Price Range */}
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
              {currency.symbol}{lowestConverted} - {currency.symbol}{highestConverted}
            </span>
            <span className="text-[11px] text-slate-400">/ {product.unit.toLowerCase().replace(/s$/, '')}</span>
          </div>

          {/* Sourcing Parameters: MOQ & Lead Time */}
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs py-1.5 px-2 bg-[#141414] rounded-xl border border-white/5">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Min. Order</span>
              <span className="font-bold text-white font-mono text-[11px]">{product.moq.toLocaleString()} {product.unit}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Lead Time</span>
              <span className="font-bold text-white flex items-center space-x-1 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-[#ff5500]" />
                <span>{product.leadTimeDays}d</span>
              </span>
            </div>
          </div>

          {/* Certifications tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.certifications.slice(0, 3).map((cert, idx) => (
              <span
                key={idx}
                className="text-[9px] font-semibold bg-[#171717] text-slate-300 px-1.5 py-0.5 rounded border border-white/5"
              >
                {cert}
              </span>
            ))}
            {product.certifications.length > 3 && (
              <span className="text-[9px] text-slate-500 px-1 py-0.5 font-mono">
                +{product.certifications.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row - Responsive, Lean, No Overflow */}
        <div className="pt-2.5 border-t border-white/10 grid grid-cols-12 gap-1.5 items-center">
          <button
            id={`inquire-btn-${product.id}`}
            onClick={() => onInquire(product)}
            className="col-span-6 py-2 px-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-bold text-xs shadow-md shadow-[#ff5500]/20 transition-all cursor-pointer text-center truncate flex items-center justify-center space-x-1"
          >
            <span>Inquire</span>
          </button>

          {onOpenAiAssistant && (
            <button
              id={`ai-assist-btn-${product.id}`}
              onClick={() => onOpenAiAssistant(product)}
              className="col-span-3 py-2 px-1.5 rounded-xl border border-white/10 hover:border-[#ff5500]/60 text-slate-300 hover:text-white bg-[#161616] hover:bg-[#202020] text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              title="Instant AI Sourcing Specs & Quotes"
            >
              <Sparkles className="w-3 h-3 text-[#ff5500]" />
              <span className="text-[11px]">AI</span>
            </button>
          )}

          {product.sampleAvailable && (
            <button
              id={`sample-btn-${product.id}`}
              onClick={() => onRequestSample(product)}
              className={`${onOpenAiAssistant ? 'col-span-3' : 'col-span-6'} py-2 px-1.5 rounded-xl border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] font-bold text-[11px] transition-colors cursor-pointer text-center truncate`}
              title={`Request Sample (${currency.symbol}${(product.samplePriceUSD * currency.rate).toFixed(2)})`}
            >
              Sample
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

