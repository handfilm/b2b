import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2,
  ShoppingCart,
  SlidersHorizontal,
  Flame,
  Eye,
} from 'lucide-react';
import { B2bCatalogProduct, CurrencyConfig } from '../types';
import { ProductImageCarousel } from './ProductImageCarousel';
import { getCatalogImageUrl } from '../utils/imageUrl';

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
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);

  const priceConv = (product.price * currency.rate).toFixed(2);
  const unitSymbol = currency.symbol;

  const validImages = (product.images || []).filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()));
  const currentImage = validImages[0] || (product.image && typeof product.image === 'string' && product.image.trim() ? product.image : '');

  const lowestPriceUSD = product.priceTiers?.[product.priceTiers.length - 1]?.priceUSD ?? product.price ?? 4.5;
  const highestPriceUSD = product.priceTiers?.[0]?.priceUSD ?? product.price ?? lowestPriceUSD;
  const lowestConverted = (lowestPriceUSD * currency.rate).toFixed(2);
  const highestConverted = (highestPriceUSD * currency.rate).toFixed(2);

  const handleCardClick = () => {
    onSelectProduct(product);
  };

  const handleTouchToggle = (e: React.TouchEvent) => {
    // On touch screens, toggle reveal state if not clicking a button
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  return (
    <motion.div
      id={`b2b-card-${product.id}`}
      onClick={handleCardClick}
      onTouchStart={handleTouchToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredTierIndex(null);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false);
        setHoveredTierIndex(null);
      }}
      tabIndex={0}
      role="article"
      aria-label={`${product.title} - ${unitSymbol}${priceConv}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 bg-[#12151e] border border-white/10 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/15 transition-shadow duration-300 transform-gpu"
    >
      {/* 1. MEDIA CAROUSEL SECTION */}
      <ProductImageCarousel
        images={validImages.length > 0 ? validImages : (currentImage ? [currentImage] : [])}
        title={product.title}
        aspectRatioClass="aspect-square"
        onCardClick={handleCardClick}
        isParentHovered={isHovered}
        angleBadgePosition="top-center"
        paginationBottomClass="top-12 sm:top-14"
        angleLabels={[
          'Front Studio Cut',
          product.frontPrint ? `Print: ${product.frontPrint}` : 'Chest Graphic Detail',
          product.club ? `${product.club} Squad #` : 'Back Silhouette',
          'Tokyo Std QC Audit',
        ]}
      />

      {/* 2. TOP BADGES (Smooth animated reveal on hover/touch) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="b2b-top-badges"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between pointer-events-none z-20"
          >
            <div className="flex flex-wrap gap-1.5 items-center">
              {product.brand && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 backdrop-blur-md font-mono shadow-xs">
                  {product.brand}
                </span>
              )}
              {product.club ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40 backdrop-blur-md shadow-xs">
                  {product.club}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/85 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{product.exportComplianceStatus || 'Tokyo Standard'}</span>
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 shadow-xs flex items-center gap-1">
              <Package className="w-2.5 h-2.5 text-slate-950" />
              <span>{product.moqBadge || `MOQ: ${product.moq}`}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MINIMAL RESTING BOTTOM BAR (ONLY Title, Price, MOQ - Super clean grid view) */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            key="b2b-minimal-resting-footer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-none z-10"
          >
            <p className="text-white text-xs sm:text-sm font-black truncate drop-shadow-md tracking-tight">
              {product.title}
            </p>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-sm sm:text-base font-black text-[#10b981] font-mono">
                  {unitSymbol}{lowestConverted}
                </span>
                {highestConverted !== lowestConverted && (
                  <span className="text-[10px] text-slate-300 font-mono">
                    - {unitSymbol}{highestConverted}
                  </span>
                )}
                <span className="text-[10px] text-slate-400">/ {product.unit || 'pc'}</span>
              </div>

              <span className="text-[10px] font-mono font-semibold text-slate-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
                MOQ: {product.moq}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. NEXT-LEVEL ANIMATED HOVER OVERLAY: All Rich Details with Carousel Active */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="b2b-hover-details-sheet"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'opacity, transform' }}
            className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-[#0a0a0c]/98 via-[#0f1118]/95 to-transparent backdrop-blur-md flex flex-col justify-end z-20 text-white transform-gpu space-y-2 border-t border-white/10"
            onClick={(e) => {
              // Click inside overlay opens modal unless specific button clicked
            }}
          >
            {/* Title & Specs line */}
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 mb-0.5">
                <span className="uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{product.divisionTitle || product.divisionSlug || 'Export RMG Cluster'}</span>
                </span>
                <span className="text-slate-400">HS {product.hsCode || '6109.10'}</span>
              </div>
              <h4 className="text-xs sm:text-[13px] font-black line-clamp-1 text-white leading-tight">
                {product.title}
              </h4>
              <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between mt-0.5">
                <span className="truncate max-w-[200px] text-slate-300">
                  {product.specifications?.[0]?.value || product.materials?.[0] || 'Export Lot 240 GSM'}
                </span>
                <span className="text-emerald-400 shrink-0">Lead: {product.leadTimeDays || 25}d</span>
              </div>
            </div>

            {/* Volume Pricing Tiers if available */}
            {product.priceTiers && product.priceTiers.length > 0 && (
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="uppercase font-bold text-slate-400">Volume Ladder</span>
                  <span className="text-[8.5px] font-mono text-[#10b981]">Wholesale Tiers</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center font-mono">
                  {product.priceTiers.slice(0, 3).map((tier, i) => {
                    const tierPriceConv = (tier.priceUSD * currency.rate).toFixed(2);
                    return (
                      <div
                        key={i}
                        className="p-1 rounded-md border border-white/10 bg-white/5 flex flex-col justify-between items-center"
                      >
                        <div className="text-[8px] text-slate-400 font-sans truncate w-full">
                          {tier.minQty}+ {product.unit || 'pcs'}
                        </div>
                        <div className="text-[10px] font-bold text-[#10b981] leading-tight mt-0.5">
                          {unitSymbol}{tierPriceConv}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Swatches if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Color Swatches</span>
                <div className="flex items-center space-x-1.5">
                  {product.colors.slice(0, 4).map((c, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-[8.5px] text-slate-400 font-mono">+{product.colors.length - 4}</span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/10">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestSample(product);
                }}
                className="py-1.5 px-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
                title="Request Sample"
              >
                <FileCheck className="w-2.5 h-2.5" />
                <span>Sample</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestTechPack(product);
                }}
                className="py-1.5 px-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Request TechPack"
              >
                <Layers className="w-2.5 h-2.5" />
                <span>TechPack</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) {
                    onAddToCart(product);
                  } else {
                    onSelectProduct(product);
                  }
                }}
                className="py-1.5 px-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer"
                title="Add to Cart / Inquire"
              >
                <ShoppingCart className="w-2.5 h-2.5" />
                <span>+Cart</span>
              </motion.button>
            </div>

            {/* Cinema View & Zoom Hint */}
            <div className="pt-0.5 text-center">
              <span className="text-[9px] font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-1">
                <SlidersHorizontal className="w-2.5 h-2.5 text-emerald-400" />
                <span>Click for Cinema View & 2.4x Zoom</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
