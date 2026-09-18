import React, { useState } from 'react';
import {
  X,
  Inbox,
  Package,
  FileCheck,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  ShieldCheck,
  Building,
  Check,
  AlertCircle,
  Coins,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SampleInquiry, RfqSubmission, CurrencyConfig } from '../types';

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  samples: SampleInquiry[];
  rfqs: RfqSubmission[];
  currency: CurrencyConfig;
  onOpenRfq: () => void;
}

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  samples,
  rfqs,
  currency,
  onOpenRfq,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'rfqs' | 'escrow' | 'samples'>('escrow');

  // Milestone Stages Definition for JIT Escrow
  const escrowOrders = [
    {
      id: 'ESCROW-BD-2026-9901',
      factoryName: 'Plummy Fashions Ltd.',
      poNumber: 'PO-NORDIC-8821',
      productName: 'Organic Combed Cotton 240 GSM Crewnecks (5,000 pcs)',
      totalValueUSD: 14250,
      bankLcVerified: true,
      currentMilestoneIndex: 1, // Inline Inspection active
      milestones: [
        {
          stage: 1,
          percentage: '20%',
          name: 'Advance / Lab Dip & Pattern Approval',
          status: 'completed',
          date: '2026-09-08',
          note: 'GOTS Lab Dip Approved & Escrow Released ($2,850)',
        },
        {
          stage: 2,
          percentage: '40%',
          name: 'Inline Inspection (Pre-Sewing / Cutting QC)',
          status: 'in_progress',
          date: '2026-09-17',
          note: 'SGS Third-Party Inspector on-site in Narayanganj floor ($5,700 Held in Escrow)',
        },
        {
          stage: 3,
          percentage: '30%',
          name: 'Pre-Shipment Inspection (PSI Pass + Bill of Lading Issued)',
          status: 'pending',
          date: 'Est. 2026-10-02',
          note: 'Payable on Chattogram Port On-Board Bill of Lading ($4,275)',
        },
        {
          stage: 4,
          percentage: '10%',
          name: 'Port Clearance & Customs Delivery',
          status: 'pending',
          date: 'Est. 2026-10-24',
          note: 'Final settlement upon destination port clearance ($1,425)',
        },
      ],
    },
    {
      id: 'ESCROW-BD-2026-8742',
      factoryName: 'Square Fashions Ltd.',
      poNumber: 'PO-KAUF-9142',
      productName: 'Biodegradable Hydrocarbon-Free Jute Bags (25,000 pcs)',
      totalValueUSD: 36250,
      bankLcVerified: true,
      currentMilestoneIndex: 0,
      milestones: [
        {
          stage: 1,
          percentage: '20%',
          name: 'Advance / Lab Dip & Pattern Approval',
          status: 'completed',
          date: '2026-09-15',
          note: 'Food-grade batch certification verified ($7,250)',
        },
        {
          stage: 2,
          percentage: '40%',
          name: 'Inline Inspection (Pre-Sewing / Cutting QC)',
          status: 'pending',
          date: 'Est. 2026-09-28',
          note: 'Weaving & tensile batch testing ($14,500)',
        },
        {
          stage: 3,
          percentage: '30%',
          name: 'Pre-Shipment Inspection (PSI Pass + Bill of Lading Issued)',
          status: 'pending',
          date: 'Est. 2026-10-18',
          note: 'Marine freight load inspection ($10,875)',
        },
        {
          stage: 4,
          percentage: '10%',
          name: 'Port Clearance & Customs Delivery',
          status: 'pending',
          date: 'Est. 2026-11-05',
          note: 'Hamburg Port customs release ($3,625)',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div
        id="inquiry-drawer-container"
        className="w-full max-w-lg bg-[#0e0e0e] text-white h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Commercial Trade Desk</h3>
              <p className="text-[11px] text-slate-400">
                Bank L/C Milestones, RFQs & Physical Sample Tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Sub-tabs */}
        <div className="flex border-b border-white/10 bg-[#111111] p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('escrow')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'escrow'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>L/C Assurance ({escrowOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rfqs')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'rfqs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>RFQs ({rfqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'samples'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Samples ({samples.length})</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* TAB 1: BANK L/C MILESTONE TRACKER */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              {/* Escrow Rule Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#181818] to-[#121212] border border-blue-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-black text-white">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Bank L/C 4-Stage Milestone Assurance</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-600/20 text-sky-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
                    TRADE ASSURANCE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Funds remain secured via international Bank Letter of Credit protocols until independent inspection certificates and shipping documentation are verified.
                </p>
                <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Standard Bank L/C Support</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>100% Guaranteed L/C Acceptance</span>
                  </span>
                </div>
              </div>

              {/* Active Orders with Visual Escrow Steps */}
              <div className="space-y-4">
                {escrowOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-sky-400 font-bold block">
                          {order.poNumber} • {order.id}
                        </span>
                        <h4 className="font-extrabold text-white text-xs mt-0.5">{order.productName}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span>{order.factoryName}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-white font-mono block">
                          ${order.totalValueUSD.toLocaleString()}
                        </span>
                        {order.bankLcVerified && (
                          <span className="text-[9px] font-bold text-sky-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            Bank L/C Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                        <span>Milestone Stage {order.currentMilestoneIndex + 1} of 4</span>
                        <span className="text-emerald-400">
                          {order.currentMilestoneIndex === 1 ? '60% Progress' : '20% Progress'}
                        </span>
                      </div>
                      <div className="w-full bg-[#202020] h-2 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(order.currentMilestoneIndex + 1) * 25}%` }}
                          className="bg-blue-600 h-full transition-all"
                        />
                      </div>
                    </div>

                    {/* Step-by-Step Milestones */}
                    <div className="space-y-2.5 pt-1 border-t border-white/5">
                      {order.milestones.map((m) => {
                        const isDone = m.status === 'completed';
                        const isCurrent = m.status === 'in_progress';
                        return (
                          <div
                            key={m.stage}
                            className={`p-2.5 rounded-lg border text-xs transition-all ${
                              isCurrent
                                ? 'bg-blue-600/15 border-blue-500/40'
                                : isDone
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-[#181818] border-white/5 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    isDone
                                      ? 'bg-emerald-500 text-black'
                                      : isCurrent
                                      ? 'bg-blue-600 text-white animate-pulse'
                                      : 'bg-white/10 text-slate-400'
                                  }`}
                                >
                                  {isDone ? <Check className="w-3 h-3" /> : m.stage}
                                </div>
                                <span
                                  className={`font-extrabold ${
                                    isCurrent ? 'text-white' : isDone ? 'text-emerald-300' : 'text-slate-400'
                                  }`}
                                >
                                  Stage {m.stage} ({m.percentage}): {m.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {m.date}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 pl-7 leading-normal">
                              {m.note}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL RFQS */}
          {activeTab === 'rfqs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-sky-400" />
                  <span>Active Commercial RFQs ({rfqs.length})</span>
                </h4>
                <button
                  onClick={onOpenRfq}
                  className="text-xs text-sky-400 font-bold hover:underline cursor-pointer"
                >
                  + New RFQ
                </button>
              </div>

              {rfqs.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                  No active RFQs submitted yet. Click "Post RFQ" to request quotes from certified factories.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rfqs.map((rfq) => (
                    <div
                      key={rfq.id}
                      className="p-3.5 bg-[#141414] rounded-xl border border-white/10 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-white line-clamp-1">
                          {rfq.productRequirement}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/15 text-sky-400 border border-blue-500/30 shrink-0">
                          {rfq.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 grid grid-cols-2 gap-1 font-mono">
                        <div>Volume: {rfq.targetQuantity.toLocaleString()} pcs</div>
                        <div>Target: ${rfq.targetUnitPriceUSD}</div>
                        <div className="col-span-2 text-slate-500 font-sans">
                          Dest: {rfq.destinationPort}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 pt-1 border-t border-white/5 flex items-center justify-between">
                        <span>Ref: {rfq.id}</span>
                        <span>{rfq.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-sky-400" />
                <span>Couriers & Physical Samples ({samples.length})</span>
              </h4>

              {samples.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                  No physical sample requests currently in flight.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {samples.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-3.5 bg-[#141414] rounded-xl border border-white/10 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-white line-clamp-1">
                          {sample.productTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                          {sample.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                        <div>Supplier: {sample.supplierName}</div>
                        <div>Tracking: {sample.trackingNumber}</div>
                        <div>Qty: {sample.quantity} pcs</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

