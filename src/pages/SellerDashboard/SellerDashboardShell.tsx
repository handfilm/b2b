import React, { useState } from 'react';
import {
  Upload,
  Layers,
  FileText,
  ShieldCheck,
  Building2,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { ProductUploadForm } from './ProductUploadForm';
import { AuthUser, B2BProduct } from '../../types';

interface SellerDashboardShellProps {
  authUser: AuthUser | null;
  onNavigateHome: () => void;
  onNavigateToBuyer?: () => void;
  onProductPublished?: (product: B2BProduct) => void;
  onLogout?: () => void;
  initialTab?: string;
  theme?: 'dark' | 'light';
}

export const SellerDashboardShell: React.FC<SellerDashboardShellProps> = ({
  authUser,
  onNavigateHome,
  onNavigateToBuyer,
  onProductPublished,
  onLogout,
  initialTab = 'upload',
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const navItems = [
    { id: 'upload', label: 'Publish New Lot', icon: Upload, badge: 'New' },
    { id: 'lots', label: 'Active Export Lots', icon: Package, badge: '14' },
    { id: 'bids', label: 'Inbound Buyer RFQs', icon: FileText, badge: '6 New' },
    { id: 'compliance', label: 'EPB & Customs Vault', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#e11d48] selection:text-white">
      {/* Top Header */}
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
              <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">
                EXPORTER TERMINAL • CHATTOGRAM PORT GATEWAY
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {onNavigateToBuyer && (
              <button
                onClick={onNavigateToBuyer}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] text-xs font-bold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Buyer Workspace</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('upload')}
              className="px-3.5 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black shadow-md shadow-[#e11d48]/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Export Lot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sticky Left Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sticky Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Mill Profile Card */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#10b981] text-slate-950 font-black flex items-center justify-center text-base shadow-md shadow-[#10b981]/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-sm text-white truncate">
                    {authUser?.companyName || 'Plummy Fashions Ltd.'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    LEED Platinum Certified #1
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                    <span className="text-[10px] font-mono text-[#10b981] font-bold">
                      100% Export Oriented
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

            {/* Quick Metrics */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 text-xs space-y-2.5">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Mill Sourcing Metrics
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Total BDT Sales:</span>
                <span className="font-mono font-bold text-white">65,000,000 BDT</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Active Export Lots:</span>
                <span className="font-mono font-bold text-[#10b981]">14 Lots Live</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Customs Clearance:</span>
                <span className="font-mono font-bold text-slate-200">3.2 Days Avg</span>
              </div>

              {onLogout && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={onLogout}
                    className="w-full text-left py-1.5 px-2 rounded-lg text-[#ff1e42] hover:bg-red-500/10 font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Exporter Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'upload' && (
            <ProductUploadForm
              onProductPublished={onProductPublished}
              onNavigateHome={onNavigateHome}
              supplierName={authUser?.companyName || 'Plummy Fashions Ltd. (LEED Platinum)'}
            />
          )}

          {activeTab === 'lots' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Package className="w-5 h-5 text-[#10b981]" />
                    <span>Active Export Lots & Inventory Matrix</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live product lots synchronized to the federated global catalog with automated 3-tier volume discounts.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black cursor-pointer shadow-md"
                >
                  Upload New Lot
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                    alt="Product"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover aspect-square bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-xs truncate">
                      100% Combed Compact Cotton Heavyweight Oversized Tee 260 GSM
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      SKU: GDRV-PLM-260T • MOQ: 100 pcs
                    </div>
                    <div className="text-xs font-bold text-[#10b981] font-mono mt-1">
                      $2.85 - $1.99 FOB Chattogram
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#161616] flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
                    alt="Product"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover aspect-square bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-xs truncate">
                      380 GSM French Terry Vintage Wash Zip Hoodie
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      SKU: GDRV-PLM-380H • MOQ: 100 pcs
                    </div>
                    <div className="text-xs font-bold text-[#10b981] font-mono mt-1">
                      $8.90 - $6.20 FOB Chattogram
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#e11d48]" />
                    <span>Inbound Buyer RFQs & Commercial Inquiries</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct quote requests dispatched by international buying desks for prompt mill quotation.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#10b981]/30 bg-[#10b981]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#10b981]">RFQ-BUYER-8941</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                        Pending Quotation
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">
                      Target Volume: 15,000 pcs • 240 GSM Knitted Polos
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Buyer: Nordic Apparel Group (Copenhagen) • Target FOB: $3.10
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Quotation submission module ready.')}
                    className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#22c55e] text-slate-950 font-black text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Submit Mill FOB Bid
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                    <span>EPB Export Compliance & Bonded License Vault</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Export Promotion Bureau (EPB), Accord on Fire and Building Safety, and LEED Platinum credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-[#161616]">
                  <div className="text-xs font-mono font-bold text-[#10b981]">LEED PLATINUM</div>
                  <div className="text-lg font-black text-white mt-1">Score: 92/100</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    World #1 Eco-friendly Knitwear Factory certified by USGBC.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#161616]">
                  <div className="text-xs font-mono font-bold text-[#10b981]">OEKO-TEX 100</div>
                  <div className="text-lg font-black text-white mt-1">Class I (Baby Safe)</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Zero harmful dyes or chemicals across knitting and dye lines.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#161616]">
                  <div className="text-xs font-mono font-bold text-[#10b981]">EPB BONDED #8942</div>
                  <div className="text-lg font-black text-white mt-1">Active Bonded Duty</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Duty-free raw material import authorized by National Board of Revenue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
