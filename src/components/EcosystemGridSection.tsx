import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Globe2,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Layers,
  Database,
  ShieldCheck,
  Maximize2,
  RefreshCw,
  ShoppingBag,
  Cpu,
} from 'lucide-react';

export interface EcosystemPortalNode {
  id: string;
  domain: string;
  url: string;
  name: string;
  roleLabel: string;
  badge: string;
  badgeColor: string;
  description: string;
  divisionSlug: string;
  metricsLabel: string;
  latencyMs: number;
  previewFallbackImg: string;
}

interface EcosystemGridSectionProps {
  onSelectDivision: (slug: string) => void;
  selectedDivision: string;
  onOpenAiAssistant?: () => void;
  theme?: 'dark' | 'light';
}

export const ECOSYSTEM_PORTALS: EcosystemPortalNode[] = [
  {
    id: 'handsandhead-ai-studio',
    domain: 'handsandhead.ai.studio',
    url: 'https://handsandhead.ai.studio',
    name: 'handsandhead.ai.studio',
    roleLabel: 'Master Portal Access',
    badge: 'MASTER NEXUS',
    badgeColor: 'bg-[#e11d48] text-white',
    description: 'Central AI Trade Engine & Federated Master Database streaming 6.5 Cr+ BDT trade ledger and live orders.',
    divisionSlug: 'all',
    metricsLabel: '6.5 Cr Ledger • 15.4k Buyers',
    latencyMs: 18,
    previewFallbackImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'handsandhead-com',
    domain: 'handsandhead.com',
    url: 'https://handsandhead.com',
    name: 'handsandhead.com',
    roleLabel: 'The Hub',
    badge: 'CENTRAL HUB',
    badgeColor: 'bg-emerald-500 text-slate-950',
    description: 'Core global wholesale trade hub, manufacturer registry, factory accreditation and compliance vault.',
    divisionSlug: 'all',
    metricsLabel: '3,105 Factories • Verified Gateway',
    latencyMs: 24,
    previewFallbackImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-handsandhead',
    domain: 'shop.handsandhead.com',
    url: 'https://shop.handsandhead.com',
    name: 'shop.handsandhead.com',
    roleLabel: 'D2C & Rapid Wholesale',
    badge: 'D2C STOREFRONT',
    badgeColor: 'bg-indigo-500 text-white',
    description: 'Direct-to-consumer and rapid bulk blank supply, Google Drive synced catalogs, and immediate stock dispatch.',
    divisionSlug: 'commercial-blanks',
    metricsLabel: 'Ready Stock • Low MOQ 100',
    latencyMs: 32,
    previewFallbackImg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rmg-handsandhead',
    domain: 'rmg.handsandhead.com',
    url: 'https://rmg.handsandhead.com',
    name: 'rmg.handsandhead.com',
    roleLabel: 'RMG Knits & Cut-and-Sew',
    badge: 'RMG APPAREL',
    badgeColor: 'bg-rose-500 text-white',
    description: 'High-GSM combed cotton jersey, French terry loopback, polo shirts and sustainable circular knitwear.',
    divisionSlug: 'rmg-knits',
    metricsLabel: '684 Products • OEKO-TEX 100',
    latencyMs: 26,
    previewFallbackImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'leather-handsandhead',
    domain: 'leather.handsandhead.com',
    url: 'https://leather.handsandhead.com',
    name: 'leather.handsandhead.com',
    roleLabel: 'Tannery & Raw Hides',
    badge: 'RAW TANNERY',
    badgeColor: 'bg-amber-600 text-white',
    description: 'LWG Gold certified wet-blue, crust leather, full-grain bovine hides, and direct tannery lot trading.',
    divisionSlug: 'tannery-hides',
    metricsLabel: '145 Lots • Hemayetpur Tannery',
    latencyMs: 35,
    previewFallbackImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bracelets-handsandhead',
    domain: 'bracelets.handsandhead.com',
    url: 'https://bracelets.handsandhead.com',
    name: 'bracelets.handsandhead.com',
    roleLabel: 'Leather Cuffs & Hardware',
    badge: 'CUFFS & STEEL',
    badgeColor: 'bg-teal-500 text-slate-950',
    description: 'Artisan bridle leather cuffs, solid surgical 316L stainless steel clasps, buckles, and custom metalwork.',
    divisionSlug: 'leather-cuffs',
    metricsLabel: '195 Designs • 316L Stainless',
    latencyMs: 29,
    previewFallbackImg: 'https://images.unsplash.com/photo-1611591475878-a32065842813?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jacket-handsandhead',
    domain: 'jacket.handsandhead.com',
    url: 'https://jacket.handsandhead.com',
    name: 'jacket.handsandhead.com',
    roleLabel: 'Heavy Outerwear & Denim',
    badge: 'DENIM & JACKETS',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Shuttle-loom selvedge raw denim, heavy chore coats, sherpa trucker jackets, and technical outerwear.',
    divisionSlug: 'heavy-outerwear',
    metricsLabel: '412 Styles • 14oz-16oz Selvedge',
    latencyMs: 28,
    previewFallbackImg: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jute-handsandhead',
    domain: 'jute.handsandhead.com',
    url: 'https://jute.handsandhead.com',
    name: 'jute.handsandhead.com',
    roleLabel: 'Golden Jute & Eco Goods',
    badge: 'GOLDEN JUTE',
    badgeColor: 'bg-yellow-500 text-slate-950',
    description: '100% biodegradable hydrocarbon-free burlap sacks, shopping totes, twine, and soil erosion geo-textiles.',
    divisionSlug: 'golden-jute',
    metricsLabel: '289 Products • 100% Organic Eco',
    latencyMs: 22,
    previewFallbackImg: '/catalog/jute/jute-card-hero.jpg',
  },
  {
    id: 'textile-handsandhead',
    domain: 'textile.handsandhead.com',
    url: 'https://textile.handsandhead.com',
    name: 'textile.handsandhead.com',
    roleLabel: 'Home Textiles & Linens',
    badge: 'HOME TEXTILES',
    badgeColor: 'bg-cyan-500 text-slate-950',
    description: '650+ GSM zero-twist luxury hotel terry towels, 400TC long-staple sateen bedding, and institutional fabrics.',
    divisionSlug: 'home-textiles',
    metricsLabel: '326 Mills • 650 GSM Zero-Twist',
    latencyMs: 31,
    previewFallbackImg: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lingerie-handsandhead',
    domain: 'lingerie.handsandhead.com',
    url: 'https://lingerie.handsandhead.com',
    name: 'lingerie.handsandhead.com',
    roleLabel: 'Intimates & Seamless',
    badge: 'SEAMLESS INTIMATES',
    badgeColor: 'bg-pink-500 text-white',
    description: 'Santoni seamless knitted intimates, high-elasticity activewear, sports bras, and fine lace undergarments.',
    divisionSlug: 'lingerie-intimates',
    metricsLabel: '210 Collections • Seamless Tech',
    latencyMs: 33,
    previewFallbackImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'harness-handsandhead',
    domain: 'harness.handsandhead.com',
    url: 'https://harness.handsandhead.com',
    name: 'harness.handsandhead.com',
    roleLabel: 'Tactical & Heavy Gear',
    badge: 'TACTICAL HARNESS',
    badgeColor: 'bg-orange-500 text-slate-950',
    description: 'Heavy-duty vegetable-tanned harness straps, load-bearing suspenders, and custom industrial leather systems.',
    divisionSlug: 'leather-harness',
    metricsLabel: '178 Items • Heavy Harness Grade',
    latencyMs: 25,
    previewFallbackImg: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'arutemika-com',
    domain: 'arutemika.com',
    url: 'https://arutemika.com',
    name: 'arutemika.com',
    roleLabel: 'Japan Wholesale Atelier',
    badge: 'HERITAGE ATELIER',
    badgeColor: 'bg-amber-400 text-slate-950',
    description: 'Hand-lasted Goodyear welted boots, briefcases, and bespoke luxury leathercraft tailored for Japan & US markets.',
    divisionSlug: 'flagship-leather',
    metricsLabel: '340 Atelier SKUs • Goodyear Welt',
    latencyMs: 38,
    previewFallbackImg: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
];

export const EcosystemGridSection: React.FC<EcosystemGridSectionProps> = ({
  onSelectDivision,
  selectedDivision,
  onOpenAiAssistant,
  theme = 'dark',
}) => {
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const isDark = theme === 'dark';

  const handleCopy = (e: React.MouseEvent, url: string, domain: string) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedDomain(domain);
      setTimeout(() => setCopiedDomain(null), 2000);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Generate screenshot URL with reliable fallback
  const getScreenshotUrl = (node: EcosystemPortalNode) => {
    if (imageErrors[node.id]) {
      return node.previewFallbackImg;
    }
    // High-resolution real-time web snapshot query
    return `https://api.microlink.io?url=${encodeURIComponent(node.url)}&screenshot=true&meta=false&embed=screenshot.url`;
  };

  return (
    <section
      id="ecosystem-network-grid"
      aria-label="Federated Ecosystem Network Hubs"
      className="my-6 space-y-4"
    >
      {/* Header Strip: Lean, Professional, High-Density */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs transition-colors ${
          isDark
            ? 'bg-[#121212] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                Federated Ecosystem Network • 12 Live Master Portals
              </h3>
              <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>All Nodes Synchronized</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct access and visual homepage cards for handsandhead.ai.studio master hub and all 11 specialized divisions.
            </p>
          </div>
        </div>

        {/* Quick Filter Pill Controls */}
        <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
          {selectedDivision !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectDivision('all')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to All Nodes</span>
            </button>
          )}
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="px-3 py-1.5 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all shadow-md shadow-[#e11d48]/20 cursor-pointer flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask RAWx Router</span>
            </button>
          )}
        </div>
      </div>

      {/* 1 x 4 SQUARE GRID: Max 12 Cards, Pure Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ECOSYSTEM_PORTALS.map((node) => {
          const isSelected = selectedDivision === node.divisionSlug && node.divisionSlug !== 'all';
          const isCopied = copiedDomain === node.domain;
          const isMaster = node.id === 'handsandhead-ai-studio';

          return (
            <motion.div
              key={node.id}
              id={`card-${node.id}`}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`group relative rounded-2xl border p-3.5 sm:p-4 flex flex-col justify-between transition-all overflow-hidden aspect-square ${
                isSelected
                  ? 'border-[#e11d48] ring-2 ring-[#e11d48]/40 shadow-xl'
                  : isMaster
                  ? 'border-[#e11d48]/40 hover:border-[#e11d48]'
                  : isDark
                  ? 'bg-[#141414] border-white/10 hover:border-white/25 hover:shadow-2xl'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl'
              } ${isDark ? 'bg-[#141414]' : 'bg-white'}`}
            >
              {/* Radial Ambient Glow on Hover */}
              <div
                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isMaster ? 'bg-[#e11d48]/20' : 'bg-[#10b981]/15'
                }`}
              />

              {/* CARD TOP: Domain + Status Badge + Quick Copy Link */}
              <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[9.5px] font-black tracking-wider uppercase font-mono shadow-xs ${node.badgeColor}`}
                    >
                      {node.badge}
                    </span>
                    <span className="text-[9.5px] font-mono text-emerald-400 flex items-center space-x-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{node.latencyMs}ms</span>
                    </span>
                  </div>
                  <h4
                    className={`font-black text-xs sm:text-[13px] truncate tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    title={node.domain}
                  >
                    {node.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{node.roleLabel}</p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, node.url, node.domain)}
                    title="Copy direct portal link"
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                        : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-[#10b981]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <a
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Open website in new window"
                    className="p-1.5 rounded-lg bg-[#e11d48]/10 hover:bg-[#e11d48] border border-[#e11d48]/30 hover:border-[#e11d48] text-[#e11d48] hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* CARD MIDDLE: Browser Window Simulation with Live Website Screenshot */}
              <div
                className={`relative z-10 flex-1 w-full my-1 rounded-xl overflow-hidden border flex flex-col group/preview ${
                  isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
              >
                {/* Simulated Mini Browser Header */}
                <div
                  className={`px-2 py-1 border-b flex items-center justify-between text-[9px] font-mono shrink-0 ${
                    isDark
                      ? 'bg-[#181818] border-white/10 text-slate-400'
                      : 'bg-slate-200 border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="truncate max-w-[130px] font-mono text-[9px] opacity-70">
                    https://{node.domain}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </div>

                {/* Screenshot Image Viewport */}
                <div className="relative flex-1 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={getScreenshotUrl(node)}
                    alt={`${node.domain} home page screenshot`}
                    loading="lazy"
                    onError={() => handleImageError(node.id)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/preview:scale-105"
                  />

                  {/* Dark Vignette Overlay on Hover with Instant Launch CTA */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end p-2 justify-between">
                    <span className="text-[10px] text-white font-mono font-bold drop-shadow">
                      Visit Home Page
                    </span>
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-md bg-[#e11d48] text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-lg cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* CARD BOTTOM: Metrics + Division Filter Action */}
              <div className="relative z-10 pt-1.5 flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {node.metricsLabel}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectDivision(node.divisionSlug)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-[#e11d48] text-white shadow-xs'
                      : isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isSelected ? 'Active' : 'Filter'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
