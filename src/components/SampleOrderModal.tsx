import React, { useState } from 'react';
import {
  X,
  Package,
  Plane,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Product, SampleInquiry, CurrencyConfig } from '../types';

interface SampleOrderModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSampleOrder: (order: SampleInquiry) => void;
}

export const SampleOrderModal: React.FC<SampleOrderModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onConfirmSampleOrder,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const sampleFeeUSD = product.samplePriceUSD * quantity;
  const courierFeeUSD = 35.0; // Flat DHL/FedEx courier from Dhaka
  const totalUSD = sampleFeeUSD + courierFeeUSD;

  const sampleFeeConv = (sampleFeeUSD * currency.rate).toFixed(2);
  const courierFeeConv = (courierFeeUSD * currency.rate).toFixed(2);
  const totalConv = (totalUSD * currency.rate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !shippingAddress) return;

    const newOrder: SampleInquiry = {
      id: `sample-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      supplierName: product.supplierName,
      quantity,
      sampleFeeUSD,
      courierFeeUSD,
      customNotes,
      buyerEmail,
      shippingCountry,
      createdAt: new Date().toLocaleDateString(),
      trackingNumber: `BD-DHL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Dispatched via Air Courier',
    };

    onConfirmSampleOrder(newOrder);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="sample-order-modal-container"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Request Physical Pre-Production Sample</h3>
              <p className="text-[11px] text-neutral-400">Direct from factory floor in Bangladesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900">Sample Order Confirmed!</h4>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">
              Your sample request has been queued at <strong className="text-neutral-900">{product.supplierName}</strong>. Factory dispatch scheduled via DHL Express with tracking notification sent to <strong className="text-neutral-900">{buyerEmail}</strong>.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
            >
              Close & View Tracking
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Product summary */}
            <div className="p-3 bg-neutral-50 rounded-xl border flex items-center space-x-3">
              <img
                src={product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover border"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-900 truncate">{product.title}</div>
                <div className="text-[11px] text-neutral-500">Supplier: {product.supplierName}</div>
              </div>
            </div>

            {/* Quantity & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Sample Quantity (pcs)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Shipping Country
                </label>
                <input
                  type="text"
                  required
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Buyer Email */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Your Business Email (For DHL AWB Tracking) *
              </label>
              <input
                type="email"
                required
                placeholder="buyer@enterprise.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Shipping Address */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Full Physical Delivery Address *
              </label>
              <input
                type="text"
                required
                placeholder="Street address, city, postal code, recipient phone"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Custom Notes */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Custom Sample Specifications / Sizing Needed
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Size Large, Natural raw wash, sample swatch of collar rib..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Financial Breakdown */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Sample Production Cost ({quantity}x):</span>
                <span className="font-mono">{currency.symbol}{sampleFeeConv}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>International DHL Express Courier (Dhaka):</span>
                <span className="font-mono">{currency.symbol}{courierFeeConv}</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-bold pt-1.5 border-t border-emerald-200">
                <span>Total Sample Order Cost:</span>
                <span className="font-mono text-sm text-emerald-950">{currency.symbol}{totalConv}</span>
              </div>
              <div className="text-[10px] text-emerald-800 flex items-center space-x-1 pt-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Estimated Arrival: 4 to 6 Business Days via DHL Air Courier</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Sample Order ({currency.symbol}{totalConv})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
