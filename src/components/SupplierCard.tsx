import React from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  Layers,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react';
import { Supplier } from '../types';

interface SupplierCardProps {
  supplier: Supplier;
  onContactSupplier: (supplier: Supplier) => void;
  onFilterBySupplier: (supplierId: string) => void;
  onOpenComplianceVault?: (supplier: Supplier) => void;
  onReserveLineSlot?: (supplier: Supplier) => void;
  onOpenAiAssistant?: (supplier: Supplier) => void;
  onOpenFactoryDrawer?: (supplier: Supplier) => void;
  theme?: 'dark' | 'light';
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onContactSupplier,
  onFilterBySupplier,
  onOpenComplianceVault,
  onReserveLineSlot,
  onOpenAiAssistant,
  onOpenFactoryDrawer,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const sla = supplier.productionSla || {
    totalLines: supplier.activeLines || 24,
    bookedCapacityPercentage: 74,
    sampleLeadDays: 7,
    productionLeadDays: 35,
    nextAvailableSlot: '2026-10-15',
  };

  const bookedPercent = sla.bookedCapacityPercentage;
  const availablePercent = 100 - bookedPercent;

  // Factory cover visual fallback
  const factoryVisual =
    supplier.coverUrl ||
    supplier.avatarUrl ||
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';

  const handleCardClick = () => {
    if (onOpenFactoryDrawer) {
      onOpenFactoryDrawer(supplier);
    } else if (onOpenComplianceVault) {
      onOpenComplianceVault(supplier);
    } else {
      onFilterBySupplier(supplier.id);
    }
  };

  return (
    <div
      id={`supplier-card-${supplier.id}`}
      onClick={handleCardClick}
      className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 ${
        isDark
          ? 'bg-[#141414] border border-white/10 hover:border-[#10b981]/70 shadow-lg hover:shadow-2xl hover:shadow-[#10b981]/10'
          : 'bg-white border border-slate-200 hover:border-[#10b981]/70 shadow-xs hover:shadow-xl'
      }`}
    >
      {/* 1. DEFAULT STATE: Square Factory Visual & Clean Architectural Card */}
      <img
        src={factoryVisual}
        alt={supplier.name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      {/* Top Badges & Scrim */}
      <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/85 via-black/30 to-transparent flex items-start justify-between pointer-events-none z-10">
        <div className="flex flex-wrap gap-1.5 items-center">
          {supplier.bondedWarehouse && (
            <span className="bg-[#10b981] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider font-mono flex items-center space-x-1">
              <ShieldCheck className="w-2.5 h-2.5 fill-current" />
              <span>EPB BONDED</span>
            </span>
          )}

          {supplier.leedStatus && (
            <span className="bg-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>LEED {supplier.leedStatus}</span>
            </span>
          )}
        </div>

        {supplier.verified && (
          <span
            className="w-7 h-7 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#10b981] shadow-xs"
            title="EPB & BGMEA Verified Facility"
          >
            <ShieldCheck className="w-4 h-4" />
          </span>
        )}
      </div>

      {/* Default State Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/95 via-black/65 to-transparent transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
        <div className="flex items-baseline justify-between">
          <h3 className="text-white text-sm sm:text-base font-black truncate drop-shadow-md">
            {supplier.name}
          </h3>
          <span className="text-[10px] text-[#10b981] font-mono font-bold shrink-0 ml-1">
            {supplier.activeLines || 24} Lines
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
          <span className="text-slate-300 font-medium truncate">
            📍 {supplier.district} Industrial Zone
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Est. {supplier.establishedYear}
          </span>
        </div>
      </div>

      {/* 2. ON HOVER: GLASSMORPHIC OPERATIONAL SLA & AUDIT OVERLAY (Smooth CSS transition) */}
      <div
        className="absolute inset-0 p-4 bg-[#0a0a0a]/94 backdrop-blur-md flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 text-white"
        onClick={(e) => {
          // Card click opens the Factory Floor Audit drawer
        }}
      >
        {/* Top: Identity & Capacity Gauge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-[#10b981]" />
              <span>{supplier.district} Export Mill</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              Active SLA
            </span>
          </div>

          <h4 className="text-sm font-black truncate text-white">
            {supplier.name}
          </h4>

          {/* SLA Capacity Gauge */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-300 font-bold">Line Capacity</span>
              <span className="font-mono text-[#10b981] font-bold">
                {bookedPercent}% Booked ({availablePercent}% Open)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-[#e11d48] to-amber-500 h-full rounded-l-full"
                style={{ width: `${bookedPercent}%` }}
              />
              <div
                className="bg-[#10b981] h-full rounded-r-full"
                style={{ width: `${availablePercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 pt-0.5">
              <span>{sla.totalLines} Active Lines</span>
              <span className="text-white font-semibold">
                Next Open Slot: <strong className="text-[#10b981]">{sla.nextAvailableSlot}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Certifications & Sample SLA */}
        <div className="space-y-2 my-1">
          {/* Verified Certifications Badges */}
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">
              Verified Compliance Vault
            </span>
            <div className="flex flex-wrap gap-1">
              {supplier.leedStatus && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/30">
                  LEED {supplier.leedStatus}
                </span>
              )}
              {(supplier.oekoTexCertified || supplier.certifications?.some((c) => c.toLowerCase().includes('oeko'))) && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                  OEKO-TEX 100
                </span>
              )}
              {(supplier.bsciAudited || supplier.certifications?.some((c) => c.toLowerCase().includes('bsci'))) && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  BSCI Audited
                </span>
              )}
              {(supplier.gotsCertified || supplier.certifications?.some((c) => c.toLowerCase().includes('gots'))) && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  GOTS Organic
                </span>
              )}
            </div>
          </div>

          {/* Turnaround Lead Times */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] p-2 rounded-lg bg-white/5 border border-white/10 font-mono">
            <div>
              <span className="text-slate-400 text-[9px] block font-sans">Sample Dispatch:</span>
              <span className="font-bold text-white">{sla.sampleLeadDays} Days (DHL/FedEx)</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] block font-sans">Bulk Production:</span>
              <span className="font-bold text-[#10b981]">{sla.productionLeadDays} Days FOB CGP</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenComplianceVault?.(supplier);
            }}
            className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
            title="Inspect Active Lines & Machinery Roster"
          >
            <Layers className="w-3 h-3 text-[#10b981]" />
            <span>Floor Audit</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onReserveLineSlot) {
                onReserveLineSlot(supplier);
              } else {
                onContactSupplier(supplier);
              }
            }}
            className="py-2 px-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
            title="Reserve Production Line / Submit RFQ"
          >
            <Send className="w-3 h-3" />
            <span>Reserve Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
