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
  ShoppingCart,
  X,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { FEDERATED_DIVISIONS } from '../data/divisions';
import { useInquiryCart } from '../context/InquiryCartContext';
import { useI18n } from '../context/I18nContext';
import { ProductImageCarousel } from './ProductImageCarousel';

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
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showSpecsOverlay, setShowSpecsOverlay] = useState(false);
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);

  const { addToCart } = useInquiryCart();

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

  const cleanTitle = product.title
    .replace(/^(Bulk Custom Batch|Rapid Turnaround Edition|Premium Export Spec|Eco-Wash Sustainable|Organic Certified Lot|High-Tensile Contract|Private Label Ready)\s*[•·-]\s*/i, '')
    .trim();
  const titleWords = cleanTitle.split(/\s+/).filter((w) => /^[a-zA-Z0-9]/.test(w));
  const productInitials = (
    titleWords.length >= 2
      ? ((titleWords[0].replace(/[^a-zA-Z0-9]/g, '')[0] || '') + (titleWords[1].replace(/[^a-zA-Z0-9]/g, '')[0] || ''))
      : cleanTitle.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2)
  ).toUpperCase() || 'BD';

  const validImages = (product.images || []).filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()));
  const hasImage = Boolean(product.image && typeof product.image === 'string' && product.image.trim()) || validImages.length > 0;

  const handleCardClick = () => {
    onSelectProduct(product);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onTouchStart={() => {
        if (!isHovered) {
          setIsHovered(true);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSpecsOverlay(false);
        setHoveredTierIndex(null);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false);
        setShowSpecsOverlay(false);
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
      {/* 1. PRODUCT MEDIA: High-Fidelity Carousel or Premium Brutalist Fallback UI */}
      {!hasImage ? (
        <div className="absolute inset-0 w-full h-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden group/fallback">
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />
          {/* Persistent Soft Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <span className="text-red-600 font-mono text-2xl uppercase font-black tracking-widest leading-none">
              {productInitials}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold border-t border-zinc-800/80 pt-2 px-2">
              IMAGE PENDING
            </span>
          </div>
        </div>
      ) : (
        <ProductImageCarousel
          images={validImages.length > 0 ? validImages : [product.image!]}
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
            'Tokyo Std QC & Fabric',
          ]}
        />
      )}

      {/* Top Badges (Revealed smoothly on hover/touch) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="top-badges"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between pointer-events-none z-20"
          >
            <div className="flex flex-wrap gap-1.5 items-center">
              {product.brand && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md font-mono shadow-xs">
                  {product.brand}
                </span>
              )}
              {product.club ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-xs">
                  {product.club}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {resolvedDivisionTitle}
                </span>
              )}
              <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-slate-200 border border-white/20 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                <span>{primaryCert}</span>
              </span>
            </div>

            {product.bestseller && (
              <span className="bg-[#e11d48] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider font-mono flex items-center space-x-1">
                <Flame className="w-2.5 h-2.5 fill-current" />
                <span>{isBn ? 'জনপ্রিয়' : 'BESTSELLER'}</span>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MINIMAL CLEAN RESTING BOTTOM BAR (Visible when NOT hovered) */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            key="minimal-resting-footer"
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
                  {currency.symbol}
                  {toDigits(lowestConverted)}
                </span>
                {highestConverted !== lowestConverted && (
                  <span className="text-[10px] text-slate-300 font-mono">
                    - {currency.symbol}
                    {toDigits(highestConverted)}
                  </span>
                )}
                <span className="text-[10px] text-slate-400">/ {product.unit.toLowerCase().replace(/s$/, '')}</span>
              </div>

              <span className="text-[10px] font-mono font-semibold text-slate-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
                MOQ: {toDigits(product.moq)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. NEXT-LEVEL ANIMATED HOVER OVERLAY: All Details with Carousel Active */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="hover-details-sheet"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'opacity, transform' }}
            className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-[#0a0a0c]/98 via-[#0f1118]/95 to-transparent backdrop-blur-md flex flex-col justify-end z-20 text-white transform-gpu space-y-2 border-t border-white/10"
            onClick={(e) => {
              // Click inside overlay delegates to full view unless an action button is clicked
            }}
          >
            {/* Title & Quick specs snippet */}
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 mb-0.5">
                <span className="uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{resolvedDivisionTitle}</span>
                </span>
                <span className="text-slate-400">HS {product.hsCode || '6109.10'}</span>
              </div>
              <h4 className="text-xs sm:text-[13px] font-black line-clamp-1 text-white leading-tight">
                {product.title}
              </h4>
              <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between mt-0.5">
                <span className="truncate max-w-[200px] text-slate-300">{gsmSpec}</span>
                <span className="text-emerald-400 shrink-0">Lead: 25-35d</span>
              </div>
            </div>

            {/* Interactive Volume Price Tiers */}
            <div className="space-y-1 relative">
              <div className="flex items-center justify-between text-[9px]">
                <span className="uppercase font-bold text-slate-400 block">{isBn ? 'বাল্ক মূল্য' : 'Volume Ladder'}</span>
                <span className="text-[8.5px] font-mono text-[#10b981] flex items-center space-x-0.5">
                  <TrendingDown className="w-2.5 h-2.5" />
                  <span>{hoveredTierIndex !== null ? (isBn ? 'মূল্য ছাড় সক্রিয়' : 'Price Drop Active') : (isBn ? 'ছাড় দেখতে ধরুন' : 'Hover tier')}</span>
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
                  const arrowLeft = hoveredTierIndex === 0 ? '16.6%' : hoveredTierIndex === 1 ? '50%' : '83.3%';

                  return (
                    <motion.div
                      key={`tier-tooltip-${hoveredTierIndex}`}
                      role="tooltip"
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 3, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute bottom-full left-0 right-0 mb-1 z-40 pointer-events-none transform-gpu"
                    >
                      <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#10b981]/50 rounded-xl p-2 shadow-2xl ring-1 ring-white/10 text-white text-[9.5px]">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-200">
                            Tier {hoveredTierIndex + 1}: {activeTier.minQty.toLocaleString()}+ {product.unit}
                          </span>
                          <span className="font-mono font-black text-[#10b981]">
                            {currency.symbol}{activeTierPriceConverted.toFixed(2)}/unit
                          </span>
                        </div>
                        {hoveredTierIndex > 0 && dropFromBaseConverted > 0 && (
                          <div className="text-[8.5px] text-emerald-400 font-mono mt-0.5">
                            Save -{currency.symbol}{dropFromBaseConverted.toFixed(2)}/unit (-{dropPercent}%)
                          </div>
                        )}
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
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onMouseEnter={() => setHoveredTierIndex(i)}
                      onMouseLeave={() => setHoveredTierIndex(null)}
                      onFocus={() => setHoveredTierIndex(i)}
                      onBlur={() => setHoveredTierIndex(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredTierIndex(hoveredTierIndex === i ? null : i);
                      }}
                      className={`p-1 rounded-md border transition-all cursor-pointer relative flex flex-col justify-between items-center ${
                        isTierHovered
                          ? 'bg-[#10b981]/25 border-[#10b981] ring-1 ring-[#10b981]/70'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="text-[8px] text-slate-400 font-sans truncate w-full text-center">
                        {tier.minQty.toLocaleString()}+ pcs
                      </div>
                      <div className="text-[10px] font-bold text-[#10b981] leading-tight mt-0.5">
                        {currency.symbol}{(tier.priceUSD * currency.rate).toFixed(2)}
                      </div>
                      {i > 0 && dropConverted > 0 ? (
                        <div className="text-[7.5px] font-bold text-emerald-400 font-mono">
                          -{currency.symbol}{dropConverted.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-[7.5px] text-slate-500 font-mono">Base</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatches */}
            {swatches && swatches.length > 0 && (
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{isBn ? 'রং' : 'Color'}</span>
                <div className="flex items-center space-x-1.5">
                  {swatches.slice(0, 4).map((sw, idx) => {
                    const isSelected = selectedSwatchIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSwatchIndex(idx);
                        }}
                        className={`w-3.5 h-3.5 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                          isSelected ? 'border-white ring-1 ring-emerald-400 scale-110' : 'border-white/30 hover:border-white/80'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      >
                        {isSelected && (
                          <Check className={`w-2 h-2 ${sw.hex === '#f8fafc' || sw.hex === '#f4f0ea' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                  <span className="text-[8.5px] text-slate-400 font-mono">+{swatches.length}</span>
                </div>
              </div>
            )}

            {/* Quick-Action Buttons */}
            <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-white/10">
              <motion.button
                type="button"
                id={`btn-inquire-${product.id}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInquire(product);
                }}
                className="py-1.5 px-1 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[10px] font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
                title="Send Direct Factory RFQ"
              >
                <Send className="w-2.5 h-2.5" />
                <span>{isBn ? 'কোটেশন' : 'RFQ'}</span>
              </motion.button>

              <motion.button
                type="button"
                id={`btn-chat-agent-${product.id}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenAiAssistant) {
                    onOpenAiAssistant(product);
                  } else {
                    onInquire(product);
                  }
                }}
                className="py-1.5 px-1 rounded-lg bg-[#10b981] hover:bg-[#059669] text-slate-950 text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                title="Chat with AI Sourcing Agent"
              >
                <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                <span>AI</span>
              </motion.button>

              <motion.button
                type="button"
                id={`btn-cart-${product.id}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="py-1.5 px-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[9.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Add to B2B Inquiry Cart"
              >
                <ShoppingCart className="w-2.5 h-2.5 text-rose-400" />
                <span>+Cart</span>
              </motion.button>

              <motion.button
                type="button"
                id={`btn-cad-${product.id}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToTechPack) {
                    onAddToTechPack(product);
                  } else {
                    onSelectProduct(product);
                  }
                }}
                className="py-1.5 px-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[9.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="View TechPack CAD"
              >
                <FileText className="w-2.5 h-2.5 text-emerald-400" />
                <span>CAD</span>
              </motion.button>
            </div>

            {/* Subtle Zoom & Cinema View Hint */}
            <div className="pt-0.5 text-center">
              <span className="text-[9px] font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-1">
                <SlidersHorizontal className="w-2.5 h-2.5 text-[#e11d48]" />
                <span>Click for Cinema View & 2x Zoom</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

