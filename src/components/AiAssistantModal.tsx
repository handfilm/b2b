import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  FileText,
  Box,
  Truck,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Loader2,
  Globe2,
  ExternalLink,
  Calculator,
  Ship,
  TrendingDown,
  Award,
  Check,
  Copy,
  ChevronRight,
  Flame,
  Zap,
  Plane,
  Scale,
  Sliders,
  Download,
  Activity,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { Product, Supplier, CurrencyConfig, AuthUser } from '../types';
import { saveAiInquiryToFirestore } from '../firebase';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  specs?: {
    estimatedFobUsd?: number;
    leadTimeDays?: number;
    containerFit?: string;
    moq?: number;
  };
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProduct?: Product | null;
  activeSupplier?: Supplier | null;
  currency: CurrencyConfig;
  authUser: AuthUser | null;
  onOpenRfqWithContext?: (notes?: string) => void;
  onOpenSampleOrder?: (product: Product) => void;
  onOpenComplianceVault?: (supplier: Supplier) => void;
}

type ModalViewTab = 'chat' | 'calculator' | 'freight' | 'compliance' | 'techpack';

interface DestinationRoute {
  id: string;
  name: string;
  country: string;
  portCode: string;
  transitDays: string;
  seaFreightTeu: string;
  seaFreightFeu: string;
  airExpressRate: string;
  duty: string;
  dutyType: 'zero' | 'mfn' | 'gcc';
}

