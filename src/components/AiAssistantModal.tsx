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

type ModalViewTab = 'chat' | 'calculator' | 'freight' | 'compliance';

const GLOBAL_DESTINATIONS = [
  { name: 'Germany (Hamburg / Bremen)', transitDays: '22-26 days', seaFreightTeu: '$1,850 - $2,200', duty: 'GSP / EBA (0% Tariff)' },
  { name: 'USA East Coast (New York / Savannah)', transitDays: '28-32 days', seaFreightTeu: '$2,450 - $2,800', duty: 'Standard MFN' },
  { name: 'USA West Coast (Los Angeles / Long Beach)', transitDays: '34-38 days', seaFreightTeu: '$2,750 - $3,150', duty: 'Standard MFN' },
  { name: 'United Kingdom (Felixstowe / Southampton)', transitDays: '24-28 days', seaFreightTeu: '$1,900 - $2,250', duty: 'DCTS Scheme (0% Tariff)' },
  { name: 'France & Benelux (Le Havre / Rotterdam)', transitDays: '23-27 days', seaFreightTeu: '$1,850 - $2,200', duty: 'EBA Duty-Free' },
  { name: 'Japan (Tokyo / Yokohama)', transitDays: '16-20 days', seaFreightTeu: '$1,200 - $1,500', duty: 'GSP Duty-Free' },
  { name: 'UAE (Jebel Ali, Dubai)', transitDays: '12-15 days', seaFreightTeu: '$950 - $1,250', duty: 'GCC 5% Tariff' },
  { name: 'Australia (Sydney / Melbourne)', transitDays: '20-25 days', seaFreightTeu: '$1,600 - $1,950', duty: 'Duty-Free' },
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
  const [simQuantity, setSimQuantity] = useState<number>(activeProduct ? activeProduct.moq : 2500);
  const [selectedDestination, setSelectedDestination] = useState<string>('Germany (Hamburg / Bremen)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting tailored to context
  useEffect(() => {
    if (!isOpen) return;

    let initialGreeting = '';
    if (activeProduct) {
      initialGreeting = `👋 Welcome! I am your **Autonomous Trade Copilot** for **${activeProduct.title}** (HS Code: \`${activeProduct.hsCode}\`).

Live factory parameters for **${activeProduct.supplierName}**:
• **MOQ**: ${activeProduct.moq.toLocaleString()} ${activeProduct.unit}
• **Port of Loading**: ${activeProduct.portOfLoading || 'Chattogram Sea Port (CGP)'}
• **FOB Price Range**: $${activeProduct.priceTiers[activeProduct.priceTiers.length - 1].priceUSD.toFixed(2)} - $${activeProduct.priceTiers[0].priceUSD.toFixed(2)} USD / ${activeProduct.unit}
• **Turnaround**: ~${activeProduct.leadTimeDays} days lead time
• **Verified Standards**: ${activeProduct.certifications.join(', ')}

How would you like to proceed? Select a quick query or toggle the tabs above for live volume cost simulation and container planning.`;
    } else if (activeSupplier) {
      initialGreeting = `👋 Welcome! I am your direct factory sourcing copilot for **${activeSupplier.name}** (${activeSupplier.district}, Bangladesh).

Factory Overview:
• **ESG Status**: ${activeSupplier.leedStatus || 'LEED Platinum / Accord Audited'}
• **Export Facility**: ${activeSupplier.bondedWarehouse ? 'Bonded Warehouse (Duty-free imported yarns & raw materials)' : 'Certified Export Facility'}
• **Production Capacity**: ${activeSupplier.annualCapacity}
• **Lines Operational**: ${activeSupplier.activeLines || 12} dedicated sewing/finishing lines

Ask me for instant FOB quotations, tech-pack compliance, or ocean freight planning from Chattogram Port.`;
    } else {
      initialGreeting = `👋 Welcome to the **Global Sourcing AI Trade Copilot**.

I am connected directly to Bangladesh's export registry across 2,749 export pavilions and 50,000+ audited factories.

I can immediately assist you with:
1. **Live FOB Price & Volume Tier Curves** with instant currency conversion (${currency.code}).
2. **Chattogram Port Container CBM Packing** (20ft vs 40ft High Cube allocation).
3. **Accord / RSC, OEKO-TEX & LEED Platinum** safety verification.
4. **Draft RFQ Generation** and expedited counter-sample courier dispatches ($35).

What category, garment, jute, or leather item are you sourcing today?`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Calculate FOB cost for 5,000 units',
          'Calculate 20ft / 40ft container fit',
          'Check Accord/RSC & LEED audits',
          'Counter-sample courier lead time',
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
  
  // Volume discount curve
  const discountFactor = simQuantity >= 20000 ? 0.78 : simQuantity >= 10000 ? 0.84 : simQuantity >= 5000 ? 0.90 : 1.0;
  const calculatedUnitPriceUSD = basePriceUSD * discountFactor;
  const calculatedUnitPriceLocal = calculatedUnitPriceUSD * currency.rate;
  const totalFobUSD = calculatedUnitPriceUSD * simQuantity;
  const totalFobLocal = totalFobUSD * currency.rate;

  // Container volume estimation: standard carton fits approx 50-70 pcs, ~0.08 CBM per carton
  const estimatedCartons = Math.ceil(simQuantity / 60);
  const estimatedCbm = Number((estimatedCartons * 0.085).toFixed(1));
  const container20ftPct = Math.min(100, Math.round((estimatedCbm / 28) * 100));
  const container40ftPct = Math.min(100, Math.round((estimatedCbm / 68) * 100));

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
      const reply = data.reply || 'Thank you for your inquiry. Our sourcing desk has analyzed your requirements.';

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
        text: `### ⚡ Live Sourcing Breakdown\n\n• **Target Volume**: ${simQuantity.toLocaleString()} pcs\n• **Estimated FOB Chattogram**: $${calculatedUnitPriceUSD.toFixed(2)} USD (${currency.symbol}${calculatedUnitPriceLocal.toFixed(2)})\n• **Total Order Valuation**: $${totalFobUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD (${currency.symbol}${totalFobLocal.toLocaleString(undefined, { maximumFractionDigits: 0 })})\n• **Ocean CBM**: ~${estimatedCbm} CBM (${container20ftPct}% of 20ft Container)\n• **Lead Time**: 35-45 days ex-factory + 4 days port dispatch\n\n*Would you like to generate a formal RFQ or request an express courier sample?*`,
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
    handleSendMessage(`Please quote and confirm production slots for ${simQuantity.toLocaleString()} units shipping to ${selectedDestination}. Estimated CBM is ~${estimatedCbm} CBM.`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
        <motion.div
          id="ai-assistant-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#0c0d11] text-slate-100 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-white/15 overflow-hidden flex flex-col h-[92vh] max-h-[820px]"
        >
          {/* Subtle Ambient Radial Highlight at Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-rose-600/15 via-rose-500/5 to-transparent blur-2xl pointer-events-none" />

          {/* =========================================================================
              HEADER SECTION: Live Pulse, Brand & Active Sourcing Context
              ========================================================================= */}
          <div className="relative px-4 sm:px-6 py-3.5 bg-[#121319]/90 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Glowing Red Icon Badge */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9f1239] p-0.5 shadow-lg shadow-rose-950/40 shrink-0 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-sm sm:text-base text-white tracking-tight flex items-center">
                    <span>AI Mode</span>
                    <span className="text-slate-400 font-normal mx-1.5 hidden sm:inline">·</span>
                    <span className="text-xs font-semibold text-rose-400 hidden sm:inline">Trade Copilot</span>
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                    Live 24/7 Desk
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-md">
                  {activeProduct ? (
                    <span>Context: <strong className="text-white">{activeProduct.title}</strong> · {activeProduct.supplierName}</span>
                  ) : activeSupplier ? (
                    <span>Factory: <strong className="text-white">{activeSupplier.name}</strong> · {activeSupplier.district}</span>
                  ) : (
                    <span>Direct factory quotation, container CBM & compliance audit engine</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {onOpenRfqWithContext && (
                <button
                  type="button"
                  onClick={() => onOpenRfqWithContext(`AI Mode RFQ inquiry for ${activeProduct?.title || activeSupplier?.name || 'wholesale requirement'}`)}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Draft RFQ</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              NAVIGATION TABS: Chat, Cost Calculator, Freight Matrix, Compliance
              ========================================================================= */}
          <div className="px-4 sm:px-6 py-2 bg-[#0e0f14] border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'chat'
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
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
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Volume & Cost Simulator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('freight')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'freight'
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
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
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Factory Audit Vault</span>
              </button>
            </div>

            {/* Currency readout indicator */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-slate-400 shrink-0">
              <Globe2 className="w-3 h-3 text-slate-500" />
              <span>Base: <strong className="text-white">Chattogram Sea Port (CGP)</strong></span>
            </div>
          </div>

          {/* =========================================================================
              MODAL BODY: Switch between Chat, Simulator, Freight & Compliance
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
                          className={`flex items-start space-x-2.5 max-w-[92%] sm:max-w-[85%] ${
                            !isBot ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                              isBot
                                ? 'bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-md shadow-rose-950/30'
                                : 'bg-white/20 text-white border border-white/20'
                            }`}
                          >
                            {isBot ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <User className="w-4 h-4 text-white" />}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`group relative p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                              !isBot
                                ? 'bg-rose-600 text-white rounded-tr-xs shadow-md shadow-rose-950/40'
                                : 'bg-[#15161f] text-slate-200 border border-white/10 rounded-tl-xs shadow-lg'
                            }`}
                          >
                            {msg.text}

                            {/* Copy button */}
                            {isBot && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-slate-500 mt-1 px-10 font-mono">
                          {msg.timestamp}
                        </span>

                        {/* Suggested Action Chips */}
                        {isBot && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="mt-2 pl-10 flex flex-wrap gap-1.5 max-w-[92%]">
                            {msg.suggestedActions.map((action, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSendMessage(action)}
                                className="px-2.5 py-1 rounded-lg bg-[#181922] hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-white text-[11px] transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                              >
                                <Zap className="w-3 h-3 text-rose-400" />
                                <span>{action}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center space-x-2 text-slate-400 pl-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                      </div>
                      <div className="px-4 py-2.5 rounded-2xl bg-[#15161f] border border-white/10 flex items-center space-x-2 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                        <span className="text-slate-400 font-mono text-[11px]">
                          Analyzing factory pricing curve & Chattogram container CBM...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Quick Sourcing Action Bar */}
                <div className="px-4 sm:px-6 py-2 bg-[#101117] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-slate-400">Quick Tools:</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('calculator')}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/20 text-[10.5px] font-bold cursor-pointer transition-colors"
                    >
                      Cost Slider ({simQuantity.toLocaleString()} pcs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('freight')}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-sky-300 border border-sky-400/20 text-[10.5px] font-bold cursor-pointer transition-colors"
                    >
                      Ocean Transit Matrix
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {activeProduct && activeProduct.sampleAvailable && onOpenSampleOrder && (
                      <button
                        type="button"
                        onClick={() => onOpenSampleOrder(activeProduct)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Box className="w-3 h-3" />
                        <span>Order Sample ($35)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Bar */}
                <div className="p-3.5 sm:p-4 bg-[#121319] border-t border-white/10 shrink-0">
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
                            ? `Ask trade copilot about ${activeProduct.title} (MOQ discounts, custom dyeing, packing)...`
                            : 'Ask about FOB prices, ocean CBM, OEKO-TEX certification, or production slots...'
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full bg-[#181922] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 pr-10 shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="px-4 sm:px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-md shadow-rose-950/40 transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                  </form>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Direct Factory Sourcing Copilot · Connected to Bangladesh EPB Registry</span>
                    <span>Multi-Language & HS Code Grounded</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DYNAMIC COST & VOLUME SIMULATOR */}
            {activeTab === 'calculator' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span>Dynamic FOB Cost & Container Packing Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag the production volume slider to simulate live volume discount curves, container utilization, and port export valuation.
                  </p>
                </div>

                {/* Slider Control Card */}
                <div className="p-5 rounded-2xl bg-[#14151e] border border-white/10 space-y-4">
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

                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>500 (Sample/Trial)</span>
                    <span>5,000 (Commercial Batch)</span>
                    <span>20,000 (Full 20ft Container)</span>
                    <span>50,000+ (High Volume)</span>
                  </div>
                </div>

                {/* Live Real-Time Cost Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Unit Price */}
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Unit FOB Price
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-white font-mono">
                        ${calculatedUnitPriceUSD.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        USD / pc
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-rose-400 font-semibold">
                      {currency.symbol}{calculatedUnitPriceLocal.toFixed(2)} {currency.code}
                    </div>
                    {discountFactor < 1 && (
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {Math.round((1 - discountFactor) * 100)}% Volume Discount Active
                      </span>
                    )}
                  </div>

                  {/* Card 2: Total FOB Order Valuation */}
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Total Order Valuation (FOB)
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        ${totalFobUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        USD
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-300 font-semibold">
                      {currency.symbol}{totalFobLocal.toLocaleString(undefined, { maximumFractionDigits: 0 })} {currency.code}
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-mono text-slate-400">
                      Ex-Factory + Port Chattogram Delivery
                    </span>
                  </div>

                  {/* Card 3: Ocean Container CBM Allocation */}
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Ocean Freight Volume
                    </span>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-sky-400 font-mono">
                        ~{estimatedCbm} CBM
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-300">
                      {estimatedCartons} Master Export Cartons
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      {container20ftPct}% of 20ft Container ({container40ftPct}% of 40ft HC)
                    </div>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="p-5 rounded-2xl bg-[#14151e] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Estimated Production & Dispatch Schedule
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-rose-400">Day 1 - 4</p>
                      <p className="text-[11px] text-slate-300 mt-1">Lab Dips & Trims</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-amber-400">Day 5 - 10</p>
                      <p className="text-[11px] text-slate-300 mt-1">PP Counter Sample</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-sky-400">Day 11 - 38</p>
                      <p className="text-[11px] text-slate-300 mt-1">Bulk Assembly & QC</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-emerald-400">Day 39 - 42</p>
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
                    <span>Send Volume Specs to AI Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onOpenRfqWithContext && (
                    <button
                      type="button"
                      onClick={() => onOpenRfqWithContext(`Volume simulation: ${simQuantity.toLocaleString()} pcs at ~$${calculatedUnitPriceUSD.toFixed(2)} USD FOB Chattogram (~${estimatedCbm} CBM).`)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10 flex items-center space-x-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                      <span>Convert to Formal RFQ</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: OCEAN FREIGHT MATRIX */}
            {activeTab === 'freight' && (
              <div className="flex-1 p-5 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                    <Ship className="w-5 h-5 text-sky-400" />
                    <span>Chattogram Port (CGP) Ocean Logistics Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct scheduled feeder vessels connect Chattogram with Singapore/Colombo transshipment hubs for fast global routing.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#14151e] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#191b26] text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Destination Port</th>
                          <th className="p-3.5">Transit Lead Time</th>
                          <th className="p-3.5">Ocean Freight (TEU)</th>
                          <th className="p-3.5">Trade Agreement / Tariff</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {GLOBAL_DESTINATIONS.map((dest, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                              <span>{dest.name}</span>
                            </td>
                            <td className="p-3.5 font-mono text-sky-400">{dest.transitDays}</td>
                            <td className="p-3.5 font-mono text-amber-300">{dest.seaFreightTeu}</td>
                            <td className="p-3.5">
                              <span className="text-[11px] font-mono text-emerald-400">
                                {dest.duty}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDestination(dest.name);
                                  setActiveTab('chat');
                                  handleSendMessage(`What is the optimal shipping line and packing specification from Chattogram to ${dest.name}?`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[11px] font-bold cursor-pointer transition-colors"
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
              <div className="flex-1 p-5 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Audited Compliance & ESG Protocol</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Every factory listed on Made in BD maintains active certifications audited by international inspectors.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Item 1 */}
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10 space-y-2">
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
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10 space-y-2">
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
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10 space-y-2">
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
                  <div className="p-4 rounded-2xl bg-[#14151e] border border-white/10 space-y-2">
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

                <div className="p-4 rounded-2xl bg-[#111219] border border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    Need factory inspection certificates uploaded to your buyer profile?
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage('Please provide audit report summary and compliance certificates for my records.');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Request Audit Dossier
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
