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
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  supplier,
  currency,
  onClose,
  onRequestSample,
  onInquire,
  onOpenShippingCalc,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calculatorQty, setCalculatorQty] = useState(product.moq);
  const [selectedIncoterm, setSelectedIncoterm] = useState(product.incoterms[0]);
  const [quickMsg, setQuickMsg] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  // Determine pricing based on entered quantity
  const getUnitPrice = (qty: number) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800">
              HS Code {product.hsCode}
            </span>
            {product.ecoFriendly && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                <Leaf className="w-3.5 h-3.5 mr-1" />
                <span>Green Eco Export</span>
              </span>
            )}
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Section: Images + Key Trade Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg border overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Supplier Mini Card */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Manufacturer</span>
                  <span className="text-amber-600 font-bold">★ {product.supplierRating} Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-sm text-neutral-900 truncate">{product.supplierName}</span>
                  {product.supplierVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                {supplier && (
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {supplier.about}
                  </p>
                )}
                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-200">
                  <span>Factory Location:</span>
                  <span className="font-medium text-neutral-800">{supplier?.district || 'Dhaka Export Zone, BD'}</span>
                </div>
              </div>
            </div>

            {/* Product Meta & Wholesale Sourcing Engine */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-950 leading-snug">
                  {product.title}
                </h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Wholesale Pricing Tiers Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                <div className="px-3.5 py-2 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Wholesale Order Tier</span>
                  <span>Unit Price ({currency.code})</span>
                </div>
                <div className="divide-y divide-neutral-200 text-xs">
                  {product.priceTiers.map((tier, idx) => {
                    const tierPriceConv = (tier.priceUSD * currency.rate).toFixed(2);
                    const isCurrentTier =
                      calculatorQty >= tier.minQty &&
                      (!tier.maxQty || calculatorQty <= tier.maxQty);
                    return (
                      <div
                        key={idx}
                        className={`px-3.5 py-2 flex items-center justify-between transition-colors ${
                          isCurrentTier ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-neutral-700'
                        }`}
                      >
                        <span>
                          {tier.minQty.toLocaleString()}
                          {tier.maxQty ? ` - ${tier.maxQty.toLocaleString()}` : '+'} {product.unit}
                        </span>
                        <span className="font-mono text-neutral-900">
                          {currency.symbol}{tierPriceConv}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Order Estimate Calculator */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Estimated Order Total</span>
                  </span>
                  <span className="text-xs text-emerald-800">
                    MOQ: {product.moq.toLocaleString()} {product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 items-center">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Quantity ({product.unit})
                    </label>
                    <input
                      type="number"
                      min={product.moq}
                      step={100}
                      value={calculatorQty}
                      onChange={(e) => setCalculatorQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Trade Term (Incoterms)
                    </label>
                    <select
                      value={selectedIncoterm}
                      onChange={(e) => setSelectedIncoterm(e.target.value as any)}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-800 focus:outline-none"
                    >
                      {product.incoterms.map((term) => (
                        <option key={term} value={term}>
                          {term} ({product.portOfLoading.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-emerald-200/80">
                  <div>
                    <span className="text-[11px] text-neutral-600 block">Unit Price:</span>
                    <span className="font-mono text-sm font-bold text-emerald-900">
                      {currency.symbol}{unitConverted}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-600 block">Subtotal Estimate:</span>
                    <span className="font-mono text-lg font-extrabold text-emerald-950">
                      {currency.symbol}{totalConverted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logistics & Port Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Port of Loading</span>
                  <span className="font-semibold text-neutral-800 flex items-center space-x-1 mt-0.5">
                    <Anchor className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{product.portOfLoading}</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Production Lead Time</span>
                  <span className="font-semibold text-neutral-800 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{product.leadTimeDays} Days to Port Dispatch</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Specifications Section */}
          <div className="border-t border-neutral-200 pt-5 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Technical Export Specifications</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                  <span className="font-medium text-neutral-500">{spec.label}</span>
                  <span className="font-semibold text-neutral-900 text-right ml-2">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Certifications Row */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-neutral-600">Export Factory Certifications & Audits:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Factory Inquiry Form */}
          <div className="border-t border-neutral-200 pt-5 space-y-3 bg-neutral-50 p-4 rounded-xl border">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Contact {product.supplierName} Directly</span>
            </h4>

            {sentNotice ? (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your inquiry was recorded and forwarded to the factory trade desk! Check the Inquiries tab.</span>
              </div>
            ) : (
              <form onSubmit={handleSendQuickInquiry} className="space-y-2.5">
                <textarea
                  rows={2}
                  value={quickMsg}
                  onChange={(e) => setQuickMsg(e.target.value)}
                  placeholder={`Hello, we are interested in sourcing ${calculatorQty} ${product.unit} of ${product.title}. Please provide sample lead time and formal FOB quote.`}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-neutral-500">
                    Average response: under 4 hours • Direct English speaking export managers
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenShippingCalc(product.portOfLoading)}
            className="text-xs font-semibold text-neutral-700 hover:text-emerald-800 flex items-center space-x-1.5"
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Check Ocean Transit & Container Rates</span>
          </button>

          <div className="flex items-center space-x-3">
            {product.sampleAvailable && (
              <button
                onClick={() => onRequestSample(product)}
                className="px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Order Paid Sample ({currency.symbol}{(product.samplePriceUSD * currency.rate).toFixed(2)})
              </button>
            )}
            <button
              onClick={() => {
                onInquire(product, `Direct RFQ for ${calculatorQty} ${product.unit}`);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Request Custom Proforma Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
