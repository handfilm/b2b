import React, { useState } from 'react';
import {
  Customer,
  LiveTradeEvent,
  CategoryId,
  LanguageCode,
} from '../types';
import { CATEGORIES } from '../data/mockData';
import { getTranslation } from '../i18n/translations';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Globe2,
  Ship,
  Sparkles,
  Plane,
  FileText,
  Search,
  Filter,
  DollarSign,
  Briefcase,
  Star,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

interface CustomerTradeHubProps {
  customers: Customer[];
  liveEvents: LiveTradeEvent[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  lang: LanguageCode;
  onOpenRfq: () => void;
  onOpenAutomation: () => void;
}

export const CustomerTradeHub: React.FC<CustomerTradeHubProps> = ({
  customers,
  liveEvents,
  selectedCategory,
  onSelectCategory,
  lang,
  onOpenRfq,
  onOpenAutomation,
}) => {
  const t = getTranslation(lang);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.country.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.recentInquiry.toLowerCase().includes(customerSearch.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || c.sectorsOfInterest.includes(selectedCategory);

    const matchesVerification =
      selectedVerification === 'all' || c.verifiedStatus === selectedVerification;

    return matchesSearch && matchesCategory && matchesVerification;
  });

  const getEventIcon = (type: LiveTradeEvent['type']) => {
    switch (type) {
      case 'lc_opened':
        return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case 'container_shipped':
        return <Ship className="w-4 h-4 text-sky-400" />;
      case 'sample_dispatched':
        return <Plane className="w-4 h-4 text-amber-400" />;
      case 'rfq_broadcast':
        return <FileText className="w-4 h-4 text-[#ff5500]" />;
      case 'quote_placed':
        return <DollarSign className="w-4 h-4 text-purple-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Realtime Live Trading Stream Ticker */}
      <div className="rounded-2xl bg-gradient-to-r from-[#141414] via-[#171717] to-[#121212] border border-white/10 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
              {t.liveTickerTitle}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Stream Active
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={onOpenAutomation}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#ff5500]/15 hover:bg-[#ff5500]/25 text-[#ff5500] border border-[#ff5500]/30 font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.superAutomation}</span>
            </button>
          </div>
        </div>

        {/* Live Stream Horizontal Rail */}
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveEvents.slice(0, 3).map((evt) => (
            <div
              key={evt.id}
              className="bg-[#0a0a0a]/80 rounded-xl p-3 border border-white/[0.06] hover:border-white/20 transition-all flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-white/[0.04] shrink-0 mt-0.5">
                {getEventIcon(evt.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <span>{evt.flag}</span>
                    <span className="truncate">{evt.partyName}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {evt.timestamp}
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  {lang === 'BN' ? evt.titleBn : evt.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {lang === 'BN' ? evt.detailsBn : evt.details}
                </p>
                {evt.targetFactory && (
                  <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <span className="text-slate-500">Target:</span>
                    <span className="text-[#ff5500] font-semibold truncate">{evt.targetFactory}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header & Sourcing Search Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#ff5500] text-xs font-bold uppercase tracking-wider mb-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>International Wholesale Sourcing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.customersTitle}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
            {t.customersSubtitle}
          </p>
        </div>

        {/* Global Buyer Onboarding CTA */}
        <div className="shrink-0 flex items-center space-x-2.5">
          <button
            onClick={onOpenRfq}
            className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#ff5500]/25 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.postRfq}</span>
          </button>
        </div>
      </div>

      {/* Search & Verification Badges Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121212] p-3 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search enterprise buyers, countries..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-white bg-[#1a1a1a] rounded-lg border border-white/10 focus:outline-none focus:border-[#ff5500]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Verification:</span>
          {['all', 'Gold Verified Enterprise', 'Retail Conglomerate', 'Global Sourcing Agent'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedVerification(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedVerification === status
                  ? 'bg-white text-black font-bold'
                  : 'text-slate-400 hover:text-white bg-[#1a1a1a]'
              }`}
            >
              {status === 'all' ? 'All Tiers' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Customer Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="rounded-2xl bg-[#121212] border border-white/10 hover:border-white/20 p-5 shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Logo, Company & Country Flag */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden flex items-center justify-center p-1 group-hover:border-[#ff5500]/50 transition-colors">
                    <img
                      src={cust.logoUrl}
                      alt={cust.companyName}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff5500] transition-colors">
                        {cust.companyName}
                      </h3>
                      <span className="text-base" title={cust.country}>
                        {cust.flag}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <span className="text-slate-300 font-medium">{cust.contactPerson}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">{cust.role}</span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 shrink-0">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {cust.verifiedStatus}
                </span>
              </div>

              {/* Sourcing Volume & Metrics Banner */}
              <div className="grid grid-cols-3 gap-2 bg-[#171717] p-3 rounded-xl border border-white/[0.06] mb-4 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    {t.sourcingBudget}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">
                    {cust.annualSourcingBudgetUSD}
                  </div>
                </div>
                <div className="border-x border-white/[0.06]">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    {t.activeContracts}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white mt-0.5">
                    {cust.activeLcs} Active L/C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    {t.totalShipped}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                    {cust.totalVolumeExported}
                  </div>
                </div>
              </div>

              {/* Recent Inquiry Highlight */}
              <div className="bg-[#1a1a1a]/70 p-3 rounded-xl border border-white/[0.04] mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Current Active Sourcing Order:</span>
                  <span className="text-emerald-400 text-[10px] font-mono">Bidding Open</span>
                </div>
                <p className="text-xs text-white font-medium">
                  {cust.recentInquiry}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>Incoterms: {cust.preferredIncoterms.join(', ')}</span>
                  <span>•</span>
                  <span>Direct Chittagong / Dhaka Freight</span>
                </div>
              </div>

              {/* Endorsement Quote */}
              <div className="border-l-2 border-[#ff5500] pl-3 py-1 mb-4 bg-white/[0.02] rounded-r-lg">
                <div className="flex items-center space-x-1 text-amber-400 text-xs mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1 font-mono">{cust.testimonial.date}</span>
                </div>
                <p className="text-xs italic text-slate-300">
                  "{lang === 'BN' ? cust.testimonial.quoteBn : cust.testimonial.quote}"
                </p>
              </div>
            </div>

            {/* Card Footer: Category Tags & Action */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center flex-wrap gap-1.5">
                {cust.sectorsOfInterest.map((secId) => {
                  const cat = CATEGORIES.find((c) => c.id === secId);
                  return (
                    <span
                      key={secId}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] text-slate-300 border border-white/10"
                    >
                      {cat?.name || secId}
                    </span>
                  );
                })}
              </div>

              <button
                onClick={onOpenRfq}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff5500] text-white hover:text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                <span>Submit Direct Bid</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
