import { useEffect } from 'react';
import { WingId, WINGS_BY_ID, B2B_CANONICAL_ORIGIN, ECOSYSTEM_HOME_URL } from '../config/wings';

export type SeoTabMode = 'HOME' | 'APPS' | 'SLIDERS';

export interface EcosystemSeoModule {
  id: string;
  hash: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  image: string;
}

export interface UseSeoHeadOptions {
  /** Active top-level tab when used inside handsandhead.com hub (HOME, APPS, SLIDERS) */
  activeTab?: SeoTabMode;
  /** Active ecosystem module slug or hash (e.g. 'studio', '#jacket', '#leather', '#rmg', '#bloom') */
  activeSection?: string | null;
  /** Active B2B portal route path (e.g. '/rmg', '/leather', '/jacket', '/hardware', '/d2c', '/admin', '/catalog') */
  currentPath?: string;
  /** Resolved B2B wing ID */
  activeWing?: WingId | null;
  /** Active B2B portal view tab */
  activeView?: 'products' | 'suppliers' | 'customers' | 'insights';
  /** Optional explicit overrides */
  titleOverride?: string;
  descriptionOverride?: string;
  canonicalOverride?: string;
  imageOverride?: string;
}

const DEFAULT_OG_IMAGE =
  'https://b2b.handsandhead.com/RAWx%20Atelier%20Stealth%20Matte%20Technical%20Leather%20Minimalist%20Bomber%20Jacket%20%201.jpg';

const HUB_DEFAULT_META = {
  title: 'HANDS & HEAD — One Core, Many Worlds. | HandFilm Studio & Direct Dhaka B2B Ecosystem',
  description:
    'HANDS & HEAD ("One Core, Many Worlds.") founded by Rakib Himon in Dhaka: HandFilm Studio WebGL2 AI Video Editor (storyboard.handsandhead.com), Direct B2B Manufacturing (240–300 GSM Streetwear, Custom Leather Jackets, 316L Hardware), and 24 modular venture portals.',
  keywords:
    'HANDS AND HEAD, One Core Many Worlds, Rakib Himon, Shaikh Rakibuzzaman Himon, HandFilm Studio, WebGL2 AI Video Editor, Custom Leather Jacket Manufacturer Bangladesh, Heavyweight Streetwear Manufacturer Dhaka, 316L Stainless Hardware, RAWx, Arutemika',
  canonicalUrl: `${ECOSYSTEM_HOME_URL}/`,
  image: DEFAULT_OG_IMAGE,
};

const B2B_DEFAULT_META = {
  title: 'HANDS & HEAD × RAWx | Custom Leather Jacket & Heavyweight Streetwear Manufacturer Bangladesh',
  description:
    'Direct-from-source Dhaka B2B manufacturer of 240–300 GSM heavyweight streetwear, bespoke full-grain leather jackets, and 316L stainless steel hardware. MOQ 120 pcs/style, 7–12 day sampling, 3–4 day DHL swatch dispatch to USA, Saudi Arabia, Bahrain & EU.',
  keywords:
    'Custom Leather Jacket Manufacturer Bangladesh, Heavyweight Streetwear Manufacturer Bangladesh, 300 GSM Boxy Tee Wholesale Dhaka, Low MOQ Clothing Manufacturer Bangladesh, Bespoke Full-Grain Leather Goods OEM, 316L Stainless Steel Hardware Trims, HANDS AND HEAD, RAWx, Arutemika',
  canonicalUrl: `${B2B_CANONICAL_ORIGIN}/`,
  image: DEFAULT_OG_IMAGE,
};

const TAB_META_MAP: Record<SeoTabMode, { title: string; description: string; hash: string }> = {
  HOME: {
    title: 'HANDS & HEAD — One Core, Many Worlds. | Ecosystem Command Hub',
    description:
      'Explore the HANDS & HEAD ecosystem founded by Rakib Himon in Dhaka: HandFilm WebGL2 AI Video Studio, direct-from-source B2B RMG & Leather manufacturing, and 24 connected venture portals.',
    hash: '#home',
  },
  APPS: {
    title: 'HANDS & HEAD Apps & 24 Ecosystem Modules | Software, RMG, Leather & Hardware',
    description:
      'Browse all 24 HANDS & HEAD ecosystem portals including HandFilm Studio, Aural, Bloom, Skyhara, NexOS, RMG Heavyweight Streetwear, RAWx Leather Jackets, Arutemika, and 316L Hardware.',
    hash: '#apps',
  },
  SLIDERS: {
    title: 'HANDS & HEAD Interactive Showcase Sliders | One Core, Many Worlds.',
    description:
      'Visual cinema showcase of HANDS & HEAD software engines, RAWx leather outerwear, 300 GSM heavyweight streetwear, Arutemika leathercraft, and 316L surgical stainless hardware.',
    hash: '#sliders',
  },
};

