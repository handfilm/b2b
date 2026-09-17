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
      className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
    >
      <div className="p-5 space-y-4">
        {/* Top Supplier Identity */}
        <div className="flex items-start space-x-3.5">
          <img
            src={supplier.avatarUrl}
            alt={supplier.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-neutral-900 text-base truncate">
                {supplier.name}
              </h3>
              {supplier.verified && (
                <span title="Government & Chamber Verified" className="inline-flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 truncate mt-0.5">{supplier.district}</p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {supplier.leedStatus && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                  <span>LEED {supplier.leedStatus}</span>
                </span>
              )}
              {supplier.bgmeaMember && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  BGMEA Member
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
          {supplier.about}
        </p>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Workforce</span>
            <span className="font-bold text-neutral-800 flex items-center space-x-1 mt-0.5">
              <Users className="w-3 h-3 text-neutral-500" />
              <span>{supplier.employeeCount}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Est. Year</span>
            <span className="font-bold text-neutral-800 flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3 h-3 text-neutral-500" />
              <span>{supplier.establishedYear}</span>
            </span>
          </div>
          <div className="col-span-2 pt-1 border-t border-neutral-200/60">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Annual Capacity</span>
            <span className="font-bold text-neutral-900 mt-0.5 block truncate">
              {supplier.annualCapacity}
            </span>
          </div>
        </div>

        {/* Export Markets */}
        <div>
          <span className="text-[11px] font-semibold text-neutral-600 block mb-1">
            Major Export Destinations:
          </span>
          <div className="flex flex-wrap gap-1">
            {supplier.exportMarkets.map((market, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
              >
                {market}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications List */}
        <div>
          <span className="text-[11px] font-semibold text-neutral-600 block mb-1">
            Audits & Compliance:
          </span>
          <div className="flex flex-wrap gap-1">
            {supplier.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 border-t border-neutral-100 mt-2 flex items-center space-x-2">
        <button
          onClick={() => onFilterBySupplier(supplier.id)}
          className="flex-1 py-2 px-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer text-center"
        >
          View Factory Items
        </button>
        <button
          onClick={() => onContactSupplier(supplier)}
          className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer text-center"
        >
          Contact Trade Desk
        </button>
      </div>
    </div>
  );
};
