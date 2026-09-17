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
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs flex justify-end">
      <div
        id="inquiry-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Inbox className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Sourcing Activity & Inquiries</h3>
              <p className="text-[11px] text-neutral-400">
                Tracking your samples, factory quotes & RFQs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* RFQ Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Submitted RFQs ({rfqs.length})</span>
              </h4>
              <button
                onClick={onOpenRfq}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                + New RFQ
              </button>
            </div>

            {rfqs.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-neutral-200 text-center text-xs text-neutral-400">
                No active RFQs submitted yet. Click "Post RFQ" to request quotes from certified factories.
              </div>
            ) : (
              <div className="space-y-2.5">
                {rfqs.map((rfq) => (
                  <div
                    key={rfq.id}
                    className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-neutral-900 line-clamp-1">
                        {rfq.productRequirement}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        {rfq.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-600 grid grid-cols-2 gap-1 font-mono">
                      <div>Volume: {rfq.targetQuantity.toLocaleString()} pcs</div>
                      <div>Target: ${rfq.targetUnitPriceUSD}</div>
                      <div className="col-span-2 text-neutral-500 font-sans">
                        Dest: {rfq.destinationPort}
                      </div>
                    </div>

                    <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-200 flex justify-between">
                      <span>Submitted: {rfq.createdAt}</span>
                      <span className="text-emerald-700 font-medium">Factories review underway</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Requests Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Sample Orders ({samples.length})</span>
            </h4>

            {samples.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-neutral-200 text-center text-xs text-neutral-400">
                No samples ordered yet. Browse catalog items and click "Sample" to request physical approval pieces.
              </div>
            ) : (
              <div className="space-y-2.5">
                {samples.map((s) => {
                  const totalConv = ((s.sampleFeeUSD + s.courierFeeUSD) * currency.rate).toFixed(2);
                  return (
                    <div
                      key={s.id}
                      className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-xs text-neutral-900 block line-clamp-1">
                            {s.productTitle}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Supplier: {s.supplierName}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                          {s.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-600 flex justify-between font-mono bg-white p-2 rounded-lg border border-neutral-200">
                        <span>Courier: DHL Air Express</span>
                        <span className="font-bold text-neutral-900">
                          {currency.symbol}{totalConv}
                        </span>
                      </div>

                      <div className="text-[10px] text-neutral-500 flex justify-between items-center">
                        <span className="font-mono">Track: {s.trackingNumber}</span>
                        <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                          <Truck className="w-3 h-3" />
                          <span>4-6 Days Delivery</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500 text-center">
          Trade desk assistance: <span className="font-bold text-neutral-700">support@handsandhead.com</span>
        </div>
      </div>
    </div>
  );
};
