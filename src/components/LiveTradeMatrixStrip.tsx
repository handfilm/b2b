import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      label: 'Exporters',
      value: `${activeMetrics.verifiedSuppliers.toLocaleString()}+`,
      badge: 'EPB Bonded',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Building2 className="w-3.5 h-3.5 text-[#e11d48]" />,
      action: onOpenFactories,
      actionText: `Explore ${activeMetrics.verifiedSuppliers.toLocaleString()}+ Mills`,
      tooltip: {
        title: 'Verified Bangladesh Exporters',
        tagline: `${activeMetrics.verifiedSuppliers.toLocaleString()}+ EPB Bonded Mills in NexOS DB`,
        stats: [
          { label: 'RMG Knitwear & Jersey', value: '1,850+ Units' },
          { label: 'Woven & Selvedge Denim', value: '750+ Plants' },
          { label: 'Finished Leather & Shoes', value: '320+ Tannery/Mfr' },
          { label: 'Diversified Jute & Agro', value: '185+ Eco Units' },
        ],
        compliance: 'OEKO-TEX 100 • GOTS • WRAP • SEDEX • BSCI',
        turnaround: 'Counter-sample: 3-5 days • Bulk: 30-45 days',
      },
    },
    {
      id: 'buyers',
      label: 'Buyers',
      value: `${activeMetrics.activeBuyers.toLocaleString()}+`,
      badge: 'Active Hub',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Users className="w-3.5 h-3.5 text-[#10b981]" />,
      action: onOpenBuyers,
      actionText: 'View Buyer Hub',
      tooltip: {
        title: 'Global Sourcing Network',
        tagline: `${activeMetrics.activeBuyers.toLocaleString()} Verified Purchasing Accounts`,
        stats: [
          { label: 'European Union (EU)', value: '44% Volume' },
          { label: 'North America (US/CA)', value: '36% Volume' },
          { label: 'UK, Japan & Australia', value: '20% Volume' },
          { label: 'Active Monthly RFQs', value: '120+ Tenders' },
        ],
        compliance: 'Bank L/C Verified • 50% JIT Escrow Coverage',
        turnaround: 'Direct Buyer-to-Mill Matching with Zero Intermediary Markups',
      },
    },
    {
      id: 'capacity',
      label: 'Sales Ledger',
      value: `${activeMetrics.totalTradeVol}`,
      badge: 'NexOS Central',
      badgeColor: 'text-[#ff1e42] bg-[#e11d48]/15 border-[#e11d48]/30',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#e11d48]" />,
      action: onOpenPipeline || handleShipping,
      actionText: 'Inspect NexOS Ledger',
      tooltip: {
        title: 'NexOS Central Database',
        tagline: `${activeMetrics.totalTradeVol} BDT Sales Volume Ingested`,
        stats: [
          { label: 'BDT Sales History', value: activeMetrics.bdtSalesVolume || '65,000,000 BDT' },
          { label: 'Google Drive Headless', value: 'shop.handsandhead.com' },
          { label: 'Japan Wholesale Store', value: 'arutemika.com' },
          { label: 'Sync Pipeline Status', value: 'Realtime Bus Online' },
        ],
        compliance: 'Duty-Free EU EBA (GSP) & UK DCTS Tariff Treatment',
        turnaround: 'Continuous Headless Asset & Inventory Hydration',
      },
    },
    {
      id: 'leed',
      label: 'LEED Green Mills',
      value: '220+',
      badge: '#1 ESG World',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />,
      action: onOpenFactories,
      actionText: 'Browse Green Mills',
      tooltip: {
        title: 'USGBC Green Certified Factories',
        tagline: 'World Leader in Eco-Friendly RMG',
        stats: [
          { label: 'LEED Platinum Certified', value: '80+ Facilities' },
          { label: 'LEED Gold Certified', value: '140+ Facilities' },
          { label: 'Top 100 World Green RMG', value: '73 in Bangladesh' },
          { label: 'Carbon & Water Footprint', value: '-40% CO2 / -50% H2O' },
        ],
        compliance: 'Zero Liquid Discharge (ZLD) • Solar Rooftop Integrated',
        turnaround: 'Preferred by ESG-mandated retailers across EU and North America',
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
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5">
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
              Live Trade Matrix
            </span>
            <span
              className={`text-[9.5px] font-mono px-2 py-0.2 rounded border ${
                isDark
                  ? 'bg-white/5 text-slate-300 border-white/10'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              EPB Customs Synced
            </span>
            {onOpenPipeline && (
              <button
                type="button"
                onClick={onOpenPipeline}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#e11d48]/15 hover:bg-[#e11d48]/25 text-[#ff1e42] border border-[#e11d48]/30 font-mono text-[9.5px] font-bold transition-all cursor-pointer"
                title="Inspect NexOS Data Ingestion Pipeline (Google Drive & Arutemika)"
              >
                <Activity className="w-3 h-3 text-[#ff1e42]" />
                <span>NEXOS BUS: ACTIVE</span>
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
                  <strong>Chattogram Port:</strong> 3.2d AVG
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
                        <span>Chattogram Port (CGP) Hub</span>
                        <span className="text-[9px] font-mono text-slate-400">92% Trade</span>
                      </div>
                      <p className="text-slate-300 text-[10px] leading-tight">
                        Average vessel berth turnaround is 3.2 days with daily feeder departures to Singapore and Colombo deep-sea transshipment lines.
                      </p>
                      <div className="text-[9.5px] font-mono text-emerald-400 flex items-center space-x-1 pt-0.5">
                        <ArrowRight className="w-3 h-3" />
                        <span>Click to open Sea Freight Calculator</span>
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
                  <strong>Escrow & L/C:</strong> 100% Guaranteed
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
