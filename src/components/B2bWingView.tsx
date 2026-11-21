import React, { useMemo, useState } from 'react';
import {
  MessageCircle,
  Package,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  FileText,
  Layers,
  Cpu,
  Building2,
  RefreshCw,
  Factory,
  ExternalLink,
} from 'lucide-react';
import {
  WINGS_BY_ID,
  WingId,
  buildWhatsAppUrl,
  WHATSAPP_DISPLAY,
} from '../config/wings';
import { Product, CurrencyConfig, RfqSubmission, AuthUser } from '../types';
import { ProductCard } from './ProductCard';
import { ManufacturerHub } from './ManufacturerHub';
import { EcosystemOsBadge } from './EcosystemOsBadge';

interface B2bWingViewProps {
  wingId: WingId;
  products: Product[];
  currency: CurrencyConfig;
  rfqs: RfqSubmission[];
  authUser: AuthUser | null;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onInquireProduct: (product: Product, msg?: string) => void;
  onOpenAiAssistant: (product?: Product | null) => void;
  onOpenRfq: () => void;
  onOpenTechPack: () => void;
  onOpenShippingCalc: () => void;
  onOpenPipeline: () => void;
  onRespondToRfq: (rfqId: string, quoteUSD: number, leadTimeDays: number) => void;
  onForceSync: () => void;
  isSyncing: boolean;
  theme?: 'dark' | 'light';
}

