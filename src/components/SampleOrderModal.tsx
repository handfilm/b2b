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
import { useI18n } from '../context/I18nContext';

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
  const [quantity, setQuantity] = useState(1);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  const sampleFeeUSD = (product?.samplePriceUSD || 0) * quantity;
  const courierFeeUSD = 35.0; // Flat DHL/FedEx air courier from Dhaka
  const totalUSD = sampleFeeUSD + courierFeeUSD;

  const sampleFeeConv = (sampleFeeUSD * currency.rate).toFixed(2);
  const courierFeeConv = (courierFeeUSD * currency.rate).toFixed(2);
  const totalConv = (totalUSD * currency.rate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !buyerEmail || !shippingAddress) return;

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

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="sample-order-modal-container"
        className="relative w-full max-w-lg bg-[#0e0e0e] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#ff5500]" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {isBn ? 'প্রাক-উৎপাদন নমুনার অনুরোধ করুন' : 'Request Pre-Production Sample'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'বাংলাদেশের কারখানার ফ্লোর থেকে সরাসরি' : 'Direct from factory floor in Bangladesh'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#ff5500]/20 border border-[#ff5500]/40 text-[#ff5500] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {isBn ? 'নমুনা অর্ডার নিশ্চিত করা হয়েছে!' : 'Sample Order Confirmed!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {isBn ? (
                <span>
                  আপনার নমুনার অনুরোধটি <strong className="text-white">{product.supplierName}</strong> কারখানায় গৃহীত হয়েছে। ডিএইচএল এক্সপ্রেস ট্র্যাকিং <strong className="text-white">{buyerEmail}</strong> ঠিকানায় পাঠানো হবে।
                </span>
              ) : (
                <span>
                  Your sample request has been queued at <strong className="text-white">{product.supplierName}</strong>. Factory dispatch scheduled via DHL Express with tracking sent to <strong className="text-white">{buyerEmail}</strong>.
                </span>
              )}
            </p>
            <div className="p-3 bg-[#171717] rounded-xl border border-white/10 text-xs font-mono text-slate-300">
              {isBn ? 'কুরিয়ার ট্র্যাকিং: ' : 'Courier Tracking: '}BD-DHL-{Math.floor(10000000 + Math.random() * 90000000)}
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold"
            >
              {isBn ? 'সম্পন্ন' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div className="p-3 bg-[#141414] rounded-xl border border-white/5 flex items-center space-x-3">
              <img
                src={product.images[0]}
                alt=""
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
                <p className="text-[11px] text-slate-400">{product.supplierName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {isBn ? 'পরিমাণ' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {isBn ? 'গন্তব্য দেশ' : 'Destination Country'}
                </label>
                <input
                  type="text"
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isBn ? 'কুরিয়ার ডেলিভারি ঠিকানা *' : 'Courier Delivery Address *'}
              </label>
              <textarea
                rows={2}
                required
                placeholder={isBn ? 'রাস্তা, শহর, পোস্টাল কোড, মোবাইল নম্বর...' : 'Street address, city, postal code, recipient phone...'}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isBn ? 'প্রাপকের ব্যবসায়িক ইমেইল *' : 'Recipient Business Email *'}
              </label>
              <input
                type="email"
                required
                placeholder="buyer@domain.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 bg-[#141414] rounded-xl border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>{isBn ? `নমুনার ফি (${toDigits(quantity)} পিস):` : `Sample Fee (${quantity} pc):`}</span>
                <span className="text-white">{currency.symbol}{toDigits(sampleFeeConv)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isBn ? 'এয়ার এক্সপ্রেস কুরিয়ার (ডিএইচএল):' : 'Air Express Courier (DHL):'}</span>
                <span className="text-white">{currency.symbol}{toDigits(courierFeeConv)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 font-bold text-white">
                <span>{isBn ? 'সর্বমোট পরিমাণ:' : 'Total Amount:'}</span>
                <span className="text-[#ff5500] text-sm">{currency.symbol}{toDigits(totalConv)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 cursor-pointer"
              >
                {isBn ? 'নমুনার অনুরোধ নিশ্চিত করুন' : 'Confirm Sample Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
