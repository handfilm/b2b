import React, { useState } from 'react';
import {
  X,
  Ship,
  Anchor,
  Clock,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SHIPPING_DESTINATIONS } from '../data/mockData';
import { CurrencyConfig } from '../types';

interface ShippingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
  defaultPort?: string;
}

export const ShippingCalculatorModal: React.FC<ShippingCalculatorModalProps> = ({
  isOpen,
  onClose,
  currency,
  defaultPort,
}) => {
  if (!isOpen) return null;

  const [originPort, setOriginPort] = useState('Chattogram Port (CGP)');
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);
  const [containerType, setContainerType] = useState<'20ft' | '40ft' | 'lcl'>('40ft');
  const [lclVolumeCBM, setLclVolumeCBM] = useState(8);

  const dest = SHIPPING_DESTINATIONS[selectedDestinationIndex] || SHIPPING_DESTINATIONS[0];

  // Benchmark container multiplier
  const multiplier = containerType === '20ft' ? 0.65 : containerType === '40ft' ? 1.0 : 0.08 * lclVolumeCBM;
  const estimatedCostUSD = Math.round(dest.teusCostUSD * multiplier);
  const costConverted = (estimatedCostUSD * currency.rate).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="shipping-modal-container"
        className="relative w-full max-w-2xl bg-[#0e0e0e] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Bangladesh Ocean Freight & Transit Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Direct container line routes from Chattogram (CGP) & Mongla (MGL) Ports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Port Origin & Destination Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Port of Departure (Bangladesh)
              </label>
              <select
                value={originPort}
                onChange={(e) => setOriginPort(e.target.value)}
                className="w-full bg-[#171717] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5500] cursor-pointer"
              >
                <option value="Chattogram Port (CGP)">Chattogram Seaport (CGP - 92% of Exports)</option>
                <option value="Mongla Port (MGL)">Mongla Seaport (MGL - Eco Jute & Agro)</option>
                <option value="Dhaka Air Cargo (DAC)">Hazrat Shahjalal Air Cargo (DAC - Garments)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Destination Discharge Port
              </label>
              <select
                value={selectedDestinationIndex}
                onChange={(e) => setSelectedDestinationIndex(Number(e.target.value))}
                className="w-full bg-[#171717] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5500] cursor-pointer"
              >
                {SHIPPING_DESTINATIONS.map((d, idx) => (
                  <option key={d.port} value={idx}>
                    {d.port} ({d.transitDays})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Container Size Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Shipment Load Configuration
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setContainerType('20ft')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  containerType === '20ft'
                    ? 'border-[#ff5500] bg-[#ff5500]/10 text-white font-bold'
                    : 'border-white/10 bg-[#141414] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">20ft Standard FCL</div>
                <div className="text-[10px] text-slate-500 mt-0.5">~33 CBM / 28,000 kg</div>
              </button>

              <button
                type="button"
                onClick={() => setContainerType('40ft')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  containerType === '40ft'
                    ? 'border-[#ff5500] bg-[#ff5500]/10 text-white font-bold'
                    : 'border-white/10 bg-[#141414] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">40ft High Cube (HC)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">~76 CBM / Best Value</div>
              </button>

              <button
                type="button"
                onClick={() => setContainerType('lcl')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  containerType === 'lcl'
                    ? 'border-[#ff5500] bg-[#ff5500]/10 text-white font-bold'
                    : 'border-white/10 bg-[#141414] text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">LCL Shared Pallet</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Consolidated Cargo</div>
              </button>
            </div>
          </div>

          {containerType === 'lcl' && (
            <div className="p-3.5 bg-[#171717] rounded-xl border border-white/10">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                LCL Volume in Cubic Meters (CBM): {lclVolumeCBM} CBM
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={lclVolumeCBM}
                onChange={(e) => setLclVolumeCBM(Number(e.target.value))}
                className="w-full accent-[#ff5500]"
              />
            </div>
          )}

          {/* Freight Estimation Output Card */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs text-slate-400">Route Corridor:</span>
              <span className="text-xs font-bold text-white">
                {originPort.split(' ')[0]} → {dest.port}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ocean Transit Time</span>
                <span className="text-sm font-black text-white flex items-center space-x-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>{dest.transitDays} Days</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Freight Range</span>
                <span className="text-lg font-black text-[#ff5500]">
                  {currency.symbol}{costConverted}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px] font-sans text-slate-400">
              Direct feeder vessel connects Chattogram to Singapore/Colombo transshipment hubs weekly.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end bg-[#141414]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 cursor-pointer"
          >
            Apply Rate to Calculation
          </button>
        </div>
      </div>
    </div>
  );
};
