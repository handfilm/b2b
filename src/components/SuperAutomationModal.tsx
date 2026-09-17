import React, { useState } from 'react';
import {
  LanguageCode,
  AutomationWorkflow,
  AutomationLog,
} from '../types';
import {
  AUTOMATION_WORKFLOWS as INITIAL_WORKFLOWS,
  INITIAL_AUTOMATION_LOGS,
} from '../data/mockData';
import { getTranslation } from '../i18n/translations';
import { nexusApi } from '../services/nexusApi';
import {
  X,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Send,
  Sliders,
  DollarSign,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Clock,
  ExternalLink,
  Code2,
  Layers,
} from 'lucide-react';

interface SuperAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
}

export const SuperAutomationModal: React.FC<SuperAutomationModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = getTranslation(lang);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_WORKFLOWS);
  const [logs, setLogs] = useState<AutomationLog[]>(INITIAL_AUTOMATION_LOGS);
  const [autoPilotActive, setAutoPilotActive] = useState(true);

  // Algorithmic Costing State
  const [fabricGsm, setFabricGsm] = useState(200);
  const [yarnPricePerLb, setYarnPricePerLb] = useState(0.92);
  const [orderQty, setOrderQty] = useState(5000);

  // Webhook Tester State
  const [webhookUrl, setWebhookUrl] = useState('https://erp.buyer.internal/api/webhooks/made-in-bd');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<{
    success: boolean;
    latencyMs: number;
    status: number;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  // Real-world dynamic costing formula for BD knit apparel:
  // Yarn requirement approx (GSM * 1.5 sq meters * 1.15 cutting wastage) / 1000 kg
  const yarnCostPerPc = ((fabricGsm * 1.35) / 1000) * (yarnPricePerLb * 2.20462) * 1.12;
  const knittingDyeingPerPc = (fabricGsm / 200) * 0.48;
  const cutMakePerPc = orderQty > 10000 ? 0.65 : orderQty > 2000 ? 0.82 : 1.10;
  const accessoriesAndPackaging = 0.35;
  const portHandlingAndEscrow = 0.18;
  const estimatedFobChittagong = Number(
    (yarnCostPerPc + knittingDyeingPerPc + cutMakePerPc + accessoriesAndPackaging + portHandlingAndEscrow).toFixed(2)
  );

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? {
              ...wf,
              status: wf.status === 'active' ? 'standby' : 'active',
              lastExecution: 'Just now',
            }
          : wf
      )
    );
  };

  const handleDispatchWebhook = async () => {
    setIsSendingWebhook(true);
    setWebhookResponse(null);

    const testPayload = {
      event: 'trade.rfq_matched',
      timestamp: new Date().toISOString(),
      source: 'Made in BD Trade Desk',
      rfq: {
        id: `BD-RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
        buyer: 'Enterprise Retail Sourcing Ltd.',
        matchedMills: ['Plummy Fashions (LEED Platinum)', 'Envoy Textiles Ltd.'],
        estimatedFobUSD: estimatedFobChittagong,
        incoterms: 'FOB Chittagong (CGP)',
      },
    };

    const result = await nexusApi.triggerWebhookTest(webhookUrl, testPayload);
    setIsSendingWebhook(false);
    setWebhookResponse(result);

    // Append to live logs
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      workflowId: 'wf-erp-webhook',
      workflowName: 'Real-Time ERP / SAP Webhook Dispatcher',
      status: 'success',
      details: `Dispatched test event to ${webhookUrl} (Latency: ${result.latencyMs}ms)`,
      detailsBn: `${webhookUrl} এ সফলভাবে টেস্ট ইভেন্ট পুশ করা হয়েছে (লেটেন্সি: ${result.latencyMs}ms)`,
      payloadPreview: JSON.stringify(testPayload),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111111] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#b33c00] flex items-center justify-center text-white shadow-lg shadow-[#ff5500]/25">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {t.superAutomation}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.superAutomationDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* AI Auto-Pilot Master Toggle Card */}
          <div className="rounded-xl bg-gradient-to-r from-[#171717] to-[#141414] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{t.autoPilotTitle}</span>
                  <span className={`w-2 h-2 rounded-full ${autoPilotActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.autoPilotSubtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setAutoPilotActive(!autoPilotActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                autoPilotActive
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {autoPilotActive ? t.autoPilotActive : t.autoPilotPaused}
            </button>
          </div>

          {/* Active Workflows Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-[#ff5500]" />
              <span>Core Trade Pipelines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="bg-[#161616] p-3.5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">
                        {lang === 'BN' ? wf.nameBn : wf.name}
                      </span>
                      <button
                        onClick={() => handleToggleWorkflow(wf.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          wf.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        {wf.status.toUpperCase()}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'BN' ? wf.descriptionBn : wf.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{wf.triggersCount} Triggers executed</span>
                    <span className="text-emerald-400">{wf.latencyMs}ms latency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithmic FOB Costing Engine */}
          <div className="bg-[#161616] p-5 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#ff5500]" />
                <h3 className="text-sm font-bold text-white">
                  {t.algorithmicCosting}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Port of Loading: Chittagong (CGP)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  {t.fabricGsm}: <span className="text-white font-bold">{fabricGsm} GSM</span>
                </label>
                <input
                  type="range"
                  min="140"
                  max="320"
                  step="10"
                  value={fabricGsm}
                  onChange={(e) => setFabricGsm(Number(e.target.value))}
                  className="w-full accent-[#ff5500] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  {t.yarnIndex}: <span className="text-white font-bold">${yarnPricePerLb.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.75"
                  max="1.50"
                  step="0.05"
                  value={yarnPricePerLb}
                  onChange={(e) => setYarnPricePerLb(Number(e.target.value))}
                  className="w-full accent-[#ff5500] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  {t.orderQuantity}: <span className="text-white font-bold">{orderQty.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="w-full accent-[#ff5500] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Breakdown Display */}
            <div className="bg-[#121212] p-4 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full sm:w-auto">
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.yarnCost}</span>
                  <span className="font-mono text-slate-200">${yarnCostPerPc.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.knittingDyeing}</span>
                  <span className="font-mono text-slate-200">${knittingDyeingPerPc.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.cutMake}</span>
                  <span className="font-mono text-slate-200">${cutMakePerPc.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.freightOverhead}</span>
                  <span className="font-mono text-slate-200">${(accessoriesAndPackaging + portHandlingAndEscrow).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {t.estFobPrice}
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#ff5500]">
                  ${estimatedFobChittagong.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ pc</span>
                </div>
              </div>
            </div>
          </div>

          {/* JIT Escrow Smart Trigger Milestone Pipeline */}
          <div className="bg-[#161616] p-5 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  50% Advance JIT Escrow Smart Contract Pipeline
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Autonomous Escrow
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              <div className="bg-[#121212] p-2.5 rounded-lg border border-emerald-500/30 text-center">
                <span className="text-[10px] font-bold text-emerald-400 block">Milestone 1</span>
                <div className="text-xs font-semibold text-white mt-0.5">Lab-Dip Signoff</div>
                <div className="text-[10px] text-slate-400 mt-1">50% Advance Triggered</div>
              </div>

              <div className="bg-[#121212] p-2.5 rounded-lg border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Milestone 2</span>
                <div className="text-xs font-semibold text-white mt-0.5">Bulk Knitting / Cut</div>
                <div className="text-[10px] text-slate-400 mt-1">Daily IoT Line Reports</div>
              </div>

              <div className="bg-[#121212] p-2.5 rounded-lg border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Milestone 3</span>
                <div className="text-xs font-semibold text-white mt-0.5">SGS Pre-Ship Inspection</div>
                <div className="text-[10px] text-slate-400 mt-1">Digital QC Audit Grade A</div>
              </div>

              <div className="bg-[#121212] p-2.5 rounded-lg border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Milestone 4</span>
                <div className="text-xs font-semibold text-white mt-0.5">Chittagong Port B/L</div>
                <div className="text-[10px] text-emerald-400 mt-1">Final 50% Auto Released</div>
              </div>
            </div>
          </div>

          {/* Real-Time Webhook & ERP Dispatcher */}
          <div className="bg-[#161616] p-5 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-[#ff5500]" />
                <h3 className="text-sm font-bold text-white">
                  {t.webhookConfig}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">REST JSON Webhook</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
                className="flex-1 px-3 py-2 text-xs bg-[#121212] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#ff5500]"
              />
              <button
                onClick={handleDispatchWebhook}
                disabled={isSendingWebhook}
                className="px-4 py-2 bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff5500]/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSendingWebhook ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSendingWebhook ? 'Pinging...' : t.testWebhook}</span>
              </button>
            </div>

            {webhookResponse && (
              <div className="bg-[#121212] p-3 rounded-lg border border-emerald-500/30 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{webhookResponse.message}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  HTTP {webhookResponse.status} • {webhookResponse.latencyMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Live Automation Logs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.automationLogs}</span>
            </h3>

            <div className="bg-[#0e0e0e] rounded-xl border border-white/[0.08] p-3 space-y-2 max-h-48 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="text-[11px] font-mono p-2 rounded bg-white/[0.02] border border-white/[0.04] flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[#ff5500] font-bold">[{log.workflowName}]</span>{' '}
                    <span className="text-slate-300">
                      {lang === 'BN' ? log.detailsBn : log.details}
                    </span>
                  </div>
                  <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