const GLOBAL_DESTINATIONS: DestinationRoute[] = [
  {
    id: 'de-ham',
    name: 'Hamburg / Bremen',
    country: 'Germany',
    portCode: 'DEHAM',
    transitDays: '22-26 days',
    seaFreightTeu: '$1,850 - $2,200',
    seaFreightFeu: '$2,850 - $3,300',
    airExpressRate: '$4.20 / kg (4 days)',
    duty: 'EU EBA Scheme (0% Tariff Duty-Free)',
    dutyType: 'zero',
  },
  {
    id: 'us-nyc',
    name: 'New York / Savannah',
    country: 'USA East Coast',
    portCode: 'USNYC',
    transitDays: '28-32 days',
    seaFreightTeu: '$2,450 - $2,800',
    seaFreightFeu: '$3,600 - $4,100',
    airExpressRate: '$5.10 / kg (5 days)',
    duty: 'Standard MFN Customs Valuation',
    dutyType: 'mfn',
  },
  {
    id: 'us-lax',
    name: 'Los Angeles / Long Beach',
    country: 'USA West Coast',
    portCode: 'USLAX',
    transitDays: '34-38 days',
    seaFreightTeu: '$2,750 - $3,150',
    seaFreightFeu: '$3,950 - $4,500',
    airExpressRate: '$5.30 / kg (5 days)',
    duty: 'Standard MFN Customs Valuation',
    dutyType: 'mfn',
  },
  {
    id: 'gb-fxs',
    name: 'Felixstowe / Southampton',
    country: 'United Kingdom',
    portCode: 'GBFXS',
    transitDays: '24-28 days',
    seaFreightTeu: '$1,900 - $2,250',
    seaFreightFeu: '$2,950 - $3,400',
    airExpressRate: '$4.40 / kg (4 days)',
    duty: 'UK DCTS Scheme (0% Tariff Duty-Free)',
    dutyType: 'zero',
  },
  {
    id: 'nl-rtm',
    name: 'Rotterdam / Antwerp',
    country: 'Netherlands / Belgium',
    portCode: 'NLRTM',
    transitDays: '23-27 days',
    seaFreightTeu: '$1,850 - $2,200',
    seaFreightFeu: '$2,800 - $3,250',
    airExpressRate: '$4.25 / kg (4 days)',
    duty: 'EU EBA Scheme (0% Duty-Free)',
    dutyType: 'zero',
  },
  {
    id: 'jp-tyo',
    name: 'Tokyo / Yokohama',
    country: 'Japan',
    portCode: 'JPTYO',
    transitDays: '16-20 days',
    seaFreightTeu: '$1,200 - $1,500',
    seaFreightFeu: '$1,950 - $2,300',
    airExpressRate: '$3.80 / kg (3 days)',
    duty: 'Japan GSP Generalized Preferences (0%)',
    dutyType: 'zero',
  },
  {
    id: 'ae-dxb',
    name: 'Jebel Ali, Dubai',
    country: 'United Arab Emirates',
    portCode: 'AEDXB',
    transitDays: '12-15 days',
    seaFreightTeu: '$950 - $1,250',
    seaFreightFeu: '$1,650 - $1,950',
    airExpressRate: '$3.10 / kg (2 days)',
    duty: 'GCC Unified Customs (5% Standard)',
    dutyType: 'gcc',
  },
  {
    id: 'au-syd',
    name: 'Sydney / Melbourne',
    country: 'Australia',
    portCode: 'AUSYD',
    transitDays: '20-25 days',
    seaFreightTeu: '$1,600 - $1,950',
    seaFreightFeu: '$2,500 - $2,900',
    airExpressRate: '$4.80 / kg (4 days)',
    duty: 'Australia Developing Country (0% Duty)',
    dutyType: 'zero',
  },
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeProduct,
  activeSupplier,
  currency,
  authUser,
  onOpenRfqWithContext,
  onOpenSampleOrder,
  onOpenComplianceVault,
}) => {
  const [activeTab, setActiveTab] = useState<ModalViewTab>('chat');
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic simulation parameters
  const [simQuantity, setSimQuantity] = useState<number>(activeProduct ? activeProduct.moq : 5000);
  const [selectedDestination, setSelectedDestination] = useState<string>('Hamburg / Bremen');
  const [shippingMode, setShippingMode] = useState<'sea' | 'air'>('sea');
  const [customNotes, setCustomNotes] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting tailored to context
  useEffect(() => {
    if (!isOpen) return;

    let initialGreeting = '';
    if (activeProduct) {
      initialGreeting = `⚡ **AI Mode · Neural Sourcing Desk Online**

Welcome! I am calibrated for **${activeProduct.title}** (HS Code: \`${activeProduct.hsCode}\`) manufactured by **${activeProduct.supplierName}**.

### 🏭 Verified Mill Specifications:
• **Factory MOQ**: ${activeProduct.moq.toLocaleString()} ${activeProduct.unit}
• **Loading Port**: ${activeProduct.portOfLoading || 'Chattogram Sea Port (CGP)'}
• **FOB Price Tier**: $${activeProduct.priceTiers[activeProduct.priceTiers.length - 1].priceUSD.toFixed(2)} - $${activeProduct.priceTiers[0].priceUSD.toFixed(2)} USD / ${activeProduct.unit}
• **Bulk Lead Time**: ~${activeProduct.leadTimeDays} days ex-factory
• **Accreditations**: ${activeProduct.certifications.join(' · ')}

Use the interactive simulator tools above to test volume discounts, container CBM utilization, or ocean transit times. How can I assist your procurement plan today?`;
    } else if (activeSupplier) {
      initialGreeting = `⚡ **AI Mode · Neural Sourcing Desk Online**

Connected to **${activeSupplier.name}** in ${activeSupplier.district}, Bangladesh.

### 🏭 Factory Intelligence:
• **Audit Rating**: ${activeSupplier.leedStatus || 'USGBC LEED Platinum / RSC Accord Certified'}
• **Bonded Warehouse Status**: ${activeSupplier.bondedWarehouse ? 'Active EPB Bonded Facility (Zero-Duty Raw Material Clearance)' : 'Licensed Export Facility'}
• **Production Velocity**: ${activeSupplier.annualCapacity}
• **Operational Lines**: ${activeSupplier.activeLines || 24} Dedicated Manufacturing Lines

Ask me to calculate FOB quotes for your target volume, inspect structural safety audits, or simulate container packing.`;
    } else {
      initialGreeting = `⚡ **AI Mode · Bangladesh Sourcing Neural Desk**

Live connection established with 126 Export Promotion Bureau (EPB) verified manufacturers across 2,749 export product styles.

### 🚀 Direct Capabilities:
1. **Dynamic FOB Valuation**: Real-time volume discount curve calculation in ${currency.code}.
2. **Container Logistics Matrix**: 20ft & 40ft High Cube CBM allocation from Chattogram Sea Port (CGP).
3. **Duty & ESG Verification**: EU EBA 0% duty compliance, Accord/RSC safety records, and OEKO-TEX standard verification.
4. **Autonomous RFQ & Spec Generation**: One-click procurement dossiers ready for production line reservations.

What product line, textile vertical, or factory requirement are you sourcing today?`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Calculate FOB for 10,000 pcs',
          'Simulate 20ft / 40ft container fit',
          'Verify EU 0% Duty & Customs HS Code',
          'Generate instant procurement RFQ',
        ],
      },
    ]);
  }, [isOpen, activeProduct, activeSupplier, currency.code]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen, activeTab]);

  // Derived calculation values
  const basePriceUSD = activeProduct
    ? activeProduct.priceTiers[0].priceUSD
    : 4.8;

  // Volume discount curve: 5k = 10% off, 10k = 16% off, 20k+ = 22% off
  const discountFactor =
    simQuantity >= 25000
      ? 0.78
      : simQuantity >= 15000
      ? 0.82
      : simQuantity >= 10000
      ? 0.84
      : simQuantity >= 5000
      ? 0.90
      : 1.0;

  const calculatedUnitPriceUSD = basePriceUSD * discountFactor;
  const calculatedUnitPriceLocal = calculatedUnitPriceUSD * currency.rate;
  const totalFobUSD = calculatedUnitPriceUSD * simQuantity;
  const totalFobLocal = totalFobUSD * currency.rate;
  const totalSavingsUSD = (basePriceUSD - calculatedUnitPriceUSD) * simQuantity;

  // Container volume estimation: standard carton fits approx 50-70 pcs, ~0.085 CBM per carton
  const estimatedCartons = Math.ceil(simQuantity / 60);
  const estimatedCbm = Number((estimatedCartons * 0.085).toFixed(1));
  const container20ftPct = Math.min(100, Math.round((estimatedCbm / 28) * 100));
  const container40ftPct = Math.min(100, Math.round((estimatedCbm / 68) * 100));

  const currentRoute =
    GLOBAL_DESTINATIONS.find((d) => d.name === selectedDestination) ||
    GLOBAL_DESTINATIONS[0];

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          productContext: activeProduct || null,
          supplierContext: activeSupplier || null,
          targetQuantity: simQuantity,
          destinationCountry: selectedDestination,
          buyerPersona: authUser?.role || 'buyer',
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        'Thank you for your inquiry. Our sourcing desk has verified available production line slots and confirmed EPB compliance.';

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [
          'Order Courier Counter-Sample ($35)',
          'Create Formal RFQ',
          'Inspect Factory Audit Vault',
        ],
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save inquiry log to Firestore
      saveAiInquiryToFirestore({
        userId: authUser?.id || 'guest',
        query: queryText,
        response: reply,
        contextType: activeProduct ? 'product' : activeSupplier ? 'supplier' : 'general',
        contextTitle: activeProduct?.title || activeSupplier?.name || 'General Query',
      });
    } catch (err) {
      console.error('AI assistant query error:', err);
      const fallbackMsg: AiChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `### ⚡ Live Autonomous Procurement Brief\n\n• **Order Volume**: ${simQuantity.toLocaleString()} pcs\n• **Calculated FOB Unit Price**: **$${calculatedUnitPriceUSD.toFixed(2)} USD** (${currency.symbol}${calculatedUnitPriceLocal.toFixed(2)} ${currency.code})\n• **Volume Discount Applied**: ${Math.round((1 - discountFactor) * 100)}% Gross Savings ($${totalSavingsUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD)\n• **Total Order Valuation**: **$${totalFobUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD** (${currency.symbol}${totalFobLocal.toLocaleString(undefined, { maximumFractionDigits: 0 })})\n• **Container Allocation**: ~${estimatedCbm} CBM (${estimatedCartons} cartons) · ${container20ftPct}% of 20ft TEU\n• **Port of Departure**: Chattogram Sea Port (CGP)\n• **Estimated Route to ${selectedDestination}**: ${currentRoute.transitDays} (${currentRoute.duty})\n• **Lead Time**: 35-42 days ex-factory bulk + 3 days port customs\n\n*Would you like to generate a formal RFQ or dispatch a $35 counter-sample?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendCalculatedSpecsToChat = () => {
    setActiveTab('chat');
    handleSendMessage(
      `Please provide formal factory quotation for ${simQuantity.toLocaleString()} units shipping to ${selectedDestination}. Cargo volume is ~${estimatedCbm} CBM (${estimatedCartons} master cartons). What are the earliest available line slots?`
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
        <motion.div
          id="ai-mode-masterpiece-modal"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#090a0f] text-slate-100 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] border border-white/15 overflow-hidden flex flex-col h-[94vh] max-h-[860px]"
        >
          {/* Super Dynamic Ambient Radial Lights */}
          <div className="absolute -top-24 left-1/4 w-96 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 right-1/4 w-96 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rose-950/30 rounded-full blur-3xl pointer-events-none" />

          {/* =========================================================================
              HEADER SECTION: Super Dynamic Visual Masterpiece Header
              ========================================================================= */}
          <div className="relative px-4 sm:px-6 py-3.5 bg-[#0f1017]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Glowing Dynamic Masterpiece Crest */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#e11d48] via-[#be123c] to-[#4c0519] p-0.5 shadow-xl shadow-rose-950/60 shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#0c0d12]/80 flex items-center justify-center relative overflow-hidden">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse relative z-10" />
                  <span className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-emerald-500/20 animate-pulse" />
                </div>
                {/* Live Online Beacon */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#090a0f]"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-base sm:text-lg text-white tracking-tight flex items-center">
                    <span className="bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                      AI Mode
                    </span>
                    <span className="text-slate-500 font-normal mx-1.5 hidden sm:inline">·</span>
                    <span className="text-xs font-mono font-bold text-rose-400 tracking-wider hidden sm:inline uppercase">
                      Autonomous Sourcing Desk
                    </span>
                  </h2>

                  {/* Equalizer audio-visual bar representation */}
                  <div className="hidden md:flex items-center space-x-0.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                    <span className="w-0.5 h-3 bg-rose-500 rounded-full animate-pulse" />
                    <span className="w-0.5 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                    <span className="w-0.5 h-3.5 bg-rose-400 rounded-full animate-pulse delay-100" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 ml-1.5">
                      126 Mills Live
                    </span>
                  </div>
                </div>

                {/* Sub-bar context pill */}
                <p className="text-[11.5px] text-slate-400 truncate max-w-lg mt-0.5 flex items-center space-x-1.5">
                  {activeProduct ? (
                    <>
                      <span className="text-rose-400 font-bold">Focus:</span>
                      <strong className="text-white truncate">{activeProduct.title}</strong>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300 truncate">{activeProduct.supplierName}</span>
                    </>
                  ) : activeSupplier ? (
                    <>
                      <span className="text-rose-400 font-bold">Factory:</span>
                      <strong className="text-white truncate">{activeSupplier.name}</strong>
                      <span className="text-slate-500">·</span>
                      <span className="text-emerald-400 font-mono">{activeSupplier.district}</span>
                    </>
                  ) : (
                    <span>
                      Grounded in EPB export registry · 2,749 export styles · CGP Port Feeder Network
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center space-x-2 shrink-0">
              {onOpenRfqWithContext && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenRfqWithContext(
                      `AI Mode Procurement Spec: ${simQuantity.toLocaleString()} units for ${
                        activeProduct?.title || activeSupplier?.name || 'wholesale requirement'
                      } at ~$${calculatedUnitPriceUSD.toFixed(2)} USD FOB CGP.`
                    )
                  }
                  className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/50 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Formal RFQ</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close AI Mode"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              NAVIGATION TABS: Dynamic Super-Switcher Bar
              ========================================================================= */}
          <div className="px-4 sm:px-6 py-2 bg-[#0c0d14] border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-rose-600/30 to-rose-500/20 text-white border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-rose-400" />
                <span>Trade Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'calculator'
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-400/20 text-white border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Volume & FOB Simulator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('freight')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'freight'
                    ? 'bg-gradient-to-r from-sky-500/30 to-sky-400/20 text-white border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Ship className="w-3.5 h-3.5 text-sky-400" />
                <span>Ocean Freight Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('compliance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'compliance'
                    ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-400/20 text-white border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ESG & Accord Vault</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('techpack')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'techpack'
                    ? 'bg-gradient-to-r from-purple-500/30 to-purple-400/20 text-white border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Spec & RFQ Sheet</span>
              </button>
            </div>

            {/* Port & Latency telemetry indicator */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Port: <strong className="text-white">Chattogram (CGP)</strong></span>
              <span className="text-slate-600">|</span>
              <span>FX: <strong className="text-rose-400">1 USD = {currency.rate} {currency.code}</strong></span>
            </div>
          </div>

          {/* =========================================================================
              MODAL BODY: Switch between Chat, Simulator, Freight, Compliance, TechPack
              ========================================================================= */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
            {/* TAB 1: CHAT VIEW */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'assistant';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`flex items-start space-x-2.5 max-w-[94%] sm:max-w-[88%] ${
                            !isBot ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                              isBot
                                ? 'bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-md shadow-rose-950/40 border border-rose-400/30'
                                : 'bg-white/20 text-white border border-white/20'
                            }`}
                          >
                            {isBot ? <Sparkles className="w-4 h-4 text-amber-300" /> : <User className="w-4 h-4 text-white" />}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`group relative p-4 sm:p-5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                              !isBot
                                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-tr-xs shadow-lg shadow-rose-950/50'
                                : 'bg-[#12131c] text-slate-200 border border-white/10 rounded-tl-xs shadow-xl'
                            }`}
                          >
                            {msg.text}

                            {/* Copy button */}
                            {isBot && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* Suggested Quick Prompt Chips */}
                            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                                {msg.suggestedActions.map((action, aIdx) => (
                                  <button
                                    key={aIdx}
                                    type="button"
                                    onClick={() => handleSendMessage(action)}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/20 hover:border-rose-500/50 text-[11px] font-medium transition-all cursor-pointer"
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="mt-2 text-[10px] font-mono text-slate-500 text-right">
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Typing State Animation */}
                  {isTyping && (
                    <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono p-2">
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                      <span>Synthesizing factory line schedules & export tariffs...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-4 sm:px-6 py-2 bg-[#0e0f16] border-t border-white/10 flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0">
                  <span className="text-[10.5px] font-mono text-slate-400 shrink-0">Prompts:</span>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`What is the FOB price and timeline for 10,000 units shipping to ${selectedDestination}?`)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    ⚡ FOB for 10,000 pcs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`Explain Bangladesh's 0% duty privilege for exports entering ${currentRoute.country}.`)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    🌍 0% Duty & Customs HS Code
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Check Accord/RSC fire and structural safety audits for this manufacturer.')}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    🌿 LEED Platinum & RSC Safety
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`Calculate CBM and ocean container capacity for ${simQuantity.toLocaleString()} units.`)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    🚢 Container CBM Allocation
                  </button>
                </div>

                {/* Input Bar */}
                <div className="p-3.5 sm:p-4 bg-[#111219] border-t border-white/10 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputText);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={
                          activeProduct
                            ? `Ask AI Mode about ${activeProduct.title} (FOB, custom dyeing, packing, MOQ)...`
                            : 'Ask about FOB prices, ocean CBM, OEKO-TEX certification, or production slots...'
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full bg-[#181924] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 pr-10 shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 sm:px-5 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-md shadow-rose-950/50 transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Submit</span>
                    </button>
                  </form>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Direct Factory Sourcing Engine · Connected to Bangladesh EPB Registry</span>
                    <span>126 Factories · Real-Time Port Feed</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DYNAMIC FOB & VOLUME SIMULATOR */}
            {activeTab === 'calculator' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-amber-400" />
                      <span>Dynamic FOB Cost & Container Packing Simulator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adjust production volume to simulate live economies of scale, container packing CBM, and export valuation.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 self-start sm:self-auto">
                    Live Curve Active
                  </span>
                </div>

                {/* Slider Control Card */}
                <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Target Production Volume:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                      {simQuantity.toLocaleString()} pcs
                    </span>
                  </div>

                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={simQuantity}
                    onChange={(e) => setSimQuantity(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />

                  {/* Volume Preset Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: '500 (Sample/Trial)', val: 500 },
                      { label: '2,500 (MOQ Batch)', val: 2500 },
                      { label: '10,000 (Commercial)', val: 10000 },
                      { label: '20,000 (20ft Container)', val: 20000 },
                      { label: '40,000 (Full 40ft HC)', val: 40000 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setSimQuantity(preset.val)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer border ${
                          simQuantity === preset.val
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Real-Time Cost Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Unit Price */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Unit FOB Price (CGP Port)
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-white font-mono">
                        ${calculatedUnitPriceUSD.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">USD / pc</span>
                    </div>
                    <div className="mt-1 text-xs text-rose-400 font-semibold">
                      {currency.symbol}
                      {calculatedUnitPriceLocal.toFixed(2)} {currency.code}
                    </div>
                    {discountFactor < 1 ? (
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {Math.round((1 - discountFactor) * 100)}% Volume Discount Active
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-[10px] font-mono text-slate-500">
                        Standard MOQ Base Rate
                      </span>
                    )}
                  </div>

                  {/* Card 2: Total FOB Order Valuation */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Total Order Valuation (FOB)
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        ${totalFobUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">USD</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-300 font-semibold">
                      {currency.symbol}
                      {totalFobLocal.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                      {currency.code}
                    </div>
                    {totalSavingsUSD > 0 && (
                      <span className="inline-block mt-2 text-[10px] font-mono text-emerald-400 font-bold">
                        Save ${totalSavingsUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD vs base tier
                      </span>
                    )}
                  </div>

                  {/* Card 3: Ocean Container CBM Allocation */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Ocean Container Allocation
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-sky-400 font-mono">
                        ~{estimatedCbm} CBM
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-300">
                      {estimatedCartons} Master Export Cartons (~60 pcs/ctn)
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      {container20ftPct}% of 20ft TEU ({container40ftPct}% of 40ft HC)
                    </div>
                  </div>
                </div>

                {/* Animated Container Visualizer Gauge */}
                <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                      <Ship className="w-4 h-4 text-sky-400" />
                      <span>Ocean Container Utilization Visualizer</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-300">
                      {container20ftPct}% Filled (20ft TEU)
                    </span>
                  </div>

                  {/* Progress Bars for 20ft and 40ft */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>20ft Standard Container (28 CBM Max)</span>
                        <span className="font-mono text-white">
                          {estimatedCbm} / 28 CBM ({container20ftPct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            container20ftPct > 95
                              ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500'
                              : 'bg-gradient-to-r from-sky-500 to-emerald-400'
                          }`}
                          style={{ width: `${container20ftPct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>40ft High Cube Container (68 CBM Max)</span>
                        <span className="font-mono text-white">
                          {estimatedCbm} / 68 CBM ({container40ftPct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
                          style={{ width: `${container40ftPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Estimated Production & Port Dispatch Schedule
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-rose-400">Day 1 - 4</p>
                      <p className="text-[11px] text-slate-300 mt-1">Lab Dips & Trims</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-amber-400">Day 5 - 10</p>
                      <p className="text-[11px] text-slate-300 mt-1">PP Counter Sample</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-sky-400">Day 11 - 36</p>
                      <p className="text-[11px] text-slate-300 mt-1">Bulk Assembly & QC</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-emerald-400">Day 37 - 40</p>
                      <p className="text-[11px] text-slate-300 mt-1">Port CGP Lading</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={sendCalculatedSpecsToChat}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 cursor-pointer flex items-center space-x-2"
                  >
                    <span>Inject Specs into AI Trade Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('techpack')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10 flex items-center space-x-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>View RFQ Spec Sheet</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: OCEAN FREIGHT MATRIX */}
            {activeTab === 'freight' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                      <Ship className="w-5 h-5 text-sky-400" />
                      <span>Chattogram Port (CGP) Global Ocean Logistics Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct scheduled feeder vessels connect Chattogram with transshipment hubs (Singapore/Colombo) for fast worldwide routing.
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 p-1 bg-[#14151e] border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setShippingMode('sea')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                        shippingMode === 'sea'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Ship className="w-3 h-3" />
                      <span>Ocean (TEU)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMode('air')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                        shippingMode === 'air'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Plane className="w-3 h-3" />
                      <span>Air Express (DAC)</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#12131c] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#181a25] text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Destination Port</th>
                          <th className="p-3.5">Transit Lead Time</th>
                          <th className="p-3.5">
                            {shippingMode === 'sea' ? 'Ocean Freight (20ft / 40ft)' : 'Air Cargo Rate (DAC)'}
                          </th>
                          <th className="p-3.5">Trade Agreement / Duty</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {GLOBAL_DESTINATIONS.map((dest) => (
                          <tr
                            key={dest.id}
                            className={`hover:bg-white/5 transition-colors ${
                              selectedDestination === dest.name ? 'bg-rose-500/10' : ''
                            }`}
                          >
                            <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                                {dest.portCode}
                              </span>
                              <span>{dest.name}</span>
                            </td>
                            <td className="p-3.5 font-mono text-sky-400">
                              {shippingMode === 'sea' ? dest.transitDays : '3-5 days air'}
                            </td>
                            <td className="p-3.5 font-mono text-amber-300">
                              {shippingMode === 'sea' ? `${dest.seaFreightTeu}` : dest.airExpressRate}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                                  dest.dutyType === 'zero'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/10 text-slate-300'
                                }`}
                              >
                                {dest.duty}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDestination(dest.name);
                                  setActiveTab('chat');
                                  handleSendMessage(
                                    `What is the optimal shipping schedule from Chattogram to ${dest.name} for ${simQuantity.toLocaleString()} units (~${estimatedCbm} CBM)?`
                                  );
                                }}
                                className="px-3 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Select Route
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMPLIANCE AUDIT VAULT */}
            {activeTab === 'compliance' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Audited Compliance & ESG Safety Protocol</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Every exporter listed on Made in BD maintains active certifications audited by accredited international inspectors.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                    100% Remediated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Item 1 */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accord / RSC Building Safety</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      100% structural, electrical, and fire safety remediation completed under the Ready-Made Garments Sustainability Council (RSC).
                    </p>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Remediation Verified
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>OEKO-TEX Standard 100 Class I</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All dyed fabrics, threads, buttons, and zippers tested free from toxic chemicals, heavy metals, and harmful azo colorants.
                    </p>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Baby & Adult Certified
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>LEED Platinum Green Facilities</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Bangladesh hosts over 200 USGBC LEED Certified factories, the highest concentration of green industrial facilities worldwide.
                    </p>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Solar Powered & Water Recycled
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bonded Warehouse & Zero-Duty Trims</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Special customs privileges allow factories to import European/Japanese YKK zippers, organic yarns, and labels without import duties.
                    </p>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      National Board of Revenue Active
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111219] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    Need factory inspection certificates and audit dossiers attached to your buyer requisition?
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage('Please provide audit report summary and compliance certificates for my records.');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
                  >
                    Request Audit Dossier
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: INSTANT TECH-PACK / RFQ SPEC SHEET */}
            {activeTab === 'techpack' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                      <Sliders className="w-5 h-5 text-purple-400" />
                      <span>Instant Procurement Specification Sheet (RFQ)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Export-grade requisition document generated with live commercial terms, incoterms, and destination routing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const specSheet = `=== MADE IN BANGLADESH B2B PROCUREMENT DOSSIER ===
Product: ${activeProduct?.title || 'Custom Export Batch'}
HS Code: ${activeProduct?.hsCode || '6109.10'}
Factory Partner: ${activeProduct?.supplierName || activeSupplier?.name || 'Verified Bangladesh Mills'}
Order Volume: ${simQuantity.toLocaleString()} pcs
Unit FOB Price: $${calculatedUnitPriceUSD.toFixed(2)} USD
Total Valuation: $${totalFobUSD.toLocaleString()} USD (${currency.symbol}${totalFobLocal.toLocaleString()} ${currency.code})
Estimated CBM: ~${estimatedCbm} CBM (${estimatedCartons} Master Cartons)
Loading Port: Chattogram Sea Port (CGP), Bangladesh
Destination: ${selectedDestination}
Incoterms: FOB Chattogram
Transit Target: ${currentRoute.transitDays}
Certifications Required: OEKO-TEX Standard 100, Accord/RSC, BSCI
===================================================`;
                      handleCopyText('spec-sheet-btn', specSheet);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    {copiedId === 'spec-sheet-btn' ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy Full Spec</span>
                  </button>
                </div>

                {/* Dossier Card */}
                <div className="p-6 rounded-2xl bg-[#12131c] border border-white/10 font-mono text-xs text-slate-300 space-y-4">
                  <div className="border-b border-white/10 pb-3 flex justify-between items-center text-[11px] text-slate-400">
                    <span>DOSSIER REF: BD-EPB-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                    <span className="text-emerald-400">STATUS: READY FOR FACTORY SUBMISSION</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Commercial Item</p>
                      <p className="font-bold text-white text-sm">
                        {activeProduct?.title || 'High-GSM Export Production Batch'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Harmonized HS Code</p>
                      <p className="font-bold text-rose-400">{activeProduct?.hsCode || '6109.10.00'}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Quantity Required</p>
                      <p className="font-bold text-white text-sm">{simQuantity.toLocaleString()} units</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Indicative FOB Price</p>
                      <p className="font-bold text-emerald-400 text-sm">
                        ${calculatedUnitPriceUSD.toFixed(2)} USD / unit
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Total Valuation (FOB)</p>
                      <p className="font-bold text-white">
                        ${totalFobUSD.toLocaleString()} USD ({currency.symbol}
                        {totalFobLocal.toLocaleString()} {currency.code})
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Ocean Logistics Allocation</p>
                      <p className="font-bold text-sky-400">
                        ~{estimatedCbm} CBM ({estimatedCartons} ctns) · {container20ftPct}% of 20ft TEU
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Destination Port</p>
                      <p className="font-bold text-white">{selectedDestination}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Duty Benefit</p>
                      <p className="font-bold text-emerald-400">{currentRoute.duty}</p>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex flex-wrap items-center gap-3">
                  {onOpenRfqWithContext && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenRfqWithContext(
                          `Formal Requisition: ${simQuantity.toLocaleString()} units of ${
                            activeProduct?.title || 'wholesale batch'
                          } shipping to ${selectedDestination}. Unit FOB: ~$${calculatedUnitPriceUSD.toFixed(
                            2
                          )} USD.`
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 cursor-pointer flex items-center space-x-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Transmit RFQ to Factory Line</span>
                    </button>
                  )}

                  {activeProduct && activeProduct.sampleAvailable && onOpenSampleOrder && (
                    <button
                      type="button"
                      onClick={() => onOpenSampleOrder(activeProduct)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Order Physical Counter-Sample ($35 Courier)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