export const ECOSYSTEM_SEO_MODULES: Record<string, EcosystemSeoModule> = {
  studio: {
    id: 'studio',
    hash: '#studio',
    name: 'HandFilm Studio & Storyboard',
    title: 'HandFilm Studio & Storyboard | Browser-Native WebGL2 AI Video Editor — HANDS & HEAD',
    description:
      'Browser-native WebGL2 AI Video Editor, Cinema Player, and Cloudflare Video Host engineered by HANDS & HEAD (storyboard.handsandhead.com) for zero-install cinema production.',
    keywords: 'HandFilm Studio, WebGL2 AI Video Editor, Browser Video Editor, Cloudflare Video Host, Cinema Player, HANDS AND HEAD',
    canonicalUrl: 'https://storyboard.handsandhead.com/',
    image: `${B2B_CANONICAL_ORIGIN}/1.%20handsandhead.ai.studio%20(Master%20Portal).jpg`,
  },
  aural: {
    id: 'aural',
    hash: '#aural',
    name: 'Aural Audio Lab',
    title: 'Aural Audio Lab | Spatial Mastering & Cinema Soundscapes — HANDS & HEAD',
    description:
      'Spatial audio mastering, sonic identity design, and cinema soundscapes integrated directly with HandFilm Studio inside the HANDS & HEAD ecosystem.',
    keywords: 'Aural Audio Lab, Spatial Audio Mastering, Cinema Sound Design, HandFilm Audio, HANDS AND HEAD',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#aural`,
    image: `${B2B_CANONICAL_ORIGIN}/2.%20handsandhead.com%20(The%20Hub).jpg`,
  },
  bloom: {
    id: 'bloom',
    hash: '#bloom',
    name: 'Bloom Growth & Brand Engine',
    title: 'Bloom Growth Engine | Brand Architecture & GEO/SEO Systems — HANDS & HEAD',
    description:
      'Digital brand architecture, Generative Engine Optimization (GEO), Technical SEO, and international direct-response scaling engineered by HANDS & HEAD.',
    keywords: 'Bloom Growth Engine, Technical SEO, Generative Engine Optimization, Brand Systems, HANDS AND HEAD',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#bloom`,
    image: `${B2B_CANONICAL_ORIGIN}/2.%20handsandhead.com%20(The%20Hub).jpg`,
  },
  skyhara: {
    id: 'skyhara',
    hash: '#skyhara',
    name: 'Skyhara Air & Express Logistics',
    title: 'Skyhara Logistics | Global DHL Express & DAC Air Cargo Corridors — HANDS & HEAD',
    description:
      'Cross-border express logistics connecting Dhaka (DAC) and Chattogram (CGP) with USA, Saudi Arabia, Bahrain, EU, and Japan via 3–4 day DHL Express swatch and air cargo lanes.',
    keywords: 'Skyhara Logistics, DHL Express Dhaka, Bangladesh Air Cargo Export, Chattogram FOB Freight, HANDS AND HEAD',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#skyhara`,
    image: `${B2B_CANONICAL_ORIGIN}/2.%20handsandhead.com%20(The%20Hub).jpg`,
  },
  nexos: {
    id: 'nexos',
    hash: '#nexos',
    name: 'NexOS Trade Operating System',
    title: 'NexOS Trade OS | Supplier Registry & Production Telemetry — HANDS & HEAD',
    description:
      'Centralized NexOS ERP connecting 3,105+ verified factories, live RFQ pipelines, production line allocation, and export compliance across HANDS & HEAD.',
    keywords: 'NexOS Trade OS, Bangladesh Factory ERP, B2B Supplier Management, RFQ Automation, HANDS AND HEAD',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/admin`,
    image: `${B2B_CANONICAL_ORIGIN}/1.%20handsandhead.ai.studio%20(Master%20Portal).jpg`,
  },
  'ai-studio': {
    id: 'ai-studio',
    hash: '#ai-studio',
    name: 'HANDS & HEAD AI Studio',
    title: 'HANDS & HEAD AI Studio | Federated Trade Copilot & Automated Costing',
    description:
      'Central AI trade engine synthesizing garment TechPacks, FOB BOM estimates, and multi-wing sourcing specs across HANDS & HEAD.',
    keywords: 'HANDS AND HEAD AI Studio, AI Sourcing Copilot, Automated FOB Costing, TechPack AI',
    canonicalUrl: 'https://handsandhead.ai.studio/',
    image: `${B2B_CANONICAL_ORIGIN}/1.%20handsandhead.ai.studio%20(Master%20Portal).jpg`,
  },
  vault: {
    id: 'vault',
    hash: '#vault',
    name: 'Compliance & ESG Vault',
    title: 'Compliance & ESG Vault | OEKO-TEX 100, LWG Gold & Savar CETP — HANDS & HEAD',
    description:
      'Verified export compliance repository covering OEKO-TEX 100, GOTS Organic, LWG Gold tanneries, Savar CETP environmental audits, and 4-Point AQL 1.5 Dhaka QC.',
    keywords: 'OEKO-TEX 100 Bangladesh, LWG Gold Tannery Savar, AQL 1.5 QC Dhaka, Tokyo JIS Garment Audit',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#vault`,
    image: `${B2B_CANONICAL_ORIGIN}/2.%20handsandhead.com%20(The%20Hub).jpg`,
  },
  cad: {
    id: 'cad',
    hash: '#cad',
    name: 'TechPack & CAD Studio',
    title: 'TechPack & CAD Studio | Garment Grading & BOM Engineering — HANDS & HEAD',
    description:
      'Factory-ready TechPack builder, GSM fabric spec sheets, pattern grading, and 7–12 day Dhaka prototyping workflows.',
    keywords: 'Garment TechPack Studio, Apparel CAD Grading, Streetwear Pattern Maker Dhaka, BOM Engineering',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#cad`,
    image: `${B2B_CANONICAL_ORIGIN}/4.%20rmg.handsandhead.com%20(RMG%20Knits%20&%20Wovens).jpg`,
  },
  b2b: {
    id: 'b2b',
    hash: '#b2b',
    name: 'HANDS & HEAD B2B Master Hub',
    title: B2B_DEFAULT_META.title,
    description: B2B_DEFAULT_META.description,
    keywords: B2B_DEFAULT_META.keywords,
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/`,
    image: DEFAULT_OG_IMAGE,
  },
  rmg: {
    id: 'rmg',
    hash: '#rmg',
    name: 'RMG & Heavyweight Streetwear Wing',
    title: 'RMG Heavyweight Streetwear Manufacturer Bangladesh (240–300 GSM) | HANDS & HEAD × RAWx',
    description:
      'Direct-from-source Dhaka RMG manufacturer of 240–300 GSM combed cotton boxy tees, double-layer collars, 420 GSM French terry hoodies, polos, and shirts. MOQ 120 pcs/style (40/color), 7–12d sampling.',
    keywords: 'Heavyweight Streetwear Manufacturer Bangladesh, 300 GSM Boxy Tee Dhaka, Low MOQ RMG Factory, Double Layer Collar Tee OEM',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/rmg`,
    image: `${B2B_CANONICAL_ORIGIN}/300%20GSM%20Ultra-Heavyweight%20Vintage%20Boxy%20Blank%20Tee.jpg`,
  },
  leather: {
    id: 'leather',
    hash: '#leather',
    name: 'Full-Grain & Distressed Leather Wing',
    title: 'Genuine Distressed & Full-Grain Leather Manufacturer Bangladesh | RAWx × Arutemika',
    description:
      'Savar CETP & LWG-audited full-grain cowhide, aniline lambskin, bespoke distressed leather jackets, leather pants, weekender bags & Goodyear boots. 7–12d prototyping, 3–4d DHL hide swatches.',
    keywords: 'Full-Grain Leather Manufacturer Bangladesh, Savar Tannery Leather Goods, Bespoke Leather Bags OEM, Arutemika Leather',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/leather`,
    image: `${B2B_CANONICAL_ORIGIN}/5.%20leather.handsandhead.com%20(Hide%20Registry).jpg`,
  },
  jacket: {
    id: 'jacket',
    hash: '#jacket',
    name: 'RAWx Custom Leather Jackets & Outerwear',
    title: 'Custom Leather Jacket & Heavy Outerwear Manufacturer Bangladesh | RAWx Atelier',
    description:
      'Bespoke vintage-distressed & stealth matte technical leather bomber jackets, cropped moto coats, waxed leather pants, and selvedge denim outerwear crafted in Dhaka.',
    keywords: 'Custom Leather Jacket Manufacturer Bangladesh, Vintage Distressed Leather Jacket OEM, RAWx Bomber Jacket, Moto Leather Jacket Factory',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/jacket`,
    image: DEFAULT_OG_IMAGE,
  },
  hardware: {
    id: 'hardware',
    hash: '#hardware',
    name: '316L / 516SS Surgical Hardware & CNC Trims',
    title: 'Custom 316L / 516SS Surgical Stainless Steel Hardware & CNC Trims | HANDS & HEAD',
    description:
      'Precision CNC-milled (±0.05mm) 316L/516SS surgical stainless clasps, heavy #8/#10 zippers, forged solid brass shackles, PVD obsidian & brushed gold logo trims.',
    keywords: '316L Stainless Steel Clasp Manufacturer, 516SS Hardware Trims, CNC Milled Leather Hardware, Custom PVD Zippers',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/hardware`,
    image: `${B2B_CANONICAL_ORIGIN}/Arutemika%20Full-Grain%20Braided%20Cowhide%20Bracelet%20(316L%20Stainless%20Steel%20Clasp).jpg`,
  },
  bracelets: {
    id: 'bracelets',
    hash: '#bracelets',
    name: 'Leather Cuffs & Artisan Metalwork',
    title: 'Braided Leather Cuffs & 316L Stainless Clasp Bracelets OEM | HANDS & HEAD',
    description:
      'Artisan 8-strand braided calfskin and bridle leather cuffs fitted with custom laser-engraved 316L surgical stainless magnetic locks and screw shackles.',
    keywords: 'Braided Leather Bracelet Manufacturer, 316L Clasp Leather Cuff OEM, Mens Leather Accessories Wholesale Dhaka',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#bracelets`,
    image: `${B2B_CANONICAL_ORIGIN}/6.%20bracelets.handsandhead.com%20(Leather%20Cuffs%20&%20Hardware).jpg`,
  },
  harness: {
    id: 'harness',
    hash: '#harness',
    name: 'Tactical Leather Harness Systems',
    title: 'Heavy Latigo Leather Harness & Tactical Saddlery OEM | HANDS & HEAD',
    description:
      'Structural vegetable-tanned latigo leather harness straps, load-bearing suspenders, and custom heavy-hardware industrial leather systems.',
    keywords: 'Leather Harness Manufacturer, Heavy Latigo Leather Gear OEM, Tactical Leather Straps Bangladesh',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#harness`,
    image: `${B2B_CANONICAL_ORIGIN}/11.%20harness.handsandhead.com%20(Tactical%20&%20Heavy%20Gear).jpg`,
  },
  jute: {
    id: 'jute',
    hash: '#jute',
    name: 'Golden Jute & Biodegradable Eco Packaging',
    title: 'Golden Jute Sacks & Biodegradable Eco Packaging Manufacturer | HANDS & HEAD',
    description:
      '100% biodegradable hydrocarbon-free Grade-A Bengal golden jute burlap sacks, retail totes, and sustainable export packaging.',
    keywords: 'Golden Jute Manufacturer Bangladesh, Hydrocarbon Free Jute Coffee Sacks, Biodegradable Eco Packaging Wholesale',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#jute`,
    image: `${B2B_CANONICAL_ORIGIN}/8.%20jute.handsandhead.com%20(Golden%20Jute%20&%20Eco).jpg`,
  },
  textile: {
    id: 'textile',
    hash: '#textile',
    name: 'Home Textiles & Hotel Linens',
    title: '650 GSM Luxury Hotel Towels & Home Textiles Manufacturer | HANDS & HEAD',
    description:
      '650+ GSM zero-twist combed cotton hospitality bath towels, 400TC long-staple sateen bedding, and institutional textile manufacturing from Bangladesh.',
    keywords: '650 GSM Hotel Towel Manufacturer Bangladesh, Zero Twist Terry Towel Export, Hospitality Linens Wholesale',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#textile`,
    image: `${B2B_CANONICAL_ORIGIN}/9.%20textile.handsandhead.com%20(Home%20Textiles).jpg`,
  },
  lingerie: {
    id: 'lingerie',
    hash: '#lingerie',
    name: 'Intimates, Seamless & Activewear',
    title: 'Santoni Seamless Intimates & Performance Activewear OEM | HANDS & HEAD',
    description:
      'Santoni seamless knitwear, high-compression 4-way stretch athletic sets, and moisture-wicking performance activewear manufactured in Dhaka.',
    keywords: 'Seamless Activewear Manufacturer Bangladesh, Santoni Knit Intimates OEM, Performance Gym Apparel Wholesale',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#lingerie`,
    image: `${B2B_CANONICAL_ORIGIN}/10.%20lingerie.handsandhead.com%20(Intimates%20&%20Seamless).jpg`,
  },
  rawx: {
    id: 'rawx',
    hash: '#rawx',
    name: 'RAWx Flagship Apparel & Outerwear',
    title: 'RAWx Apparel & Stealth Leather Outerwear | HANDS & HEAD Flagship Label',
    description:
      'High-contrast architectural streetwear, 300 GSM boxy blanks, stealth matte full-grain leather bombers, and 13.5 oz raw selvedge denim by RAWx.',
    keywords: 'RAWx Apparel, RAWx Leather Bomber, Heavyweight Streetwear Brand, Selvedge Denim Bangladesh',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#rawx`,
    image: DEFAULT_OG_IMAGE,
  },
  arutemika: {
    id: 'arutemika',
    hash: '#arutemika',
    name: 'Arutemika Japan & Global Leather Atelier',
    title: 'Arutemika Leather Atelier | Goodyear Welted Boots & Calfskin Bags — HANDS & HEAD',
    description:
      'Hand-lasted 360° Goodyear welted boots, origami calfskin shoulder totes, and full-grain vegetable-tanned briefcases engineered to Tokyo JIS retail standards.',
    keywords: 'Arutemika Leather Atelier, Goodyear Welted Boots Bangladesh, Origami Calfskin Tote, Japan Wholesale Leathercraft',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#arutemika`,
    image: `${B2B_CANONICAL_ORIGIN}/12.%20arutemika.com%20(Japan%20Wholesale%20Atelier)%20.jpg`,
  },
  d2c: {
    id: 'd2c',
    hash: '#d2c',
    name: 'D2C Drops & Rapid Wholesale Blanks',
    title: 'D2C Drops & Ready-to-Ship Heavyweight Blanks | HANDS & HEAD × RAWx',
    description:
      'Immediate stock allocation of 260–300 GSM print-ready streetwear blanks, selvedge denim capsules, and 5–10 day fast private-label relabeling (MOQ 40–120 pcs).',
    keywords: 'Ready Stock Heavyweight Blanks, Rapid Wholesale Streetwear, Private Label Relabeling Dhaka, D2C Drops',
    canonicalUrl: `${B2B_CANONICAL_ORIGIN}/d2c`,
    image: `${B2B_CANONICAL_ORIGIN}/3.%20shop.handsandhead.com%20(D2C%20&%20Rapid%20Wholesale).jpg`,
  },
  denim: {
    id: 'denim',
    hash: '#denim',
    name: 'Selvedge Denim & Wash Lab',
    title: 'Shuttle-Loom Raw Selvedge Denim & Wash House OEM | HANDS & HEAD × RAWx',
    description:
      '13.5–14.5 oz shuttle-loom redline raw indigo selvedge jeans and chore jackets with ozone, laser, and mineral enzyme wash finishing.',
    keywords: 'Raw Selvedge Denim Manufacturer Bangladesh, Shuttle Loom Redline Jeans OEM, Denim Wash House Dhaka',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#denim`,
    image: `${B2B_CANONICAL_ORIGIN}/RAWx%2013.5%20oz%20Raw%20Indigo%20Selvedge%20Denim%20Heritage%205-Pocket%20Jeans%201.jpg`,
  },
  freight: {
    id: 'freight',
    hash: '#freight',
    name: 'Chattogram & DAC Export Freight Desk',
    title: 'Chattogram FOB Sea Freight & DAC Air Cargo Trade Desk | HANDS & HEAD',
    description:
      'Direct FOB Chattogram ocean consolidation, DAC express air cargo, 50% B/L escrow terms, and irrevocable L/C export clearance.',
    keywords: 'Chattogram FOB Shipping, Bangladesh Apparel Export Freight, 50 Percent BL Escrow, DAC Air Cargo',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#freight`,
    image: `${B2B_CANONICAL_ORIGIN}/2.%20handsandhead.com%20(The%20Hub).jpg`,
  },
  swatch: {
    id: 'swatch',
    hash: '#swatch',
    name: 'Global DHL Express Swatch & Sample Program',
    title: 'Order 3–4 Day Worldwide DHL Express Swatch Kits | HANDS & HEAD B2B',
    description:
      'Book physical 240–300 GSM combed cotton swatches, Savar full-grain leather hide cards, and 316L PVD hardware boxes dispatched worldwide via DHL Express in 3–4 days.',
    keywords: 'Garment Swatch Kit DHL Express, Leather Hide Swatches Bangladesh, 316L Hardware Sample Box, Fast Fashion Sampling',
    canonicalUrl: `${ECOSYSTEM_HOME_URL}/#swatch`,
    image: `${B2B_CANONICAL_ORIGIN}/300%20GSM%20Ultra-Heavyweight%20Vintage%20Boxy%20Blank%20Tee.jpg`,
  },
};

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function normalizeSectionKey(raw?: string | null): string {
  if (!raw) return '';
  return raw.replace(/^#/, '').trim().toLowerCase();
}

/**
 * Lightweight, zero-dependency Document Head Manager for HANDS & HEAD.
 * Dynamically updates <title>, description, keywords, canonical, OpenGraph,
 * and Twitter Card metadata across HOME / APPS / SLIDERS tabs, all 24 hash sections
 * (#studio, #rmg, #leather, #jacket, #bloom, #aural, #skyhara, etc.), and B2B wing paths.
 */
export function useSeoHead(options: UseSeoHeadOptions = {}): void {
  const {
    activeTab,
    activeSection,
    currentPath = '/',
    activeWing = null,
    activeView,
    titleOverride,
    descriptionOverride,
    canonicalOverride,
    imageOverride,
  } = options;

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const applyHeadMetadata = () => {
      const cleanPath = (currentPath || window.location.pathname || '/').split('?')[0];
      const hashKey = normalizeSectionKey(activeSection || window.location.hash);
      const isMainHubHost =
        window.location.hostname === 'handsandhead.com' ||
        window.location.hostname === 'www.handsandhead.com';

      const baseMeta = isMainHubHost ? HUB_DEFAULT_META : B2B_DEFAULT_META;

      let resolvedTitle = baseMeta.title;
      let resolvedDescription = baseMeta.description;
      let resolvedKeywords = baseMeta.keywords;
      let resolvedCanonical = isMainHubHost
        ? `${ECOSYSTEM_HOME_URL}${cleanPath === '/' ? '/' : cleanPath}`
        : `${B2B_CANONICAL_ORIGIN}${cleanPath === '/' ? '/' : cleanPath}`;
      let resolvedImage = baseMeta.image;

      // 1. Check explicit 24-module hash/section key (#studio, #jacket, #leather, #rmg, #bloom, etc.)
      if (hashKey && ECOSYSTEM_SEO_MODULES[hashKey]) {
        const mod = ECOSYSTEM_SEO_MODULES[hashKey];
        resolvedTitle = mod.title;
        resolvedDescription = mod.description;
        resolvedKeywords = mod.keywords;
        resolvedCanonical = mod.canonicalUrl;
        resolvedImage = mod.image;
      } else if (activeWing && WINGS_BY_ID[activeWing]) {
        // 2. Check active B2B Wing route (/rmg, /leather, /jacket, /hardware, /d2c, /admin)
        const wing = WINGS_BY_ID[activeWing];
        const pathModuleKey = cleanPath.replace(/^\/+/, '').split('/')[0].toLowerCase();
        if (pathModuleKey === 'jacket' && ECOSYSTEM_SEO_MODULES.jacket) {
          resolvedTitle = ECOSYSTEM_SEO_MODULES.jacket.title;
          resolvedDescription = ECOSYSTEM_SEO_MODULES.jacket.description;
          resolvedKeywords = ECOSYSTEM_SEO_MODULES.jacket.keywords;
          resolvedCanonical = `${B2B_CANONICAL_ORIGIN}/jacket`;
          resolvedImage = ECOSYSTEM_SEO_MODULES.jacket.image;
        } else {
          resolvedTitle = wing.seoTitle;
          resolvedDescription = wing.seoDescription;
          resolvedCanonical = `${B2B_CANONICAL_ORIGIN}${wing.path}`;
          resolvedImage = `${B2B_CANONICAL_ORIGIN}${encodeURI(wing.heroImage)}`;
        }
      } else if (cleanPath.startsWith('/catalog')) {
        resolvedTitle = 'Wholesale Export Catalog (RMG, Leather & 316L Hardware) | HANDS & HEAD × RAWx';
        resolvedDescription =
          'Browse verified Dhaka factory-direct wholesale SKUs across 240–300 GSM heavyweight streetwear, bespoke full-grain leather jackets & bags, and 316L surgical stainless hardware.';
        resolvedCanonical = `${B2B_CANONICAL_ORIGIN}${cleanPath}`;
      } else if (!isMainHubHost && activeView === 'suppliers') {
        resolvedTitle = '3,105+ Verified Dhaka Export Factories & Tanneries | HANDS & HEAD B2B';
        resolvedDescription =
          'Direct factory directory of OEKO-TEX 100, GOTS, BGMEA, and Savar CETP / LWG Gold audited Bangladesh apparel, leather, and hardware manufacturers.';
      } else if (!isMainHubHost && activeView === 'customers') {
        resolvedTitle = 'Global Buyer Corridors (USA, KSA, Bahrain, EU & Japan) | HANDS & HEAD B2B';
        resolvedDescription =
          'Verified international buyer demand, FOB Chattogram & DAC air cargo corridors, and 3–4 day DHL Express swatch fulfillment across 15,420+ trade accounts.';
      } else if (!isMainHubHost && activeView === 'insights') {
        resolvedTitle = 'Bangladesh Apparel & Leather Export Trade Telemetry | HANDS & HEAD B2B';
        resolvedDescription =
          'Real-time Dhaka manufacturing telemetry, FOB pricing ladders, lead times, and compliance analytics across RMG, leathercraft, and surgical steel hardware.';
      } else if (activeTab && TAB_META_MAP[activeTab]) {
        // 3. Check top-level hub tab mode (HOME / APPS / SLIDERS)
        const tabMeta = TAB_META_MAP[activeTab];
        resolvedTitle = tabMeta.title;
        resolvedDescription = tabMeta.description;
        resolvedCanonical =
          activeTab === 'HOME'
            ? `${ECOSYSTEM_HOME_URL}/`
            : `${ECOSYSTEM_HOME_URL}/${tabMeta.hash}`;
      } else if (hashKey === 'home' || hashKey === 'apps' || hashKey === 'sliders') {
        const mappedTab = hashKey.toUpperCase() as SeoTabMode;
        const tabMeta = TAB_META_MAP[mappedTab];
        resolvedTitle = tabMeta.title;
        resolvedDescription = tabMeta.description;
        resolvedCanonical =
          mappedTab === 'HOME'
            ? `${ECOSYSTEM_HOME_URL}/`
            : `${ECOSYSTEM_HOME_URL}/${tabMeta.hash}`;
      }

      if (titleOverride) resolvedTitle = titleOverride;
      if (descriptionOverride) resolvedDescription = descriptionOverride;
      if (canonicalOverride) resolvedCanonical = canonicalOverride;
      if (imageOverride) resolvedImage = imageOverride;

      document.title = resolvedTitle;
      upsertMeta('name', 'title', resolvedTitle);
      upsertMeta('name', 'description', resolvedDescription);
      upsertMeta('name', 'keywords', resolvedKeywords);
      upsertCanonical(resolvedCanonical);

      // OpenGraph synchronization
      upsertMeta('property', 'og:title', resolvedTitle);
      upsertMeta('property', 'og:description', resolvedDescription);
      upsertMeta('property', 'og:url', resolvedCanonical);
      upsertMeta('property', 'og:image', resolvedImage);

      // Twitter / X synchronization
      upsertMeta('name', 'twitter:title', resolvedTitle);
      upsertMeta('name', 'twitter:description', resolvedDescription);
      upsertMeta('name', 'twitter:image', resolvedImage);
    };

    applyHeadMetadata();
    window.addEventListener('hashchange', applyHeadMetadata);
    return () => window.removeEventListener('hashchange', applyHeadMetadata);
  }, [
    activeTab,
    activeSection,
    currentPath,
    activeWing,
    activeView,
    titleOverride,
    descriptionOverride,
    canonicalOverride,
    imageOverride,
  ]);
}

export default useSeoHead;
