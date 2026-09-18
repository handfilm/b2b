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
} from 'lucide-react';
import { Product, Supplier, CurrencyConfig } from '../types';

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
                <span>Green Eco Export</span>
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
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#171717] border border-white/10">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#e11d48]' : 'border-white/10 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Supplier Block */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Manufacturer</span>
                  <div className="flex items-center space-x-1 text-[11px] text-[#10b981] font-bold font-mono">
                    <span>★</span>
                    <span>{product.supplierRating} Rating</span>
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
                    <div>Location: {supplier.district}</div>
                    {supplier.leedStatus && (
                      <div className="text-[#10b981] font-semibold">LEED {supplier.leedStatus} Certified Mill</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications & Pricing Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
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
                  Volume FOB Pricing Tiers (USD)
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
                          {tier.maxQty ? `${tier.minQty.toLocaleString()} - ${tier.maxQty.toLocaleString()}` : `${tier.minQty.toLocaleString()}+`} pcs
                        </div>
                        <div className="text-base font-black text-[#10b981] mt-0.5">
                          {currency.symbol}{tierConverted}
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
                    <span>Instant Order Cost Estimator</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Unit: {product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Order Quantity (Min: {product.moq.toLocaleString()})
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
                      Trade Incoterm
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
                    <span className="text-[10px] text-slate-400 block">Unit Cost:</span>
                    <span className="font-mono text-sm font-bold text-white">{currency.symbol}{unitConverted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Estimated FOB Total:</span>
                    <span className="font-mono text-lg font-black text-[#10b981]">{currency.symbol}{totalConverted}</span>
                  </div>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Export Technical Specifications
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
                    placeholder="Enter custom specifications, Pantone shade, or inquiry notes..."
                    value={quickMsg}
                    onChange={(e) => setQuickMsg(e.target.value)}
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e11d48]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#e11d48]/25 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire Now</span>
                  </button>
                </div>

                {sentNotice && (
                  <div className="text-xs text-[#10b981] flex items-center space-x-1 font-semibold animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inquiry dispatched! Track status in Inquiries drawer.</span>
                  </div>
                )}
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 border-t border-white/10">
                {onOpenAiAssistant && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAiAssistant(product);
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#e11d48]/15 hover:bg-[#e11d48]/25 border border-[#e11d48]/30 text-[#e11d48] hover:text-white text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>RAWx Trade Agent</span>
                  </button>
                )}

                {product.sampleAvailable && (
                  <button
                    onClick={() => onRequestSample(product)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 hover:border-[#e11d48]/50 text-white bg-[#171717] hover:bg-[#202020] text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Sample ({currency.symbol}{(product.samplePriceUSD * currency.rate).toFixed(2)})</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenShippingCalc(product.portOfLoading)}
                  className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-transparent border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Freight Rates</span>
                </button>

                {product.targetRoutingUrl && (
                  <a
                    href={product.targetRoutingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Direct Headless Checkout at Origin"
                  >
                    <span>Origin Checkout ({product.sourceDomain || 'Headless'})</span>
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
