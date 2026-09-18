import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Building2,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  Layers,
  CheckCircle2,
  Ship,
  Plane,
  Compass,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { Supplier } from '../types';

export interface RegionalCluster {
  id: string;
  name: string;
  districtKey: string; // matches District filter in App
  division: string;
  x: number;
  y: number;
  radius: number;
  densityTier: 'ultra' | 'high' | 'medium' | 'emerging';
  color: string;
  pulseColor: string;
  factoryCount: number;
  leedCount: number;
  exportShare: string;
  avgLeadTime: number;
  portTransitHours: number;
  specialties: string[];
  keyZones: string[];
  description: string;
}

export const REGIONAL_CLUSTERS: RegionalCluster[] = [
  {
    id: 'cluster-gazipur',
    name: 'Gazipur Industrial Zone',
    districtKey: 'Gazipur',
    division: 'Dhaka Division',
    x: 435,
    y: 295,
    radius: 38,
    densityTier: 'ultra',
    color: '#e11d48', // rose-600
    pulseColor: 'rgba(225, 29, 72, 0.4)',
    factoryCount: 980,
    leedCount: 78,
    exportShare: '32.4% of National RMG',
    avgLeadTime: 28,
    portTransitHours: 5.5,
    specialties: ['Heavy Denim', 'Woven Tops', 'USGBC LEED Platinum Mills', 'High-Speed Air-Jet Weaving'],
    keyZones: ['Kashimpur', 'Konabari', 'Tongi', 'Kaliakoir', 'Vogra'],
    description:
      "The world's highest concentration of USGBC LEED Platinum certified green denim and woven complexes. Hosts major conglomerates including DBL Group, Envoy Textiles, Ha-Meem, and Square Fashions.",
  },
  {
    id: 'cluster-narayanganj',
    name: 'Narayanganj Knitwear Hub',
    districtKey: 'Narayanganj',
    division: 'Dhaka Division',
    x: 465,
    y: 365,
    radius: 35,
    densityTier: 'ultra',
    color: '#8b5cf6', // violet-500
    pulseColor: 'rgba(139, 92, 246, 0.4)',
    factoryCount: 840,
    leedCount: 46,
    exportShare: '27.8% of Knitwear & Yarn',
    avgLeadTime: 24,
    portTransitHours: 4.8,
    specialties: ['Circular Knitwear', 'Combed Single Jersey', 'Yarn Dyeing', 'Adamjee EPZ Tech Workwear'],
    keyZones: ['Adamjee EPZ', 'Fatullah', 'Kanchpur', 'Shitalakshya Riverside'],
    description:
      "Known historically as the 'Dundee of the East' and modern hub of BKMEA circular knitting mills, yarn spinning, and high-efficiency dyeing plants along the Shitalakshya River.",
  },
  {
    id: 'cluster-savar',
    name: 'Savar & Ashulia Corridor',
    districtKey: 'Savar',
    division: 'Dhaka Division',
    x: 405,
    y: 330,
    radius: 31,
    densityTier: 'high',
    color: '#f59e0b', // amber-500
    pulseColor: 'rgba(245, 158, 11, 0.4)',
    factoryCount: 620,
    leedCount: 38,
    exportShare: '19.6% of Leather & Outerwear',
    avgLeadTime: 32,
    portTransitHours: 6.2,
    specialties: ['LWG Certified Leather', 'Central Tannery Park (CETP)', 'Heavy Outerwear', 'DEPZ Footwear'],
    keyZones: ['Hemayetpur Tannery Estate', 'Dhaka EPZ (DEPZ)', 'Zirabo', 'Baipail'],
    description:
      'Hosts the national Savar Leather Industrial Park with central effluent treatment (CETP), alongside Dhaka EPZ high-tech garment factories and athletic footwear manufacturing.',
  },
  {
    id: 'cluster-chattogram',
    name: 'Chattogram Maritime Export Corridor',
    districtKey: 'Chattogram',
    division: 'Chattogram Division',
    x: 595,
    y: 505,
    radius: 30,
    densityTier: 'high',
    color: '#06b6d4', // cyan-500
    pulseColor: 'rgba(6, 182, 212, 0.4)',
    factoryCount: 410,
    leedCount: 32,
    exportShare: '14.2% (Direct Ocean Berth)',
    avgLeadTime: 22,
    portTransitHours: 0.5,
    specialties: ['Zero Inland Haulage', 'CEPZ & KEPZ High-Tech', 'Performance Footwear', 'Heavy Canvas'],
    keyZones: ['Chittagong EPZ (CEPZ)', 'Karnaphuli EPZ (KEPZ)', 'Halishahar', 'Patenga'],
    description:
      'Direct gateway to Chattogram Sea Port (CGP). Eliminates 250km of highway transit, offering instantaneous container stuffing and fastest transit to Europe and North America.',
  },
  {
    id: 'cluster-dhaka',
    name: 'Dhaka Metro & Tejgaon Tech Hub',
    districtKey: 'Dhaka',
    division: 'Dhaka Division',
    x: 442,
    y: 342,
    radius: 24,
    densityTier: 'medium',
    color: '#3b82f6', // blue-500
    pulseColor: 'rgba(59, 130, 246, 0.4)',
    factoryCount: 255,
    leedCount: 16,
    exportShare: '8.5% of Design & Samples',
    avgLeadTime: 18,
    portTransitHours: 5.0,
    specialties: ['Fast-Turnaround Samples', 'Tech Pack Engineering', 'CAD/CAM Grading', 'Embroidery & Printing'],
    keyZones: ['Tejgaon Industrial Area', 'Mirpur', 'Uttara Sector 1', 'Mohakhali'],
    description:
      'Urban nerve center for corporate sourcing offices, rapid prototyping sampling units, computerized embroidery labs, and air-freight express delivery via Hazrat Shahjalal International Airport.',
  },
  {
    id: 'cluster-mymensingh',
    name: 'Bhaluka & Mymensingh Green Belt',
    districtKey: 'Gazipur', // often grouped with Greater Gazipur / Northern corridor
    division: 'Mymensingh Division',
    x: 435,
    y: 225,
    radius: 22,
    densityTier: 'medium',
    color: '#10b981', // emerald-500
    pulseColor: 'rgba(16, 185, 129, 0.4)',
    factoryCount: 195,
    leedCount: 24,
    exportShare: '6.2% of Composite Textiles',
    avgLeadTime: 30,
    portTransitHours: 6.8,
    specialties: ['Organic Cotton Spinning', 'Mega Composite Mills', 'Zero Liquid Discharge', 'Rooftop Solar Parks'],
    keyZones: ['Bhaluka Industrial Corridor', 'Trishal', 'Seedstore'],
    description:
      'Expansive greenfield eco-parks with integrated spinning-to-garment facilities, huge biological water recycling plants, and solar-powered manufacturing lines.',
  },
  {
    id: 'cluster-jashore-khulna',
    name: 'Jashore & Mongla Port Delta',
    districtKey: 'all',
    division: 'Khulna Division',
    x: 320,
    y: 470,
    radius: 20,
    densityTier: 'emerging',
    color: '#eab308', // yellow-500
    pulseColor: 'rgba(234, 179, 8, 0.4)',
    factoryCount: 160,
    leedCount: 8,
    exportShare: '5.1% of Jute & Marine Food',
    avgLeadTime: 35,
    portTransitHours: 1.2,
    specialties: ['100% Biodegradable Jute Yarn', 'Hessian Cloth', 'Black Tiger Shrimp Export', 'Mongla EPZ'],
    keyZones: ['Noapara Jute Belt', 'Mongla Port EPZ', 'Rupsha'],
    description:
      "World's largest jute spinning clusters (including Akij Jute) combined with sea-freight access via Mongla Port and organic aquaculture processing.",
  },
  {
    id: 'cluster-pabna-rajshahi',
    name: 'Pabna & Rajshahi Bio-Pharma Hub',
    districtKey: 'all',
    division: 'Rajshahi Division',
    x: 305,
    y: 310,
    radius: 18,
    densityTier: 'emerging',
    color: '#ec4899', // pink-500
    pulseColor: 'rgba(236, 72, 153, 0.4)',
    factoryCount: 110,
    leedCount: 6,
    exportShare: '3.8% of US-FDA Pharma & Silk',
    avgLeadTime: 40,
    portTransitHours: 7.5,
    specialties: ['US-FDA Regulated Pharmaceuticals', 'UK-MHRA Cleanrooms', 'Heritage Mulberry Silk', 'Ishwardi EPZ'],
    keyZones: ['Salgaria Pharma Park', 'Ishwardi EPZ', 'Rajshahi Silk Estate'],
    description:
      'Home to Square Pharmaceuticals export division meeting strict US-FDA and UK-MHRA cleanroom standards, alongside traditional Rajshahi silk weaving mills.',
  },
];

