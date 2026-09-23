import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  Globe2,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  MapPin,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { Customer } from '../types';

interface BuyerDetailDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRfq: () => void;
  theme?: 'dark' | 'light';
}

export const BuyerDetailDrawer: React.FC<BuyerDetailDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onOpenRfq,
  theme = 'dark',
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !customer) return null;

  const isDark = theme === 'dark';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-md sm:max-w-xl border-l shadow-2xl flex flex-col ${
            isDark
              ? 'bg-[#0e0e0e] border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Top Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isDark ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden p-1 flex items-center justify-center">
                <img
                  src={customer.logoUrl}
                  alt={customer.companyName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight">{customer.companyName}</h3>
                  <span className="text-base" title={customer.country}>{customer.flag}</span>
                  {customer.customerId && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      ID: {customer.customerId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {customer.contactPerson} • {customer.role}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Direct Sourcing Credentials & Verified Contact */}
            {(customer.email || customer.phone || customer.address || customer.note) && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Buyer Contact & Official Coordinates</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Permanent Account
                  </span>
                </div>

                {customer.note && (
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-300 font-mono">
                    <span className="text-slate-500 block text-[9.5px] uppercase font-bold mb-0.5">Procurement Role / Directive:</span>
                    {customer.note}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {customer.email && (
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="font-mono text-[11px] text-slate-200 hover:text-white truncate hover:underline"
                        >
                          {customer.email}
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard(customer.email!, 'email')}
                        className="text-slate-400 hover:text-white shrink-0 p-1"
                        title="Copy Email"
                      >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <a
                          href={`tel:${customer.phone}`}
                          className="font-mono text-[11px] text-slate-200 hover:text-white truncate hover:underline"
                        >
                          {customer.phone}
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard(customer.phone!, 'phone')}
                        className="text-slate-400 hover:text-white shrink-0 p-1"
                        title="Copy Phone"
                      >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {customer.address && (
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start space-x-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Official Address / HQ:</span>
                      <span className="text-slate-200 font-mono text-[11px]">{customer.address}</span>
                    </div>
                  </div>
                )}

                {customer.tags && customer.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                    {customer.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {customer.taxExempt && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        Tax Exempt
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sourcing Volume & Verification */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Sourcing Target</span>
                <span className="text-lg font-black text-[#10b981] font-mono block">
                  {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD}
                </span>
                <span className="text-[10px] text-slate-400">
                  Target MOQ: {(customer.minOrderQty || 5000).toLocaleString()} units
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Tier</span>
                <span className="text-xs font-bold text-[#e11d48] flex items-center space-x-1 mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{customer.verifiedStatus}</span>
                </span>
                <span className="text-[10px] text-[#10b981] block">
                  {customer.totalSpentUSD && customer.totalSpentUSD > 0
                    ? `$${customer.totalSpentUSD.toLocaleString()} USD Completed`
                    : 'KYC & Credit Approved'}
                </span>
              </div>
            </div>

            {/* Sourcing Sectors */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Primary Target Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {customer.sectorsOfInterest.map((sec, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white"
                  >
                    {sec === 'rmg-apparel'
                      ? '👕 RMG & Knitwear Apparel'
                      : sec === 'leather-footwear'
                      ? '👜 Leather Goods & Footwear'
                      : sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment Terms & Incoterms */}
            <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Trade Terms & Financial Assurance
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Payment Terms:</span>
                  <span className="font-mono font-bold text-white">Bank L/C • 50% JIT Escrow</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Preferred Incoterms:</span>
                  <span className="font-mono font-bold text-[#10b981]">
                    {customer.preferredIncoterms?.join(', ') || 'FOB Chattogram Port'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Live RFQ / Sourcing Inquiry */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#e11d48] uppercase tracking-wider flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Recent Sourcing Requirement</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Status: Active</span>
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">
                "{customer.recentInquiry}"
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5">
                <span>Avg Fulfillment Cycle: <strong>35 Days</strong></span>
                <span>Destination: <strong>{customer.country}</strong></span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center space-x-3 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRfq();
              }}
              className="py-2.5 px-5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
