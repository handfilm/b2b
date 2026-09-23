import React, { useState } from 'react';
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
  ZoomIn,
  Maximize2,
  X,
  CheckCircle2,
  Clock,
  Flame,
  Activity,
} from 'lucide-react';
import { Customer } from '../types';
import { getBuyerInquiriesCount, getBuyerRecentActivity } from '../utils/buyerActivity';

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isLeather =
    customer.leadType === 'RMLG' ||
    customer.sectorsOfInterest.includes('leather-footwear') ||
    (customer.note && customer.note.toLowerCase().includes('leather'));

  const inquiriesCount = getBuyerInquiriesCount(customer);
  const activity = getBuyerRecentActivity(customer);

  return (
    <>
      <div
        id={`customer-card-${customer.id}`}
        onClick={() => onSelectCustomer(customer)}
        className={`relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 ${
          isDark
            ? 'bg-[#121212] border border-white/10 hover:border-[#e11d48]/80 shadow-lg hover:shadow-2xl hover:shadow-[#e11d48]/15'
            : 'bg-white border border-slate-200 hover:border-[#e11d48]/70 shadow-xs hover:shadow-2xl'
        }`}
      >
        {/* 1. BACKGROUND PHOTO: Fit to Card with Cinematic Hover Zoom */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img
            src={customer.logoUrl}
            alt={customer.companyName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-115 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* Dual Layer Scrim for high contrast legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/45 group-hover:via-black/70 transition-all duration-300" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
        </div>

        {/* 2. CARD CONTENT: Structured over the fitted photo */}
        <div className="w-full h-full p-3.5 sm:p-4 flex flex-col justify-between relative z-10">
          {/* Top: Country Flag & Verification Badge & Quick Photo Zoom Button */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-xl" title={customer.country}>
                  {customer.flag}
                </span>
                <span className="text-[10px] font-mono text-slate-200 font-bold">
                  {customer.countryCode}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-emerald-500 hover:text-black text-slate-200 backdrop-blur-md border border-white/15 transition-all shadow-md cursor-pointer"
                  title="Zoom Photo Fullscreen"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <span className="inline-flex items-center px-2 py-0.8 rounded-lg text-[10px] font-bold bg-[#e11d48]/85 text-white shadow-sm border border-white/20 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 mr-1 shrink-0" />
                  <span>{customer.verifiedStatus === 'Gold Verified Enterprise' ? 'Gold Verified' : customer.verifiedStatus}</span>
                </span>
              </div>
            </div>

            {/* Quick Context at a Glance: Recent Activity Badge & Pending Inquiries Count */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <span
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-slate-200 truncate max-w-[130px]"
                title={`Recent Activity: ${activity.summary} (${activity.time})`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activity.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                <span className="truncate">{activity.time}</span>
              </span>

              <span
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-black bg-amber-500 text-slate-950 backdrop-blur-md shadow-sm border border-amber-300/40 shrink-0"
                title={`${inquiriesCount} active sourcing inquiries awaiting quotes`}
              >
                <Flame className="w-3 h-3 fill-slate-950 text-slate-950 shrink-0" />
                <span>{inquiriesCount} Pending</span>
              </span>
            </div>
          </div>

          {/* Center: Brand Focal Thumb & Typography */}
          <div className="flex flex-col items-center text-center my-auto space-y-1.5">
            {/* Focal Thumbnail with Micro-Zoom */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="relative group/thumb cursor-zoom-in"
              title="Click to Zoom Photo"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl group-hover/thumb:border-emerald-400 group-hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-black/40">
                <img
                  src={customer.logoUrl}
                  alt={customer.companyName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/thumb:scale-125 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md group-hover/thumb:scale-110 transition-transform">
                <Maximize2 className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="w-full px-1">
              <h3 className="text-sm sm:text-base font-black text-white truncate tracking-tight drop-shadow-md">
                {customer.companyName}
              </h3>
              <p className="text-[11px] font-semibold text-slate-200 truncate drop-shadow-sm">
                {customer.contactPerson}
              </p>
              <p className="text-[10px] text-slate-300 truncate flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                <span>{customer.city ? `${customer.city}, ${customer.country}` : customer.country}</span>
              </p>
            </div>
          </div>

          {/* Bottom: Category Pill & Budget Spec */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs backdrop-blur-xs">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md truncate max-w-[130px] shadow-xs ${
                isLeather
                  ? 'bg-amber-500/85 text-slate-950'
                  : 'bg-emerald-500/85 text-slate-950'
              }`}
            >
              {isLeather ? '👜 Leather / RMLG' : '👕 RMG Apparel'}
            </span>

            <div className="flex items-center space-x-1.5">
              {customer.email && (
                <span title={customer.email} className="p-1 rounded bg-black/60 text-slate-200 border border-white/10">
                  <Mail className="w-2.5 h-2.5" />
                </span>
              )}
              {customer.phone && (
                <span title={customer.phone} className="p-1 rounded bg-black/60 text-emerald-400 border border-white/10">
                  <Phone className="w-2.5 h-2.5" />
                </span>
              )}
              <span className="text-xs font-black text-emerald-300 font-mono drop-shadow-sm">
                {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD}
              </span>
            </div>
          </div>
        </div>

        {/* 3. ON HOVER: RICH SOURCING OPERATIONAL OVERLAY */}
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
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="p-1 rounded bg-white/10 hover:bg-emerald-500 hover:text-black text-slate-300 text-[10px] flex items-center space-x-1 transition-all"
                  title="Zoom Photo"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>Zoom</span>
                </button>
                <span className="text-base">{customer.flag}</span>
              </div>
            </div>

            <h4 className="text-sm font-black truncate text-white">
              {customer.companyName}
            </h4>
            <p className="text-[10.5px] text-slate-300 truncate font-medium">
              {customer.contactPerson} • {customer.role}
            </p>
          </div>

          {/* Middle: Pending Inquiries Banner & Contact Coordinates */}
          <div className="space-y-1.5 my-1">
            {/* Recent Activity & Pending Inquiries Banner */}
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-[10.5px]">
              <div className="flex items-center space-x-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-200 truncate">
                  Active <strong className="text-white">{activity.time}</strong>
                </span>
              </div>
              <span className="font-mono font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 shrink-0 text-[10px]">
                {inquiriesCount} Pending {inquiriesCount === 1 ? 'RFQ' : 'RFQs'}
              </span>
            </div>

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

      {/* 4. FULLSCREEN PHOTO ZOOM LIGHTBOX */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#121212] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{customer.flag}</span>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    {customer.companyName}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{inquiriesCount} Pending Inquiries</span>
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {customer.contactPerson} • {customer.role} • Active {activity.time}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Photo: Full Fit with Smooth Zoom */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={customer.logoUrl}
                alt={customer.companyName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{customer.verifiedStatus}</span>
                </span>
                <span className="font-mono text-emerald-400 font-black">
                  Target: {customer.sourcingBudgetUSD || customer.annualSourcingBudgetUSD}
                </span>
              </div>
            </div>

            {/* Lightbox Actions */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400 truncate">
                {customer.note || customer.recentInquiry}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    onSelectCustomer(customer);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  View Full Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    onContactCustomer(customer);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
