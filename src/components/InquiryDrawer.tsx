import React from 'react';
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div
        id="inquiry-drawer-container"
        className="w-full max-w-md bg-[#0e0e0e] text-white h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Trade Desk & Inquiries</h3>
              <p className="text-[11px] text-slate-400">
                Tracking your samples, factory quotes & JIT escrow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 50% JIT Escrow Summary Banner */}
          <div className="p-3.5 bg-[#141414] border border-white/10 rounded-xl space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
              <span>50% Advance JIT Escrow Standard</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Orders are protected by international standby LC / trade escrow. 50% upon pre-production lab-dip approval, 50% upon Chattogram Port Bill of Lading (B/L) release.
            </p>
          </div>

          {/* RFQ Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-[#ff5500]" />
                <span>Active Commercial RFQs ({rfqs.length})</span>
              </h4>
              <button
                onClick={onOpenRfq}
                className="text-xs text-[#ff5500] font-bold hover:underline"
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 shrink-0">
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

          {/* Sample Requests Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Package className="w-4 h-4 text-[#ff5500]" />
              <span>Couriers & Samples ({samples.length})</span>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
