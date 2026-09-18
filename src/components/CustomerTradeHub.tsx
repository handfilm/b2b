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
import { CustomerCard } from './CustomerCard';
import { BuyerDetailDrawer } from './BuyerDetailDrawer';

interface CustomerTradeHubProps {
  customers: Customer[];
  liveEvents: LiveTradeEvent[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  lang: LanguageCode;
  onOpenRfq: () => void;
  onOpenAutomation: () => void;
  theme?: 'dark' | 'light';
}

export const CustomerTradeHub: React.FC<CustomerTradeHubProps> = ({
  customers,
  liveEvents,
  selectedCategory,
  onSelectCategory,
  lang,
  onOpenRfq,
  onOpenAutomation,
  theme = 'dark',
}) => {
  const t = getTranslation(lang);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const isDark = theme === 'dark';

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
        return <FileCheck className="w-4 h-4 text-[#10b981]" />;
      case 'container_shipped':
        return <Ship className="w-4 h-4 text-sky-400" />;
      case 'sample_dispatched':
        return <Plane className="w-4 h-4 text-amber-400" />;
      case 'rfq_broadcast':
        return <FileText className="w-4 h-4 text-[#e11d48]" />;
      case 'quote_placed':
        return <DollarSign className="w-4 h-4 text-purple-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Realtime Live Trading Stream Ticker */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 shadow-xl relative overflow-hidden ${
          isDark
            ? 'bg-[#141414] border-white/10'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-inherit">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
            </span>
            <span
              className={`text-xs sm:text-sm font-black tracking-wide uppercase flex items-center gap-1.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.liveTickerTitle}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              Live Feed Active
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={onOpenAutomation}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#e11d48]/15 hover:bg-[#e11d48]/25 text-[#ff1e42] border border-[#e11d48]/30 font-bold transition-all cursor-pointer"
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
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                isDark
                  ? 'bg-white/5 border-white/5'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
                  {getEventIcon(evt.type)}
                </div>
                <div className="truncate">
                  <span className={`font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {evt.description || evt.title || evt.details}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {evt.partner || evt.partyName} • {evt.timestamp}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#10b981] shrink-0 bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20">
                {typeof evt.valueUSD === 'number' ? `$${evt.valueUSD.toLocaleString()}` : (evt.valueUSD || '$45,000')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Verification Badges Filter Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border ${
          isDark
            ? 'bg-[#121212] border-white/10'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search enterprise buyers, countries..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:border-[#e11d48] ${
              isDark
                ? 'bg-[#1a1a1a] text-white border-white/10'
                : 'bg-slate-50 text-slate-900 border-slate-200'
            }`}
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
                  ? 'bg-[#e11d48] text-white font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white bg-[#1a1a1a]'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {status === 'all' ? 'All Tiers' : status}
            </button>
          ))}
        </div>
      </div>

      {/* 1:1 Aspect Ratio Square Cards Grid for Verified Global Buyers */}
      {filteredCustomers.length === 0 ? (
        <div
          className={`py-16 text-center space-y-3 rounded-2xl border ${
            isDark ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-base">No matching global buyers found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try clearing the search query or changing verification tier filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.map((cust) => (
            <CustomerCard
              key={cust.id}
              customer={cust}
              onSelectCustomer={(c) => setSelectedCustomer(c)}
              onContactCustomer={(c) => {
                setSelectedCustomer(c);
                onOpenRfq();
              }}
              theme={theme}
            />
          ))}
        </div>
      )}

      {/* Slide-out Buyer Detail Drawer */}
      <BuyerDetailDrawer
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        onOpenRfq={onOpenRfq}
        theme={theme}
      />
    </div>
  );
};
