import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  Layers,
  FileCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Info,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { B2bCatalogProduct, CurrencyConfig } from '../types';

interface B2bCatalogCardProps {
  product: B2bCatalogProduct;
  currency: CurrencyConfig;
  onSelectProduct: (product: B2bCatalogProduct) => void;
  onRequestSample: (product: B2bCatalogProduct) => void;
  onRequestTechPack: (product: B2bCatalogProduct) => void;
  onAddToCart?: (product: B2bCatalogProduct) => void;
}

export const B2bCatalogCard: React.FC<B2bCatalogCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onRequestSample,
  onRequestTechPack,
  onAddToCart,
}) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCtaMenu, setShowCtaMenu] = useState(false);

  const priceConv = (product.price * currency.rate).toFixed(2);
  const unitSymbol = currency.symbol;

  const currentImage = product.images?.[activeImgIdx] || product.images?.[0] || '/football_club (1).jpg';

  return (
    <div
      className="group relative bg-[#131720]/90 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col overflow-hidden text-slate-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowCtaMenu(false);
      }}
    >
      {/* Top Media Section */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={currentImage}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              // Fallback to primary alias
              (e.target as HTMLImageElement).src = `/catalog/club-football/club-${String(product.id.replace(/\D/g, '') || '01').padStart(2, '0')}.jpg`;
            }
          }}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {/* Export Compliance Status (Tokyo Standard) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
            <span className="tracking-tight uppercase">{product.exportComplianceStatus || 'Tokyo Standard'}</span>
          </div>

          {/* MOQ Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-mono text-[11px] font-black shadow-md">
            <Package className="w-3 h-3 text-slate-950 shrink-0" />
            <span>{product.moqBadge || `MOQ: ${product.moq} pcs`}</span>
          </div>
        </div>

        {/* Lead time & HS Code pill bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{product.leadTimeDays}d FOB Lead</span>
          </span>
          {product.hsCode && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-slate-400">
              HS {product.hsCode}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Category & Club Division Tag */}
        {/* Category, Brand, Print & Club Tag */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.brand && (
                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-black font-mono text-rose-300 uppercase tracking-wide">
                  {product.brand}
                </span>
              )}
              {product.club && (
                <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-[10px] font-bold font-mono text-blue-300 tracking-tight">
                  {product.club}
                </span>
              )}
            </div>

            {product.frontPrint && (
              <span className="text-[10px] font-mono font-medium text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 truncate max-w-[150px]" title={`Print: ${product.frontPrint}`}>
                Print: {product.frontPrint}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm sm:text-base font-bold text-white hover:text-rose-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Color Variants Swatches */}
        {product.colorVariants && product.colorVariants.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-mono text-slate-400 mr-1">Tones:</span>
            {product.colorVariants.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colorVariants.length > 4 && (
              <span className="text-[10px] text-slate-400 font-mono">+{product.colorVariants.length - 4}</span>
            )}
          </div>
        )}

        {/* Pricing Ladder / MOQ Price */}
        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Wholesale FOB</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-400 tracking-tight">
                {unitSymbol}{priceConv}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {product.unit || 'pc'}</span>
            </div>
          </div>

          {/* Volume tiers hint */}
          {product.priceTiers && product.priceTiers.length > 1 && (
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Bulk Scale</span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {unitSymbol}{(product.priceTiers[product.priceTiers.length - 1].priceUSD * currency.rate).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Action Button: Direct 'Request TechPack/Sample' CTA */}
        <div className="pt-2 relative">
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => onRequestSample(product)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-950/40 hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <FileCheck className="w-4 h-4 text-rose-200" />
              <span>Request TechPack / Sample</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onRequestTechPack(product)}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>TechPack Spec</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Full Spec</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
