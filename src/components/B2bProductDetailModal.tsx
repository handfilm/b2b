import React, { useState, useRef, useEffect } from 'react';
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
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { B2bCatalogProduct, CurrencyConfig } from '../types';
import { getCatalogImageUrl, handleImageFallback } from '../utils/imageUrl';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedImgIdx(0);
      setIsZoomed(false);
      setIsFullscreen(false);
    }
  }, [product]);

  // Keyboard navigation for image angles and Escape for fullscreen/modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && product?.images && product.images.length > 1) {
        setSelectedImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
      } else if (e.key === 'ArrowRight' && product?.images && product.images.length > 1) {
        setSelectedImgIdx((prev) => (prev + 1) % product.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, product, onClose]);

  if (!isOpen || !product) return null;

  const priceConv = (product.price * currency.rate).toFixed(2);
  const validImages = (product.images || []).filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()));
  const currentImg = validImages[selectedImgIdx] || validImages[0] || (product.image && typeof product.image === 'string' && product.image.trim() ? product.image : null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col p-4 sm:p-6 text-white animate-in fade-in duration-200">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-black text-white truncate max-w-2xl">{product.title}</h3>
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Angle {selectedImgIdx + 1} of {validImages.length || 1} • {
                  selectedImgIdx === 0 ? 'Front Cut' :
                  selectedImgIdx === 1 ? (product.frontPrint ? `Print: ${product.frontPrint}` : 'Chest Graphic') :
                  selectedImgIdx === 2 ? (product.club ? `${product.club} #` : 'Back View') :
                  'Tokyo Std QC Audit'
                }</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Toggle 2.4x Zoom"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4 text-amber-400" /> : <ZoomIn className="w-4 h-4 text-emerald-400" />}
                <span className="hidden sm:inline">{isZoomed ? 'Zoom 1x' : 'Zoom 2.4x'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors cursor-pointer"
                title="Exit Fullscreen (Esc)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Photo Viewing Arena */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onClick={() => setIsZoomed(!isZoomed)}
            className={`relative flex-1 w-full my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/80 border border-white/10 select-none ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
          >
            {currentImg ? (
              <img
                src={getCatalogImageUrl(currentImg)}
                alt={product.title}
                onError={(e) => handleImageFallback(e)}
                style={
                  isZoomed
                    ? {
                        transform: 'scale(2.4)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transition: 'transform 0.15s ease-out',
                      }
                    : { transform: 'scale(1)', transition: 'transform 0.25s ease-out' }
                }
                className="max-h-[80vh] w-auto max-w-full object-contain transform-gpu select-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <span className="text-red-600 font-mono text-5xl uppercase font-black tracking-widest leading-none">
                  {product.title.replace(/^(Bulk Custom Batch|Rapid Turnaround Edition|Premium Export Spec)\s*[•·-]\s*/i, '').trim().slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">IMAGE PENDING</span>
              </div>
            )}

            {/* Left / Right Chevron Navigation in Fullscreen */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous angle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx((prev) => (prev - 1 + validImages.length) % validImages.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next angle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIdx((prev) => (prev + 1) % validImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Fullscreen Zoom Hint */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-lg">
                {isZoomed ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>2.4x Zoom Active • Pan cursor to explore textures • Click to reset</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Click photo or toggle button to Zoom (2.4x)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Fullscreen Thumbnails Filmstrip */}
          {validImages.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 shrink-0">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    selectedImgIdx === idx ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getCatalogImageUrl(img)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageFallback(e)}
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[9px] font-mono text-center text-white py-0.5 truncate">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Print' : idx === 2 ? 'Back' : 'QC'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STANDARD MODAL CONTAINER */}
      <div
        className="relative w-full max-w-6xl xl:max-w-7xl bg-[#11141c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#161a24]/90 backdrop-blur-md">
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

        {/* Modal Scrollable Body: Dominant Photo Space (8-9 cols) + Lower Space Details (3-4 cols) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: COMMANDING PHOTO GALLERY (lg:col-span-8 xl:col-span-8 2xl:col-span-9) */}
          <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-4">
            {/* Main Interactive Angle Viewer */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
              className={`relative aspect-[4/3] sm:aspect-[16/11] xl:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl flex items-center justify-center select-none group/modalImg ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              {currentImg ? (
                <>
                  <img
                    src={getCatalogImageUrl(currentImg)}
                    alt={product.title}
                    onError={(e) => handleImageFallback(e)}
                    style={
                      isZoomed
                        ? {
                            transform: 'scale(2.4)',
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            transition: 'transform 0.15s ease-out',
                          }
                        : { transform: 'scale(1)', transition: 'transform 0.25s ease-out' }
                    }
                    className="w-full h-full object-cover object-center transform-gpu select-none"
                  />

                  {/* Floating badges Top Left */}
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

                  {/* Top Right Zoom and Fullscreen Toolbar */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(!isZoomed);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title={isZoomed ? 'Reset Zoom (1x)' : 'Interactive Zoom (2.4x)'}
                    >
                      {isZoomed ? <ZoomOut className="w-4 h-4 text-amber-400" /> : <ZoomIn className="w-4 h-4 text-emerald-400" />}
                      <span>{isZoomed ? '1x' : '2.4x'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(true);
                      }}
                      className="p-2 rounded-xl bg-black/80 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Enter Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Navigation Chevrons */}
                  {validImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous angle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImgIdx((prev) => (prev - 1 + validImages.length) % validImages.length);
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
                          setSelectedImgIdx((prev) => (prev + 1) % validImages.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </>
                  )}

                  {/* Bottom Zoom Tip */}
                  <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm border border-white/10 text-[10.5px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
                      {isZoomed ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Pan cursor to inspect texture • Click to reset</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Click photo or Zoom button for high-res detail</span>
                        </>
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                    <span className="text-red-600 font-mono text-4xl uppercase font-black tracking-widest leading-none">
                      {product.title.replace(/^(Bulk Custom Batch|Rapid Turnaround Edition|Premium Export Spec)\s*[•·-]\s*/i, '').trim().slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold border-t border-zinc-800/80 pt-2 px-3">
                      IMAGE PENDING
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {validImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImgIdx === idx ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getCatalogImageUrl(img)}
                      alt="thumb"
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageFallback(e)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Factory Credentials Box */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
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

          {/* Right Column: COMPACT LOWER SPACE DETAILS (lg:col-span-4 xl:col-span-4 2xl:col-span-3) */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                    {product.subdivision || product.subcategorySlug.replace(/-/g, ' ')}
                  </span>
                  {product.brand && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-[10.5px] font-black font-mono text-rose-300 uppercase tracking-wide">
                      Brand: {product.brand}
                    </span>
                  )}
                  {product.club && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-500/50 text-[10.5px] font-bold font-mono text-blue-300 tracking-tight">
                      Club: {product.club}
                    </span>
                  )}
                  {product.frontPrint && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10.5px] font-bold font-mono text-amber-300">
                      Print: {product.frontPrint}
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white mt-1 leading-snug">
                  {product.title}
                </h1>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Price Tier Grid */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Wholesale Export Pricing</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-400 tracking-tight">
                        {currency.symbol}{priceConv}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/ {product.unit || 'pc'} FOB</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">Sample Fee</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {currency.symbol}{((product.samplePriceUSD || 30) * currency.rate).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Volume Tier Table */}
                {product.priceTiers && (
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-emerald-500/20 text-center">
                    {product.priceTiers.map((tier, i) => (
                      <div key={i} className="p-1.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[9.5px] font-mono text-slate-400 block">
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
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider">
                    Export Colorways
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colorVariants.map((col, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="font-semibold text-slate-200 text-[11px]">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Specifications
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {product.specifications?.slice(0, 4).map((spec, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[9px] font-mono text-slate-400 block">{spec.label}</span>
                      <span className="font-bold text-slate-200 text-[11px] truncate block">{spec.value}</span>
                    </div>
                  ))}
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 block">Port</span>
                    <span className="font-bold text-slate-200 text-[11px] truncate block">{product.portOfLoading || 'CGP Port'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 block">Lead Time</span>
                    <span className="font-bold text-emerald-400 font-mono text-[11px]">{product.leadTimeDays} Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons Footer */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onRequestSample(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-xl shadow-rose-950/50 hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Request Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRequestTechPack(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>TechPack Spec</span>
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
