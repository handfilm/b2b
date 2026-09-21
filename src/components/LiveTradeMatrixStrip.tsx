import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../context/I18nContext';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Sparkles,
  Ship,
  Anchor,
  CheckCircle2,
  Building2,
  Flame,
  ArrowRight,
  ExternalLink,
  Award,
  Globe2,
  Activity,
} from 'lucide-react';

interface LiveTradeMatrixStripProps {
  theme?: 'dark' | 'light';
  onOpenFactories?: () => void;
  onOpenBuyers?: () => void;
  onOpenShipping?: () => void;
  onOpenFreightMatrix?: () => void;
  metrics?: import('../types').NexosDatabaseMetrics;
  onOpenPipeline?: () => void;
}

export const LiveTradeMatrixStrip: React.FC<LiveTradeMatrixStripProps> = ({
  theme = 'dark',
  onOpenFactories,
  onOpenBuyers,
  onOpenShipping,
  onOpenFreightMatrix,
  metrics: customMetrics,
  onOpenPipeline,
}) => {
  const isDark = theme === 'dark';
  const handleShipping = onOpenFreightMatrix || onOpenShipping;
  const { t, toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);

  // Exact Database Metrics binding from admin.handsandhead.com
  const activeMetrics = customMetrics || {
    activeBuyers: 15420,
    verifiedSuppliers: 3105,
    totalTradeVol: '6.5 Crore+',
    bdtSalesVolume: '65,000,000 BDT',
  };

  const metrics = [
    {
      id: 'exporters',
      label: isBn ? 'রপ্তানিকারক' : 'Exporters',
      value: `${toDigits(activeMetrics.verifiedSuppliers.toLocaleString())}+`,
      badge: isBn ? 'ইপিবি বন্ডেড' : 'EPB Bonded',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Building2 className="w-3.5 h-3.5 text-[#e11d48]" />,
      action: onOpenFactories,
      actionText: isBn ? `${toDigits(activeMetrics.verifiedSuppliers.toLocaleString())}+ কারখানা দেখুন` : `Explore ${activeMetrics.verifiedSuppliers.toLocaleString()}+ Mills`,
      tooltip: {
        title: isBn ? 'যাচাইকৃত বাংলাদেশ রপ্তানিকারক' : 'Verified Bangladesh Exporters',
        tagline: isBn ? `নেক্সস ডেটাবেজে ${toDigits(activeMetrics.verifiedSuppliers.toLocaleString())}+ ইপিবি বন্ডেড মিল` : `${activeMetrics.verifiedSuppliers.toLocaleString()}+ EPB Bonded Mills in NexOS DB`,
        stats: [
          { label: isBn ? 'আরএমজি নিটওয়্যার ও জার্সি' : 'RMG Knitwear & Jersey', value: isBn ? `${toDigits('1,850')}+ ইউনিট` : '1,850+ Units' },
          { label: isBn ? 'ওভেন ও সেলভেজ ডেনিম' : 'Woven & Selvedge Denim', value: isBn ? `${toDigits('750')}+ প্ল্যান্ট` : '750+ Plants' },
          { label: isBn ? 'ফিনিশড লেদার ও পাদুকা' : 'Finished Leather & Shoes', value: isBn ? `${toDigits('320')}+ ট্যানারি` : '320+ Tannery/Mfr' },
          { label: isBn ? 'পাটজাত ও পরিবেশবান্ধব পণ্য' : 'Diversified Jute & Agro', value: isBn ? `${toDigits('185')}+ ইউনিট` : '185+ Eco Units' },
        ],
        compliance: 'OEKO-TEX 100 • GOTS • WRAP • SEDEX • BSCI',
        turnaround: isBn ? 'কাউন্টার-স্যাম্পল: ৩-৫ দিন • বাল্ক: ৩০-৪৫ দিন' : 'Counter-sample: 3-5 days • Bulk: 30-45 days',
      },
    },
    {
      id: 'buyers',
      label: isBn ? 'ক্রেতাসমূহ' : 'Buyers',
      value: `${toDigits(activeMetrics.activeBuyers.toLocaleString())}+`,
      badge: isBn ? 'সক্রিয় হাব' : 'Active Hub',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Users className="w-3.5 h-3.5 text-[#10b981]" />,
      action: onOpenBuyers,
      actionText: isBn ? 'ক্রেতা হাব দেখুন' : 'View Buyer Hub',
      tooltip: {
        title: isBn ? 'বৈশ্বিক সোর্সিং নেটওয়ার্ক' : 'Global Sourcing Network',
        tagline: isBn ? `${toDigits(activeMetrics.activeBuyers.toLocaleString())} যাচাইকৃত আন্তর্জাতিক ক্রেতা একাউন্ট` : `${activeMetrics.activeBuyers.toLocaleString()} Verified Purchasing Accounts`,
        stats: [
          { label: isBn ? 'ইউরোপিয়ান ইউনিয়ন (EU)' : 'European Union (EU)', value: isBn ? `${toDigits('44%')} ভলিউম` : '44% Volume' },
          { label: isBn ? 'উত্তর আমেরিকা (US/CA)' : 'North America (US/CA)', value: isBn ? `${toDigits('36%')} ভলিউম` : '36% Volume' },
          { label: isBn ? 'যুক্তরাজ্য, জাপান ও অস্ট্রেলিয়া' : 'UK, Japan & Australia', value: isBn ? `${toDigits('20%')} ভলিউম` : '20% Volume' },
          { label: isBn ? 'সক্রিয় মাসিক আরএফকিউ' : 'Active Monthly RFQs', value: isBn ? `${toDigits('120')}+ টেন্ডার` : '120+ Tenders' },
        ],
        compliance: isBn ? 'ব্যাংক এল/সি যাচাইকৃত • ৫০% জেআইটি এসক্রো কভারেজ' : 'Bank L/C Verified • 50% JIT Escrow Coverage',
        turnaround: isBn ? 'জিরো মধ্যস্বত্বভোগী সরাসরি কারখানা ম্যাচিং' : 'Direct Buyer-to-Mill Matching with Zero Intermediary Markups',
      },
    },
    {
      id: 'capacity',
      label: isBn ? 'বিক্রয় হিসাব (লেজার)' : 'Sales Ledger',
      value: isBn ? '৬.৫ কোটি+' : `${activeMetrics.totalTradeVol}`,
      badge: 'NexOS Central',
      badgeColor: 'text-[#ff1e42] bg-[#e11d48]/15 border-[#e11d48]/30',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#e11d48]" />,
      action: onOpenPipeline || handleShipping,
      actionText: isBn ? 'নেক্সস লেজার পরিদর্শন' : 'Inspect NexOS Ledger',
      tooltip: {
        title: isBn ? 'নেক্সস সেন্ট্রাল ডেটাবেজ' : 'NexOS Central Database',
        tagline: isBn ? `${toDigits(activeMetrics.totalTradeVol)} বিডিটি বিক্রয় ইনজেস্টেড` : `${activeMetrics.totalTradeVol} BDT Sales Volume Ingested`,
        stats: [
          { label: isBn ? 'বিক্রয় ইতিহাস' : 'BDT Sales History', value: isBn ? '৬৫,০০০,০০০ টাকা' : (activeMetrics.bdtSalesVolume || '65,000,000 BDT') },
          { label: 'Google Drive Headless', value: 'shop.handsandhead.com' },
          { label: 'Japan Wholesale Store', value: 'arutemika.com' },
          { label: isBn ? 'সিঙ্ক পাইপলাইন স্ট্যাটাস' : 'Sync Pipeline Status', value: isBn ? 'লাইভ বাস সক্রিয়' : 'Realtime Bus Online' },
        ],
        compliance: 'Duty-Free EU EBA (GSP) & UK DCTS Tariff Treatment',
        turnaround: 'Continuous Headless Asset & Inventory Hydration',
      },
    },
    {
      id: 'leed',
      label: isBn ? 'লিড গ্রিন মিলস' : 'LEED Green Mills',
      value: `${toDigits('220+')}`,
      badge: '#1 ESG World',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />,
      action: onOpenFactories,
      actionText: isBn ? 'গ্রিন মিলস দেখুন' : 'Browse Green Mills',
      tooltip: {
        title: isBn ? 'ইউএসজিবিসি প্রত্যয়িত পরিবেশবান্ধব কারখানা' : 'USGBC Green Certified Factories',
        tagline: isBn ? 'বিশ্বের শীর্ষ পরিবেশবান্ধব তৈরি পোশাক শিল্প' : 'World Leader in Eco-Friendly RMG',
        stats: [
          { label: isBn ? 'লিড প্ল্যাটিনাম প্রত্যয়িত' : 'LEED Platinum Certified', value: isBn ? `${toDigits('80')}+ মিলস` : '80+ Facilities' },
          { label: isBn ? 'লিড গোল্ড প্রত্যয়িত' : 'LEED Gold Certified', value: isBn ? `${toDigits('140')}+ মিলস` : '140+ Facilities' },
          { label: isBn ? 'বিশ্বের শীর্ষ ১০০ কারখানার' : 'Top 100 World Green RMG', value: isBn ? `৭৩টি বাংলাদেশে` : '73 in Bangladesh' },
          { label: isBn ? 'কার্বন ও পানি সাশ্রয়' : 'Carbon & Water Footprint', value: isBn ? `-${toDigits('40')}% CO2 / -${toDigits('50')}% H2O` : '-40% CO2 / -50% H2O' },
        ],
        compliance: 'Zero Liquid Discharge (ZLD) • Solar Rooftop Integrated',
        turnaround: isBn ? 'ইউরোপ ও উত্তর আমেরিকার ইএসজি অগ্রাধিকারপ্রাপ্ত' : 'Preferred by ESG-mandated retailers across EU and North America',
      },
    },
  ];

  return (
    <section
      id="live-trade-matrix-strip"
      className={`w-full transition-colors duration-200 relative z-10 ${
        isDark
          ? 'bg-[#0b0e14] border-y border-white/10'
          : 'bg-[#f8fafc] border-y border-slate-200'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5">
        {/* Compact Bar with Live Indicator & Functional Status Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-inherit">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isBn ? 'লাইভ ট্রেড ম্যাট্রিক্স' : 'Live Trade Matrix'}
            </span>
            <span
              className={`text-[9.5px] font-mono px-2 py-0.2 rounded border ${
                isDark
                  ? 'bg-white/5 text-slate-300 border-white/10'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {isBn ? 'ইপিবি কাস্টমস সিঙ্কড' : 'EPB Customs Synced'}
            </span>
            {onOpenPipeline && (
              <button
                type="button"
                onClick={onOpenPipeline}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#e11d48]/15 hover:bg-[#e11d48]/25 text-[#ff1e42] border border-[#e11d48]/30 font-mono text-[9.5px] font-bold transition-all cursor-pointer"
                title="Inspect NexOS Data Ingestion Pipeline (Google Drive & Arutemika)"
              >
                <Activity className="w-3 h-3 text-[#ff1e42]" />
                <span>{isBn ? 'নেক্সস বাস: সক্রিয়' : 'NEXOS BUS: ACTIVE'}</span>
              </button>
            )}
          </div>

          {/* Interactive Chips with Animated Hover Cards */}
          <div className="flex items-center space-x-2 text-[10.5px]">
            {/* Chattogram Port Chip */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredChip('port')}
              onMouseLeave={() => setHoveredChip(null)}
            >
              <button
                type="button"
                onClick={handleShipping}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Ship className="w-3 h-3 text-[#10b981]" />
                <span>
                  <strong>{isBn ? 'চট্টগ্রাম বন্দর:' : 'Chattogram Port:'}</strong> {toDigits('3.2')}d AVG
                </span>
              </button>

              <AnimatePresence>
                {hoveredChip === 'port' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute top-full right-0 mt-1.5 z-50 pointer-events-none w-64"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/95 border border-[#10b981]/50 rounded-xl p-2.5 shadow-2xl text-white text-[10.5px] space-y-1">
                      <div className="font-bold text-[#10b981] flex items-center justify-between">
                        <span>{isBn ? 'চট্টগ্রাম বন্দর (CGP) হাব' : 'Chattogram Port (CGP) Hub'}</span>
                        <span className="text-[9px] font-mono text-slate-400">{isBn ? '৯২% বাণিজ্য' : '92% Trade'}</span>
                      </div>
                      <p className="text-slate-300 text-[10px] leading-tight">
                        {isBn ? 'গড় টার্নঅ্যারাউন্ড ৩.২ দিন এবং সিঙ্গাপুর ও কলম্বো ট্রান্সশিপমেন্ট লাইনে দৈনিক ফিডার জাহাজ চলাচল।' : 'Average vessel berth turnaround is 3.2 days with daily feeder departures to Singapore and Colombo deep-sea transshipment lines.'}
                      </p>
                      <div className="text-[9.5px] font-mono text-emerald-400 flex items-center space-x-1 pt-0.5">
                        <ArrowRight className="w-3 h-3" />
                        <span>{isBn ? 'সি ফ্রেট ক্যালকুলেটর খুলতে ক্লিক করুন' : 'Click to open Sea Freight Calculator'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Escrow Guarantee Chip */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setHoveredChip('escrow')}
              onMouseLeave={() => setHoveredChip(null)}
            >
              <button
                type="button"
                onClick={handleShipping}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Anchor className="w-3 h-3 text-[#e11d48]" />
                <span>
                  <strong>{isBn ? 'এসক্রো ও এল/সি:' : 'Escrow & L/C:'}</strong> {isBn ? '১০০% সুরক্ষিত' : '100% Guaranteed'}
                </span>
              </button>

              <AnimatePresence>
                {hoveredChip === 'escrow' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute top-full right-0 mt-1.5 z-50 pointer-events-none w-64"
                  >
                    <div className="backdrop-blur-xl bg-[#090d16]/95 border border-[#e11d48]/50 rounded-xl p-2.5 shadow-2xl text-white text-[10.5px] space-y-1">
                      <div className="font-bold text-[#e11d48] flex items-center justify-between">
                        <span>Irrevocable Trade Escrow</span>
                        <span className="text-[9px] font-mono text-slate-400">Bank-Backed</span>
                      </div>
                      <p className="text-slate-300 text-[10px] leading-tight">
                        50% JIT payment release milestone is triggered upon verified on-board ocean Bill of Lading (B/L) inspection.
                      </p>
                      <div className="text-[9.5px] font-mono text-rose-400 flex items-center space-x-1 pt-0.5">
                        <ArrowRight className="w-3 h-3" />
                        <span>Click to view trade protection terms</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 4 Compact, High-Density Metric Nodes with Next-Level Animated Hover Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {metrics.map((m, idx) => {
            // Intelligent tooltip horizontal alignment to prevent right-edge and left-edge overflowing
            const isFirst = idx === 0;
            const isLast = idx === metrics.length - 1;
            const isSecond = idx === 1;

            const alignmentClasses = isFirst
              ? 'left-0 sm:left-0 -translate-x-0'
              : isLast
              ? 'right-0 left-auto translate-x-0'
              : isSecond
              ? 'right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2'
              : 'left-1/2 -translate-x-1/2';

            return (
              <div
                key={m.id}
                className="relative"
                onMouseEnter={() => setHoveredCard(m.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={m.action}
                  className={`w-full text-left p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs ${
                    isDark
                      ? 'bg-[#121620] hover:bg-[#161c2b] border-white/10 hover:border-[#e11d48]/60 shadow-black/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#e11d48]/50 shadow-slate-200'
                  }`}
                >
                  {/* Node Top: Icon + Label + Badge */}
                  <div className="flex items-center justify-between gap-1 w-full">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <div
                        className={`p-1 rounded-md ${
                          isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {m.icon}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold tracking-tight truncate ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {m.label}
                      </span>
                    </div>

                    <span
                      className={`text-[8.5px] sm:text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${m.badgeColor}`}
                    >
                      {m.badge}
                    </span>
                  </div>

                  {/* Node Bottom: Value + Arrow */}
                  <div className="mt-1 flex items-baseline justify-between w-full">
                    <div
                      className={`text-lg sm:text-xl font-black tracking-tight group-hover:text-[#e11d48] transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {m.value}
                    </div>
                    <div className="flex items-center space-x-0.5 text-[9px] font-bold text-slate-400 group-hover:text-[#e11d48] transition-colors">
                      <span className="hidden sm:inline">Details</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* Next-Level Hover Animated Card */}
                <AnimatePresence>
                  {hoveredCard === m.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className={`absolute bottom-full mb-2 z-50 pointer-events-none w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] ${alignmentClasses}`}
                    >
                      <div className="backdrop-blur-xl bg-[#090d16]/98 border border-[#e11d48]/40 rounded-2xl p-3 sm:p-3.5 shadow-2xl text-white space-y-2">
                        {/* Tooltip Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <div>
                            <div className="font-extrabold text-xs text-white flex items-center space-x-1.5">
                              <span>{m.tooltip.title}</span>
                            </div>
                            <div className="text-[9.5px] font-mono text-[#10b981]">
                              {m.tooltip.tagline}
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                            {m.badge}
                          </span>
                        </div>

                        {/* Tooltip Stats Grid */}
                        <div className="grid grid-cols-2 gap-1.5 py-0.5">
                          {m.tooltip.stats.map((st, i) => (
                            <div
                              key={i}
                              className="bg-white/5 rounded-lg p-1.5 border border-white/5"
                            >
                              <div className="text-[8.5px] text-slate-400 font-medium">
                                {st.label}
                              </div>
                              <div className="text-[11px] font-mono font-bold text-slate-100">
                                {st.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Compliance & Operations */}
                        <div className="text-[9.5px] font-mono text-slate-300 bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-lg p-1.5">
                          <div className="text-[#ff4a68] font-bold text-[8.5px] uppercase tracking-wider mb-0.5">
                            Standard & SLA
                          </div>
                          <div className="line-clamp-2 leading-tight">
                            {m.tooltip.compliance}
                          </div>
                        </div>

                        {/* Action Prompt */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                          <span>{m.tooltip.turnaround}</span>
                          <span className="text-[#10b981] font-bold flex items-center space-x-1">
                            <span>{m.actionText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
