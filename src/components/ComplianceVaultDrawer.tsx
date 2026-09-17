import React from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Droplets,
  Leaf,
  FileCheck2,
  BadgeCheck,
  Building,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Supplier } from '../types';

interface ComplianceVaultDrawerProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRfq: (supplier: Supplier) => void;
}

export const ComplianceVaultDrawer: React.FC<ComplianceVaultDrawerProps> = ({
  supplier,
  isOpen,
  onClose,
  onOpenRfq,
}) => {
  if (!isOpen || !supplier) return null;

  const vault = supplier.complianceVault || {
    certificateId: `LEED-EPB-BD-${supplier.establishedYear}`,
    auditDate: '2026-02-15',
    validUntil: '2028-02-14',
    auditorName: 'USGBC & SGS Industrial Verification',
    environmentalRating: 'LEED Certified Facility | Zero toxic discharge ETP',
    waterTreatment: 'Biological Effluent Treatment Plant (3,500 m³/day)',
    epbRegNo: `EPB/REG/BD/${supplier.establishedYear}/9812`,
    bgmeaRegNo: supplier.bgmeaMember ? `BGMEA-MEM-${supplier.establishedYear + 1200}` : undefined,
    auditScore: '98.2% Comprehensive ESG Pass',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#0e0e0e] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Top Drawer Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#141414] to-[#101010] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <span>Factory Compliance & ESG Vault</span>
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">
                  {supplier.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status Banner */}
            <div className="p-4 rounded-xl bg-[#161616] border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-400 block">
                    Enterprise Tier-1 Audit Passed
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Certificate ID: <strong className="text-white font-mono">{vault.certificateId}</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                VERIFIED
              </span>
            </div>

            {/* Core Verification Credentials */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Statutory Government & Association Registrations</span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Export Promotion Bureau</span>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">{vault.epbRegNo}</p>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1 mt-1 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>EPB Registered</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Trade Association</span>
                  <p className="text-xs font-mono font-bold text-white mt-0.5">
                    {vault.bgmeaRegNo || vault.bkmeaRegNo || (supplier.bgmeaMember ? 'BGMEA Active Member' : 'Direct EPZ Enterprise')}
                  </p>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1 mt-1 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>Active Member</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental & ETP Water Treatment Ratings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Environmental & Water Treatment Standards</span>
              </h4>

              <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3">
                <div className="flex items-start space-x-3">
                  <Droplets className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Biological Effluent Treatment (ETP)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{vault.waterTreatment}</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex items-start space-x-3">
                  <Leaf className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Carbon & Energy Footprint</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{vault.environmentalRating}</p>
                  </div>
                </div>

                {supplier.leedStatus && (
                  <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-300">USGBC LEED Rating</span>
                    <span className="text-xs font-extrabold text-[#ff5500] px-2.5 py-0.5 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/30">
                      LEED {supplier.leedStatus} Certified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Standard Certifications List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Active International Certifications ({supplier.compliance?.length || supplier.certifications.length})</span>
              </h4>

              <div className="space-y-2">
                {(supplier.compliance || supplier.certifications).map((cert, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#ff5500]/10 border border-[#ff5500]/20 flex items-center justify-center text-[#ff5500]">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white">{cert}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Valid & Certified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Body & Expiry */}
            <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Accredited Auditing Body:</span>
                <span className="text-white font-medium text-right max-w-[200px] truncate">{vault.auditorName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Comprehensive Audit:</span>
                <span className="text-white font-mono">{vault.auditDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Certification Valid Until:</span>
                <span className="text-emerald-400 font-mono font-bold">{vault.validUntil}</span>
              </div>
              {vault.auditScore && (
                <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                  <span>ESG Compliance Score:</span>
                  <span className="text-[#ff5500] font-bold">{vault.auditScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer Action */}
          <div className="p-5 border-t border-white/10 bg-[#121212] flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Close Drawer
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRfq(supplier);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-extrabold shadow-lg shadow-[#ff5500]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Dispatch RFQ to Factory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
