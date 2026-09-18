import React, { useState } from 'react';
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
  Clock,
  Cpu,
  Scissors,
  Layers,
  Send,
} from 'lucide-react';
import { Supplier } from '../types';

interface ComplianceVaultDrawerProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRfq: (supplier: Supplier) => void;
  theme?: 'dark' | 'light';
}

export const ComplianceVaultDrawer: React.FC<ComplianceVaultDrawerProps> = ({
  supplier,
  isOpen,
  onClose,
  onOpenRfq,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'machinery' | 'lines'>('audit');

  if (!isOpen || !supplier) return null;

  const isDark = theme === 'dark';

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

  const sla = supplier.productionSla || {
    totalLines: supplier.activeLines || 28,
    bookedCapacityPercentage: 74,
    sampleLeadDays: 7,
    productionLeadDays: 35,
    nextAvailableSlot: '2026-10-15',
  };

  const machineryRoster = [
    {
      brand: 'Juki (Japan)',
      model: 'DDL-9000C Direct-Drive Computerized Lockstitch',
      quantity: 140,
      spec: 'Digital tension feed with automatic thread trimmer',
      type: 'Assembly Line Sewing',
    },
    {
      brand: 'Brother (Japan)',
      model: 'S-7300A Nexio Electronic Direct Drive',
      quantity: 55,
      spec: 'DigiFlex Feed for sensitive stretch knits & twill',
      type: 'Precision Seaming',
    },
    {
      brand: 'Gerber / Lectra',
      model: 'Paragon Automated Multi-Ply CNC Fabric Cutters',
      quantity: 6,
      spec: 'Continuous vacuum conveyor with ±0.2mm tolerance',
      type: 'Automated Cutting',
    },
    {
      brand: 'Tajima (Japan)',
      model: 'TMAR-KC Multi-Head Industrial Embroidery 12-Color',
      quantity: 10,
      spec: 'High-speed 1,100 rpm with auto-pantograph sync',
      type: 'Specialized Embellishment',
    },
    {
      brand: 'Veit (Germany)',
      model: 'Varioset Steam Tunnel Pressing & Finishing Units',
      quantity: 8,
      spec: 'Anti-crease sanitized steam chamber with QC scales',
      type: 'Finishing & Inspection',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-md sm:max-w-xl border-l shadow-2xl flex flex-col ${
            isDark
              ? 'bg-[#0e0e0e] border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Top Drawer Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isDark ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight flex items-center space-x-2">
                  <span>Factory Floor Audit & Vault</span>
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[260px]">
                  {supplier.name} • {supplier.district} Hub
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

          {/* Navigation Tabs (Audit Vault, Machinery Roster, Active Lines) */}
          <div
            className={`flex items-center space-x-2 px-5 py-2.5 border-b text-xs font-bold ${
              isDark ? 'bg-[#111111] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ESG & EPB Vault
            </button>
            <button
              onClick={() => setActiveTab('machinery')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'machinery'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Machinery Roster (Juki/Brother)
            </button>
            <button
              onClick={() => setActiveTab('lines')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'lines'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Lines SLA
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {activeTab === 'audit' && (
              <>
                {/* Status Banner */}
                <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#10b981] block">
                        Enterprise Tier-1 Audit Passed
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Certificate ID: <strong className="text-white font-mono">{vault.certificateId}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/20 px-2 py-1 rounded-md border border-[#10b981]/40">
                    VERIFIED
                  </span>
                </div>

                {/* Core Statutory Verification */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Statutory Government & Association Registrations</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Export Promotion Bureau</span>
                      <p className="text-xs font-mono font-bold text-white mt-0.5">{vault.epbRegNo}</p>
                      <span className="text-[10px] text-[#10b981] flex items-center space-x-1 mt-1 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>EPB Bonded Registered</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141414] border border-white/10">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Trade Association</span>
                      <p className="text-xs font-mono font-bold text-white mt-0.5">
                        {vault.bgmeaRegNo || (supplier.bgmeaMember ? 'BGMEA Active Member' : 'Direct EPZ Enterprise')}
                      </p>
                      <span className="text-[10px] text-[#10b981] flex items-center space-x-1 mt-1 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Active Member</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Environmental Standards & LEED */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#10b981]" />
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
                      <Leaf className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">Carbon & Energy Footprint</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{vault.environmentalRating}</p>
                      </div>
                    </div>

                    {supplier.leedStatus && (
                      <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-300">USGBC LEED Rating</span>
                        <span className="text-xs font-extrabold text-[#e11d48] px-2.5 py-0.5 rounded-full bg-[#e11d48]/15 border border-[#e11d48]/30">
                          LEED {supplier.leedStatus} Certified
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications Roster */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Active International Accreditations</span>
                  </h4>

                  <div className="space-y-2">
                    {(supplier.compliance || supplier.certifications).map((cert, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 rounded-md bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-white">{cert}</span>
                        </div>
                        <span className="text-[11px] text-[#10b981] font-mono">Validated by SGS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tab 2: Machinery Roster */}
            {activeTab === 'machinery' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>
                    Verified inventory of automated industrial sewing, computerized CNC cutting, and embroidery lines.
                  </span>
                </div>

                <div className="space-y-3">
                  {machineryRoster.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider">
                          {m.type}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                          {m.quantity} Units Installed
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{m.brand} • {m.model}</h5>
                      <p className="text-xs text-slate-400">{m.spec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Active Production Lines SLA */}
            {activeTab === 'lines' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Line Capacity Allocation</span>
                    <span className="text-xs font-mono font-bold text-[#10b981]">
                      {sla.bookedCapacityPercentage}% Booked
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-[#e11d48] to-amber-500 h-full rounded-l-full"
                      style={{ width: `${sla.bookedCapacityPercentage}%` }}
                    />
                    <div
                      className="bg-[#10b981] h-full rounded-r-full"
                      style={{ width: `${100 - sla.bookedCapacityPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 font-mono">
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-[10px] block">Total Operational Lines:</span>
                      <strong className="text-white text-sm">{sla.totalLines} Lines</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-[10px] block">Next Available Slot:</span>
                      <strong className="text-[#10b981] text-sm">{sla.nextAvailableSlot}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <h5 className="font-bold text-white flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>SLA Lead Times & Export Terms</span>
                  </h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Samples are dispatched via express courier (DHL / FedEx) within {sla.sampleLeadDays} days of lab-dip approval. Bulk production cycles average {sla.productionLeadDays} days FOB Chattogram Port under 50% JIT Escrow or Irrevocable Bank L/C.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Action */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center space-x-3 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRfq(supplier);
              }}
              className="py-2.5 px-5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reserve Production Slot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
