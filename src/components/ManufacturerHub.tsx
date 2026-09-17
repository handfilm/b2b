import React, { useState } from 'react';
import {
  Factory,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Eye,
  Sliders,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar,
  Users,
  ChevronRight,
} from 'lucide-react';
import {
  RfqSubmission,
  FactoryProductionLine,
  CurrencyConfig,
} from '../types';
import { FACTORY_PRODUCTION_LINES } from '../data/mockData';

interface ManufacturerHubProps {
  rfqs: RfqSubmission[];
  currency: CurrencyConfig;
  onOpenRfq: () => void;
  onRespondToRfq?: (rfqId: string, quoteUSD: number, leadTimeDays: number) => void;
}

export const ManufacturerHub: React.FC<ManufacturerHubProps> = ({
  rfqs,
  currency,
  onOpenRfq,
  onRespondToRfq,
}) => {
  const [productionLines, setProductionLines] = useState<FactoryProductionLine[]>(
    FACTORY_PRODUCTION_LINES
  );
  const [selectedRfqForBid, setSelectedRfqForBid] = useState<RfqSubmission | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(3.2);
  const [bidLeadDays, setBidLeadDays] = useState<number>(40);
  const [bidPlacedSuccess, setBidPlacedSuccess] = useState<string | null>(null);

  // Line availability toggle
  const handleUpdateLineBooking = (lineId: string, newPct: number) => {
    setProductionLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId) {
          let status: FactoryProductionLine['status'] = 'Open';
          if (newPct >= 90) status = 'Fully Booked';
          else if (newPct >= 60) status = 'Partially Booked';
          return {
            ...l,
            currentBookedPct: newPct,
            status,
          };
        }
        return l;
      })
    );
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqForBid) return;

    if (onRespondToRfq) {
      onRespondToRfq(selectedRfqForBid.id, bidPrice, bidLeadDays);
    }
    setBidPlacedSuccess(`Bid submitted to ${selectedRfqForBid.companyName} at $${bidPrice} FOB`);
    setTimeout(() => {
      setSelectedRfqForBid(null);
      setBidPlacedSuccess(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Exporter Status Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#ff5500]/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/40 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse"></span>
                <span>Active Exporter Hub</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                BIN: 00192849201 • BGMEA / BKMEA Certified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bangladeshi Manufacturer & Export Dispatch Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Review live global inquiries, inspect international tech-packs, submit factory FOB bids, and publish monthly line capacity to verified buyers across the US, EU, and Japan.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <div className="bg-[#141414] border border-white/10 px-4 py-3 rounded-xl min-w-[130px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Open Inquiries</div>
              <div className="text-2xl font-black text-white">{rfqs.length}</div>
            </div>
            <div className="bg-[#141414] border border-white/10 px-4 py-3 rounded-xl min-w-[130px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Lines</div>
              <div className="text-2xl font-black text-[#ff5500]">
                {productionLines.length} Units
              </div>
            </div>
            <div className="bg-[#141414] border border-white/10 px-4 py-3 rounded-xl min-w-[130px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Bond Status</div>
              <div className="text-sm font-black text-emerald-400 flex items-center space-x-1 mt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>EPB Bonded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live RFQ Inquiries (Left) + Production Line Capacity Manager (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Buyer Inquiries & Tech-Packs (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#ff5500]" />
              <h3 className="text-base font-extrabold text-white">
                Live Global Buyer Inquiries ({rfqs.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Direct from Buyer Portal
            </span>
          </div>

          {rfqs.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-slate-400 text-xs">
              No new buyer inquiries pending at this moment.
            </div>
          ) : (
            <div className="space-y-3.5">
              {rfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="glass-card p-5 rounded-2xl border border-white/10 hover:border-[#ff5500]/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded border border-[#ff5500]/25">
                          {rfq.id}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {rfq.companyName} ({rfq.buyerCountry})
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {rfq.productRequirement}
                      </h4>
                    </div>

                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {rfq.status}
                    </span>
                  </div>

                  {/* Sourcing Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#171717] p-3 rounded-xl border border-white/5 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">VOLUME:</span>
                      <span className="text-white font-bold">{rfq.targetQuantity.toLocaleString()} pcs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">TARGET FOB:</span>
                      <span className="text-[#ff5500] font-bold">${rfq.targetUnitPriceUSD}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DEST PORT:</span>
                      <span className="text-white truncate block">{rfq.destinationPort}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">INCOTERMS:</span>
                      <span className="text-slate-300 truncate block">{rfq.incoterms}</span>
                    </div>
                  </div>

                  {/* Notes / Spec */}
                  {rfq.specNotes && (
                    <p className="text-xs text-slate-300 italic bg-[#121212] p-2.5 rounded-lg border border-white/5">
                      "{rfq.specNotes}"
                    </p>
                  )}

                  {/* Tech-Pack Attachment & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <FileText className="w-4 h-4 text-[#ff5500]" />
                      <span>{rfq.techPackFile ? rfq.techPackFile.name : 'Standard Spec Sheet Attached'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRfqForBid(rfq);
                          setBidPrice(rfq.targetUnitPriceUSD);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-md shadow-[#ff5500]/20 flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Place Factory Bid</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Monthly Production Line Availability Manager (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Factory className="w-5 h-5 text-[#ff5500]" />
              <h3 className="text-base font-extrabold text-white">
                Monthly Line Availability
              </h3>
            </div>
            <span className="text-xs text-[#ff5500] font-bold">
              Live JIT Sync
            </span>
          </div>

          <div className="space-y-3.5">
            {productionLines.map((line) => (
              <div
                key={line.id}
                className="glass-card p-4 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-xs text-white line-clamp-1">{line.lineName}</h5>
                    <span className="text-[11px] text-slate-400">{line.category} • {line.operatorCount} Operators</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      line.status === 'Open'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : line.status === 'Partially Booked'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {line.status}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Booked Capacity:</span>
                    <span className="text-white font-bold">{line.currentBookedPct}%</span>
                  </div>
                  <div className="w-full bg-[#202020] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        line.currentBookedPct >= 90
                          ? 'bg-red-500'
                          : line.currentBookedPct >= 60
                          ? 'bg-[#ff5500]'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${line.currentBookedPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Controls to adjust capacity in real-time */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-400 text-[11px]">
                    Next open slot: <strong className="text-white">{line.nextOpenSlotDate}</strong>
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleUpdateLineBooking(line.id, Math.max(0, line.currentBookedPct - 15))}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white"
                      title="Release Capacity"
                    >
                      -15%
                    </button>
                    <button
                      onClick={() => handleUpdateLineBooking(line.id, Math.min(100, line.currentBookedPct + 15))}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ff5500]"
                      title="Book Line"
                    >
                      +15%
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Place Bid Modal */}
      {selectedRfqForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm">
                Place Factory Bid on {selectedRfqForBid.id}
              </h4>
              <button
                onClick={() => setSelectedRfqForBid(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Buyer: <strong className="text-white">{selectedRfqForBid.companyName}</strong></div>
              <div>Requirement: <strong className="text-white">{selectedRfqForBid.productRequirement}</strong></div>
              <div>Volume: <strong className="text-white">{selectedRfqForBid.targetQuantity.toLocaleString()} pcs</strong></div>
            </div>

            {bidPlacedSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center">
                {bidPlacedSuccess}
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Your FOB Unit Bid Price (USD)
                  </label>
                  <input
                    type="number"
                    step={0.05}
                    required
                    value={bidPrice}
                    onChange={(e) => setBidPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Confirmed Lead Time to Port (Days)
                  </label>
                  <input
                    type="number"
                    required
                    value={bidLeadDays}
                    onChange={(e) => setBidLeadDays(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRfqForBid(null)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25"
                  >
                    Submit Formal Factory Quote
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
