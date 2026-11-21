import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  Globe2,
  ArrowUpRight,
  Copy,
  Check,
  Layers,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import {
  B2B_CANONICAL_ORIGIN,
  ECOSYSTEM_HOME_URL,
  WingId,
  buildWhatsAppUrl,
} from '../config/wings';

export interface EcosystemPortalNode {
  id: string;
  domain: string;
  url: string;
  wingPath: string;
  wingId: WingId;
  isExternalHub?: boolean;
  name: string;
  roleLabel: string;
  badge: string;
  badgeColor: string;
  description: string;
  divisionSlug: string;
  metricsLabel: string;
  previewImage: string;
}

interface EcosystemGridSectionProps {
  onSelectDivision: (slug: string) => void;
  selectedDivision: string;
  onOpenAiAssistant?: () => void;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
}

export const ECOSYSTEM_PORTALS: EcosystemPortalNode[] = [
  {
    id: 'b2b-rmg-wing',
    domain: 'b2b.handsandhead.com/rmg',
    url: `${B2B_CANONICAL_ORIGIN}/rmg`,
    wingPath: '/rmg',
    wingId: 'rmg',
    name: '/rmg · Heavyweight Streetwear',
    roleLabel: '240–300 GSM Knits, Polos & Shirts',
    badge: 'RMG WING',
    badgeColor: 'bg-[#E50914] text-white',
    description:
      'High-GSM combed ring-spun cotton boxy tees, double-layer collars, French terry hoodies, polos, and casual/formal shirts.',
    divisionSlug: 'rmg-knits',
    metricsLabel: 'MOQ 120 pcs/style · 7–12d Sample',
    previewImage: '/4. rmg.handsandhead.com (RMG Knits & Wovens).jpg',
  },
  {
    id: 'b2b-leather-wing',
    domain: 'b2b.handsandhead.com/leather',
    url: `${B2B_CANONICAL_ORIGIN}/leather`,
    wingPath: '/leather',
    wingId: 'leather',
    name: '/leather · Bespoke Hide & Goods',
    roleLabel: 'Full-Grain Jackets, Pants & Bags',
    badge: 'LEATHER WING',
    badgeColor: 'bg-[#C9A24B] text-[#0A0B0D]',
    description:
      'LWG & Savar CETP audited full-grain cowhide, aniline lambskin, vintage-distressed jackets, weekender duffles, and Goodyear boots.',
    divisionSlug: 'tannery-hides',
    metricsLabel: 'MOQ 40/color · 3–4d DHL Swatches',
    previewImage: '/5. leather.handsandhead.com (Hide Registry).jpg',
  },
  {
    id: 'b2b-jacket-wing',
    domain: 'b2b.handsandhead.com/jacket',
    url: `${B2B_CANONICAL_ORIGIN}/jacket`,
    wingPath: '/jacket',
    wingId: 'leather',
    name: '/jacket · RAWx Heavy Outerwear',
    roleLabel: 'Leather Bombers & Selvedge Coats',
    badge: 'JACKET WING',
    badgeColor: 'bg-[#E50914] text-white',
    description:
      'RAWx Atelier matte technical leather bombers, cropped moto jackets, waxed leather pants, and 14.5 oz shuttle-loom denim coats.',
    divisionSlug: 'heavy-outerwear',
    metricsLabel: '7–12d Proto · Dhaka Source QC',
    previewImage: '/7. jacket.handsandhead.com (Heavy Outerwear) .jpg',
  },
  {
    id: 'b2b-hardware-wing',
    domain: 'b2b.handsandhead.com/hardware',
    url: `${B2B_CANONICAL_ORIGIN}/hardware`,
    wingPath: '/hardware',
    wingId: 'hardware',
    name: '/hardware · 316L / 516SS Trims',
    roleLabel: 'Surgical Steel Clasps & CNC Trims',
    badge: 'HARDWARE WING',
    badgeColor: 'bg-[#C9A24B] text-[#0A0B0D]',
    description:
      'Custom CNC-milled 316L/516SS surgical stainless clasps, heavy #8/#10 metal zippers, forged brass shackles, and PVD logo trims.',
    divisionSlug: 'leather-cuffs',
    metricsLabel: '±0.05mm CNC · PVD Obsidian & Gold',
    previewImage: '/6. bracelets.handsandhead.com (Leather Cuffs & Hardware).jpg',
  },
  {
    id: 'b2b-d2c-wing',
    domain: 'b2b.handsandhead.com/d2c',
    url: `${B2B_CANONICAL_ORIGIN}/d2c`,
    wingPath: '/d2c',
    wingId: 'd2c',
    name: '/d2c · Direct Drops & Blanks',
    roleLabel: 'Ready-Stock Wholesale & Relabel',
    badge: 'D2C WING',
    badgeColor: 'bg-white/15 text-white',
    description:
      'Immediate stock allocation from RAWx & Arutemika commercial runs — print-ready 280–300 GSM blanks and selvedge capsules.',
    divisionSlug: 'commercial-blanks',
    metricsLabel: 'MOQ 40/color · 5–10d Relabel',
    previewImage: '/3. shop.handsandhead.com (D2C & Rapid Wholesale).jpg',
  },
  {
    id: 'b2b-admin-wing',
    domain: 'b2b.handsandhead.com/admin',
    url: `${B2B_CANONICAL_ORIGIN}/admin`,
    wingPath: '/admin',
    wingId: 'admin',
    name: '/admin · NexOS Control Gateway',
    roleLabel: 'Supplier & Production Telemetry',
    badge: 'NEXOS ADMIN',
    badgeColor: 'bg-[#C9A24B] text-[#0A0B0D]',
    description:
      'Unified NexOS supplier management, live factory line allocation, RFQ pipeline, and verified catalog publishing console.',
    divisionSlug: 'all',
    metricsLabel: '3,105 Factories · 15.4k Buyers',
    previewImage: '/1. handsandhead.ai.studio (Master Portal).jpg',
  },
  {
    id: 'arutemika-atelier',
    domain: 'b2b.handsandhead.com/leather',
    url: `${B2B_CANONICAL_ORIGIN}/leather`,
    wingPath: '/leather',
    wingId: 'leather',
    name: 'Arutemika Leather Atelier',
    roleLabel: 'Goodyear Boots & Calfskin Bags',
    badge: 'ATELIER',
    badgeColor: 'bg-[#C9A24B] text-[#0A0B0D]',
    description:
      'Hand-lasted Goodyear welted boots, origami calfskin totes, and executive briefcases built to Japan JIS retail tolerances.',
    divisionSlug: 'flagship-leather',
    metricsLabel: 'Tokyo JIS QC · Savar Full-Grain',
    previewImage: '/12. arutemika.com (Japan Wholesale Atelier) .jpg',
  },
  {
    id: 'handsandhead-os-hub',
    domain: 'handsandhead.com',
    url: ECOSYSTEM_HOME_URL,
    wingPath: '/',
    wingId: 'rmg',
    isExternalHub: true,
    name: 'handsandhead.com',
    roleLabel: 'Parent HANDS & HEAD OS Hub',
    badge: 'PARENT OS',
    badgeColor: 'bg-white/15 text-[#E2C275]',
    description:
      'Master ecosystem corporate hub, accreditation registry, multi-vertical trade directory, and institutional governance.',
    divisionSlug: 'all',
    metricsLabel: 'Engineered by HANDS & HEAD OS',
    previewImage: '/2. handsandhead.com (The Hub).jpg',
  },
];