interface StrategicPort {
  id: string;
  name: string;
  code: string;
  type: 'sea' | 'air';
  x: number;
  y: number;
  capacity: string;
  traffic: string;
}

const STRATEGIC_PORTS: StrategicPort[] = [
  {
    id: 'port-cgp',
    name: 'Chattogram Sea Port',
    code: 'CGP',
    type: 'sea',
    x: 605,
    y: 535,
    capacity: '3.2M TEUs / Year',
    traffic: '92% of Bangladesh Seaborne Trade',
  },
  {
    id: 'port-mgl',
    name: 'Mongla Port Terminal',
    code: 'MGL',
    type: 'sea',
    x: 335,
    y: 540,
    capacity: '100K TEUs / Year',
    traffic: 'Southern Green Logistics Route',
  },
  {
    id: 'port-dac',
    name: 'Dhaka Cargo Village',
    code: 'DAC',
    type: 'air',
    x: 446,
    y: 335,
    capacity: '350K Metric Tons / Year',
    traffic: 'Express Air Shipments & Samples',
  },
];

interface BangladeshManufacturerMapProps {
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

export const BangladeshManufacturerMap: React.FC<BangladeshManufacturerMapProps> = ({
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

  // Active Cluster State
  const [activeClusterId, setActiveClusterId] = useState<string>('cluster-gazipur');
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [metricFilter, setMetricFilter] = useState<'density' | 'leed' | 'ports'>('density');
  // Zoom Mode: 'country' (Full Bangladesh View) or 'district' (Zoomed into selected cluster)
  const [zoomLevel, setZoomLevel] = useState<'country' | 'district'>('country');

  // Full country default view coordinates
  const FULL_COUNTRY_VIEW = { x: 180, y: 30, width: 520, height: 630 };

  // Currently focused cluster
  const currentCluster = useMemo(() => {
    return (
      REGIONAL_CLUSTERS.find((c) => c.id === activeClusterId) ||
      REGIONAL_CLUSTERS[0]
    );
  }, [activeClusterId]);

  // Target viewport coordinates based on zoom level and selected cluster
  const targetView = useMemo(() => {
    if (zoomLevel === 'country') {
      return FULL_COUNTRY_VIEW;
    }
    // District-level zoom centered on the active cluster (zoom factor ~2.3x)
    const zoomW = 230;
    const zoomH = 280;
    const targetX = Math.max(180, Math.min(700 - zoomW, currentCluster.x - zoomW / 2));
    const targetY = Math.max(30, Math.min(660 - zoomH, currentCluster.y - zoomH / 2));
    return {
      x: targetX,
      y: targetY,
      width: zoomW,
      height: zoomH,
    };
  }, [zoomLevel, currentCluster]);

  // Suppliers matching the current cluster district
  const clusterSuppliers = useMemo(() => {
    const key = currentCluster.districtKey;
    if (key === 'all') return suppliers.slice(0, 4);
    return suppliers.filter((s) => s.district.toLowerCase().includes(key.toLowerCase()));
  }, [suppliers, currentCluster]);

  const handleSelectCluster = (cluster: RegionalCluster, autoZoom = true) => {
    setActiveClusterId(cluster.id);
    if (autoZoom) {
      setZoomLevel('district');
    }
    if (cluster.districtKey !== 'all') {
      onSelectDistrict(cluster.districtKey);
    }
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev === 'country' ? 'district' : 'country'));
  };

