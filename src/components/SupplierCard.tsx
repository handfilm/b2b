import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Globe2,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Supplier } from '../types';

interface SupplierCardProps {
  supplier: Supplier;
  onContactSupplier: (supplier: Supplier) => void;
  onFilterBySupplier: (supplierId: string) => void;
  onOpenComplianceVault?: (supplier: Supplier) => void;
  onReserveLineSlot?: (supplier: Supplier) => void;
  onOpenAiAssistant?: (supplier: Supplier) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onContactSupplier,
  onFilterBySupplier,
  onOpenComplianceVault,
  onReserveLineSlot,
  onOpenAiAssistant,
}) => {
  const [showCapacityTooltip, setShowCapacityTooltip] = useState(false);
  const [showComplianceTooltip, setShowComplianceTooltip] = useState(false);

  const sla = supplier.productionSla || {
    totalLines: supplier.activeLines || 24,
    bookedCapacityPercentage: 78,
    sampleLeadDays: 7,
    productionLeadDays: 45,
    nextAvailableSlot: '2026-10-15',
  };

  const bookedPercent = sla.bookedCapacityPercentage;
  const availablePercent = 100 - bookedPercent;

  return (
    <div
      id={`supplier-card-${supplier.id}`}
      className="glass-card-interactive rounded-2xl border border-white/10 hover:border-[#ff5500]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#ff5500]/5"
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Top Supplier Identity */}
        <div className="flex items-start space-x-3">
          <img
            src={supplier.avatarUrl}
            alt={supplier.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-white/10 shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3
                onClick={() => onFilterBySupplier(supplier.id)}
                className="font-extrabold text-white text-sm sm:text-base truncate cursor-pointer hover:text-[#ff5500] transition-colors"
                title={supplier.name}
              >
                {supplier.name}
              </h3>
              {supplier.verified && (
                <span title="EPB & BGMEA Verified Exporter" className="inline-flex items-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{supplier.district} Hub</p>

            <div className="flex flex-wrap gap-1 mt-1.5">
              {supplier.leedStatus && (
                <button
                  type="button"
                  onClick={() => onOpenComplianceVault?.(supplier)}
                  className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 flex items-center space-x-1 hover:bg-[#ff5500]/25 transition-colors cursor-pointer"
                  title="Click to inspect LEED Green Certificate"
                >
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-[#ff5500]" />
                  <span>LEED {supplier.leedStatus}</span>
                </button>
              )}
              {supplier.bondedWarehouse && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  EPB Bonded
                </span>
              )}
              {supplier.bankLcAccepted && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Bank L/C
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SLA Guarantee Badge */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#ff5500]/15 via-[#1a1410] to-[#121212] border border-[#ff5500]/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <Clock className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
            <span className="font-extrabold text-white text-[11px] sm:text-xs truncate">
              {sla.sampleLeadDays}-Day Sample Courier Turnaround
            </span>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 ml-1">
            SLA Backed
          </span>
        </div>

        {/* Lean Bio */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {supplier.about}
        </p>

        {/* Production Capacity Gauge with Rich Hover Tooltip */}
        <div
          className="relative p-2.5 sm:p-3 rounded-xl bg-[#141414] border border-white/10 space-y-2 cursor-pointer transition-colors hover:border-[#ff5500]/40"
          onMouseEnter={() => setShowCapacityTooltip(true)}
          onMouseLeave={() => setShowCapacityTooltip(false)}
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Production Capacity</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              <strong className="text-white">{sla.totalLines}</strong> Lines Active
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#202020] h-2 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${bookedPercent}%` }}
                className="bg-[#ff5500] h-full transition-all"
                title={`Booked: ${bookedPercent}%`}
              />
              <div
                style={{ width: `${availablePercent}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Open Capacity: ${availablePercent}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#ff5500] font-bold">{bookedPercent}% Booked</span>
              <span className="text-emerald-400 font-bold">{availablePercent}% Open ({Math.round(sla.totalLines * (availablePercent / 100))} Lines)</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-t border-white/5">
            <span>Next Open Slot:</span>
            <span className="text-white font-mono font-bold">{sla.nextAvailableSlot}</span>
          </div>

          {/* On-Hover Capacity Preview Popover */}
          {showCapacityTooltip && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 bg-[#0a0a0a] text-white p-2.5 rounded-xl border border-[#ff5500]/40 shadow-2xl z-30 pointer-events-none text-left">
              <div className="text-xs font-bold text-[#ff5500] flex items-center space-x-1">
                <Info className="w-3.5 h-3.5" />
                <span>Live Floor Capacity Breakdown</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1 space-y-0.5 font-mono">
                <div>• Total Lines: {sla.totalLines} automated lines</div>
                <div>• Export Bulk Lead: {sla.productionLeadDays} days</div>
                <div>• Port Transit: Chattogram Port (4-6h express road)</div>
              </div>
            </div>
          )}
        </div>

        {/* Compliance Tags with On-Hover Audit Preview */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Verified Compliance
            </span>
            <button
              type="button"
              onClick={() => onOpenComplianceVault?.(supplier)}
              className="text-[10px] text-[#ff5500] hover:underline font-bold cursor-pointer"
            >
              Audit Vault →
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {(supplier.compliance || supplier.certifications).slice(0, 4).map((cert, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenComplianceVault?.(supplier)}
                className="text-[9px] sm:text-[10px] font-medium bg-[#1a1a1a] hover:bg-[#252525] text-slate-300 hover:text-white px-2 py-0.5 rounded border border-white/10 transition-colors cursor-pointer"
              >
                {cert}
              </button>
            ))}
            {(supplier.compliance || supplier.certifications).length > 4 && (
              <button
                type="button"
                onClick={() => onOpenComplianceVault?.(supplier)}
                className="text-[9px] sm:text-[10px] text-[#ff5500] px-1.5 py-0.5 rounded bg-[#ff5500]/10 border border-[#ff5500]/20 font-bold cursor-pointer"
              >
                +{(supplier.compliance || supplier.certifications).length - 4}
              </button>
            )}
          </div>
        </div>

        {/* Export Destinations */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-mono">
            Export Destinations
          </span>
          <div className="flex flex-wrap gap-1">
            {(supplier.exportDestinations || supplier.exportMarkets).slice(0, 4).map((market, idx) => (
              <span
                key={idx}
                className="text-[9px] sm:text-[10px] font-mono bg-[#171717] text-slate-300 px-1.5 py-0.5 rounded border border-white/5"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer - Non-wrapping, Balanced 3-column Responsive Buttons */}
      <div className="p-3 sm:p-4 pt-2 border-t border-white/10 grid grid-cols-12 gap-1.5 bg-[#121212]">
        <button
          onClick={() => (onReserveLineSlot ? onReserveLineSlot(supplier) : onContactSupplier(supplier))}
          className="col-span-5 py-2 px-2 rounded-xl border border-[#ff5500]/40 hover:border-[#ff5500] text-[#ff5500] hover:text-white bg-[#ff5500]/10 hover:bg-[#ff5500] text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center space-x-1 truncate"
          title="Reserve Production Line Slot"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Reserve Line</span>
        </button>

        {onOpenAiAssistant && (
          <button
            onClick={() => onOpenAiAssistant(supplier)}
            className="col-span-3 py-2 px-1.5 rounded-xl border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 truncate"
            title="Instant AI Inquiry about this factory"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
            <span className="truncate">AI</span>
          </button>
        )}

        <button
          onClick={() => onContactSupplier(supplier)}
          className={`${onOpenAiAssistant ? 'col-span-4' : 'col-span-7'} py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center space-x-1 truncate`}
          title="Direct Manufacturer Message"
        >
          <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate">Contact</span>
        </button>
      </div>
    </div>
  );
};


