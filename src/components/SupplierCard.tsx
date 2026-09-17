import React from 'react';
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
} from 'lucide-react';
import { Supplier } from '../types';

interface SupplierCardProps {
  supplier: Supplier;
  onContactSupplier: (supplier: Supplier) => void;
  onFilterBySupplier: (supplierId: string) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onContactSupplier,
  onFilterBySupplier,
}) => {
  return (
    <div
      id={`supplier-card-${supplier.id}`}
      className="glass-card-interactive rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between"
    >
      <div className="p-5 space-y-4">
        {/* Top Supplier Identity */}
        <div className="flex items-start space-x-3.5">
          <img
            src={supplier.avatarUrl}
            alt={supplier.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-white text-base truncate">
                {supplier.name}
              </h3>
              {supplier.verified && (
                <span title="Government & Chamber Verified" className="inline-flex items-center">
                  <ShieldCheck className="w-4 h-4 text-[#ff5500] shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{supplier.district}</p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {supplier.leedStatus && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-[#ff5500]" />
                  <span>LEED {supplier.leedStatus}</span>
                </span>
              )}
              {supplier.bondedWarehouse && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  EPB Bonded Unit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
          {supplier.about}
        </p>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 bg-[#141414] rounded-xl border border-white/5 font-mono">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Workforce</span>
            <span className="font-bold text-white flex items-center space-x-1 mt-0.5">
              <Users className="w-3 h-3 text-[#ff5500]" />
              <span>{supplier.employeeCount}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Est. Year</span>
            <span className="font-bold text-white flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3 h-3 text-[#ff5500]" />
              <span>{supplier.establishedYear}</span>
            </span>
          </div>
          <div className="col-span-2 pt-1.5 border-t border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Annual Capacity</span>
            <span className="font-bold text-white mt-0.5 block truncate">
              {supplier.annualCapacity}
            </span>
          </div>
        </div>

        {/* Export Markets */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            Major Export Destinations:
          </span>
          <div className="flex flex-wrap gap-1">
            {supplier.exportMarkets.map((market, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#171717] text-slate-300 px-2 py-0.5 rounded-md border border-white/5"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-2 border-t border-white/10 flex items-center space-x-2 bg-[#121212]">
        <button
          onClick={() => onFilterBySupplier(supplier.id)}
          className="flex-1 py-2 px-2.5 rounded-xl border border-white/10 hover:border-[#ff5500]/40 text-slate-300 hover:text-white bg-[#171717] hover:bg-[#202020] text-xs font-bold transition-colors cursor-pointer text-center"
        >
          View Factory Items
        </button>

        <button
          onClick={() => onContactSupplier(supplier)}
          className="py-2 px-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-md shadow-[#ff5500]/20 transition-all cursor-pointer"
        >
          Contact Exporter
        </button>
      </div>
    </div>
  );
};