  const handleResetToCountryView = () => {
    setZoomLevel('country');
  };

  const handleApplyFilterAndGoToList = () => {
    if (currentCluster.districtKey !== 'all') {
      onSelectDistrict(currentCluster.districtKey);
    }
    onSwitchToListView();
  };

  return (
    <div
      id="bangladesh-manufacturer-map-container"
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isDark ? 'bg-[#0f0f10] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* 1. TOP SUMMARY BAR: National Density Metrics */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'bg-[#141416] border-white/10' : 'bg-slate-50/80 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center border border-[#e11d48]/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black tracking-tight">
                Bangladesh Industrial Corridor & Manufacturer Density Map
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/30">
                LIVE GEOGRAPHY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive geographic cluster breakdown of 4,800+ EPB registered manufacturing plants & export mills
            </p>
          </div>
        </div>

        {/* Metric Layer Switches */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-black/50 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <button
              id="map-metric-density"
              onClick={() => setMetricFilter('density')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                metricFilter === 'density'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Factory Density
            </button>
            <button
              id="map-metric-leed"
              onClick={() => setMetricFilter('leed')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                metricFilter === 'leed'
                  ? 'bg-[#10b981] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              LEED Platinum
            </button>
            <button
              id="map-metric-ports"
              onClick={() => setMetricFilter('ports')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                metricFilter === 'ports'
                  ? 'bg-[#06b6d4] text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ports & EPZ
            </button>
          </div>

          <button
            id="map-switch-to-list-top-btn"
            onClick={onSwitchToListView}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>Return to Cards List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. STATS BANNER: National Industrial Benchmarks */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border-b text-xs ${
          isDark ? 'bg-black/30 border-white/5 text-slate-300' : 'bg-slate-50/50 border-slate-100 text-slate-700'
        }`}
      >
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <Building2 className="w-4 h-4 text-[#e11d48]" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">4,800+ Export Factories</div>
            <div className="text-[10px] text-slate-400">Total Registered Active Mills</div>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <Award className="w-4 h-4 text-emerald-500" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">220+ LEED Green Mills</div>
            <div className="text-[10px] text-slate-400">Global #1 USGBC Concentration</div>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <Ship className="w-4 h-4 text-cyan-500" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">3 Deep Seaports & Riverways</div>
            <div className="text-[10px] text-slate-400">Chattogram, Mongla & Matarbari</div>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <ShieldCheck className="w-4 h-4 text-violet-500" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">92% Bonded Coverage</div>
            <div className="text-[10px] text-slate-400">Duty-Free Raw Material Import</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: Visual Map (Left/Center) + Regional Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* MAP CANVAS (7 Cols on large screen) */}
        <div
          className={`lg:col-span-7 relative p-4 flex flex-col justify-between select-none ${
            isDark
              ? 'bg-radial from-[#18181b] via-[#09090b] to-[#040405]'
              : 'bg-radial from-slate-50 via-slate-100 to-slate-200'
          }`}
        >
          {/* Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 space-y-1 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] text-slate-300">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Concentration Tiers
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] animate-pulse" />
              <span>Ultra Dense (&gt;800 Mills)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
              <span>Knit &amp; Dyeing Hub (500–800)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
              <span>Maritime &amp; EPZ Corridor</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span>Eco Greenfield Belt</span>
            </div>
          </div>

          {/* Interactive Zoom Viewport Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/5">
              <button
                id="map-view-full-country-btn"
                title="Full Country Overview"
                onClick={handleResetToCountryView}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  zoomLevel === 'country'
                    ? 'bg-[#e11d48] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Country</span>
              </button>
              <button
                id="map-view-district-zoom-btn"
                title={`District Zoom: ${currentCluster.name.split(' ')[0]}`}
                onClick={() => setZoomLevel('district')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  zoomLevel === 'district'
                    ? 'bg-[#e11d48] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>District Zoom</span>
              </button>
            </div>

            {/* Current Zoom Mode Indicator Badge */}
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 hidden sm:inline-flex items-center space-x-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  zoomLevel === 'district' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{zoomLevel === 'district' ? `${currentCluster.name.split(' ')[0]} 2.3x` : '1.0x Full'}</span>
            </span>
          </div>

          {/* District Quick Switch Pill Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {REGIONAL_CLUSTERS.map((cl) => {
              const isSelected = activeClusterId === cl.id;
              return (
                <button
                  key={cl.id}
                  onClick={() => handleSelectCluster(cl, true)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-md'
                      : isDark
                      ? 'bg-[#18181c]/90 text-slate-300 border-white/10 hover:bg-white/10'
                      : 'bg-white/90 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cl.color }}
                  />
                  <span>{cl.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({cl.factoryCount})</span>
                </button>
              );
            })}
          </div>

          {/* BANGLADESH VECTOR MAP SVG WITH SMOOTH VIEWPORT TRANSITION ANIMATION */}
          <div className="w-full h-full flex items-center justify-center py-2 overflow-hidden">
            <motion.svg
              viewBox="180 30 520 630"
              className="w-full max-h-[520px] filter drop-shadow-xl"
              animate={{
                viewBox: `${targetView.x} ${targetView.y} ${targetView.width} ${targetView.height}`,
              }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <defs>
                {/* Subtle Map Grid Pattern */}
                <pattern
                  id="map-grid-pattern"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
                    strokeWidth="1"
                  />
                </pattern>

                {/* Radar Ring Animation Filter */}
                <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid */}
              <rect x="180" y="30" width="520" height="630" fill="url(#map-grid-pattern)" />

              {/* Bay of Bengal Sea Backdrop (South) */}
              <path
                d="M 220 540 Q 320 520 440 540 T 680 570 L 680 660 L 220 660 Z"
                fill={isDark ? '#020b14' : '#e0f2fe'}
                opacity={isDark ? 0.6 : 0.8}
              />
              <text
                x="450"
                y="630"
                textAnchor="middle"
                fontSize="16"
                fontFamily="sans-serif"
                fontWeight="900"
                letterSpacing="6"
                fill={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(2,132,199,0.25)'}
              >
                BAY OF BENGAL
              </text>

              {/* AUTHENTIC BANGLADESH GEOGRAPHIC OUTLINE */}
              {/* Generalized accurate polygonal boundary path for Bangladesh */}
              <path
                d={`
                  M 265 60
                  C 285 50, 320 55, 335 85
                  C 350 115, 395 130, 420 125
                  C 455 120, 520 140, 560 160
                  C 600 175, 650 190, 660 230
                  C 670 265, 630 290, 610 320
                  C 590 350, 580 390, 595 430
                  C 610 470, 655 520, 665 570
                  C 675 615, 650 645, 635 635
                  C 610 610, 585 540, 540 515
                  C 505 495, 470 515, 440 535
                  C 405 555, 360 565, 335 545
                  C 310 525, 310 495, 290 460
                  C 270 425, 275 385, 260 345
                  C 245 305, 230 250, 245 200
                  C 255 160, 245 100, 265 60
                  Z
                `}
                fill={isDark ? '#141416' : '#f8fafc'}
                stroke={isDark ? '#27272a' : '#cbd5e1'}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Major River Corridors (Jamuna, Padma, Meghna) */}
              <path
                d="M 360 90 Q 375 220 395 320 Q 425 365 470 410 Q 520 455 530 515"
                fill="none"
                stroke={isDark ? '#0284c7' : '#38bdf8'}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={isDark ? 0.35 : 0.5}
              />
              <path
                d="M 255 260 Q 330 310 395 320"
                fill="none"
                stroke={isDark ? '#0284c7' : '#38bdf8'}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={isDark ? 0.35 : 0.5}
              />
              <path
                d="M 570 210 Q 530 280 470 410"
                fill="none"
                stroke={isDark ? '#0284c7' : '#38bdf8'}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={isDark ? 0.35 : 0.5}
              />

              {/* River Labels */}
              <text x="350" y="210" fill={isDark ? '#0284c7' : '#0369a1'} fontSize="9" opacity="0.6" fontStyle="italic">
                Jamuna River
              </text>
              <text x="490" y="440" fill={isDark ? '#0284c7' : '#0369a1'} fontSize="9" opacity="0.6" fontStyle="italic">
                Meghna Estuary
              </text>

              {/* Strategic Ports & Logistics Nodes */}
              {metricFilter === 'ports' &&
                STRATEGIC_PORTS.map((port) => (
                  <g key={port.id} className="cursor-pointer">
                    <circle
                      cx={port.x}
                      cy={port.y}
                      r="16"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                    <circle cx={port.x} cy={port.y} r="6" fill="#06b6d4" />
                    {port.type === 'sea' ? (
                      <text x={port.x + 10} y={port.y + 4} fontSize="11" fontWeight="bold" fill="#06b6d4">
                        ⚓ {port.code} ({port.name})
                      </text>
                    ) : (
                      <text x={port.x + 10} y={port.y + 4} fontSize="11" fontWeight="bold" fill="#06b6d4">
                        ✈️ {port.code} ({port.name})
                      </text>
                    )}
                  </g>
                ))}

              {/* REGIONAL DENSITY CLUSTERS */}
              {REGIONAL_CLUSTERS.map((cl) => {
                const isSelected = activeClusterId === cl.id;
                const isHovered = hoveredClusterId === cl.id;

                // Adjust radius based on filter
                let renderRadius = cl.radius;
                if (metricFilter === 'leed') {
                  renderRadius = Math.max(16, (cl.leedCount / 78) * 40);
                }

                return (
                  <g
                    key={cl.id}
                    onClick={() => handleSelectCluster(cl)}
                    onMouseEnter={() => setHoveredClusterId(cl.id)}
                    onMouseLeave={() => setHoveredClusterId(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Animated Pulsing Outer Radar Ring */}
                    <circle
                      cx={cl.x}
                      cy={cl.y}
                      r={renderRadius + (isSelected ? 16 : isHovered ? 10 : 6)}
                      fill={cl.pulseColor}
                      opacity={isSelected ? 0.7 : 0.3}
                      className={isSelected ? 'animate-ping' : ''}
                      style={{ animationDuration: isSelected ? '2.5s' : '4s' }}
                    />

                    {/* Secondary Aura Ring */}
                    <circle
                      cx={cl.x}
                      cy={cl.y}
                      r={renderRadius + (isSelected ? 8 : 4)}
                      fill="none"
                      stroke={cl.color}
                      strokeWidth={isSelected ? '2.5' : '1'}
                      opacity={isSelected ? 0.9 : 0.4}
                      strokeDasharray={isSelected ? 'none' : '4 2'}
                    />

                    {/* Core Solid Circle */}
                    <circle
                      cx={cl.x}
                      cy={cl.y}
                      r={renderRadius}
                      fill={cl.color}
                      opacity={isSelected ? 0.95 : 0.82}
                      className="transition-transform duration-200"
                    />

                    {/* Inner Metric Number */}
                    <text
                      x={cl.x}
                      y={cl.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={renderRadius > 26 ? '12' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {metricFilter === 'leed' ? `${cl.leedCount}🌿` : cl.factoryCount}
                    </text>

                    {/* Label Badge */}
                    <g transform={`translate(${cl.x}, ${cl.y - renderRadius - 10})`}>
                      <rect
                        x="-45"
                        y="-14"
                        width="90"
                        height="16"
                        rx="8"
                        fill={isDark ? '#09090b' : '#ffffff'}
                        stroke={isSelected ? cl.color : isDark ? '#3f3f46' : '#cbd5e1'}
                        strokeWidth={isSelected ? '2' : '1'}
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill={isSelected ? cl.color : isDark ? '#ffffff' : '#0f172a'}
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {cl.name.split(' ')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </motion.svg>
          </div>
        </div>

        {/* REGIONAL DOSSIER & MILLS SPOTLIGHT (5 Cols on large screen) */}
        <div
          className={`lg:col-span-5 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l ${
            isDark ? 'bg-[#121214] border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-4">
            {/* Cluster Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: currentCluster.color }}
                >
                  {currentCluster.densityTier.toUpperCase()} DENSITY CLUSTER
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentCluster.division}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1 flex items-center space-x-2">
                <span>{currentCluster.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                  {currentCluster.districtKey}
                </span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentCluster.description}
              </p>
            </div>

            {/* Industrial Metrics Matrix */}
            <div
              className={`grid grid-cols-2 gap-2.5 p-3 rounded-xl border text-xs ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="text-[10px] text-slate-400">Certified Export Factories</div>
                <div className="text-base font-black text-slate-900 dark:text-white font-mono flex items-center space-x-1">
                  <span>{currentCluster.factoryCount}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Mills</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">USGBC LEED Platinum</div>
                <div className="text-base font-black text-emerald-500 font-mono flex items-center space-x-1">
                  <span>{currentCluster.leedCount}</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Green Units</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">National Export Share</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentCluster.exportShare}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Transit to Chattogram Port</div>
                <div className="text-xs font-bold text-cyan-500 font-mono">
                  ~{currentCluster.portTransitHours} Hours
                </div>
              </div>
            </div>

            {/* Core Specialties Tags */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Cluster Manufacturing Specializations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentCluster.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-Zones */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Key Industrial Enclaves & EPZ Hubs
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                {currentCluster.keyZones.map((zone, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/20 font-medium"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{zone}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Certified Factories in this Region */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#e11d48]" />
                  <span>
                    Active Verified Mills in {currentCluster.districtKey} ({clusterSuppliers.length})
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Direct EPB Verified</span>
              </div>

              {clusterSuppliers.length === 0 ? (
                <div
                  className={`p-4 rounded-xl border text-center text-xs ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <p>All mills active in this zone are currently operating at peak capacity.</p>
                  <button
                    onClick={() => onSelectDistrict('all')}
                    className="mt-2 text-xs text-[#e11d48] font-bold underline cursor-pointer"
                  >
                    Show all Bangladesh districts
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {clusterSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isDark
                          ? 'bg-[#18181c] border-white/10 hover:border-[#e11d48]/60'
                          : 'bg-slate-50 border-slate-200 hover:border-[#e11d48]/60 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={supplier.avatarUrl}
                          alt={supplier.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate text-slate-900 dark:text-white flex items-center space-x-1.5">
                            <span>{supplier.name}</span>
                            {supplier.leedStatus && (
                              <span className="text-[10px] font-bold text-emerald-500 flex-shrink-0">
                                LEED {supplier.leedStatus}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {supplier.district} • {supplier.employeeCount} Workers
                          </div>
                          <div className="text-[10px] text-[#e11d48] font-semibold mt-0.5 truncate">
                            {supplier.annualCapacity}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {onOpenComplianceVault && (
                          <button
                            title="Compliance Vault"
                            onClick={() => onOpenComplianceVault(supplier)}
                            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                              isDark
                                ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        )}
                        {onContactSupplier && (
                          <button
                            title="Request Direct Quotation"
                            onClick={() => onContactSupplier(supplier)}
                            className="p-1.5 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer: Filter or Jump to List */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-4">
            <button
              id="map-filter-district-btn"
              onClick={handleApplyFilterAndGoToList}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>View {currentCluster.districtKey} Mills in List</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {selectedDistrict !== 'all' && (
              <button
                title="Reset District Filter"
                onClick={() => onSelectDistrict('all')}
                className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