export const B2bWingView: React.FC<B2bWingViewProps> = ({
  wingId,
  products,
  currency,
  rfqs,
  onNavigate,
  onSelectProduct,
  onRequestSample,
  onInquireProduct,
  onOpenAiAssistant,
  onOpenRfq,
  onOpenTechPack,
  onOpenShippingCalc,
  onOpenPipeline,
  onRespondToRfq,
  onForceSync,
  isSyncing,
  theme = 'dark',
}) => {
  const wing = WINGS_BY_ID[wingId];
  const isDark = theme === 'dark';
  const [adminTab, setAdminTab] = useState<'rfq_desk' | 'production_nodes'>('rfq_desk');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Filter live hydrated catalog products relevant to this wing
  const wingCatalogProducts = useMemo(() => {
    if (wingId === 'admin') return [];

    const matched = products.filter((p) => {
      const slugMatch = p.divisionSlug && wing.divisionSlugs.includes(p.divisionSlug);
      const text = `${p.title} ${p.description} ${p.divisionTitle || ''} ${p.materials?.join(' ') || ''}`.toLowerCase();
      const keywordMatch = wing.searchKeywords.some((kw) => text.includes(kw));

      if (wingId === 'hardware') {
        return (
          p.divisionSlug === 'leather-cuffs' ||
          p.divisionSlug === 'leather-harness' ||
          keywordMatch
        );
      }
      if (wingId === 'leather') {
        return (
          p.divisionSlug === 'flagship-leather' ||
          p.divisionSlug === 'tannery-hides' ||
          p.categoryId === 'leather-footwear' ||
          keywordMatch
        );
      }
      return slugMatch || keywordMatch;
    });

    return matched.slice(0, 16);
  }, [products, wing, wingId]);

  const quoteWaUrl = buildWhatsAppUrl({ wing: wingId, intent: 'quote' });
  const sampleWaUrl = buildWhatsAppUrl({ wing: wingId, intent: 'sample' });
  const swatchWaUrl = buildWhatsAppUrl({ wing: wingId, intent: 'swatch' });

  // Dedicated NexOS Admin & Production Management Gateway (/admin)
  if (wingId === 'admin') {
    const adminWaUrl = buildWhatsAppUrl({ wing: 'admin', intent: 'admin' });
    return (
      <div className={`min-h-[80vh] ${isDark ? 'bg-[#0A0B0D] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8 space-y-6">
          {/* Header Block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-white/10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#C9A24B]">
                <span>{wing.eyebrow}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>b2b.handsandhead.com/admin</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {wing.h1}
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {wing.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onForceSync}
                disabled={isSyncing}
                className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#14161A] border border-[#C9A24B]/50 hover:border-[#C9A24B] text-[#E2C275] text-xs font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing NexOS...' : 'Sync Master Ledger'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/seller/dashboard')}
                className="btn-crimson min-h-[44px] px-4 py-2.5 rounded-lg text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Factory className="w-4 h-4" />
                <span>Publish SKU / Exporter Console</span>
              </button>

              <a
                href={adminWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ops Desk WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Admin KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {wing.trustMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#14161A] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="text-xs text-zinc-400">{metric.label}</div>
                <div className="mt-1 text-xl font-extrabold tabular-nums text-[#E2C275]">
                  {metric.value}
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">{metric.detail}</div>
              </div>
            ))}
          </div>

          {/* Gateway Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#14161A] border border-white/10">
              <button
                type="button"
                onClick={() => setAdminTab('rfq_desk')}
                className={`px-4 py-2 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  adminTab === 'rfq_desk'
                    ? 'bg-[#E50914] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Live RFQ &amp; Production Desk
              </button>
              <button
                type="button"
                onClick={() => setAdminTab('production_nodes')}
                className={`px-4 py-2 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  adminTab === 'production_nodes'
                    ? 'bg-[#C9A24B] text-[#0A0B0D]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Unified Wing Gateways &amp; Tools
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenPipeline}
              className="text-xs font-mono text-[#E2C275] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect NexOS Ingestion Pipeline</span>
            </button>
          </div>

          {adminTab === 'rfq_desk' ? (
            <ManufacturerHub
              rfqs={rfqs}
              currency={currency}
              onOpenRfq={onOpenRfq}
              onRespondToRfq={onRespondToRfq}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#14161A] border border-white/10 space-y-3">
                <h2 className="text-base font-bold text-white">Seller &amp; Factory Console</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upload new RMG, leather, or 316L hardware SKUs directly to the unified B2B catalog with multi-tier FOB pricing.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('/seller/dashboard')}
                  className="w-full min-h-[42px] px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#ff1e2b] text-white text-xs font-bold cursor-pointer"
                >
                  Open Seller Console
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#14161A] border border-white/10 space-y-3">
                <h2 className="text-base font-bold text-white">Buyer Sourcing Dashboard</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Review saved RFQs, escrow milestones, DHL Express swatch tracking, and verified Dhaka factory shortlists.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('/buyer/dashboard')}
                  className="w-full min-h-[42px] px-4 py-2 rounded-lg bg-[#1E222B] hover:bg-[#262B36] border border-white/15 text-white text-xs font-bold cursor-pointer"
                >
                  Open Buyer Dashboard
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#14161A] border border-white/10 space-y-3">
                <h2 className="text-base font-bold text-white">Freight &amp; TechPack Engines</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Calculate Chattogram ocean freight / DAC air cargo rates or build a custom CAD TechPack specification sheet.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onOpenShippingCalc}
                    className="min-h-[42px] px-3 py-2 rounded-lg bg-[#1E222B] hover:bg-[#262B36] border border-white/15 text-xs font-bold text-zinc-200 cursor-pointer"
                  >
                    Freight Matrix
                  </button>
                  <button
                    type="button"
                    onClick={onOpenTechPack}
                    className="min-h-[42px] px-3 py-2 rounded-lg bg-[#C9A24B] hover:brightness-105 text-xs font-bold text-[#0A0B0D] cursor-pointer"
                  >
                    TechPack CAD
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0B0D] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. WING HERO SECTION (Split Layout, Balanced H1, High-Intent WhatsApp Attribution CTAs) */}
      <section className="border-b border-white/10">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
            {/* Left Copy & Conversion Panel */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Clean unboxed editorial metadata */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#C9A24B]">
                  <span>{wing.eyebrow}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>Dhaka Direct-from-Source</span>
                </div>

                <h1
                  className={`text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight leading-[1.12] max-w-2xl ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {wing.h1}
                </h1>

                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  {wing.subtitle}
                </p>

                {/* International Markets & QC Line */}
                <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                    <span>Dhaka Direct-from-Source QC (4-Point AQL 1.5)</span>
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline text-zinc-600">·</span>
                  <span>Export-Ready for USA, Saudi Arabia, Bahrain &amp; EU</span>
                </div>
              </div>

              {/* Wing-Attributed WhatsApp Conversion CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                  <a
                    href={quoteWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-crimson min-h-[46px] px-5 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Request Quote on WhatsApp</span>
                  </a>

                  <a
                    href={sampleWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold min-h-[46px] px-5 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Package className="w-4 h-4 shrink-0" />
                    <span>Order Sample Pack</span>
                  </a>

                  <a
                    href={swatchWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`min-h-[46px] px-5 py-3 rounded-lg text-sm font-bold border inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors ${
                      isDark
                        ? 'bg-[#14161A] border-white/20 hover:border-[#C9A24B] text-white'
                        : 'bg-white border-slate-300 hover:border-slate-900 text-slate-900'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#C9A24B] shrink-0" />
                    <span>Book Swatch Kit (3–4d DHL)</span>
                  </a>
                </div>

                {/* Secondary Formal Spec & Direct Line Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
                  <span className="font-mono">
                    Direct Export Desk: <strong className="text-zinc-200">{WHATSAPP_DISPLAY}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={onOpenTechPack}
                    className="text-[#E2C275] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload CAD TechPack</span>
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={onOpenRfq}
                    className="text-zinc-300 hover:text-white hover:underline font-semibold cursor-pointer"
                  >
                    Submit Email RFQ
                  </button>
                </div>
              </div>
            </div>

            {/* Right Visual Anchor Card */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] lg:h-full rounded-2xl overflow-hidden bg-[#14161A] border border-white/10">
                {!failedImages[wing.id] ? (
                  <img
                    src={wing.heroImage}
                    alt={wing.h1}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImages((prev) => ({ ...prev, [wing.id]: true }))}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#14161A]">
                    <Layers className="w-10 h-10 text-[#C9A24B] mb-3" />
                    <span className="text-sm font-bold text-white">{wing.navLabel}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/90 via-[#0A0B0D]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-[#E2C275]">{wing.attributionTag}</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Dhaka Production Floor · Ready for Custom OEM / ODM
                    </div>
                  </div>
                  <EcosystemOsBadge variant="inline" className="hidden sm:inline-flex" />
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Manufacturing Spec & Trust Row (Full-Width Below Split) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {wing.trustMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#14161A] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {metric.label}
                </div>
                <div className="mt-1 text-lg sm:text-xl font-extrabold tabular-nums text-[#E2C275]">
                  {metric.value}
                </div>
                <div className={`mt-1 text-xs leading-snug ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE WING PRODUCTION PROGRAMS (Curated Showcase with Direct WhatsApp SKU Quotes) */}
      <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-[#C9A24B]">
              Signature Production Programs · {wing.navLabel}
            </div>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Factory-Direct Flagship Silhouettes &amp; Specs
            </h2>
          </div>
          <a
            href={swatchWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#E2C275] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Order Physical Swatch Kit for All Styles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {wing.showcaseItems.map((item) => {
            const skuQuoteUrl = buildWhatsAppUrl({
              wing: wingId,
              intent: 'sku',
              productTitle: item.title,
              sku: item.sku,
              notes: `${item.specSummary} | ${item.moqLabel}`,
            });
            const skuSampleUrl = buildWhatsAppUrl({
              wing: wingId,
              intent: 'sample',
              productTitle: item.title,
              sku: item.sku,
            });

            return (
              <article
                key={item.sku}
                className={`rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isDark
                    ? 'bg-[#14161A] border-white/10 hover:border-[#C9A24B]/55'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0B0D]">
                  {!failedImages[item.sku] ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => setFailedImages((prev) => ({ ...prev, [item.sku]: true }))}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#14161A]">
                      <Package className="w-8 h-8 text-[#C9A24B] mb-2" />
                      <span className="text-xs font-mono text-zinc-400">{item.sku}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0B0D]/85 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#E2C275] font-bold">{item.sku}</span>
                    {item.badge && <span className="text-zinc-200">{item.badge}</span>}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className={`text-sm sm:text-[15px] font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {item.specSummary}
                    </p>
                    <div className="pt-2 border-t border-white/10 space-y-1 text-xs font-mono tabular-nums">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Est. FOB</span>
                        <span className="font-bold text-emerald-400">{item.fobRange}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Minimum</span>
                        <span className="text-zinc-200">{item.moqLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Timeline</span>
                        <span className="text-[#E2C275]">{item.leadTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={skuQuoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-3 py-2 rounded-lg bg-[#E50914] hover:bg-[#ff1e2b] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Request Quote</span>
                    </a>
                    <a
                      href={skuSampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-bold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-200 hover:text-white'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'
                      }`}
                    >
                      <span>Sample Pack</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. TECHNICAL MANUFACTURING CAPABILITIES & QC GUARANTEES */}
      <section className={`border-y ${isDark ? 'border-white/10 bg-[#0E1014]' : 'border-slate-200 bg-white'}`}>
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[#C9A24B]">
                Engineering &amp; Production Standards
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {wing.navLabel} Specifications &amp; Dhaka Source QC
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="w-4 h-4 text-[#C9A24B]" />
              <span>7–12d Samples · 3–4d DHL Express Swatches</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {wing.capabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className={`p-5 rounded-xl border space-y-3.5 ${
                  isDark ? 'bg-[#14161A] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 pb-2 border-b border-white/10">
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    0{idx + 1}. {cap.title}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {cap.specs.map((line) => (
                    <li
                      key={line}
                      className={`flex items-start gap-2 leading-relaxed ${
                        isDark ? 'text-zinc-300' : 'text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE FEDERATED CATALOG SKUs FOR THIS WING */}
      {wingCatalogProducts.length > 0 && (
        <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[#C9A24B]">
                Live NexOS Wing Catalog · {wingCatalogProducts.length} Active Export SKUs
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Explore Verified {wing.navLabel} Wholesale Inventory
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/catalog')}
              className="text-xs font-bold text-[#E2C275] hover:text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Browse Full Master Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {wingCatalogProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelectProduct={onSelectProduct}
                onRequestSample={onRequestSample}
                onInquire={onInquireProduct}
                onOpenAiAssistant={(p) => onOpenAiAssistant(p)}
                theme={theme}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. BOTTOM HIGH-INTENT CONVERSION BANNER */}
      <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 pb-10">
        <div className="rounded-2xl bg-[#14161A] border border-[#C9A24B]/35 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[#C9A24B]">
              {wing.attributionTag} · Direct Dhaka Export Desk
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Ready to lock your {wing.shortLabel} sample pack or 3–4 day DHL swatch box?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Send your tech pack, target GSM, hide finish, or hardware drawing directly to our Dhaka production engineers on WhatsApp ({WHATSAPP_DISPLAY}). Same-day FOB costing for USA, Saudi Arabia, Bahrain, and EU buyers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href={quoteWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson min-h-[46px] px-5 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Request Quote</span>
            </a>
            <a
              href={swatchWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold min-h-[46px] px-5 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Package className="w-4 h-4" />
              <span>Book Swatch Kit</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
