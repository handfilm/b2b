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
          <span className="text-2xl" title={customer.country}>
            {customer.flag}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/30">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {customer.verifiedStatus}
          </span>
        </div>

        {/* Center: Brand Logo & Title */}
        <div className="flex flex-col items-center text-center my-auto space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src={customer.logoUrl}
              alt={customer.companyName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          <div>
            <h3
              className={`text-sm sm:text-base font-black truncate max-w-[200px] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {customer.companyName}
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[190px]">
              {customer.contactPerson} • {customer.country}
            </p>
          </div>
        </div>

        {/* Bottom: Target Category & Budget Pill */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 truncate max-w-[120px]">
            {customer.sectorsOfInterest[0] || 'Apparel'}
          </span>
          <span className="text-xs font-black text-[#10b981] font-mono">
            {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD}
          </span>
        </div>
      </div>

      {/* 2. ON HOVER: RICH SOURCING OPERATIONAL OVERLAY (Smooth CSS transition) */}
      <div
        className="absolute inset-0 p-4 bg-[#0a0a0a]/94 backdrop-blur-md flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 text-white"
        onClick={(e) => {
          // Card click opens Buyer Detail Drawer
        }}
      >
        {/* Top: Header */}
        <div className="space-y-1.5 border-b border-white/10 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#10b981]" />
              <span>Verified Buyer</span>
            </span>
            <span className="text-base">{customer.flag}</span>
          </div>

          <h4 className="text-sm font-black truncate text-white">
            {customer.companyName}
          </h4>
          <p className="text-[11px] text-slate-400 truncate">
            {customer.contactPerson} ({customer.role})
          </p>
        </div>

        {/* Middle: Active Sourcing Volume & Preferred Terms */}
        <div className="space-y-2 my-1">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">
              Annual Sourcing Volume
            </span>
            <div className="text-base font-black text-[#10b981] font-mono">
              {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD} Target
            </div>
            <span className="text-[10px] text-slate-300 block">
              Min Order: {(customer.minOrderQty || 5000).toLocaleString()} units
            </span>
          </div>

          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Payment Terms:</span>
              <strong className="text-white">Bank L/C • 50% JIT Escrow</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Port:</span>
              <strong className="text-[#10b981]">{customer.country} Seaport</strong>
            </div>
          </div>

          {/* Active Requirement preview */}
          <div className="text-[10px] text-slate-300 line-clamp-2 italic bg-black/40 p-1.5 rounded border border-white/5">
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
            className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
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
            className="py-2 px-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Direct Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
