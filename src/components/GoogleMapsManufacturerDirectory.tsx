import React, { useState, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Building2,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
  Send,
  Compass,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Anchor,
  Plane,
  Layers,
  CheckCircle2,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { Supplier } from '../types';

export interface IndustrialHubMarker {
  id: string;
  name: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  type: 'mill_cluster' | 'seaport' | 'airport' | 'epz';
  factoryCount?: number;
  leedCount?: number;
  specialty: string;
  color: string;
  description: string;
}

// Key industrial clusters, maritime ports and export hubs in Bangladesh
export const BANGLADESH_INDUSTRIAL_HUBS: IndustrialHubMarker[] = [
  {
    id: 'hub-gazipur',
    name: 'Gazipur Industrial Megacluster',
    district: 'Gazipur',
    division: 'Dhaka Division',
    lat: 23.9999,
    lng: 90.4203,
    type: 'mill_cluster',
    factoryCount: 980,
    leedCount: 78,
    specialty: 'LEED Platinum Heavy Denim & Composite Woven Plants',
    color: '#e11d48',
    description: 'World\'s densest concentration of USGBC LEED Platinum denim complexes, including DBL and Envoy Textiles.',
  },
  {
    id: 'hub-narayanganj',
    name: 'Narayanganj Knitwear & Spinning Corridor',
    district: 'Narayanganj',
    division: 'Dhaka Division',
    lat: 23.6238,
    lng: 90.5000,
    type: 'mill_cluster',
    factoryCount: 840,
    leedCount: 46,
    specialty: 'Circular Knitwear, Yarn Dyeing & Adamjee EPZ',
    color: '#8b5cf6',
    description: 'Historic "Dundee of the East" and leading hub for BKMEA high-speed circular knitting and yarn dyeing.',
  },
  {
    id: 'hub-savar',
    name: 'Savar Leather & DEPZ Corridor',
    district: 'Savar',
    division: 'Dhaka Division',
    lat: 23.8583,
    lng: 90.2667,
    type: 'mill_cluster',
    factoryCount: 620,
    leedCount: 38,
    specialty: 'LWG Certified Leather Tannery Park & DEPZ Outerwear',
    color: '#f59e0b',
    description: 'Hosts the Central Effluent Treatment Tannery Park alongside Dhaka EPZ precision sportswear factories.',
  },
  {
    id: 'hub-chattogram',
    name: 'Chattogram Maritime Export Corridor (CEPZ / KEPZ)',
    district: 'Chattogram',
    division: 'Chattogram Division',
    lat: 22.3569,
    lng: 91.7832,
    type: 'mill_cluster',
    factoryCount: 410,
    leedCount: 32,
    specialty: 'Direct Port Logistics, CEPZ & Athletic Footwear',
    color: '#06b6d4',
    description: 'Zero inland haulage gateway with direct ocean container stuffing right at Chittagong Port berths.',
  },
  {
    id: 'hub-bhaluka',
    name: 'Bhaluka & Mymensingh Eco-Textile Belt',
    district: 'Mymensingh',
    division: 'Mymensingh Division',
    lat: 24.3754,
    lng: 90.3773,
    type: 'mill_cluster',
    factoryCount: 195,
    leedCount: 24,
    specialty: 'Bluesign Partners, Mega Organic Spinning & Solar Parks',
    color: '#10b981',
    description: 'Home to Square Fashions and Envoy Textiles greenfield mega-mills powered by rooftop solar and biological ETPs.',
  },
  {
    id: 'hub-jashore',
    name: 'Jashore & Noapara Golden Jute Hub',
    district: 'Jashore',
    division: 'Khulna Division',
    lat: 23.1664,
    lng: 89.2138,
    type: 'mill_cluster',
    factoryCount: 160,
    leedCount: 8,
    specialty: '100% Biodegradable Jute Yarn & Export Hessian',
    color: '#eab308',
    description: 'Hosts Akij Jute Mills, the world\'s single largest jute spinning mill, and access to Mongla Port.',
  },
  {
    id: 'hub-port-cgp',
    name: 'Chattogram Sea Port (CGP)',
    district: 'Chattogram',
    division: 'Chattogram Division',
    lat: 22.2986,
    lng: 91.8153,
    type: 'seaport',
    specialty: 'Primary Container Terminal Handling 92% of BD Seaborne Trade',
    color: '#0284c7',
    description: 'Main deepwater gateway connecting Bangladesh directly to Colombo, Singapore, Rotterdam, and New York.',
  },
  {
    id: 'hub-port-mgl',
    name: 'Mongla Port Terminal (MGL)',
    district: 'Bagerhat / Khulna',
    division: 'Khulna Division',
    lat: 22.4855,
    lng: 89.6015,
    type: 'seaport',
    specialty: 'Southern Seaport for Eco Jute, Agro & Direct Sea Freight',
    color: '#0d9488',
    description: 'Eco-friendly alternative maritime export port serving southern industrial corridors with zero congestion.',
  },
  {
    id: 'hub-airport-dac',
    name: 'Hazrat Shahjalal Int\'l Airport (DAC Cargo)',
    district: 'Dhaka',
    division: 'Dhaka Division',
    lat: 23.8433,
    lng: 90.3978,
    type: 'airport',
    specialty: 'Express Air Cargo & Rapid Sample Dispatch Hub',
    color: '#ec4899',
    description: 'Central air freight hub with direct courier connections for sample deliveries to Europe & North America in 3-5 days.',
  },
];

// Fallback supplier coordinates matching districts
export const DEFAULT_SUPPLIER_COORDINATES: Record<string, { lat: number; lng: number; zone: string }> = {
  'sup-plummy': { lat: 23.6358, lng: 90.5211, zone: 'Fatullah, Narayanganj' },
  'sup-envoy': { lat: 24.3821, lng: 90.3845, zone: 'Bhaluka, Mymensingh' },
  'sup-janata': { lat: 23.9511, lng: 90.6288, zone: 'Palash, Narsingdi' },
  'sup-apex': { lat: 24.0112, lng: 90.4189, zone: 'Kashimpur, Gazipur' },
  'sup-savar-leather': { lat: 23.7844, lng: 90.2789, zone: 'Hemayetpur Tannery Park, Savar' },
  'sup-ananta-technical': { lat: 23.6512, lng: 90.5188, zone: 'Adamjee EPZ, Narayanganj' },
  'sup-dbl': { lat: 24.0245, lng: 90.3951, zone: 'Kashimpur Industrial Belt, Gazipur' },
  'sup-square-fashions': { lat: 24.3599, lng: 90.3688, zone: 'Bhaluka Greenfield Complex' },
  'sup-akij-jute': { lat: 23.0189, lng: 89.3988, zone: 'Noapara Jute Belt, Jashore' },
  'sup-square-pharma': { lat: 24.0089, lng: 89.2455, zone: 'Salgaria Cleanroom Park, Pabna' },
  'sup-bay-footwear': { lat: 22.2899, lng: 91.7955, zone: 'Karnaphuli EPZ, Chattogram' },
};

interface GoogleMapsManufacturerDirectoryProps {
  suppliers: Supplier[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onSwitchToListView: () => void;
  onContactSupplier?: (supplier: Supplier) => void;
  onOpenComplianceVault?: (supplier: Supplier) => void;
  onReserveLineSlot?: (supplier: Supplier) => void;
  onOpenAiAssistant?: (supplier: Supplier) => void;
  theme?: 'dark' | 'light';
}

export const GoogleMapsManufacturerDirectory: React.FC<GoogleMapsManufacturerDirectoryProps> = ({
  suppliers,
  selectedDistrict,
  onSelectDistrict,
  onSwitchToListView,
  onContactSupplier,
  onOpenComplianceVault,
  onReserveLineSlot,
  onOpenAiAssistant,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Retrieve API key from environment variable
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [mapMode, setMapMode] = useState<'google' | 'vector'>(apiKey ? 'google' : 'vector');

  // Selected marker state for InfoWindow
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedHub, setSelectedHub] = useState<IndustrialHubMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mills' | 'ports' | 'leed'>('all');

  // Center of Bangladesh
  const BANGLADESH_CENTER = { lat: 23.8103, lng: 90.4125 };

  // Map suppliers with enriched coordinates
  const mappedSuppliers = useMemo(() => {
    return suppliers.map((s) => {
      const coords = DEFAULT_SUPPLIER_COORDINATES[s.id] || {
        lat: 23.8103 + (Math.random() - 0.5) * 0.4,
        lng: 90.4125 + (Math.random() - 0.5) * 0.4,
        zone: s.district,
      };
      return {
        ...s,
        lat: s.lat ?? coords.lat,
        lng: s.lng ?? coords.lng,
        industrialZone: coords.zone,
      };
    });
  }, [suppliers]);

  // Filtered suppliers based on selected district and filter pill
  const filteredSuppliers = useMemo(() => {
    return mappedSuppliers.filter((s) => {
      if (selectedDistrict !== 'all') {
        const matchesDistrict = s.district.toLowerCase().includes(selectedDistrict.toLowerCase());
        if (!matchesDistrict) return false;
      }
      if (activeFilter === 'leed') {
        return s.leedStatus === 'Platinum' || s.leedStatus === 'Gold';
      }
      return true;
    });
  }, [mappedSuppliers, selectedDistrict, activeFilter]);

  // Filtered ports and hubs
  const displayedHubs = useMemo(() => {
    if (activeFilter === 'mills') {
      return BANGLADESH_INDUSTRIAL_HUBS.filter((h) => h.type === 'mill_cluster');
    }
    if (activeFilter === 'ports') {
      return BANGLADESH_INDUSTRIAL_HUBS.filter((h) => h.type === 'seaport' || h.type === 'airport');
    }
    return BANGLADESH_INDUSTRIAL_HUBS;
  }, [activeFilter]);

  return (
    <div
      id="google-maps-manufacturer-directory"
      className={`rounded-2xl border transition-all overflow-hidden ${
        isDark ? 'bg-[#0f0f10] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* 1. TOP HEADER & CONTROLS */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'bg-[#141416] border-white/10' : 'bg-slate-50/80 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center border border-[#e11d48]/20 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black tracking-tight">
                Live Google Maps™ Bangladesh Sourcing Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                ACTIVE SATELLITE &amp; VECTOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pinpoint certified export mills, bonded EPZ zones, Chattogram container berths, and DAC air cargo hubs
            </p>
          </div>
        </div>

        {/* Quick Filter Buttons & Return to List */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-black/50 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hubs ({filteredSuppliers.length + displayedHubs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('mills')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'mills'
                  ? 'bg-[#8b5cf6] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Export Mills ({filteredSuppliers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('leed')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'leed'
                  ? 'bg-[#10b981] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              LEED Platinum/Gold
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ports')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'ports'
                  ? 'bg-[#06b6d4] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ports &amp; Air Cargo
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMapMode(mapMode === 'google' ? 'vector' : 'google')}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer ${
              mapMode === 'vector'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>{mapMode === 'google' ? 'Vector Corridor' : 'Live Satellite Map'}</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToListView}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>Switch to Cards List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAP CONTAINER */}
      <div className="relative w-full h-[540px]">
        {mapMode === 'google' && apiKey ? (
        <APIProvider apiKey={apiKey}>
          <Map
            mapId={(import.meta as any).env?.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
            style={{ width: '100%', height: '100%' }}
            defaultCenter={BANGLADESH_CENTER}
            defaultZoom={7.8}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            colorScheme={isDark ? 'DARK' : 'LIGHT'}
          >
            {/* A. Industrial Hub & Port Markers */}
            {displayedHubs.map((hub) => (
              <AdvancedMarker
                key={hub.id}
                position={{ lat: hub.lat, lng: hub.lng }}
                title={hub.name}
                onClick={() => {
                  setSelectedHub(hub);
                  setSelectedSupplier(null);
                }}
              >
                <div
                  className="flex items-center justify-center p-2 rounded-2xl shadow-xl transition-transform transform hover:scale-110 cursor-pointer border-2 border-white/80"
                  style={{ backgroundColor: hub.color }}
                >
                  {hub.type === 'seaport' ? (
                    <Anchor className="w-4 h-4 text-white" />
                  ) : hub.type === 'airport' ? (
                    <Plane className="w-4 h-4 text-white" />
                  ) : (
                    <Building2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </AdvancedMarker>
            ))}

            {/* B. Specific Factory/Supplier Markers */}
            {filteredSuppliers.map((s) => (
              <AdvancedMarker
                key={s.id}
                position={{ lat: s.lat || BANGLADESH_CENTER.lat, lng: s.lng || BANGLADESH_CENTER.lng }}
                title={`${s.name} (${s.district})`}
                onClick={() => {
                  setSelectedSupplier(s);
                  setSelectedHub(null);
                }}
              >
                <div className="relative group cursor-pointer">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/85 text-white border border-[#e11d48]/60 shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse" />
                    <span className="text-[10px] font-black tracking-tight truncate max-w-[110px]">
                      {s.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {/* C. InfoWindow for Selected Supplier */}
            {selectedSupplier && selectedSupplier.lat && selectedSupplier.lng && (
              <InfoWindow
                position={{ lat: selectedSupplier.lat, lng: selectedSupplier.lng }}
                onCloseClick={() => setSelectedSupplier(null)}
              >
                <div className="p-2 max-w-[280px] text-slate-900">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs">
                      {selectedSupplier.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs leading-snug">{selectedSupplier.name}</h4>
                      <p className="text-[10px] text-slate-500">{selectedSupplier.industrialZone || selectedSupplier.district}</p>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">LEED Status:</span>
                      <span className="font-bold text-emerald-700">{selectedSupplier.leedStatus || 'Verified Eco'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Capacity:</span>
                      <span className="font-bold text-slate-700">{selectedSupplier.annualCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Response Rate:</span>
                      <span className="font-bold text-emerald-600">{selectedSupplier.responseRatePercent}%</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center space-x-1.5">
                    {onReserveLineSlot && (
                      <button
                        type="button"
                        onClick={() => {
                          onReserveLineSlot(selectedSupplier);
                          setSelectedSupplier(null);
                        }}
                        className="flex-1 py-1 px-2 rounded-md bg-[#e11d48] text-white font-bold text-[10px] hover:bg-[#ff1e42] transition-colors cursor-pointer text-center"
                      >
                        RFQ / Reserve
                      </button>
                    )}
                    {onOpenComplianceVault && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenComplianceVault(selectedSupplier);
                          setSelectedSupplier(null);
                        }}
                        className="py-1 px-2 rounded-md bg-slate-200 text-slate-800 font-bold text-[10px] hover:bg-slate-300 transition-colors cursor-pointer"
                      >
                        Audit Vault
                      </button>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* D. InfoWindow for Selected Industrial Hub */}
            {selectedHub && (
              <InfoWindow
                position={{ lat: selectedHub.lat, lng: selectedHub.lng }}
                onCloseClick={() => setSelectedHub(null)}
              >
                <div className="p-2 max-w-[280px] text-slate-900">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: selectedHub.color }}
                    >
                      {selectedHub.type === 'seaport' ? 'CGP' : selectedHub.type === 'airport' ? 'DAC' : 'EPZ'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs leading-snug">{selectedHub.name}</h4>
                      <p className="text-[10px] text-slate-500">{selectedHub.division}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {selectedHub.description}
                  </p>

                  <div className="mt-2 text-[10px] space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Core Specialty:</span>
                      <span className="font-bold text-slate-800">{selectedHub.specialty}</span>
                    </div>
                    {selectedHub.factoryCount && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Registered Mills:</span>
                        <span className="font-bold text-[#e11d48]">{selectedHub.factoryCount}+ Plants</span>
                      </div>
                    )}
                  </div>

                  {selectedHub.district && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDistrict(selectedHub.district);
                          setSelectedHub(null);
                        }}
                        className="w-full py-1 px-2 rounded-md bg-[#0284c7] text-white font-bold text-[10px] hover:bg-[#0369a1] transition-colors cursor-pointer text-center"
                      >
                        Filter {selectedHub.district} Mills ({selectedHub.factoryCount || 'All'})
                      </button>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
        ) : (
          /* STYLED SVG VECTOR CORRIDOR MAP FOR DHAKA-CHATTOGRAM TRANSIT */
          <div className="w-full h-full bg-[#080b11] relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 select-none">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Corridor Header */}
            <div className="relative z-10 w-full flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Dhaka–Chattogram High-Speed Industrial Export Corridor
                </span>
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                N-1 Express • 248 km • CGP Berth 1–14
              </div>
            </div>

            {/* Vector SVG Canvas */}
            <div className="relative z-10 w-full flex-1 flex items-center justify-center my-2 max-h-[360px]">
              <svg viewBox="0 0 800 320" className="w-full h-full">
                {/* Highway Contour */}
                <path
                  d="M 100 80 Q 220 100 320 140 T 520 200 T 700 260"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 100 80 Q 220 100 320 140 T 520 200 T 700 260"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />

                {/* Waypoint 1: Gazipur / Savar Denim Hub */}
                <g
                  transform="translate(100, 80)"
                  className="cursor-pointer"
                  onClick={() => setSelectedHub(BANGLADESH_INDUSTRIAL_HUBS[0])}
                >
                  <circle r="22" fill="#e11d48" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <circle r="12" fill="#e11d48" />
                  <circle r="4" fill="#ffffff" />
                  <text x="0" y="-22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    GAZIPUR &amp; SAVAR
                  </text>
                  <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    980+ LEED Platinum Mills
                  </text>
                </g>

                {/* Waypoint 2: Narayanganj & DAC Airport */}
                <g
                  transform="translate(250, 115)"
                  className="cursor-pointer"
                  onClick={() => setSelectedHub(BANGLADESH_INDUSTRIAL_HUBS[1])}
                >
                  <circle r="16" fill="#8b5cf6" fillOpacity="0.25" />
                  <circle r="9" fill="#8b5cf6" />
                  <circle r="3" fill="#ffffff" />
                  <text x="0" y="-18" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    NARAYANGANJ / DAC
                  </text>
                  <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="monospace">
                    BKMEA Circular Knit Hub
                  </text>
                </g>

                {/* Waypoint 3: Comilla EPZ */}
                <g transform="translate(420, 165)" className="cursor-pointer">
                  <circle r="14" fill="#3b82f6" fillOpacity="0.2" />
                  <circle r="8" fill="#3b82f6" />
                  <text x="0" y="-16" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    COMILLA EPZ
                  </text>
                  <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                    Bonded Customs Gate
                  </text>
                </g>

                {/* Waypoint 4: Feni Transit */}
                <g transform="translate(540, 205)" className="cursor-pointer">
                  <circle r="12" fill="#10b981" fillOpacity="0.2" />
                  <circle r="7" fill="#10b981" />
                  <text x="0" y="-14" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    FENI OVERPASS
                  </text>
                  <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="monospace">
                    Dedicated Fast Lane
                  </text>
                </g>

                {/* Waypoint 5: Chattogram Seaport (CGP) */}
                <g
                  transform="translate(700, 260)"
                  className="cursor-pointer"
                  onClick={() => setSelectedHub(BANGLADESH_INDUSTRIAL_HUBS[3] || BANGLADESH_INDUSTRIAL_HUBS[0])}
                >
                  <circle r="26" fill="#06b6d4" fillOpacity="0.25" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                  <circle r="15" fill="#06b6d4" />
                  <circle r="5" fill="#ffffff" />
                  <text x="0" y="-24" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="black" fontFamily="monospace">
                    CHATTOGRAM SEAPORT (CGP)
                  </text>
                  <text x="0" y="30" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Berth 1-14 • Bay Terminal Active
                  </text>
                </g>
              </svg>
            </div>

            {/* Corridor Footnote Stats */}
            <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-slate-400">Total Corridor Length</div>
                <div className="text-white font-bold">248 km Dedicated Highway</div>
              </div>
              <div className="p-2 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-slate-400">Transit Duration</div>
                <div className="text-emerald-400 font-bold">4 – 6 Hours Factory-to-Berth</div>
              </div>
              <div className="p-2 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-slate-400">Active Container Capacity</div>
                <div className="text-cyan-400 font-bold">3.2M TEUs / Annum</div>
              </div>
              <div className="p-2 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-slate-400">Customs Clearance SLA</div>
                <div className="text-rose-400 font-bold">24h Direct Wharfside</div>
              </div>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center space-x-3 bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] text-white">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] animate-pulse" />
            <span>Industrial Denim &amp; RMG</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
            <span>Knit &amp; Spinning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
            <span>Chattogram Port</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span>LEED Greenfield Belt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
