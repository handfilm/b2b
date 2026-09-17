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
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Made in Bangladesh (BD) Competitive Edge</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Why Global Brands & Wholesale Buyers Source from Bangladesh
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
          Bangladesh is the world's second-largest ready-made garment (RMG) exporter and the undisputed global leader in sustainable, LEED certified green industrial manufacturing. Supported by robust backward linkages and duty-free access to major global markets, sourcing "Made in BD" delivers cost efficiency without compromising ESG compliance.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-base">Global Green Capital</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Home to over <strong>220+ USGBC LEED certified green factories</strong>, including 68 LEED Platinum mills—the highest density of sustainable manufacturing plants on Earth.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold pt-1">
            40% Less Water & Carbon Footprint
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-base">Duty-Free Market Access</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Duty-free, quota-free preferential market access under Everything But Arms (EBA) to the European Union (27 countries), UK Developing Countries Trading Scheme (DCTS), Canada, Japan, and Australia.
          </p>
          <div className="text-[11px] text-blue-700 font-semibold pt-1">
            Zero Import Tariffs in Key Markets
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-base">Integrated Backward Linkage</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Over 85% of knitwear raw materials (spinning, knitting, dyeing, circular finishing) and 50%+ of woven fabrics are produced internally within Bangladesh, shortening lead times.
          </p>
          <div className="text-[11px] text-amber-700 font-semibold pt-1">
            Rapid Turnaround & Supply Stability
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-neutral-900 text-base">Bank LC & Legal Security</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All export contracts operate under Bangladesh Bank (Central Bank) foreign exchange guidelines, governed by international Irrevocable Letters of Credit (LC) and recognized dispute tribunals.
          </p>
          <div className="text-[11px] text-purple-700 font-semibold pt-1">
            100% Capital & Shipment Safety
          </div>
        </div>
      </div>

      {/* Sourcing Process Walkthrough */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-neutral-900">
          Step-by-Step B2B Sourcing Protocol from Bangladesh
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-700">01. RFQ & Tech Pack</div>
            <h4 className="font-bold text-sm text-neutral-900">Inquiry Dispatch</h4>
            <p className="text-xs text-neutral-600">
              Submit your target specifications, Pantone codes, GSM, and target unit pricing.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-700">02. Counter Sample</div>
            <h4 className="font-bold text-sm text-neutral-900">Lab Dips & Approval</h4>
            <p className="text-xs text-neutral-600">
              Receive physical prototypes via DHL Express within 5-7 business days for handfeel and sizing approval.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-700">03. Production & QC</div>
            <h4 className="font-bold text-sm text-neutral-900">Factory Run & Audits</h4>
            <p className="text-xs text-neutral-600">
              Bulk manufacturing under AQL 2.5 standard with pre-shipment third-party inspection (SGS, Intertek, Bureau Veritas).
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-700">04. Seaport Dispatch</div>
            <h4 className="font-bold text-sm text-neutral-900">Port-to-Door Logistics</h4>
            <p className="text-xs text-neutral-600">
              Container loading at Chattogram or Mongla Port with complete Bill of Lading, GSP Form A, and Export Invoices.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenRfq}
            className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Post Your Custom Sourcing RFQ
          </button>
          <button
            onClick={onOpenShippingCalc}
            className="px-4 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            View Port Shipping Transit Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
