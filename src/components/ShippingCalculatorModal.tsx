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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="shipping-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Bangladesh Ocean Freight & Transit Matrix</h3>
              <p className="text-xs text-neutral-400">
                Direct container line routes from Chattogram & Mongla Ports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Port Origin & Destination Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Port of Departure (Bangladesh)
              </label>
              <div className="relative">
                <select
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Chattogram Port (CGP)">Chattogram Seaport (CGP - 92% of Exports)</option>
                  <option value="Mongla Port (MGL)">Mongla Seaport (MGL - Eco Jute & Agro)</option>
                  <option value="Dhaka Air Cargo (DAC)">Hazrat Shahjalal Air Cargo (DAC - Urgent Garments)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Destination Discharge Port
              </label>
              <select
                value={selectedDestinationIndex}
                onChange={(e) => setSelectedDestinationIndex(Number(e.target.value))}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:border-emerald-600"
              >
                {SHIPPING_DESTINATIONS.map((d, idx) => (
                  <option key={idx} value={idx}>
                    {d.port} ({d.transitDays})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shipment Mode Toggle */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Shipment Container Specification
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setContainerType('20ft')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  containerType === '20ft'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="text-xs font-bold">20’ Standard FCL</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">33 CBM / 21,500 kg</div>
              </button>

              <button
                type="button"
                onClick={() => setContainerType('40ft')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  containerType === '40ft'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="text-xs font-bold">40’ High Cube FCL</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">76 CBM / 26,000 kg</div>
              </button>

              <button
                type="button"
                onClick={() => setContainerType('lcl')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  containerType === 'lcl'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="text-xs font-bold">LCL Consolidation</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Per CBM Sharing</div>
              </button>
            </div>
          </div>

          {containerType === 'lcl' && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">Estimated Cargo Volume (CBM):</span>
                <span className="font-bold text-neutral-900">{lclVolumeCBM} CBM</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={lclVolumeCBM}
                onChange={(e) => setLclVolumeCBM(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          )}

          {/* Results Summary Box */}
          <div className="p-4 bg-gradient-to-br from-emerald-900 to-neutral-900 text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
              <span className="text-xs font-semibold text-emerald-300">Route Overview:</span>
              <span className="text-xs text-neutral-300 font-mono">
                {originPort.split('(')[0].trim()} → {dest.port}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-neutral-400 block">Typical Ocean Transit</span>
                <span className="text-lg font-bold text-emerald-300 flex items-center space-x-1 mt-0.5 font-mono">
                  <Clock className="w-4 h-4" />
                  <span>{dest.transitDays}</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block">Indicative Sea Freight</span>
                <span className="text-lg font-bold text-white mt-0.5 font-mono">
                  {currency.symbol}{costConverted} <span className="text-xs text-neutral-400 font-normal">est.</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 pt-1">
              * Indicative index rates based on standard carrier spot contracts (Maersk, MSC, Hapag-Lloyd). Port handling, THC, and customs clearance quoted upon formal booking.
            </p>
          </div>

          {/* Full Benchmark Ports Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
            <div className="px-3.5 py-2 bg-neutral-100 font-bold text-neutral-800 border-b border-neutral-200">
              Direct Bangladesh Seaport Schedules to Key Global Hubs
            </div>
            <div className="divide-y divide-neutral-200">
              {SHIPPING_DESTINATIONS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDestinationIndex(idx)}
                  className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedDestinationIndex === idx
                      ? 'bg-emerald-50 text-emerald-950 font-bold'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Anchor className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{item.port}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-neutral-500 font-mono">{item.transitDays}</span>
                    <span className="font-mono text-neutral-900 font-semibold">
                      {currency.symbol}{(item.teusCostUSD * currency.rate).toFixed(0)} / 40'
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-100 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
