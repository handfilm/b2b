import React, { useState } from 'react';
import {
  X,
  Trash2,
  Send,
  Building2,
  Package,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import { useInquiryCart } from '../context/InquiryCartContext';
import { useI18n } from '../context/I18nContext';
import { AuthUser, CurrencyConfig } from '../types';
import { createRfqThread } from '../services/rfqService';

interface InquiryCartProps {
  authUser?: AuthUser | null;
  currency?: CurrencyConfig;
  onExploreProducts?: () => void;
}

export const InquiryCart: React.FC<InquiryCartProps> = ({
  authUser,
  currency = { code: 'USD', symbol: '$', rate: 1 },
  onExploreProducts,
}) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    openRawxBot,
  } = useInquiryCart();

  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalMessage, setGlobalMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Aggregate metrics
  const totalPcs = cartItems.reduce((acc, item) => acc + (Number(item.requestedQty) || 0), 0);
  const totalTargetValUSD = cartItems.reduce(
    (acc, item) => acc + (Number(item.requestedQty) || 0) * (Number(item.targetPrice) || 0),
    0
  );

  const handleSubmitInquiry = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionSuccess(null);

    try {
      const primaryItem = cartItems[0];
      const supplierId = primaryItem?.product?.supplierId || 'federated_node_dhaka_01';
      const supplierName = primaryItem?.product?.supplierName || 'Export Mill Direct';

      const combinedInitialMessage =
        globalMessage.trim() ||
        `Commercial Inquiry Cart submission for ${cartItems.length} styles (${totalPcs.toLocaleString()} pcs total). Requesting expedited FOB quotes and sample lead-time confirmation.`;

      const { threadId } = await createRfqThread({
        buyerId: authUser?.id || `buyer-${Math.random().toString(36).substring(2, 8)}`,
        buyerName: authUser?.name || 'Global Enterprise Buyer',
        buyerEmail: authUser?.email || '',
        supplierId,
        supplierName,
        products: cartItems.map((item) => ({
          sku: item.sku,
          title: item.product.title,
          productId: item.product.id,
          requestedQty: item.requestedQty,
          targetPrice: item.targetPrice,
          supplierId: item.product.supplierId,
          supplierName: item.product.supplierName,
          imageUrl: item.product.images?.[0] || '',
          customNotes: item.itemMessage,
        })),
        initialMessage: combinedInitialMessage,
        initialAiMessage: `Hello, I am the RAWx Trade Agent representing ${supplierName}. We have received your RFQ for ${primaryItem.product.title}${
          cartItems.length > 1 ? ` and ${cartItems.length - 1} other item(s)` : ''
        }. Our standard production lead time for ${totalPcs.toLocaleString()} pcs is 14-21 days. Do you have a custom TechPack or CAD ready for review?`,
      });

      setSubmissionSuccess(threadId);

      // Brief pause to allow user to observe feedback before opening RAWx Bot
      setTimeout(() => {
        clearCart();
        closeCart();
        setIsSubmitting(false);
        // Instantly launch RAWx Bot chat with the newly initialized thread
        openRawxBot(threadId, primaryItem.product);
      }, 750);
    } catch (err) {
      console.error('[InquiryCart] Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeCart}
      />

      {/* Obsidian Dark Drawer */}
      <aside
        role="dialog"
        aria-label="B2B Inquiry Cart"
        className="relative z-10 w-full sm:w-[500px] md:w-[560px] bg-[#0a0a0a] text-white border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0f0f0f]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e11d48] to-[#9f1239] flex items-center justify-center shadow-lg shadow-[#e11d48]/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight text-white uppercase">
                  {isBn ? 'বি২বি অনুসন্ধান / আরএফকিউ কার্ট' : 'B2B Inquiry / RFQ Cart'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#ff1e42]">
                  {toDigits(cartItems.length)} {isBn ? 'লট' : (cartItems.length === 1 ? 'Lot' : 'Lots')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'সরাসরি মিল ইনকোয়ারি কিউ • খুচরা চেকআউট নেই' : 'Direct mill inquiry queue • Zero retail checkout'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-slate-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title={isBn ? 'সব মুছুন' : 'Clear all lots'}
              >
                {isBn ? 'মুছুন' : 'Clear'}
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="px-4 py-2 bg-[#121212] border-b border-white/5 flex items-center space-x-2 text-[11px] text-slate-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
          <span>
            {isBn ? (
              <>লক্ষ্য মূল্য ও পরিমাণ সরাসরি <strong className="text-white">র-এক্স স্বায়ত্তশাসিত এজেন্ট</strong> দ্বারা কারখানায় রাউট করা হয়।</>
            ) : (
              <>Target prices & quantities are intercepted by <strong className="text-white">RAWx Autonomous Agent</strong> for automated factory routing.</>
            )}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-base font-bold text-white">{isBn ? 'আপনার অনুসন্ধান কার্ট খালি' : 'Your Inquiry Cart is Empty'}</h3>
                <p className="text-xs text-slate-400">
                  {isBn
                    ? 'তৈরি পোশাক, চামড়াজাত পণ্য বা শিল্প উপাদান নির্বাচন করে স্বয়ংক্রিয় ফ্যাক্টরি নেগোসিয়েশন শুরু করুন।'
                    : 'Select RMG blanks, leather goods, or industrial products to configure target volume lots and launch automated mill negotiation.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  onExploreProducts?.();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#e11d48]/25 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>{isBn ? 'রপ্তানি ক্যাটালগ দেখুন' : 'Browse Export Catalog'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, idx) => {
                const product = item.product;
                const itemTotalUSD = (Number(item.requestedQty) || 0) * (Number(item.targetPrice) || 0);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all space-y-3.5"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative">
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 backdrop-blur-xs text-[8px] font-mono text-[#10b981] rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate" title={product.title}>
                            {product.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                            <span className="font-mono text-slate-300">{item.sku}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1 text-[#10b981]">
                              <Building2 className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[140px]">{product.supplierName}</span>
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Factory MOQ: <strong className="text-white">{product.moq?.toLocaleString() || 500} pcs</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                        title="Remove Lot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Inputs: Quantity & Target Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {/* Target Quantity */}
                      <div className="p-2.5 rounded-xl bg-[#171717] border border-white/10 space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                          {isBn ? 'লক্ষ্যমাত্রা পরিমাণ (পিস)' : 'Target Quantity (Pieces)'}
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(item.id, {
                                requestedQty: Math.max(100, (Number(item.requestedQty) || 1000) - 250),
                              })
                            }
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={100}
                            step={100}
                            value={item.requestedQty}
                            onChange={(e) =>
                              updateCartItem(item.id, {
                                requestedQty: Math.max(1, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-[#e11d48]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(item.id, {
                                requestedQty: (Number(item.requestedQty) || 1000) + 500,
                              })
                            }
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                          <span>{isBn ? 'ধাপ:' : 'Steppers:'}</span>
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { requestedQty: 1000 })}
                            className="hover:text-white transition-colors"
                          >
                            {isBn ? '১হাজার' : '1k'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { requestedQty: 3000 })}
                            className="hover:text-white transition-colors"
                          >
                            {isBn ? '৩হাজার' : '3k'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { requestedQty: 5000 })}
                            className="hover:text-white transition-colors"
                          >
                            {isBn ? '৫হাজার' : '5k'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { requestedQty: 10000 })}
                            className="hover:text-white transition-colors"
                          >
                            {isBn ? '১০হাজার' : '10k'}
                          </button>
                        </div>
                      </div>

                      {/* Target Price */}
                      <div className="p-2.5 rounded-xl bg-[#171717] border border-white/10 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                            {isBn ? 'লক্ষ্য এফওবি মূল্য (USD)' : 'Target FOB Price (USD)'}
                          </label>
                          <span className="text-[9px] font-mono text-[#10b981]">
                            {isBn ? 'আনুমানিক:' : 'Est:'} ${toDigits(item.targetPrice.toFixed(2))}
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono font-bold">
                            $
                          </span>
                          <input
                            type="number"
                            min={0.1}
                            step={0.05}
                            value={item.targetPrice}
                            onChange={(e) =>
                              updateCartItem(item.id, {
                                targetPrice: Math.max(0.01, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full bg-black/60 border border-white/15 rounded-lg pl-6 pr-2 py-1.5 text-xs text-[#10b981] font-mono font-bold focus:outline-none focus:border-[#e11d48]"
                          />
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between items-center">
                          <span>{isBn ? 'লট মূল্যায়ন:' : 'Lot Valuation:'}</span>
                          <strong className="text-white font-mono">
                            ${toDigits(itemTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Message to Supplier text box */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-slate-400">
                          {isBn ? 'কারখানার জন্য বার্তা / টেকনিক্যাল স্পেক্স:' : 'Message / Technical Spec to Mill:'}
                        </label>
                        <span className="text-[9px] text-slate-500">TechPack, GSM, Pantone TCX</span>
                      </div>
                      <textarea
                        rows={2}
                        value={item.itemMessage}
                        onChange={(e) => updateCartItem(item.id, { itemMessage: e.target.value })}
                        placeholder={
                          isBn
                            ? 'উদা: ২৪০ জিএসএম অর্গানিক কটন, প্যান্টোন ১৯-৪০৫২ টিসিএক্স ক্ল্যাসিক ব্লু, ল্যাব ডিপ নমুনা সহ...'
                            : 'e.g., Required in 240 GSM organic cotton, Pantone 19-4052 TCX Classic Blue, FOB Chittagong with lab dip samples...'
                        }
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#e11d48] resize-none"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Optional Master Note */}
              <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/10 space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                  {isBn ? 'ক্রেতার সমন্বিত ক্রয় নোট (ঐচ্ছিক)' : 'Consolidated Buyer Purchase Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={globalMessage}
                  onChange={(e) => setGlobalMessage(e.target.value)}
                  placeholder={
                    isBn
                      ? 'অতিরিক্ত ডেলিভারি নির্দেশনা, পেমেন্ট মাধ্যম (এল/সি, এসক্রো), অথবা গন্তব্য বন্দর (যেমন লস অ্যাঞ্জেলেস, রটারড্যাম)...'
                      : 'Additional delivery instructions, payment preferences (L/C, Escrow), or destination ports (e.g., Los Angeles, Rotterdam)...'
                  }
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#e11d48] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Valuation & Submit Bar */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#0e0e0e] border-t border-white/10 space-y-3 shrink-0">
            {/* Summary Metrics */}
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'মোট লক্ষ্যমাত্রা ভলিউম:' : 'Total Target Volume:'}</span>
                <span className="text-sm font-black text-white font-mono">
                  {toDigits(totalPcs.toLocaleString())} {isBn ? 'পিস' : 'Pieces'}
                </span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'আনুমানিক লট মূল্য:' : 'Estimated Lot Value:'}</span>
                <span className="text-base font-black text-[#10b981] font-mono">
                  ${toDigits(totalTargetValUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} USD
                </span>
              </div>
            </div>

            {/* Factory Direct Guarantee */}
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span>
                {isBn
                  ? 'সরাসরি যাচাইকৃত ইপিবি/বিজিএমইএ বন্ডেড প্রস্তুতকারকদের কাছে প্রেরিত। কোনো খুচরা অতিরিক্ত মূল্য নেই।'
                  : 'Dispatched directly to verified EPB/BGMEA bonded manufacturers. No retail markup.'}
              </span>
            </div>

            {/* Submission Status Notice */}
            {submissionSuccess && (
              <div className="p-2.5 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {isBn
                    ? `আরএফকিউ থ্রেড #${submissionSuccess.substring(0, 10)} সফলভাবে তৈরি! র-এক্স এজেন্ট চালু হচ্ছে...`
                    : `RFQ Thread #${submissionSuccess.substring(0, 10)} created! Launching RAWx Trade Agent...`}
                </span>
              </div>
            )}

            {/* Action Button: Crimson Red, Launches RAWx Bot */}
            <button
              type="button"
              id="submit-inquiry-rfq-cart-btn"
              disabled={isSubmitting}
              onClick={handleSubmitInquiry}
              className={`w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff1e42] hover:opacity-95 text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-xl shadow-[#e11d48]/25 transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isBn ? 'আরএফকিউ থ্রেড তৈরি ও পাঠানো হচ্ছে...' : 'Logging RFQ Thread & Dispatching...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isBn ? 'ইনকোয়ারি জমা দিন ও র-এক্স এজেন্ট চালু করুন' : 'Submit Inquiry & Launch RAWx Agent'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
