import React, { useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  MessageSquareQuote,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Building2,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { B2BProduct } from '../../types';

interface TechPackActivity {
  id: string;
  garmentSpec: string;
  division: string;
  factoryName: string;
  factoryCert: string;
  targetQty: number;
  unit: string;
  status: string;
  statusType: 'success' | 'progress' | 'pending' | 'review';
  targetDate: string;
  targetFobUSD: number;
}

const SAMPLE_TECHPACK_ACTIVITIES: TechPackActivity[] = [
  {
    id: 'TP-BD-8921',
    garmentSpec: '240 GSM Combed Ring-Spun Cotton Crewneck',
    division: 'RMG Apparel & Knits',
    factoryName: 'Plummy Fashions Ltd.',
    factoryCert: 'LEED Platinum #1',
    targetQty: 5000,
    unit: 'pcs',
    status: 'Pre-Production Sample Approved',
    statusType: 'success',
    targetDate: 'Oct 14, 2026',
    targetFobUSD: 2.85,
  },
  {
    id: 'TP-BD-9104',
    garmentSpec: 'Full-Grain Drum-Dyed Bovine Chelsea Boot',
    division: 'Leather & Footwear',
    factoryName: 'Apex Footwear & Tannery',
    factoryCert: 'LWG Gold Certified',
    targetQty: 1200,
    unit: 'pairs',
    status: 'Lab Dip & Upper Stitching QA',
    statusType: 'progress',
    targetDate: 'Oct 28, 2026',
    targetFobUSD: 36.5,
  },
  {
    id: 'TP-BD-9340',
    garmentSpec: 'Biodegradable Hydrocarbon-Free Jute Coffee Bag',
    division: 'Jute & Eco Fiber',
    factoryName: 'Janata Jute Mills Ltd.',
    factoryCert: 'EPB Export Award',
    targetQty: 25000,
    unit: 'bags',
    status: 'Bulk Weaving & Printing in Progress',
    statusType: 'progress',
    targetDate: 'Nov 08, 2026',
    targetFobUSD: 1.45,
  },
  {
    id: 'TP-BD-9511',
    garmentSpec: '380 GSM Heavy French Terry Oversized Hoodie',
    division: 'RMG Knits & Fleece',
    factoryName: 'Envoy Textiles Limited',
    factoryCert: 'OEKO-TEX 100',
    targetQty: 3000,
    unit: 'pcs',
    status: 'Awaiting Color Swatch Approval',
    statusType: 'review',
    targetDate: 'Nov 18, 2026',
    targetFobUSD: 8.9,
  },
];

const SAMPLE_SAVED_PRODUCTS: Array<{
  id: string;
  title: string;
  category: string;
  supplier: string;
  moq: number;
  unit: string;
  priceUSD: number;
  imageUrl: string;
  leadTimeDays: number;
  rating: number;
}> = [
  {
    id: 'saved-1',
    title: '100% Combed Compact Cotton Heavyweight Oversized Tee 260 GSM',
    category: 'RMG Apparel',
    supplier: 'Plummy Fashions Ltd.',
    moq: 100,
    unit: 'pcs',
    priceUSD: 2.85,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    leadTimeDays: 14,
    rating: 4.96,
  },
  {
    id: 'saved-2',
    title: 'Arutemika Cordwainer Hand-Lasted Goodyear Leather Boot',
    category: 'Leather Goods',
    supplier: 'Arutemika Heritage Atelier',
    moq: 50,
    unit: 'pairs',
    priceUSD: 38.0,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    leadTimeDays: 30,
    rating: 4.98,
  },
  {
    id: 'saved-3',
    title: 'Organic Golden Jute Heavy Tote Bag with Padded Webbing Handle',
    category: 'Jute & Eco',
    supplier: 'Golden Jute Mills Ltd.',
    moq: 200,
    unit: 'pcs',
    priceUSD: 1.65,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    leadTimeDays: 12,
    rating: 4.92,
  },
  {
    id: 'saved-4',
    title: '400 Thread Count Combed Egyptian Satin Bedding Set',
    category: 'Home Textiles',
    supplier: 'Noman Terry Towel & Mills',
    moq: 150,
    unit: 'sets',
    priceUSD: 14.5,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    leadTimeDays: 21,
    rating: 4.88,
  },
  {
    id: 'saved-5',
    title: 'Artisan Brass Inlay Ceramic Dinnerware Set 16-Piece',
    category: 'Ceramics',
    supplier: 'Monno Ceramic Industries',
    moq: 80,
    unit: 'sets',
    priceUSD: 28.0,
    imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80',
    leadTimeDays: 25,
    rating: 4.95,
  },
];

interface OverviewProps {
  onOpenRfqModal: () => void;
  onOpenTechPackModal: () => void;
  onOpenInquiries?: () => void;
  onSelectProduct?: (product: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onOpenRfqModal,
  onOpenTechPackModal,
  onOpenInquiries,
  onSelectProduct,
  onNavigateToTab,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* =========================================================================
          TOP BANNER: SOURCING HUB HERO SUMMARY
          ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#141414] via-[#181818] to-[#121212] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e11d48]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                Live Escrow & Sourcing Vault
              </span>
              <span className="text-xs text-slate-400 font-mono">Alibaba Enterprise Hub BD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1.5 text-white">
              My Global Sourcing Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Direct access to EPB Escrow milestones, real-time factory bids from 5,000+ verified mills, and active garment TechPack production streams.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenRfqModal}
              className="px-4 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black shadow-lg shadow-[#e11d48]/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Broadcast RFQ</span>
            </button>
            <button
              onClick={onOpenTechPackModal}
              className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <span>New TechPack</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 1: 3 HIGH-TECH METRIC CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pending Escrow */}
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-lg relative overflow-hidden group hover:border-[#10b981]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Secured Trade Escrow
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center border border-[#10b981]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              $142,500.00
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-[#10b981] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2 Milestones Protected • EPB Bonded Guarantee</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Next Release: Post-Lab Dip ($28.5k)</span>
            <button
              onClick={() => onNavigateToTab?.('orders')}
              className="text-[#10b981] hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
            >
              <span>Audit Ledger</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Active RFQs */}
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-lg relative overflow-hidden group hover:border-[#e11d48]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Active RFQ Broadcasts
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#e11d48]/15 text-[#e11d48] flex items-center justify-center border border-[#e11d48]/30">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              8 Active Lots
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-[#ff1e42] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>34 Factory Quotations in Review</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>5 Mills Quoting FOB Chattogram</span>
            <button
              onClick={onOpenRfqModal}
              className="text-[#e11d48] hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
            >
              <span>Manage Lots</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Unread Quotes */}
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Unread Factory Quotes
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              12 Unread Bids
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avg SLA Response: 3.2 hrs</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Lowest bid: $2.42/pc (Knits)</span>
            <button
              onClick={onOpenInquiries}
              className="text-amber-400 hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
            >
              <span>Open Quotes</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 2: SLEEK "RECENT ACTIVITY" TABLE TRACKING TECHPACK STATUSES
          ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#10b981]" />
              <span>Active TechPack Garment Streams & QA Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live manufacturing tracking from lab-dip and pattern drafting to container dispatch.
            </p>
          </div>
          <button
            onClick={onOpenTechPackModal}
            className="text-xs font-bold text-[#10b981] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Create New TechPack</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/5">
                <th className="py-2.5 px-3">TechPack Code</th>
                <th className="py-2.5 px-3">Commodity & Specification</th>
                <th className="py-2.5 px-3">Assigned Factory Partner</th>
                <th className="py-2.5 px-3">Target Volume</th>
                <th className="py-2.5 px-3">SLA Target Date</th>
                <th className="py-2.5 px-3">Production Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SAMPLE_TECHPACK_ACTIVITIES.map((item) => {
                let badgeClass = 'bg-white/10 text-slate-300 border-white/20';
                if (item.statusType === 'success') {
                  badgeClass = 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30';
                } else if (item.statusType === 'progress') {
                  badgeClass = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
                } else if (item.statusType === 'review') {
                  badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                }

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {item.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{item.garmentSpec}</div>
                      <div className="text-[10px] text-slate-400">{item.division}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200 flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{item.factoryName}</span>
                      </div>
                      <span className="text-[10px] text-[#10b981] font-mono">{item.factoryCert}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {item.targetQty.toLocaleString()} {item.unit}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        FOB ${item.targetFobUSD.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {item.targetDate}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={onOpenTechPackModal}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#10b981] hover:text-slate-950 text-slate-200 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 3: HORIZONTAL SCROLL SLIDER FOR "SAVED PRODUCTS"
          ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-base font-black text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#e11d48]" />
              <span>Saved Catalog Products & Sourcing Watchlist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pinned export inventory with direct 3-tier wholesale volume discounts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollSlider('left')}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={sliderRef}
          className="flex items-stretch space-x-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {SAMPLE_SAVED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="w-64 shrink-0 rounded-xl border border-white/10 bg-[#161616] p-3 flex flex-col justify-between hover:border-[#e11d48]/50 transition-all group"
            >
              <div>
                {/* 1:1 Aspect Ratio Image */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40 border border-white/5 mb-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs border border-white/10">
                    {prod.category}
                  </span>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#10b981] text-slate-950 font-mono">
                    ★ {prod.rating}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-white line-clamp-2 leading-snug group-hover:text-[#ff1e42] transition-colors">
                  {prod.title}
                </h3>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1 truncate">
                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{prod.supplier}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Wholesale FOB:</span>
                    <div className="text-sm font-black text-white font-mono">
                      ${prod.priceUSD.toFixed(2)}{' '}
                      <span className="text-[10px] text-slate-400 font-sans">/{prod.unit}</span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    MOQ: {prod.moq} {prod.unit}
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={onOpenRfqModal}
                    className="w-full py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                  >
                    Inquire RFQ
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(prod);
                      } else {
                        onOpenRfqModal();
                      }
                    }}
                    className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer text-center"
                  >
                    Sample Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
