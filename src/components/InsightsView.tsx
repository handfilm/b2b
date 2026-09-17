import React from 'react';
import {
  Award,
  Leaf,
  Globe2,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileText,
  Anchor,
  Sparkles,
} from 'lucide-react';
import { BANGLADESH_EXPORT_STATS } from '../data/mockData';

interface InsightsViewProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
}) => {
  return (
    <div className="space-y-8 py-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ff5500]/15 text-[#ff5500] text-xs font-bold border border-[#ff5500]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Made in Bangladesh (BD) Competitive Edge</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Why Global Brands & Wholesale Buyers Source from Bangladesh
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Bangladesh is the world's second-largest ready-made garment (RMG) exporter and the undisputed global leader in sustainable, LEED certified green industrial manufacturing. Supported by robust backward linkages and duty-free access to major global markets, sourcing "Made in BD" delivers cost efficiency without compromising ESG compliance.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Global Green Capital</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Home to over <strong className="text-white">220+ USGBC LEED certified green factories</strong>, including 68 LEED Platinum mills—the highest density of sustainable manufacturing plants on Earth.
          </p>
          <div className="text-[11px] text-[#ff5500] font-bold pt-1 font-mono">
            40% Less Water & Carbon Footprint
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-bold">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Duty-Free Market Access</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Duty-free, quota-free preferential market access under Everything But Arms (EBA) to the European Union (27 countries), UK Developing Countries Trading Scheme (DCTS), Canada, Japan, and Australia.
          </p>
          <div className="text-[11px] text-[#ff5500] font-bold pt-1 font-mono">
            Zero Import Tariffs in Key Markets
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Integrated Backward Linkage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Over 85% of knitwear raw materials (spinning, knitting, dyeing, circular finishing) and 50%+ of woven fabrics are produced internally within Bangladesh, shortening lead times.
          </p>
          <div className="text-[11px] text-[#ff5500] font-bold pt-1 font-mono">
            Rapid Turnaround & Supply Stability
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Bank LC & 50% JIT Escrow</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All export contracts operate under Bangladesh Bank foreign exchange guidelines, governed by international Irrevocable Letters of Credit (LC) and recognized dispute tribunals.
          </p>
          <div className="text-[11px] text-[#ff5500] font-bold pt-1 font-mono">
            100% Capital & Shipment Safety
          </div>
        </div>
      </div>

      {/* Sourcing Process Walkthrough */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-white">
          Step-by-Step B2B Sourcing Protocol from Bangladesh
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-2">
            <div className="text-xs font-mono font-bold text-[#ff5500]">01. INITIATION</div>
            <h4 className="text-sm font-bold text-white">Submit Sourcing RFQ</h4>
            <p className="text-xs text-slate-400">
              Provide tech-pack, target MOQ, and target unit pricing. Transmitted directly to certified EPB bonded manufacturers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-2">
            <div className="text-xs font-mono font-bold text-[#ff5500]">02. APPROVAL</div>
            <h4 className="text-sm font-bold text-white">Pre-Production Samples</h4>
            <p className="text-xs text-slate-400">
              Courier physical lab-dips, yarn swatches, and sizing sets via DHL/FedEx within 4-7 business days.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-2">
            <div className="text-xs font-mono font-bold text-[#ff5500]">03. PRODUCTION</div>
            <h4 className="text-sm font-bold text-white">50% JIT Advance Escrow</h4>
            <p className="text-xs text-slate-400">
              Contract secured via Bank LC or verified Escrow. Fabric knitting/weaving and cutting begin on dedicated lines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-2">
            <div className="text-xs font-mono font-bold text-[#ff5500]">04. EXPORT</div>
            <h4 className="text-sm font-bold text-white">Chattogram Departure</h4>
            <p className="text-xs text-slate-400">
              Container stuffed at bonded warehouse and loaded at Chattogram Port with full Bill of Lading documentation.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Need custom guidance for your sourcing department or brand tech-pack?
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onOpenRfq}
              className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 cursor-pointer"
            >
              Post Commercial RFQ
            </button>
            <button
              onClick={onOpenShippingCalc}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white bg-[#171717] text-xs font-bold cursor-pointer"
            >
              Check Freight Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