export const EcosystemGridSection: React.FC<EcosystemGridSectionProps> = ({
  onSelectDivision,
  selectedDivision,
  onNavigate,
  theme = 'dark',
}) => {
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleCopy = (e: React.MouseEvent, url: string, domain: string) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedDomain(domain);
      setTimeout(() => setCopiedDomain(null), 2000);
    }
  };

  const handleOpenNode = (node: EcosystemPortalNode) => {
    if (node.isExternalHub) return;
    if (onNavigate) {
      onNavigate(node.wingPath);
    } else {
      onSelectDivision(node.divisionSlug);
    }
  };

  return (
    <section
      id="ecosystem-network-grid"
      aria-label="Unified B2B Manufacturing Wings"
      className="my-6 space-y-4"
    >
      {/* Header Strip */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
          isDark
            ? 'bg-[#14161A] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black tracking-tight">
              Unified Single-Domain Wings · Zero Fragmentation
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Every production vertical consolidated inside b2b.handsandhead.com — switch wings instantaneously without leaving the portal.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
          {selectedDivision !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectDivision('all')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
          <a
            href={buildWhatsAppUrl({ wing: 'swatch', intent: 'swatch' })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#C9A24B] hover:bg-[#E2C275] text-[#0A0B0D] text-xs font-black transition-all flex items-center space-x-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Book Swatch Kit (3–4d DHL)</span>
          </a>
        </div>
      </div>

      {/* 4-Column Unified Wing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ECOSYSTEM_PORTALS.map((node) => {
          const isSelected = selectedDivision === node.divisionSlug && node.divisionSlug !== 'all';
          const isCopied = copiedDomain === node.domain;

          return (
            <motion.div
              key={node.id}
              id={`card-${node.id}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => handleOpenNode(node)}
              className={`group relative rounded-xl border p-3.5 flex flex-col justify-between transition-all overflow-hidden ${
                !node.isExternalHub ? 'cursor-pointer' : ''
              } ${
                isSelected
                  ? 'border-[#E50914] ring-1 ring-[#E50914]/50 shadow-xl'
                  : isDark
                  ? 'bg-[#14161A] border-white/10 hover:border-[#C9A24B]/50 hover:shadow-2xl'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {/* Top: Wing Badge + Copy / Open Action */}
              <div className="relative z-10 flex items-start justify-between gap-2 mb-2.5">
                <div className="min-w-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-black tracking-wider uppercase font-mono mb-1.5 ${node.badgeColor}`}
                  >
                    {node.badge}
                  </span>
                  <h3
                    className={`font-black text-xs sm:text-[13px] truncate tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    title={node.name}
                  >
                    {node.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">{node.roleLabel}</p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, node.url, node.domain)}
                    title="Copy direct wing link"
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'
                        : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  {node.isExternalHub ? (
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open HANDS & HEAD OS Hub"
                      className="p-1.5 rounded-lg bg-[#C9A24B]/15 hover:bg-[#C9A24B] border border-[#C9A24B]/40 text-[#E2C275] hover:text-[#0A0B0D] transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNode(node);
                      }}
                      title={`Enter ${node.wingPath}`}
                      className="p-1.5 rounded-lg bg-[#E50914]/15 hover:bg-[#E50914] border border-[#E50914]/35 text-[#E50914] hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Middle: Verified Local Editorial Preview */}
              <div
                className={`relative z-10 w-full aspect-[16/10] my-1 rounded-lg overflow-hidden border ${
                  isDark ? 'bg-[#0A0B0D] border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <img
                  src={node.previewImage}
                  alt={node.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-2.5 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-200 font-mono truncate">
                    {node.domain}
                  </span>
                  {node.isExternalHub ? (
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-0.5 rounded bg-[#C9A24B] text-[#0A0B0D] text-[10px] font-black uppercase tracking-wider shrink-0"
                    >
                      Hub
                    </a>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider shrink-0">
                      Enter
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Metrics + Quick WhatsApp / Filter Action */}
              <div className="relative z-10 pt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-zinc-400 truncate">
                  {node.metricsLabel}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {!node.isExternalHub && (
                    <a
                      href={buildWhatsAppUrl({ wing: node.wingId, intent: 'quote' })}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded-md bg-white/5 hover:bg-[#E50914] text-zinc-200 hover:text-white border border-white/10 text-[10px] font-bold transition-colors flex items-center gap-1"
                      title={`WhatsApp Quote (${node.badge})`}
                    >
                      <MessageCircle className="w-2.5 h-2.5" />
                      <span>WA</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDivision(node.divisionSlug);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-[#E50914] text-white'
                        : isDark
                        ? 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <Layers className="w-2.5 h-2.5" />
                    <span>{isSelected ? 'Active' : 'Filter'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
