import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  Database,
  Cloud,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  FolderGit2,
  Cpu,
  Sparkles,
  X,
  Clock,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { useNexosSync } from '../context/NexosSyncContext';

interface NexosPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const NexosPipelineModal: React.FC<NexosPipelineModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const {
    metrics,
    syncStatus,
    lastSyncedAt,
    syncEvents,
    triggerSync,
    products,
  } = useNexosSync();

  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'arutemika' | 'ledger'>('overview');
  const [isTriggering, setIsTriggering] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async (source: 'all' | 'drive' | 'arutemika') => {
    setIsTriggering(true);
    await triggerSync(source);
    setIsTriggering(false);
  };

  const driveItems = products.filter((p) => p.sourceDomain === 'shop.handsandhead.com');
  const arutemikaItems = products.filter((p) => p.sourceDomain === 'arutemika.com');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark
              ? 'bg-[#0b0e14] border-white/15 text-white shadow-black/80'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
          }`}
        >
          {/* Header */}
          <div
            className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-[#ff1e42] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight truncate">
                    NexOS Data Syncing Pipeline
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 uppercase tracking-wider shrink-0">
                    Live Stream
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  Ingestion: Google Drive (`shop.handsandhead.com`) &amp; `arutemika.com` &rarr; Central NexOS DB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleManualSync('all')}
                disabled={isTriggering}
                className="px-3 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-[#e11d48]/20"
                title="Force Re-Ingestion from both sources"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Force Re-Sync</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Database Metric Indicators */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b text-xs ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Sales History Ledger</div>
              <div className="text-sm sm:text-base font-mono font-black text-amber-400">
                {metrics.totalTradeVol} BDT
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">{metrics.bdtSalesVolume}</div>
            </div>

            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Active Global Buyers</div>
              <div className="text-sm sm:text-base font-mono font-black text-[#10b981]">
                {metrics.activeBuyers.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">EU, US, Japan &amp; UK</div>
            </div>

            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Verified BD Suppliers</div>
              <div className="text-sm sm:text-base font-mono font-black text-[#ff1e42]">
                {metrics.verifiedSuppliers.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">EPB &amp; BGMEA Bonded</div>
            </div>

            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Pipeline Latency</div>
              <div className="text-sm sm:text-base font-mono font-black text-emerald-400">
                32 ms AVG
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">ETag Cached Memory</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`flex items-center space-x-1 px-4 py-2 border-b overflow-x-auto no-scrollbar text-xs font-bold ${
              isDark ? 'bg-[#0f131d] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Pipeline Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'drive'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Drive Normalizer ({driveItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('arutemika')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'arutemika'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Arutemika Atelier ({arutemikaItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'ledger'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync Audit Stream</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
            {/* TAB 1: ARCHITECTURE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Visual Flow Diagram */}
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
                    Headless Data Ingestion Topology
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    {/* Source 1 */}
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400">shop.handsandhead.com</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          Google Drive
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Raw Google Drive asset repository containing photo lookbooks and single D2C retail pricing.
                      </p>
                      <div className="text-[10px] font-mono text-blue-300 pt-1">
                        &rarr; normalizeDriveProduct()
                      </div>
                    </div>

                    {/* Central Bus */}
                    <div className="p-3 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/30 space-y-1.5 text-center">
                      <div className="flex items-center justify-center space-x-1 font-black text-[#ff1e42]">
                        <Database className="w-4 h-4" />
                        <span>admin.handsandhead.com</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Central NexOS Master Database: <strong>6.5 Crore BDT</strong> sales ledger, <strong>15,420 buyers</strong>, and <strong>3,105 suppliers</strong>.
                      </p>
                      <div className="text-[9.5px] font-mono text-[#10b981]">
                        Stream Bus &bull; Zero Lag Sync
                      </div>
                    </div>

                    {/* Source 2 */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">arutemika.com</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Japan Atelier
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Flagship Goodyear welted boots, bags, and benchmade leather goods in JPY / USD.
                      </p>
                      <div className="text-[10px] font-mono text-amber-300 pt-1">
                        &rarr; normalizeArutemikaProduct()
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Routing Demonstration */}
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h4 className="font-bold text-sm text-white mb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    <span>Dual Headless Target Routing Logic</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3">
                    Every ingested product generates a secure <code>targetRoutingUrl</code> directing buyers to the respective origin store for checkout or custom wholesale contracting:
                  </p>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                      <span className="text-blue-400">Drive Origin:</span>
                      <span className="text-slate-300 truncate">
                        https://shop.handsandhead.com/checkout?sku=GDRV-TEE-280&amp;source=b2b_sync
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                      <span className="text-amber-400">Arutemika Origin:</span>
                      <span className="text-slate-300 truncate">
                        https://arutemika.com/wholesale?sku=ARTM-7209-CHL&amp;ref=nexos_b2b
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE DRIVE NORMALIZER */}
            {activeTab === 'drive' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Google Drive Asset Normalizer</h3>
                    <p className="text-xs text-slate-400">
                      Rule: Auto-generate Volume Price Ladder (30% discount for MOQ 500, 40% for MOQ 2000)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleManualSync('drive')}
                    disabled={isTriggering}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTriggering ? 'animate-spin' : ''}`} />
                    <span>Re-Ingest Drive</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {driveItems.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                              {prod.sku}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 truncate">
                              {prod.provenance}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white truncate mt-1">{prod.title}</h4>
                          <div className="mt-2 text-[10px] font-mono bg-black/40 p-1.5 rounded border border-white/10 space-y-0.5">
                            <div className="text-blue-300 font-bold">Auto-Generated Price Ladder:</div>
                            {prod.priceTiers.map((t, idx) => (
                              <div key={idx} className="flex justify-between text-slate-300">
                                <span>MOQ {t.minQty}+:</span>
                                <span className="font-bold text-white">${t.priceUSD.toFixed(2)} USD</span>
                              </div>
                            ))}
                          </div>
                          <a
                            href={prod.targetRoutingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1 mt-1.5 font-mono"
                          >
                            <span>Origin Checkout Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ARUTEMIKA NORMALIZER */}
            {activeTab === 'arutemika' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Arutemika Flagship Atelier Normalizer</h3>
                    <p className="text-xs text-slate-400">
                      Rule: Auto-append provenance badges ("Arutemika Heritage Atelier", "Full-Grain Leather") &amp; set division to Flagship Leather
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleManualSync('arutemika')}
                    disabled={isTriggering}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTriggering ? 'animate-spin' : ''}`} />
                    <span>Re-Ingest Atelier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {arutemikaItems.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-1 mb-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Arutemika Heritage Atelier
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                              Full-Grain Leather
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white truncate">{prod.title}</h4>
                          <div className="mt-2 text-[10px] font-mono bg-black/40 p-1.5 rounded border border-white/10">
                            <div className="text-amber-300 font-bold">Wholesale Tiering:</div>
                            {prod.priceTiers.map((t, idx) => (
                              <div key={idx} className="flex justify-between text-slate-300">
                                <span>MOQ {t.minQty}+:</span>
                                <span className="font-bold text-white">${t.priceUSD.toFixed(2)} USD</span>
                              </div>
                            ))}
                          </div>
                          <a
                            href={prod.targetRoutingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-amber-400 hover:underline flex items-center space-x-1 mt-1.5 font-mono"
                          >
                            <span>Origin Wholesale Checkout Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AUDIT LEDGER */}
            {activeTab === 'ledger' && (
              <div className="space-y-2 font-mono">
                <div className="text-[11px] font-black uppercase text-slate-400 mb-2">
                  Live Sync Execution History
                </div>
                {syncEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-[11px] ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
                      <span className="font-bold text-slate-300 shrink-0">[{evt.sourceDomain}]</span>
                      <span className="text-slate-400 truncate">{evt.message}</span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 text-slate-500">
                      <span>{evt.latencyMs}ms</span>
                      <span>&bull;</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
              isDark ? 'bg-[#0f131d] border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>Status: NexOS Sync Bus Active</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline text-slate-500">
                Last Synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
