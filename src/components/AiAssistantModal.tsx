import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { Product, Supplier, CurrencyConfig, AuthUser } from '../types';
import { saveAiInquiryToFirestore } from '../firebase';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
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
  if (!isOpen) return null;

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [targetQuantity, setTargetQuantity] = useState<number>(activeProduct ? activeProduct.moq : 1000);
  const [destinationCountry, setDestinationCountry] = useState<string>('Germany (Europe Hub)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message tailored to context (Alibaba & IndiaMART style)
  useEffect(() => {
    let initialGreeting = '';
    if (activeProduct) {
      initialGreeting = `👋 Hello! I am your **Instant Trade Assistant** for **${activeProduct.title}** (HS Code: \`${activeProduct.hsCode}\`).

I have live factory data for **${activeProduct.supplierName}**:
- **MOQ**: ${activeProduct.moq.toLocaleString()} ${activeProduct.unit}
- **FOB Chattogram Port**: From **$${activeProduct.priceTiers[activeProduct.priceTiers.length - 1].priceUSD.toFixed(2)} USD** (bulk) to **$${activeProduct.priceTiers[0].priceUSD.toFixed(2)} USD**
- **Production Lead Time**: ~${activeProduct.leadTimeDays} days
- **Compliance**: ${activeProduct.certifications.join(', ')}

What would you like an instant breakdown on?`;
    } else if (activeSupplier) {
      initialGreeting = `👋 Hello! I am your **Factory Sourcing Agent** for **${activeSupplier.name}** (${activeSupplier.district}, Bangladesh).

- **LEED Status**: ${activeSupplier.leedStatus || 'Certified Green Facility'}
- **Bonded Warehouse**: ${activeSupplier.bondedWarehouse ? 'Active (Zero-duty imported yarn & trims)' : 'Standard'}
- **Monthly Capacity**: ${activeSupplier.annualCapacity}
- **Active Lines**: ${activeSupplier.activeLines || 8} lines available

How can I assist your order today? (e.g. FOB quotation, production slot reservation, Accord compliance certificate)`;
    } else {
      initialGreeting = `👋 Welcome to **RAWx Bot Trade Desk** (Direct Factory Sourcing AI).

I can instantly:
1. **Estimate bulk FOB unit costs & quantity discounts** across 50+ RMG, Jute, & Leather factories.
2. **Calculate ocean container CBM** (20ft vs 40ft) from Chattogram Port.
3. **Verify factory compliance** (Accord/RSC, OEKO-TEX, LEED Platinum).
4. **Prepare instant draft RFQs** or schedule air courier counter-samples.

What product or requirement are you sourcing today?`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Calculate FOB cost for 5,000 units',
          'Sample delivery time & courier cost',
          'Check LEED Green & Accord compliance',
          'Can they customize Pantone TCX & labels?',
        ],
      },
    ]);
  }, [activeProduct, activeSupplier]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
          targetQuantity,
          destinationCountry,
          buyerPersona: authUser?.role || 'buyer',
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'Thank you for your inquiry. Our sourcing desk has received your parameters.';

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [
          'Order Courier Sample ($35)',
          'Create Detailed RFQ',
        ],
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save inquiry log to Firestore for persistent user history
      saveAiInquiryToFirestore({
        userId: authUser?.id || 'guest',
        query: queryText,
        response: reply,
        contextType: activeProduct ? 'product' : activeSupplier ? 'supplier' : 'general',
        contextTitle: activeProduct?.title || activeSupplier?.name || 'General Query',
      });
    } catch (err) {
      console.error('AI assistant query error:', err);
      // Friendly fallback
      const fallbackMsg: AiChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `### ⚡ Instant Sourcing Analysis\n\n- **Estimated Rate**: Highly competitive export tariff under Bangladesh EPB bonded facilities.\n- **Turnaround**: Counter-sample in 3-5 days via DHL Express, bulk production 35-45 days FOB Chattogram.\n\n*Would you like me to open the RFQ submission form or inspect the compliance vault?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div
        id="ai-assistant-modal-container"
        className="relative w-full max-w-2xl bg-[#0d0d0d] text-white rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col h-[88vh] max-h-[740px]"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white flex items-center">
                  <span>RAWx Bot</span>
                  <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/20 text-sky-400 border border-blue-500/30 uppercase tracking-wider font-mono">
                    Instant 24/7
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">
                {activeProduct
                  ? `Product Context: ${activeProduct.title}`
                  : activeSupplier
                  ? `Supplier Context: ${activeSupplier.name}`
                  : 'Autonomous sourcing agent & factory quotation engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="px-4 py-2 bg-[#121212] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span>
              Target Qty: <strong className="text-white font-mono">{targetQuantity.toLocaleString()} pcs</strong>
            </span>
            <span>•</span>
            <span>
              Port: <strong className="text-sky-400">{activeProduct?.portOfLoading || 'Chattogram Sea Port'}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono text-slate-500">Destination:</span>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="bg-[#181818] border border-white/10 rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Germany (Europe Hub)">Germany (EU)</option>
              <option value="United States (New York / Savannah)">USA (East Coast)</option>
              <option value="United States (Los Angeles)">USA (West Coast)</option>
              <option value="United Kingdom (Felixstowe)">UK</option>
              <option value="France (Le Havre)">France</option>
              <option value="United Arab Emirates (Jebel Ali)">UAE (Dubai)</option>
              <option value="Japan (Tokyo / Yokohama)">Japan</option>
              <option value="Australia (Sydney / Melbourne)">Australia</option>
            </select>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`flex items-start space-x-2.5 max-w-[88%] ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-sky-400" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white border-blue-500/50 rounded-tr-xs'
                      : 'bg-[#151515] text-slate-200 border-white/10 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              <span className="text-[10px] text-slate-500 mt-1 px-9 font-mono">
                {msg.timestamp}
              </span>

              {/* Instant suggested query buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 pl-9 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white text-[11px] transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 pl-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#151515] border border-white/10 flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span className="text-[11px] text-slate-400">RAWx Bot is analyzing factory pricing & specs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Shortcuts Bar */}
        <div className="px-4 py-2 bg-[#121212] border-t border-white/10 flex flex-wrap items-center gap-2">
          {activeProduct && activeProduct.sampleAvailable && onOpenSampleOrder && (
            <button
              onClick={() => onOpenSampleOrder(activeProduct)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-sky-400" />
              <span>Order Courier Sample (${(activeProduct.samplePriceUSD * currency.rate).toFixed(2)})</span>
            </button>
          )}

          {onOpenRfqWithContext && (
            <button
              onClick={() => onOpenRfqWithContext(`AI Assistant inquiry for ${activeProduct?.title || activeSupplier?.name || 'wholesale requirement'}`)}
              className="px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-sky-400 text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Convert to Formal RFQ</span>
            </button>
          )}

          {activeSupplier && onOpenComplianceVault && (
            <button
              onClick={() => onOpenComplianceVault(activeSupplier)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Vault (Accord/LEED)</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-[#141414] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={
                activeProduct
                  ? `Ask RAWx Bot about ${activeProduct.title} (MOQ, custom dyeing, packing)...`
                  : 'Ask RAWx Bot about pricing, shipping lead times, factory certifications...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask RAWx</span>
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Powered by Gemini 2.5 Flash & EPB Bangladesh Registry</span>
            <span>Supports 20+ Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};
