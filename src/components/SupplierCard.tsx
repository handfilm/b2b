import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Clock,
  Layers,
  Send,
  ZoomIn,
  Maximize2,
  X,
  Mail,
  Phone,
  MapPin,
  Flame,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { Supplier } from '../types';
import { getExporterActivity, getExporterSector } from '../utils/exporterActivity';

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const avatarVisual =
    supplier.avatarUrl ||
    supplier.coverUrl ||
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=160&q=80';

  const activity = getExporterActivity(supplier);
  const sector = getExporterSector(supplier);

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
    <>
      <div
        id={`supplier-card-${supplier.id}`}
        onClick={handleCardClick}
        className={`relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 ${
          isDark
            ? 'bg-[#121212] border border-white/10 hover:border-[#10b981]/80 shadow-lg hover:shadow-2xl hover:shadow-[#10b981]/15'
            : 'bg-white border border-slate-200 hover:border-[#10b981]/70 shadow-xs hover:shadow-2xl'
        }`}
      >
        {/* 1. BACKGROUND PHOTO: Fit to Card with Cinematic Hover Zoom */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 animate-pulse bg-neutral-900 pointer-events-none" />
          <img
            src={factoryVisual}
            alt={supplier.name}
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
          {/* Top: Country Flag, District & Verification Badge & Quick Photo Zoom Button */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-xl" title="Made in Bangladesh">
                  🇧🇩
                </span>
                <span className="text-[10px] font-mono text-slate-200 font-bold truncate max-w-[80px]">
                  {supplier.district}
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

                <span className="inline-flex items-center px-2 py-0.8 rounded-lg text-[10px] font-bold bg-[#10b981] text-slate-950 shadow-sm border border-white/20 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 mr-1 shrink-0" />
                  <span>
                    {supplier.leedStatus
                      ? `LEED ${supplier.leedStatus}`
                      : supplier.bondedWarehouse
                      ? 'EPB Bonded'
                      : 'BGMEA Verified'}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Context at a Glance: Recent Activity Badge & Open Line Slots Count */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <span
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-slate-200 truncate max-w-[130px]"
                title={`Recent Activity: ${activity.shiftStatus} (${activity.time})`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    activity.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span className="truncate">{activity.time}</span>
              </span>

              <span
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-black bg-amber-500 text-slate-950 backdrop-blur-md shadow-sm border border-amber-300/40 shrink-0"
                title={`${activity.openLinesCount} active lines open for immediate booking`}
              >
                <Flame className="w-3 h-3 fill-slate-950 text-slate-950 shrink-0" />
                <span>{activity.statusText}</span>
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
                  src={avatarVisual}
                  alt={supplier.name}
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
                {supplier.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-200 truncate drop-shadow-sm">
                {supplier.employeeCount ? `${supplier.employeeCount} Machinists` : 'Certified Facility'} • Est. {supplier.establishedYear}
              </p>
              <p className="text-[10px] text-slate-300 truncate flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                <span>{supplier.district} Industrial Zone, Bangladesh</span>
              </p>
            </div>
          </div>

          {/* Bottom: Category Pill & Line Capacity */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs backdrop-blur-xs">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md truncate max-w-[130px] shadow-xs ${
                sector.isLeather
                  ? 'bg-amber-500/85 text-slate-950'
                  : sector.isDenim
                  ? 'bg-indigo-500/85 text-white'
                  : 'bg-emerald-500/85 text-slate-950'
              }`}
            >
              {sector.label}
            </span>

            <div className="flex items-center space-x-1.5">
              {supplier.contactEmail && (
                <span title={supplier.contactEmail} className="p-1 rounded bg-black/60 text-slate-200 border border-white/10">
                  <Mail className="w-2.5 h-2.5" />
                </span>
              )}
              {supplier.phone && (
                <span title={supplier.phone} className="p-1 rounded bg-black/60 text-emerald-400 border border-white/10">
                  <Phone className="w-2.5 h-2.5" />
                </span>
              )}
              <span className="text-xs font-black text-emerald-300 font-mono drop-shadow-sm">
                {sla.totalLines} Lines
              </span>
            </div>
          </div>
        </div>

        {/* 3. ON HOVER: RICH SOURCING OPERATIONAL OVERLAY */}
        <div
          className="absolute inset-0 p-4 bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 text-white"
          onClick={(e) => {
            // Card click triggers primary handler
          }}
        >
          {/* Top: Header */}
          <div className="space-y-1 border-b border-white/10 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#10b981]" />
                <span>Verified BD Manufacturer</span>
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
                <span className="text-base" title="Bangladesh">🇧🇩</span>
              </div>
            </div>

            <h4 className="text-sm font-black truncate text-white">
              {supplier.name}
            </h4>
            <p className="text-[10.5px] text-slate-300 truncate font-medium">
              {supplier.district} Export Mill • Est. {supplier.establishedYear}
            </p>
          </div>

          {/* Middle: Capacity Gauge & Compliance Chips */}
          <div className="space-y-1.5 my-1">
            {/* Live Activity & Line Slots Banner */}
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-[10.5px]">
              <div className="flex items-center space-x-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-200 truncate">
                  Active <strong className="text-white">{activity.time}</strong>
                </span>
              </div>
              <span className="font-mono font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 shrink-0 text-[10px]">
                {activity.openLinesCount} Open Slots
              </span>
            </div>

            {/* Capacity Gauge */}
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-300 font-bold">Capacity Allocation</span>
                <span className="font-mono text-[#10b981] font-bold">
                  {bookedPercent}% Booked ({availablePercent}% Open)
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-[#e11d48] to-amber-500 h-full rounded-l-full"
                  style={{ width: `${bookedPercent}%` }}
                />
                <div
                  className="bg-[#10b981] h-full rounded-r-full"
                  style={{ width: `${availablePercent}%` }}
                />
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-1">
              {supplier.leedStatus && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e11d48]/15 text-[#ff1e42] border border-[#e11d48]/30">
                  LEED {supplier.leedStatus}
                </span>
              )}
              {supplier.bondedWarehouse && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  EPB Bonded
                </span>
              )}
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                OEKO-TEX 100
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                BSCI Audited
              </span>
            </div>

            {/* Lead Times */}
            <div className="grid grid-cols-2 gap-1 text-[9.5px] p-1.5 rounded bg-white/5 border border-white/5 font-mono">
              <div>
                <span className="text-slate-400 block font-sans">Sample:</span>
                <span className="font-bold text-white">{sla.sampleLeadDays}d (FedEx/DHL)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Bulk:</span>
                <span className="font-bold text-[#10b981]">{sla.productionLeadDays}d FOB CGP</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenFactoryDrawer) {
                  onOpenFactoryDrawer(supplier);
                } else if (onOpenComplianceVault) {
                  onOpenComplianceVault(supplier);
                } else {
                  onFilterBySupplier(supplier.id);
                }
              }}
              className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
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
              className="py-1.5 px-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Reserve Slot</span>
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
                <span className="text-2xl">🇧🇩</span>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    {supplier.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{activity.openLinesCount} Open Lines</span>
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {supplier.district} Industrial Zone • {sla.totalLines} Active Lines • Active {activity.time}
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
                src={factoryVisual}
                alt={supplier.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {supplier.leedStatus
                      ? `LEED ${supplier.leedStatus}`
                      : supplier.bondedWarehouse
                      ? 'EPB Bonded Warehouse'
                      : 'BGMEA Registered'}
                  </span>
                </span>
                <span className="font-mono text-emerald-400 font-black">
                  Next Open Slot: {sla.nextAvailableSlot}
                </span>
              </div>
            </div>

            {/* Lightbox Actions */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400 truncate">
                {supplier.about || `Certified export manufacturing facility in ${supplier.district}`}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    if (onOpenFactoryDrawer) {
                      onOpenFactoryDrawer(supplier);
                    } else if (onOpenComplianceVault) {
                      onOpenComplianceVault(supplier);
                    } else {
                      onFilterBySupplier(supplier.id);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Factory Audit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    if (onReserveLineSlot) {
                      onReserveLineSlot(supplier);
                    } else {
                      onContactSupplier(supplier);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reserve Slot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
