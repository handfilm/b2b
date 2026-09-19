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
