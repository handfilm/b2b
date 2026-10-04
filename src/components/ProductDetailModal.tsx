import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Anchor,
  Leaf,
  Layers,
  FileText,
  Mail,
  Box,
  Truck,
  Building2,
  DollarSign,
  Send,
  Sparkles,
  ExternalLink,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Product, Supplier, CurrencyConfig } from '../types';
import { useInquiryCart } from '../context/InquiryCartContext';
import { useI18n } from '../context/I18nContext';
import { getCatalogImageUrl, handleImageFallback } from '../utils/imageUrl';

interface ProductDetailModalProps {
  product: Product | null;
  supplier?: Supplier;
  currency: CurrencyConfig;
  onClose: () => void;
  onRequestSample: (product: Product) => void;
  onInquire: (product: Product, customMessage?: string) => void;
  onOpenShippingCalc: (port?: string) => void;
  onOpenAiAssistant?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  supplier,
  currency,
  onClose,
  onRequestSample,
  onInquire,
  onOpenShippingCalc,
  onOpenAiAssistant,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calculatorQty, setCalculatorQty] = useState(product?.moq || 100);
  const [selectedIncoterm, setSelectedIncoterm] = useState(product?.incoterms?.[0] || 'FOB');
  const [quickMsg, setQuickMsg] = useState('');
  const [sentNotice, setSentNotice] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useInquiryCart();
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setCalculatorQty(product.moq || 100);
      setSelectedIncoterm(product.incoterms?.[0] || 'FOB');
      setQuickMsg('');
      setSentNotice(false);
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
        setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      } else if (e.key === 'ArrowRight' && product?.images && product.images.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, product, onClose]);

  if (!product) return null;

  const validImages = (product.images || []).filter((img): img is string => Boolean(img && typeof img === 'string' && img.trim()));
  const currentImageSrc = validImages[activeImageIndex] || validImages[0] || (product.image && typeof product.image === 'string' ? product.image : null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Determine pricing based on entered quantity
  const getUnitPrice = (qty: number) => {
    if (!product.priceTiers || product.priceTiers.length === 0) return 0;
    let unit = product.priceTiers[0].priceUSD;
    for (const tier of product.priceTiers) {
      if (qty >= tier.minQty) {
        unit = tier.priceUSD;
      }
    }
    return unit;
  };

  const currentUnitPriceUSD = getUnitPrice(calculatorQty);
  const totalUSD = currentUnitPriceUSD * calculatorQty;
  const unitConverted = (currentUnitPriceUSD * currency.rate).toFixed(2);
  const totalConverted = (totalUSD * currency.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSendQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    onInquire(product, quickMsg || `Inquiry for ${calculatorQty} ${product.unit} under ${selectedIncoterm}`);
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col p-4 sm:p-6 text-white animate-in fade-in duration-200">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-black text-white truncate max-w-2xl">{product.title}</h3>
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Angle {activeImageIndex + 1} of {validImages.length || 1} • {
                  activeImageIndex === 0 ? 'Front Studio Cut' :
                  activeImageIndex === 1 ? (product.frontPrint ? `Print: ${product.frontPrint}` : 'Chest Detail') :
                  activeImageIndex === 2 ? (product.club ? `${product.club} Back Silhouette` : 'Back Silhouette') :
                  'Tokyo Std QC & Fabric'
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
            {currentImageSrc ? (
              <img
                src={getCatalogImageUrl(currentImageSrc)}
                alt={product.title}
                referrerPolicy="no-referrer"
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
                    setActiveImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
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
                    setActiveImageIndex((prev) => (prev + 1) % validImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Fullscreen Zoom Hint Overlay */}
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
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getCatalogImageUrl(img)}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
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
        id="product-detail-modal-container"
        className="relative w-full max-w-6xl xl:max-w-7xl bg-[#0e0e11] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#141418]/95 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">b2b.handsandhead.com</span>
            <span className="text-slate-500">/</span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 font-bold">
              HS {product.hsCode || '6109.10'}
            </span>
            {product.ecoFriendly && (
              <span className="hidden sm:flex text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 items-center space-x-1">
                <Leaf className="w-3 h-3 mr-1 text-[#10b981]" />
                <span>{isBn ? 'সবুজ পরিবেশবান্ধব' : 'Green Eco Export'}</span>
              </span>
            )}
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Dominant Photo Space (8-9 cols) + Lower Space Details (3-4 cols) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Gallery Column: COMMANDING PHOTO SPACE (lg:col-span-8 xl:col-span-8 2xl:col-span-9) */}
            <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-3.5">
              {/* Main Interactive High-Res Photo Viewer */}
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onClick={() => setIsZoomed(!isZoomed)}
                className={`relative aspect-[4/3] sm:aspect-[16/11] xl:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl flex items-center justify-center select-none group/viewer ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              >
                {currentImageSrc ? (
                  <>
                    <img
                      src={getCatalogImageUrl(currentImageSrc)}
                      alt={product.title}
                      referrerPolicy="no-referrer"
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
                      className="w-full h-full object-cover transform-gpu select-none"
                    />

                    {/* Top Left Angle & Quality Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-md z-10 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>
                        {activeImageIndex === 0
                          ? '1/4 Front Studio Cut'
                          : activeImageIndex === 1
                          ? product.frontPrint ? `2/4 Print: ${product.frontPrint}` : '2/4 Chest Print Detail'
                          : activeImageIndex === 2
                          ? product.club ? `3/4 ${product.club} Back #` : '3/4 Back Silhouette'
                          : '4/4 Tokyo Std QC & Fabric'}
                      </span>
                    </div>

                    {/* Top Right Zoom and Fullscreen Floating Toolbar */}
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

                    {/* Left & Right Chevrons */}
                    {validImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous angle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer z-10 opacity-80 group-hover/viewer:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next angle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev + 1) % validImages.length);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer z-10 opacity-80 group-hover/viewer:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Bottom Floating Zoom Tip */}
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
                            <span>Click or Zoom button to inspect fabric details</span>
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

              {/* Thumbnails Row */}
              {validImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {validImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-102' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getCatalogImageUrl(img)}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageFallback(e)}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono text-center text-white py-0.5 truncate px-1">
                        {idx === 0 ? 'Front' : idx === 1 ? 'Print' : idx === 2 ? 'Back' : 'QC'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Supplier & Facility Banner */}
              <div className="p-3.5 rounded-2xl bg-[#141419] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center space-x-1.5">
                      <span>{product.supplierName}</span>
                      {product.supplierVerified && <ShieldCheck className="w-4 h-4 text-[#10b981]" />}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {product.portOfLoading} • Lead: {product.leadTimeDays} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-[#10b981] font-bold font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <span>★</span>
                  <span>{toDigits(product.supplierRating)} Rating</span>
                </div>
              </div>
            </div>

            {/* Product Specifications & Pricing Column: COMPACT LOWER SPACE (lg:col-span-4 xl:col-span-4 2xl:col-span-3) */}
            <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-3.5">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {product.brand && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 font-mono">
                      {product.brand}
                    </span>
                  )}
                  {product.club && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      {product.club}
                    </span>
                  )}
                  {product.frontPrint && (
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Print: {product.frontPrint}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                  {product.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tiered Price Matrix */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isBn ? 'ভলিউম এফওবি মূল্য তালিকা' : 'Volume FOB Pricing Tiers (USD)'}
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {product.priceTiers.map((tier, idx) => {
                    const tierConverted = (tier.priceUSD * currency.rate).toFixed(2);
                    return (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-[#141418] border border-white/5 text-center font-mono"
                      >
                        <div className="text-[9.5px] text-slate-400">
                          {tier.maxQty ? `${toDigits(tier.minQty.toLocaleString())} - ${toDigits(tier.maxQty.toLocaleString())}` : `${toDigits(tier.minQty.toLocaleString())}+`}
                        </div>
                        <div className="text-sm font-black text-[#10b981] mt-0.5">
                          {currency.symbol}{toDigits(tierConverted)}
                        </div>
                        <div className="text-[8.5px] text-slate-500">FOB CGP</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant Sourcing Cost Calculator */}
              <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{isBn ? 'অর্ডার হিসাবকারী' : 'Instant Cost Calculator'}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    MOQ: {toDigits(product.moq)} {product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {isBn ? 'অর্ডারের পরিমাণ' : 'Quantity'}
                    </label>
                    <input
                      type="number"
                      min={product.moq}
                      step={100}
                      value={calculatorQty}
                      onChange={(e) => setCalculatorQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                      className="w-full bg-[#1c1c24] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {isBn ? 'ইনকোটার্ম' : 'Incoterm'}
                    </label>
                    <select
                      value={selectedIncoterm}
                      onChange={(e) => setSelectedIncoterm(e.target.value as any)}
                      className="w-full bg-[#1c1c24] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e11d48] cursor-pointer"
                    >
                      {product.incoterms.map((inco) => (
                        <option key={inco} value={inco} className="bg-[#121212]">
                          {inco}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Unit Cost:</span>
                    <span className="font-mono text-xs font-bold text-white">{currency.symbol}{toDigits(unitConverted)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Estimated FOB Total:</span>
                    <span className="font-mono text-base font-black text-[#10b981]">{currency.symbol}{toDigits(totalConverted)}</span>
                  </div>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isBn ? 'কারিগরি বিবরণ' : 'Technical Specifications'}
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {product.specifications.slice(0, 4).map((spec, idx) => (
                    <div key={idx} className="p-2 bg-[#141418] rounded-xl border border-white/5">
                      <span className="text-slate-500 text-[9.5px] block uppercase">{spec.label}</span>
                      <span className="font-semibold text-white mt-0.5 block truncate text-[11px]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Contact Form */}
              <form onSubmit={handleSendQuickInquiry} className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Custom notes, Pantone shade, specs..."
                    value={quickMsg}
                    onChange={(e) => setQuickMsg(e.target.value)}
                    className="flex-1 bg-[#141418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e11d48]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#e11d48]/25 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </div>

                {sentNotice && (
                  <div className="text-xs text-[#10b981] flex items-center space-x-1 font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inquiry dispatched!</span>
                  </div>
                )}
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  id="modal-add-to-inquiry-cart-btn"
                  onClick={() => {
                    addToCart(product, {
                      requestedQty: calculatorQty,
                      targetPrice: currentUnitPriceUSD,
                      itemMessage: quickMsg.trim() || `Commercial inquiry for ${calculatorQty} ${product.unit} under ${selectedIncoterm}`,
                    });
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-[#e11d48]/20"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Add to RFQ Cart</span>
                </button>

                {product.sampleAvailable && (
                  <button
                    onClick={() => onRequestSample(product)}
                    className="py-2.5 px-3 rounded-xl border border-white/10 hover:border-[#e11d48]/50 text-white bg-[#17171c] hover:bg-[#202028] text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Sample ({currency.symbol}${(product.samplePriceUSD * currency.rate).toFixed(2)})</span>
                  </button>
                )}

                {product.targetRoutingUrl && (
                  <a
                    href={product.targetRoutingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Origin Checkout</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
