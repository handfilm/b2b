import React from 'react';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  FileText,
  Send,
  Sparkles,
  ArrowUpRight,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Tag,
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onSelectCustomer: (customer: Customer) => void;
  onContactCustomer: (customer: Customer) => void;
  theme?: 'dark' | 'light';
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onSelectCustomer,
  onContactCustomer,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const isLeather =
    customer.leadType === 'RMLG' ||
    customer.sectorsOfInterest.includes('leather-footwear') ||
    (customer.note && customer.note.toLowerCase().includes('leather'));

  return (
    <div
      id={`customer-card-${customer.id}`}
      onClick={() => onSelectCustomer(customer)}
      className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 ${
        isDark
          ? 'bg-[#141414] border border-white/10 hover:border-[#e11d48]/70 shadow-lg hover:shadow-2xl hover:shadow-[#e11d48]/10'
          : 'bg-white border border-slate-200 hover:border-[#e11d48]/60 shadow-xs hover:shadow-xl'
      }`}
    >
      {/* 1. DEFAULT STATE: Square Buyer Entity Framing */}
      <div className="w-full h-full p-4 flex flex-col justify-between relative z-10">
        {/* Top: Country Flag & Verification Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-2xl" title={customer.country}>
              {customer.flag}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">
              {customer.countryCode}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/30">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {customer.verifiedStatus === 'Gold Verified Enterprise' ? 'Gold Verified' : customer.verifiedStatus}
          </span>
        </div>

        {/* Center: Brand Logo & Title */}
        <div className="flex flex-col items-center text-center my-auto space-y-1.5">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src={customer.logoUrl}
              alt={customer.companyName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          <div className="w-full px-1">
            <h3
              className={`text-sm sm:text-base font-black truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {customer.companyName}
            </h3>
            <p className="text-[11px] font-medium text-slate-300 truncate">
              {customer.contactPerson}
            </p>
            <p className="text-[10px] text-slate-400 truncate flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span>{customer.city ? `${customer.city}, ${customer.country}` : customer.country}</span>
            </p>
          </div>
        </div>

        {/* Bottom: Target Category & Budget Pill */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md truncate max-w-[130px] ${
              isLeather
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
            }`}
          >
            {isLeather ? '👜 Leather / RMLG' : '👕 RMG Apparel'}
          </span>
          <div className="flex items-center space-x-1.5">
            {customer.email && (
              <span title={customer.email} className="p-1 rounded bg-white/5 text-slate-300">
                <Mail className="w-2.5 h-2.5" />
              </span>
            )}
            {customer.phone && (
              <span title={customer.phone} className="p-1 rounded bg-white/5 text-emerald-400">
                <Phone className="w-2.5 h-2.5" />
              </span>
            )}
            <span className="text-xs font-black text-[#10b981] font-mono">
              {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ON HOVER: RICH SOURCING OPERATIONAL OVERLAY (Smooth CSS transition) */}
      <div
        className="absolute inset-0 p-4 bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 text-white"
        onClick={(e) => {
          // Card click opens Buyer Detail Drawer
        }}
      >
        {/* Top: Header */}
        <div className="space-y-1 border-b border-white/10 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#10b981]" />
              <span>Verified Permanent Buyer</span>
            </span>
            <span className="text-base">{customer.flag}</span>
          </div>

          <h4 className="text-sm font-black truncate text-white">
            {customer.companyName}
          </h4>
          <p className="text-[10.5px] text-slate-300 truncate font-medium">
            {customer.contactPerson} • {customer.role}
          </p>
          {customer.note && (
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 truncate max-w-full">
              {customer.note}
            </span>
          )}
        </div>

        {/* Middle: Contact Coordinates & Active Sourcing Volume */}
        <div className="space-y-1.5 my-1">
          {/* Direct Email / Phone row */}
          {(customer.email || customer.phone) && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1 text-[10px]">
              {customer.email && (
                <div className="flex items-center space-x-1.5 text-slate-300 truncate">
                  <Mail className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate font-mono">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center space-x-1.5 text-emerald-400 truncate">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="truncate font-mono">{customer.phone}</span>
                </div>
              )}
            </div>
          )}

          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px] space-y-0.5">
            <div className="flex justify-between text-slate-400">
              <span>Location:</span>
              <strong className="text-white truncate max-w-[120px]">
                {customer.city ? `${customer.city}, ${customer.countryCode}` : customer.country}
              </strong>
            </div>
            {customer.totalSpentUSD !== undefined && customer.totalSpentUSD > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Total Spent:</span>
                <strong className="text-[#10b981] font-mono">
                  ${customer.totalSpentUSD.toLocaleString()} USD
                </strong>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Payment Terms:</span>
              <strong className="text-white">Bank L/C • JIT Escrow</strong>
            </div>
          </div>

          {/* Active Requirement preview */}
          <div className="text-[9.5px] text-slate-300 line-clamp-2 italic bg-black/40 p-1.5 rounded border border-white/5">
            "{customer.recentInquiry}"
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectCustomer(customer);
            }}
            className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-[#10b981]" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContactCustomer(customer);
            }}
            className="py-1.5 px-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Direct Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
