import React from 'react';
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
} from 'lucide-react';

interface LiveTradeMatrixStripProps {
  theme?: 'dark' | 'light';
  onOpenFactories?: () => void;
  onOpenBuyers?: () => void;
  onOpenShipping?: () => void;
  onOpenFreightMatrix?: () => void;
}

export const LiveTradeMatrixStrip: React.FC<LiveTradeMatrixStripProps> = ({
  theme = 'dark',
  onOpenFactories,
  onOpenBuyers,
  onOpenShipping,
  onOpenFreightMatrix,
}) => {
  const isDark = theme === 'dark';
  const handleShipping = onOpenFreightMatrix || onOpenShipping;

  const metrics = [
    {
      id: 'exporters',
      label: 'Verified EPB & Green Exporters',
      value: '5,000+',
      subtext: 'LEED, OEKO-TEX, BGMEA & BKMEA Mills',
      badge: 'EPB Bonded',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Building2 className="w-4 h-4 text-[#e11d48]" />,
      action: onOpenFactories,
    },
    {
      id: 'buyers',
      label: 'Global Sourcing Accounts',
      value: 'Unlimited',
      subtext: 'EU, US, UK, Japan Verified Brands & Retailers',
      badge: 'Active Hub',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Users className="w-4 h-4 text-[#10b981]" />,
      action: onOpenBuyers,
    },
    {
      id: 'capacity',
      label: 'Bangladesh Annual Export Capacity',
      value: '$55.5B+',
      subtext: 'RMG, Jute, Leather & Specialized Crafts',
      badge: 'Global #2',
      badgeColor: 'text-[#ff1e42] bg-[#e11d48]/15 border-[#e11d48]/30',
      icon: <TrendingUp className="w-4 h-4 text-[#e11d48]" />,
      action: onOpenShipping,
    },
    {
      id: 'leed',
      label: 'USGBC LEED Platinum/Gold Facilities',
      value: '220+',
      subtext: 'World-Leading Highest Concentration of Green RMG',
      badge: 'Global #1 ESG',
      badgeColor: 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30',
      icon: <Sparkles className="w-4 h-4 text-[#10b981]" />,
      action: onOpenFactories,
    },
  ];

  return (
    <section
      id="live-trade-matrix-strip"
      className={`w-full transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f0f0f] border-y border-white/10'
          : 'bg-[#f1f5f9] border-y border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Mini Header with Live Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-inherit">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
            </span>
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Live Trade Matrix
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isDark
                  ? 'bg-white/5 text-slate-300 border-white/10'
                  : 'bg-white text-slate-600 border-slate-200 shadow-xs'
              }`}
            >
              Real-time EPB Customs & Port Sync
            </span>
          </div>

          {/* Port Status Strip */}
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Ship className="w-3.5 h-3.5 text-[#10b981]" />
              <span>
                <strong className={isDark ? 'text-white' : 'text-slate-800'}>
                  Chattogram Port:
                </strong>{' '}
                Vessels Berth 3.2d AVG
              </span>
            </div>
            <span className="text-slate-600 hidden md:inline">•</span>
            <div className="flex items-center space-x-1.5 text-slate-400 hidden md:flex">
              <Anchor className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>
                <strong className={isDark ? 'text-white' : 'text-slate-800'}>
                  Bank L/C Escrow:
                </strong>{' '}
                100% Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div
              key={m.id}
              onClick={m.action}
              className={`group p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isDark
                  ? 'bg-[#141414] hover:bg-[#1a1a1a] border-white/10 hover:border-[#e11d48]/50 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#e11d48]/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {m.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider line-clamp-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {m.label}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${m.badgeColor}`}
                >
                  {m.badge}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div
                  className={`text-xl sm:text-2xl font-black tracking-tight group-hover:text-[#e11d48] transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {m.value}
                </div>
                <span className="text-[10px] font-medium text-slate-500 line-clamp-1 max-w-[130px] text-right">
                  {m.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
