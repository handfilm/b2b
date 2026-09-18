import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Building2,
  TrendingDown,
} from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { FEDERATED_DIVISIONS } from '../data/divisions';

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
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);

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

  // 1. Federated Division Title derivation
  const resolvedDivisionTitle =
    product.divisionTitle ||
    (product.divisionSlug
      ? FEDERATED_DIVISIONS.find((d) => d.slug === product.divisionSlug)?.divisionTitle
      : undefined) ||
    (product.sourceDomain === 'shop.handsandhead.com'
      ? 'Commercial Knits & Blanks Hub'
      : product.sourceDomain === 'arutemika.handsandhead.com'
      ? 'Arutemika Leather Atelier'
      : product.categoryId === 'rmg-apparel'
      ? 'RMG Knits & Apparel'
      : product.categoryId === 'jute-eco'
      ? 'Golden Jute & Eco'
      : product.categoryId === 'leather-footwear'
      ? 'Artisan Leather Goods'
      : product.categoryId === 'home-textiles'
      ? 'Home Textiles & Terry'
      : product.categoryId === 'ceramics-tableware'
      ? 'Ceramics & Tableware'
      : product.categoryId === 'agro-seafood'
      ? 'Agro & Marine Cluster'
      : product.categoryId === 'pharmaceuticals'
      ? 'Pharma & Formulation'
      : product.categoryId === 'handicrafts-brass'
      ? 'Heritage Brass & Craft'
      : 'Export Industrial Pavilion');

  // 2. Certification Status derivation
  const certList =
    product.certifications && product.certifications.length > 0
      ? product.certifications
      : ['EPB Certified', 'ISO 9001'];
  const primaryCert = certList[0];
  const certStatusText = product.supplierVerified ? 'EPB Verified' : 'Audit Ready';

  const isDark = theme === 'dark';

  const handleCardClick = () => {
    onSelectProduct(product);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
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
      aria-label={`${product.title} - ${currency.symbol}${lowestConverted}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] transition-shadow duration-300 transform-gpu ${
        isDark
          ? 'bg-[#141414] border border-white/10 hover:border-[#e11d48]/70 shadow-lg hover:shadow-2xl hover:shadow-[#e11d48]/15'
          : 'bg-white border border-slate-200 hover:border-[#e11d48]/60 shadow-xs hover:shadow-xl'
      }`}
    >
      {/* 1. DEFAULT STATE: Square Product Image with High-Performance Motion Zoom */}
      <motion.img
        src={product.images[0]}
        alt={product.title}
        referrerPolicy="no-referrer"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ willChange: 'transform', transformOrigin: 'center center' }}
        className="w-full h-full object-cover transform-gpu"
        loading="lazy"
      />

      {/* Top Gradient & Minimal Provenance Pill (Fades out smoothly on hover to reveal glassmorphic tooltip) */}
      <motion.div
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-start justify-between pointer-events-none z-10"
      >
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
      </motion.div>

      {/* 2. SUBTLE, ANIMATED GLASSMORPHIC TOOLTIP ON PRODUCT IMAGE BORDER (Framer Motion reveal on hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="tooltip"
            role="tooltip"
            aria-label={`Division: ${resolvedDivisionTitle}, Certification: ${primaryCert} (${certStatusText})`}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="absolute top-2 inset-x-2 z-30 pointer-events-none transform-gpu"
          >
            <div className="backdrop-blur-md bg-black/80 dark:bg-black/90 border border-white/25 border-t-[#e11d48] border-t-2 rounded-xl px-2.5 py-1.5 shadow-2xl shadow-black/80 text-white flex items-center justify-between gap-2 ring-1 ring-white/10">
              {/* Left: DivisionTitle with active pulsing sourcing node */}
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                </span>
                <div className="min-w-0">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block leading-none">
                    Division
                  </span>
                  <span className="text-[11px] font-black text-white tracking-tight truncate block leading-tight mt-0.5">
                    {resolvedDivisionTitle}
                  </span>
                </div>
              </div>

              {/* Subtle vertical divider */}
              <div className="h-5 w-px bg-white/15 shrink-0" />

              {/* Right: Certification Status */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <div className="text-right">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-[#10b981] font-bold block leading-none flex items-center justify-end space-x-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#10b981] inline" />
                    <span>{certStatusText}</span>
                  </span>
                  <span className="text-[10px] font-bold font-mono text-emerald-300 truncate max-w-[110px] block leading-tight mt-0.5">
                    {primaryCert}
                  </span>
                </div>
                {certList.length > 1 && (
                  <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-white/10 text-slate-300 border border-white/15">
                    +{certList.length - 1}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default State Bottom Overlay */}
      <motion.div
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? 12 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none"
      >
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
      </motion.div>

      {/* 3. ON HOVER: FRAMER MOTION GLASSMORPHIC OPERATIONAL OVERLAY (Slides up from the bottom with 300ms ease-out) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="operational-overlay"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ willChange: 'opacity, transform' }}
            className="absolute inset-0 pt-13 p-3.5 bg-[#0a0a0a]/92 backdrop-blur-md flex flex-col justify-between z-20 text-white transform-gpu"
            onClick={(e) => {
              // Click inside overlay delegates to full view unless an action button is clicked
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
              {/* Swatches with Framer Motion High-Performance spring response */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="uppercase font-bold">Variants / Swatches</span>
                  <span className="text-slate-300 font-medium">{swatches[selectedSwatchIndex]?.name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {swatches.slice(0, 5).map((sw, idx) => {
                    const isSelected = selectedSwatchIndex === idx;
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSwatchIndex(idx);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                        className={`w-5 h-5 rounded-full border cursor-pointer relative flex items-center justify-center transition-shadow ${
                          isSelected
                            ? 'border-[#10b981] ring-2 ring-[#10b981]/60 shadow-xs'
                            : 'border-white/30 hover:border-white/80'
                        }`}
                        style={{
                          backgroundColor: sw.hex,
                          willChange: 'transform',
                        }}
                        title={sw.name}
                        aria-label={`Color variant: ${sw.name}`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, rotate: -25 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 26 }}
                            className="flex items-center justify-center"
                          >
                            <Check
                              className={`w-2.5 h-2.5 ${
                                sw.hex === '#f8fafc' || sw.hex === '#f4f0ea' ? 'text-black' : 'text-white'
                              }`}
                            />
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  })}
                  <span className="text-[9px] text-slate-400 font-mono ml-1">+more</span>
                </div>
              </div>

              {/* Volume Price Tiers with Interactive Price Drop Tooltip */}
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="uppercase font-bold text-slate-400 block">Volume Price Ladder</span>
                  <span className="text-[8.5px] font-mono font-medium text-[#10b981] flex items-center space-x-0.5">
                    <TrendingDown className="w-2.5 h-2.5" />
                    <span>{hoveredTierIndex !== null ? 'Price Drop Active' : 'Hover tier for drop'}</span>
                  </span>
                </div>

                {/* Interactive Price Drop Tooltip */}
                <AnimatePresence>
                  {hoveredTierIndex !== null && product.priceTiers?.[hoveredTierIndex] && (() => {
                    const activeTier = product.priceTiers[hoveredTierIndex];
                    const activeTierPriceUSD = activeTier.priceUSD;
                    const activeTierPriceConverted = activeTierPriceUSD * currency.rate;
                    const dropFromBaseUSD = Math.max(0, highestPriceUSD - activeTierPriceUSD);
                    const dropFromBaseConverted = dropFromBaseUSD * currency.rate;
                    const dropPercent = highestPriceUSD > 0 ? ((dropFromBaseUSD / highestPriceUSD) * 100).toFixed(1) : '0';
                    const prevTier = hoveredTierIndex > 0 ? product.priceTiers[hoveredTierIndex - 1] : null;
                    const stepDropUSD = prevTier ? Math.max(0, prevTier.priceUSD - activeTierPriceUSD) : 0;
                    const stepDropConverted = stepDropUSD * currency.rate;
                    const batchSavings = dropFromBaseConverted * activeTier.minQty;
                    const arrowLeft = hoveredTierIndex === 0 ? '16.6%' : hoveredTierIndex === 1 ? '50%' : '83.3%';

                    return (
                      <motion.div
                        key={`tier-tooltip-${hoveredTierIndex}`}
                        role="tooltip"
                        aria-live="polite"
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute bottom-full left-0 right-0 mb-1.5 z-40 pointer-events-none transform-gpu"
                      >
                        <div className="backdrop-blur-xl bg-[#090d16]/95 border border-[#10b981]/50 rounded-xl p-2.5 shadow-2xl shadow-black/90 ring-1 ring-white/10 text-white">
                          {/* Header */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                              <span className="text-[10px] font-mono font-bold text-slate-200">
                                Tier {hoveredTierIndex + 1}: {activeTier.minQty.toLocaleString()}+ {product.unit}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono font-black text-[#10b981]">
                              {currency.symbol}{activeTierPriceConverted.toFixed(2)}
                              <span className="text-[8.5px] text-slate-400 font-sans font-normal ml-0.5">/unit</span>
                            </div>
                          </div>

                          {/* Body */}
                          {hoveredTierIndex === 0 ? (
                            <div className="text-[9.5px] text-slate-300 leading-tight">
                              <span className="text-amber-300 font-semibold block mb-0.5">Starting Baseline FOB Rate</span>
                              <span>
                                Order {product.priceTiers[1]?.minQty.toLocaleString() || 'higher'}+ {product.unit} to unlock volume price drop of{' '}
                                <strong className="text-[#10b981] font-mono">
                                  -{currency.symbol}{((highestPriceUSD - (product.priceTiers[1]?.priceUSD ?? highestPriceUSD)) * currency.rate).toFixed(2)}/unit
                                </strong>.
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-300 flex items-center space-x-1">
                                  <TrendingDown className="w-3 h-3 text-[#10b981] shrink-0" />
                                  <span>Exact Price Drop:</span>
                                </span>
                                <span className="font-mono font-black text-[#10b981]">
                                  -{currency.symbol}{dropFromBaseConverted.toFixed(2)}
                                  <span className="text-[8.5px] text-emerald-400 font-bold ml-1">(-{dropPercent}%)</span>
                                </span>
                              </div>

                              {hoveredTierIndex > 1 && stepDropConverted > 0 && (
                                <div className="flex items-center justify-between text-[8.5px] text-slate-400 font-mono">
                                  <span>Step drop vs Tier {hoveredTierIndex}:</span>
                                  <span className="text-emerald-300 font-bold">-{currency.symbol}{stepDropConverted.toFixed(2)}/unit</span>
                                </div>
                              )}

                              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[9px]">
                                <span className="text-slate-400">Order Batch Savings:</span>
                                <span className="font-mono font-bold text-amber-300">
                                  Save {currency.symbol}{Math.round(batchSavings).toLocaleString()} at MOQ
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Pointer caret arrow */}
                          <div
                            className="absolute -bottom-1 w-2 h-2 bg-[#090d16] border-r border-b border-[#10b981]/50 rotate-45 -translate-x-1/2"
                            style={{ left: arrowLeft }}
                          />
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                <div className="grid grid-cols-3 gap-1 text-center font-mono">
                  {product.priceTiers.slice(0, 3).map((tier, i) => {
                    const isTierHovered = hoveredTierIndex === i;
                    const tierPriceUSD = tier.priceUSD;
                    const dropUSD = Math.max(0, highestPriceUSD - tierPriceUSD);
                    const dropConverted = dropUSD * currency.rate;

                    return (
                      <motion.button
                        key={i}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onMouseEnter={() => setHoveredTierIndex(i)}
                        onMouseLeave={() => setHoveredTierIndex(null)}
                        onFocus={() => setHoveredTierIndex(i)}
                        onBlur={() => setHoveredTierIndex(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setHoveredTierIndex(hoveredTierIndex === i ? null : i);
                        }}
                        aria-label={`Volume Tier ${tier.minQty}+ pcs, ${currency.symbol}${(tier.priceUSD * currency.rate).toFixed(2)} per unit${i > 0 ? `, price drop ${currency.symbol}${dropConverted.toFixed(2)} per unit` : ''}`}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer relative flex flex-col justify-between items-center ${
                          isTierHovered
                            ? 'bg-[#10b981]/20 border-[#10b981] ring-2 ring-[#10b981]/60 shadow-lg shadow-[#10b981]/15'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-[8.5px] text-slate-300 font-sans truncate w-full text-center">
                          {tier.minQty.toLocaleString()}+ pcs
                        </div>
                        <div className="text-[11px] font-bold text-[#10b981] leading-tight mt-0.5">
                          {currency.symbol}{(tier.priceUSD * currency.rate).toFixed(2)}
                        </div>
                        {i > 0 ? (
                          <div className="text-[7.5px] font-bold text-emerald-400 font-mono mt-0.5 flex items-center justify-center space-x-0.5">
                            <TrendingDown className="w-2 h-2" />
                            <span>-{currency.symbol}{dropConverted.toFixed(2)}</span>
                          </div>
                        ) : (
                          <div className="text-[7.5px] text-slate-400 font-mono mt-0.5">
                            Base FOB
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
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

            {/* Bottom Quick-Action Buttons with Motion Tap feedback */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToTechPack) {
                    onAddToTechPack(product);
                  } else {
                    onSelectProduct(product);
                  }
                }}
                className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                title="Export Spec to CAD TechPack Studio"
              >
                <FileText className="w-3 h-3 text-[#10b981]" />
                <span className="truncate">TechPack Spec</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOutboundSourcing}
                className="py-2 px-2.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                title="Procure Direct on Dedicated Node"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="truncate">Procure Direct</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

