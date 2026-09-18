import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Bookmark,
  Building2,
  ArrowLeft,
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  LogOut,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Overview } from './Overview';
import { AuthUser, Product, RfqSubmission } from '../../types';

interface BuyerDashboardShellProps {
  authUser: AuthUser | null;
  onNavigateHome: () => void;
  onNavigateToSeller?: () => void;
  onOpenRfqModal: () => void;
  onOpenTechPackModal: () => void;
  onOpenInquiries: () => void;
  onOpenShippingCalc: () => void;
  onLogout?: () => void;
  initialTab?: string;
  theme?: 'dark' | 'light';
}

export const BuyerDashboardShell: React.FC<BuyerDashboardShellProps> = ({
  authUser,
  onNavigateHome,
  onNavigateToSeller,
  onOpenRfqModal,
  onOpenTechPackModal,
  onOpenInquiries,
  onOpenShippingCalc,
  onLogout,
  initialTab = 'overview',
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const navItems = [
    { id: 'overview', label: 'Sourcing Hub', icon: LayoutDashboard, badge: 'Live' },
    { id: 'orders', label: 'Orders & Escrow', icon: ShieldCheck, badge: '$142.5k' },
    { id: 'rfqs', label: 'RFQ Broadcasts', icon: FileText, badge: '8' },
    { id: 'techpack', label: 'TechPack Streams', icon: Layers, badge: '4' },
    { id: 'favorites', label: 'Saved Products', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#e11d48] selection:text-white">
      {/* Top Strip Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">
                EPB ESCROW SECURE GATEWAY
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {onNavigateToSeller && (
              <button
                onClick={onNavigateToSeller}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] text-xs font-bold transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Switch to Exporter Console</span>
              </button>
            )}

            <button
              onClick={onOpenRfqModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black shadow-md shadow-[#e11d48]/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Post New RFQ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sticky Left Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sticky Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* User Profile Card */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#e11d48] text-white font-black flex items-center justify-center text-base shadow-md shadow-[#e11d48]/30">
                  {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'B'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-sm text-white truncate">
                    {authUser?.name || 'International Buyer'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {authUser?.companyName || 'Global Sourcing Desk'}
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                    <span className="text-[10px] font-mono text-[#10b981] font-bold">
                      Verified Enterprise
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-lg space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                          isActive
                            ? 'bg-black/40 text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Utility Box */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-3.5 text-xs space-y-2">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Support & Port Freight
              </div>
              <button
                onClick={onOpenShippingCalc}
                className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Port Freight & Duty Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={onOpenInquiries}
                className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Inquiries & Messages</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[#ff1e42] hover:bg-red-500/10 font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <Overview
              onOpenRfqModal={onOpenRfqModal}
              onOpenTechPackModal={onOpenTechPackModal}
              onOpenInquiries={onOpenInquiries}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'orders' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                    <span>Orders & EPB Escrow Protection Vault</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Funds are held in secure escrow backed by the Export Promotion Bureau until inspection clearance.
                  </p>
                </div>
                <button
                  onClick={onOpenShippingCalc}
                  className="px-3 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-slate-200 hover:bg-white/5 cursor-pointer"
                >
                  Customs Tariffs
                </button>
              </div>

              {/* Active Escrow Orders */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#10b981]/30 bg-[#10b981]/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#10b981]">ESCROW #BD-90412</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                        Milestone 2 Active
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      5,000 Pcs Organic Combed Cotton Crewneck Tees
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Supplier: Plummy Fashions Ltd. • Target FOB Chattogram: $14,250.00
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white font-mono">$14,250.00</div>
                    <span className="text-[11px] text-[#10b981] font-bold">Released upon QA report</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-300">ESCROW #BD-88401</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                        Pre-Shipment QA
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      1,200 Pairs Arutemika Full-Grain Leather Chelsea Boots
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Supplier: Arutemika Heritage Atelier • Target FOB Chattogram: $45,600.00
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white font-mono">$45,600.00</div>
                    <span className="text-[11px] text-cyan-400 font-bold">Inspection scheduled Oct 24</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rfqs' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#e11d48]" />
                    <span>Broadcasted RFQ Lots & Factory Bids</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your active procurement requests circulating across Bangladesh verified manufacturing clusters.
                  </p>
                </div>
                <button
                  onClick={onOpenRfqModal}
                  className="px-3.5 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black cursor-pointer shadow-md"
                >
                  Broadcast New RFQ
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#e11d48]">BD-RFQ-8821</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                        5 Bids Received
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      Combed Organic Cotton 240 GSM Crewneck Heavyweight Tees
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Target Qty: 5,000 pcs • Target Price: $2.85 FOB • Gothenburg Port
                    </div>
                  </div>
                  <button
                    onClick={onOpenInquiries}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
                  >
                    Review Bids
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#e11d48]">BD-RFQ-9142</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                        Dispatched to 5 Mills
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      Biodegradable Hydrocarbon-Free Jute Coffee Bags
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Target Qty: 25,000 bags • Target Price: $1.45 CIF Hamburg
                    </div>
                  </div>
                  <button
                    onClick={onOpenInquiries}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'techpack' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-[#10b981]" />
                    <span>TechPack Studio Garment Specifications</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Precision size grading, Pantone TCX dye formulas, and stitch density blueprints.
                  </p>
                </div>
                <button
                  onClick={onOpenTechPackModal}
                  className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#22c55e] text-slate-950 text-xs font-black cursor-pointer shadow-md"
                >
                  Create TechPack
                </button>
              </div>

              <div className="p-8 text-center border border-dashed border-white/15 rounded-xl bg-white/[0.01]">
                <Layers className="w-10 h-10 text-[#10b981] mx-auto mb-3 opacity-80" />
                <h3 className="font-bold text-sm text-white">4 Active Production TechPacks Loaded</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Click below to open the interactive TechPack Studio with size break breakdown, stitch tolerances, and real-time mill coordination.
                </p>
                <div className="mt-4">
                  <button
                    onClick={onOpenTechPackModal}
                    className="px-4 py-2 rounded-xl bg-[#10b981] text-slate-950 font-black text-xs hover:bg-[#22c55e] cursor-pointer"
                  >
                    Open Studio Blueprint
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Bookmark className="w-5 h-5 text-[#e11d48]" />
                    <span>Saved Favorites & Pinned Manufacturers</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    High-volume export lots pinned for fast seasonal reorders.
                  </p>
                </div>
                <button
                  onClick={onNavigateHome}
                  className="px-3 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-slate-200 hover:bg-white/5 cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>

              <Overview
                onOpenRfqModal={onOpenRfqModal}
                onOpenTechPackModal={onOpenTechPackModal}
                onOpenInquiries={onOpenInquiries}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
