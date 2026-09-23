import React, { useState } from 'react';
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
} from 'lucide-react';
import { Product, Supplier, CurrencyConfig } from '../types';
import { useInquiryCart } from '../context/InquiryCartContext';
import { useI18n } from '../context/I18nContext';

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

  const { addToCart } = useInquiryCart();
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  React.useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setCalculatorQty(product.moq || 100);
      setSelectedIncoterm(product.incoterms?.[0] || 'FOB');
      setQuickMsg('');
      setSentNotice(false);
    }
  }, [product]);

  if (!product) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-4xl bg-[#0e0e0e] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#1f1f1f] text-slate-300 border border-white/5">
              HS Code {product.hsCode}
            </span>
            {product.ecoFriendly && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center space-x-1">
                <Leaf className="w-3.5 h-3.5 mr-1 text-[#10b981]" />
                <span>{isBn ? 'সবুজ পরিবেশবান্ধব রপ্তানি' : 'Green Eco Export'}</span>
              </span>
            )}
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#171717] border border-white/10 relative">
                <img
                  src={product.images[activeImageIndex] || product.images[0] || '/catalog/club-football/club-01.jpg'}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/catalog/club-football/club-01.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200">
                  {activeImageIndex === 0
                    ? '1/4 Front Studio Cut'
                    : activeImageIndex === 1
                    ? product.frontPrint ? `2/4 Print: ${product.frontPrint}` : '2/4 Chest Print Detail'
                    : activeImageIndex === 2
                    ? product.club ? `3/4 ${product.club} Back #` : '3/4 Back Silhouette'
                    : '4/4 Tokyo Std QC & Fabric'}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-[#e11d48] ring-1 ring-[#e11d48]' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/catalog/club-football/club-01.jpg';
                        }}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8.5px] font-mono text-center text-white py-0.5 truncate px-0.5">
                        {idx === 0 ? 'Front' : idx === 1 ? 'Print' : idx === 2 ? 'Back' : 'QC'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Supplier Block */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {isBn ? 'প্রস্তুতকারক' : 'Manufacturer'}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] text-[#10b981] font-bold font-mono">
                    <span>★</span>
                    <span>{toDigits(product.supplierRating)} {isBn ? 'রেটিং' : 'Rating'}</span>
                  </div>
                </div>
                <div className="font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>{product.supplierName}</span>
                  {product.supplierVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  )}
                </div>
                {supplier && (
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>{isBn ? 'অবস্থান: ' : 'Location: '}{supplier.district}</div>
                    {supplier.leedStatus && (
                      <div className="text-[#10b981] font-semibold">
                        {isBn ? `লিড ${supplier.leedStatus} সনদপ্রাপ্ত মিল` : `LEED ${supplier.leedStatus} Certified Mill`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications & Pricing Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {product.brand && (
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 font-mono">
                      {product.brand}
                    </span>
                  )}
                  {product.club && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      {product.club}
                    </span>
                  )}
                  {product.frontPrint && (
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Print: {product.frontPrint}
                    </span>
                  )}
                  {product.backPrint && (
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      Back: {product.backPrint}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {product.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tiered Price Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isBn ? 'ভলিউম এফওবি মূল্য তালিকা' : 'Volume FOB Pricing Tiers (USD)'}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {product.priceTiers.map((tier, idx) => {
                    const tierConverted = (tier.priceUSD * currency.rate).toFixed(2);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#141414] border border-white/5 text-center font-mono"
                      >
                        <div className="text-[10px] text-slate-500">
                          {tier.maxQty ? `${toDigits(tier.minQty.toLocaleString())} - ${toDigits(tier.maxQty.toLocaleString())}` : `${toDigits(tier.minQty.toLocaleString())}+`} pcs
                        </div>
                        <div className="text-base font-black text-[#10b981] mt-0.5">
                          {currency.symbol}{toDigits(tierConverted)}
                        </div>
                        <div className="text-[10px] text-slate-400">FOB Chattogram</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Sourcing Cost Calculator */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{isBn ? 'তাৎক্ষণিক অর্ডার খরচ হিসাবকারী' : 'Instant Order Cost Estimator'}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {isBn ? 'একক: ' : 'Unit: '}{product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      {isBn
                        ? `অর্ডারের পরিমাণ (সর্বনিম্ন: ${toDigits(product.moq.toLocaleString())})`
                        : `Order Quantity (Min: ${product.moq.toLocaleString()})`}
                    </label>
                    <input
                      type="number"
                      min={product.moq}
                      step={100}
                      value={calculatorQty}
                      onChange={(e) => setCalculatorQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      {isBn ? 'বাণিজ্য শর্তাবলী (ইনকোটার্ম)' : 'Trade Incoterm'}
                    </label>
                    <select
                      value={selectedIncoterm}
                      onChange={(e) => setSelectedIncoterm(e.target.value as any)}
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e11d48] cursor-pointer"
                    >
                      {product.incoterms.map((inco) => (
                        <option key={inco} value={inco} className="bg-[#121212]">
                          {inco} ({product.portOfLoading})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {isBn ? 'একক মূল্য:' : 'Unit Cost:'}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{currency.symbol}{toDigits(unitConverted)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {isBn ? 'আনুমানিক এফওবি মোট:' : 'Estimated FOB Total:'}
                    </span>
                    <span className="font-mono text-lg font-black text-[#10b981]">{currency.symbol}{toDigits(totalConverted)}</span>
                  </div>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isBn ? 'রপ্তানি কারিগরি বিবরণ' : 'Export Technical Specifications'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="p-2 bg-[#141414] rounded-lg border border-white/5">
                      <span className="text-slate-500 text-[10px] block uppercase">{spec.label}</span>
                      <span className="font-semibold text-white mt-0.5 block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Contact Form */}
              <form onSubmit={handleSendQuickInquiry} className="space-y-2 pt-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={
                      isBn
                        ? 'প্যান্টোন শেড, কাস্টম স্পেসিফিকেশন বা ইনকোয়ারি নোট লিখুন...'
                        : 'Enter custom specifications, Pantone shade, or inquiry notes...'
                    }
                    value={quickMsg}
                    onChange={(e) => setQuickMsg(e.target.value)}
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e11d48]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#e11d48]/25 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ইনকোয়ারি পাঠান' : 'Inquire Now'}</span>
                  </button>
                </div>

                {sentNotice && (
                  <div className="text-xs text-[#10b981] flex items-center space-x-1 font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isBn
                        ? 'ইনকোয়ারি পাঠানো হয়েছে! ইনকোয়ারি ড্রয়ারে স্ট্যাটাস দেখুন।'
                        : 'Inquiry dispatched! Track status in Inquiries drawer.'}
                    </span>
                  </div>
                )}
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 border-t border-white/10">
                {/* B2B Inquiry Cart Action */}
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
                  className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white text-xs font-black flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer shadow-md shadow-[#e11d48]/20"
                  title="Add to B2B Inquiry / RFQ Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white" />
                  <span>{isBn ? 'আরএফকিউ কার্টে যোগ করুন' : 'Add to RFQ Cart'}</span>
                </button>

                {onOpenAiAssistant && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAiAssistant(product);
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{isBn ? 'র-এক্স ট্রেড এজেন্ট' : 'RAWx Trade Agent'}</span>
                  </button>
                )}

                {product.sampleAvailable && (
                  <button
                    onClick={() => onRequestSample(product)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 hover:border-[#e11d48]/50 text-white bg-[#171717] hover:bg-[#202020] text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>
                      {isBn
                        ? `নমুনা (${currency.symbol}${toDigits((product.samplePriceUSD * currency.rate).toFixed(2))})`
                        : `Sample (${currency.symbol}${(product.samplePriceUSD * currency.rate).toFixed(2)})`}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => onOpenShippingCalc(product.portOfLoading)}
                  className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-transparent border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{isBn ? 'জাহাজীকরণ খরচ' : 'Freight Rates'}</span>
                </button>

                {product.targetRoutingUrl && (
                  <a
                    href={product.targetRoutingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Direct Headless Checkout at Origin"
                  >
                    <span>
                      {isBn
                        ? `সরাসরি চেকআউট (${product.sourceDomain || 'Headless'})`
                        : `Origin Checkout (${product.sourceDomain || 'Headless'})`}
                    </span>
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
