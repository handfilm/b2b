import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  Award,
  ExternalLink,
  MapPin,
  Clock,
  Truck,
  Ship,
  Plane,
  Anchor,
  Calendar,
  CheckCircle2,
  Layers,
  Sparkles,
  ChevronRight,
  FileText,
  Compass,
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Supplier } from '../types';
import { DEFAULT_SUPPLIER_COORDINATES } from './GoogleMapsManufacturerDirectory';

interface FactoryProfileDrawerProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onContactSupplier?: (supplier: Supplier) => void;
  onOpenComplianceVault?: (supplier: Supplier) => void;
  onReserveLineSlot?: (supplier: Supplier) => void;
  theme?: 'dark' | 'light';
}

export const FactoryProfileDrawer: React.FC<FactoryProfileDrawerProps> = ({
  supplier,
  isOpen,
  onClose,
  onContactSupplier,
  onOpenComplianceVault,
  onReserveLineSlot,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'overview' | 'lines'>('logistics');

  if (!isOpen || !supplier) return null;

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Factory coordinates
  const coords = DEFAULT_SUPPLIER_COORDINATES[supplier.id] || {
    lat: supplier.lat ?? 23.8103,
    lng: supplier.lng ?? 90.4125,
    zone: supplier.district,
  };

  // Distance and transit calculation to Chattogram Sea Port (CGP: 22.2986, 91.8153)
  const isChattogramBased =
    supplier.district.toLowerCase().includes('chattogram') ||
    supplier.district.toLowerCase().includes('chittagong');

  const distanceToPortKm = isChattogramBased
    ? 14
    : supplier.district.toLowerCase().includes('savar')
    ? 265
    : supplier.district.toLowerCase().includes('gazipur')
    ? 278
    : supplier.district.toLowerCase().includes('narayanganj')
    ? 242
    : 285;

  const transitHours = isChattogramBased ? '1.5 Hours' : '6.5 - 8.0 Hours';
  const icdHub = isChattogramBased
    ? 'Direct Port Gate (CEPZ/KEPZ Private Terminal)'
    : 'Kamalapur ICD / Tongi Inland Container Depot';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <aside
        role="dialog"
        aria-label={`${supplier.name} Factory Profile & Logistics`}
        className="relative z-10 w-full sm:w-[580px] md:w-[640px] bg-[#0a0a0a] text-white border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0f0f0f]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight text-white truncate max-w-[280px]">
                  {supplier.name}
                </h2>
                {supplier.leedStatus && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#ff1e42]">
                    LEED {supplier.leedStatus}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {coords.zone} • Established {supplier.establishedYear || 1998}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-white/10 bg-[#121212] px-4">
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-[#10b981] text-[#10b981]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Logistics &amp; Freight</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#e11d48] text-[#e11d48]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audits &amp; Compliance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lines')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'lines'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Line Slots &amp; Capacity</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {activeTab === 'logistics' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Google Maps Integration (Dark Mode) */}
              <div className="rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl h-[260px] bg-black">
                <APIProvider apiKey={apiKey}>
                  <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={{ lat: coords.lat, lng: coords.lng }}
                    defaultZoom={9}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    colorScheme="DARK"
                  >
                    {/* Mill Marker */}
                    <AdvancedMarker position={{ lat: coords.lat, lng: coords.lng }} title={supplier.name}>
                      <div className="p-2 rounded-xl bg-[#e11d48] text-white shadow-lg border border-white/50 flex items-center space-x-1.5 animate-bounce">
                        <Building2 className="w-4 h-4" />
                        <span className="text-[10px] font-black">{supplier.name.split(' ')[0]}</span>
                      </div>
                    </AdvancedMarker>

                    {/* Chattogram Sea Port (CGP) Marker */}
                    <AdvancedMarker position={{ lat: 22.2986, lng: 91.8153 }} title="Chattogram Sea Port (CGP)">
                      <div className="p-2 rounded-xl bg-[#0284c7] text-white shadow-lg border border-white/50 flex items-center space-x-1">
                        <Anchor className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono font-bold">PORT (CGP)</span>
                      </div>
                    </AdvancedMarker>
                  </Map>
                </APIProvider>

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                  <span className="text-white font-bold">EPB Bonded Freight Corridor</span>
                </div>
              </div>

              {/* Calculated Logistics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                    <Anchor className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>Chattogram Port</span>
                  </div>
                  <div className="text-lg font-black text-white">{distanceToPortKm} km</div>
                  <div className="text-[10px] text-slate-400">Direct Highway Route</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Avg. Transit Time</span>
                  </div>
                  <div className="text-lg font-black text-[#10b981]">{transitHours}</div>
                  <div className="text-[10px] text-slate-400">Bonded Prime Mover</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                    <Ship className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ocean Feeder Hub</span>
                  </div>
                  <div className="text-lg font-black text-white">3-4 Days</div>
                  <div className="text-[10px] text-slate-400">Colombo / Singapore</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121212] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                    <Plane className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Air Cargo (DAC)</span>
                  </div>
                  <div className="text-lg font-black text-[#ff1e42]">45 Mins</div>
                  <div className="text-[10px] text-slate-400">Express Sample Dispatch</div>
                </div>
              </div>

              {/* Detailed Freight Route & Customs Specs */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#10b981]" />
                  <span>Customs Clearance &amp; Inland Logistics Protocol</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-300 divide-y divide-white/5">
                  <div className="pt-1 flex justify-between">
                    <span className="text-slate-400">Inland Container Depot (ICD):</span>
                    <span className="font-medium text-white">{icdHub}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-400">Customs Clearance SLA:</span>
                    <span className="font-bold text-[#10b981]">24-48 Hours (Direct EDI Green Channel)</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-400">Bonded Warehouse License:</span>
                    <span className="font-mono text-slate-200">{supplier.bondedWarehouse ? 'Active (EPB Special Pass)' : 'Standard Export'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-400">Supported Incoterms:</span>
                    <span className="font-bold text-white">FOB Chattogram, CIF Rotterdam/Hamburg, CFR NY</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#121212] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  International Audit Certifications
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {supplier.certifications?.map((cert, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span className="font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onOpenComplianceVault && (
                <button
                  type="button"
                  onClick={() => onOpenComplianceVault(supplier)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-[#e11d48]" />
                  <span>Inspect Audit Vault &amp; PDF Certificates</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'lines' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#121212] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Production Line Allocations
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Active Lines:</span>
                    <span className="font-bold text-white">{supplier.activeLines || 24} High-Speed Lines</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Available Capacity:</span>
                    <span className="font-bold text-[#10b981]">{supplier.lineAvailabilityPercentage || 26}% Open</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#10b981] to-[#e11d48]"
                      style={{ width: `${100 - (supplier.lineAvailabilityPercentage || 26)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0e0e0e] flex items-center space-x-3 shrink-0">
          {onReserveLineSlot && (
            <button
              type="button"
              onClick={() => {
                onReserveLineSlot(supplier);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black tracking-wide shadow-lg shadow-[#e11d48]/25 transition-all cursor-pointer text-center"
            >
              Reserve Production Line Slot
            </button>
          )}

          {onContactSupplier && (
            <button
              type="button"
              onClick={() => {
                onContactSupplier(supplier);
                onClose();
              }}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Direct RFQ
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
