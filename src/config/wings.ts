import { CategoryId } from '../types';

export type WingId = 'rmg' | 'leather' | 'hardware' | 'd2c' | 'admin';

export interface WingSpecMetric {
  label: string;
  value: string;
  detail: string;
}

export interface WingShowcaseItem {
  sku: string;
  title: string;
  specSummary: string;
  moqLabel: string;
  fobRange: string;
  leadTime: string;
  image: string;
  badge?: string;
}

export interface WingCapability {
  title: string;
  specs: string[];
}

export interface WingConfig {
  id: WingId;
  path: string;
  aliases: string[];
  navLabel: string;
  shortLabel: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  attributionTag: string;
  accentTone: 'crimson' | 'gold';
  heroImage: string;
  divisionSlugs: string[];
  categoryIds: CategoryId[];
  searchKeywords: string[];
  trustMetrics: WingSpecMetric[];
  capabilities: WingCapability[];
  showcaseItems: WingShowcaseItem[];
  defaultQuotePrompt: string;
  defaultSamplePrompt: string;
}

export const WHATSAPP_NUMBER = '8801974518600';
export const WHATSAPP_DISPLAY = '+880 1974-518600';
export const ECOSYSTEM_HOME_URL = 'https://handsandhead.com';
export const B2B_CANONICAL_ORIGIN = 'https://b2b.handsandhead.com';

export const SWATCH_PACK_TAG = '[Via B2B - Swatch Pack]';

export const WING_ATTRIBUTION_TAGS: Record<WingId | 'swatch', string> = {
  rmg: '[Via B2B - RMG Wing]',
  leather: '[Via B2B - Leather & Jacket Wing]',
  hardware: '[Via B2B - Hardware Wing]',
  d2c: '[Via B2B - D2C Wing]',
  admin: '[Via B2B - NexOS Admin Wing]',
  swatch: SWATCH_PACK_TAG,
};

export interface WhatsAppAttributionOptions {
  wing: WingId | 'swatch';
  intent: 'quote' | 'sample' | 'swatch' | 'sku' | 'admin';
  productTitle?: string;
  sku?: string;
  quantity?: number;
  notes?: string;
  destination?: string;
}

/**
 * Generates wing-attributed pre-filled WhatsApp lead URLs pointing to +8801974518600.
 * Every CTA carries an explicit entry-point tag for instant commercial routing.
 */
export function buildWhatsAppUrl(options: WhatsAppAttributionOptions): string {
  const { wing, intent, productTitle, sku, quantity, notes, destination } = options;
  const tag =
    intent === 'swatch' ? SWATCH_PACK_TAG : WING_ATTRIBUTION_TAGS[wing] || WING_ATTRIBUTION_TAGS.rmg;

  const lines: string[] = [tag];

  if (intent === 'swatch') {
    lines.push(
      'Hello HANDS & HEAD × RAWx Export Desk — I would like to book a DHL Express Swatch Kit (3–4 days worldwide).'
    );
    if (wing !== 'swatch') {
      lines.push(`Primary Wing Focus: ${WINGS_BY_ID[wing]?.navLabel || wing.toUpperCase()}`);
    }
    lines.push('Target Market (USA / KSA / Bahrain / EU): ' + (destination || '[Specify Country]'));
  } else if (intent === 'sample') {
    lines.push(
      `Hello HANDS & HEAD × RAWx — I would like to order a Sample Pack (${
        wing !== 'swatch' ? WINGS_BY_ID[wing]?.navLabel : 'Multi-Wing'
      }).`
    );
    if (productTitle) lines.push(`Style / Reference: ${productTitle}`);
    if (sku) lines.push(`SKU: ${sku}`);
    lines.push('Expected Sampling Window: 7–12 days | DHL Express Dispatch: 3–4 days');
  } else if (intent === 'sku') {
    lines.push('Hello HANDS & HEAD × RAWx — Requesting factory-direct FOB quotation:');
    if (productTitle) lines.push(`Product: ${productTitle}`);
    if (sku) lines.push(`SKU: ${sku}`);
    if (quantity) lines.push(`Target Quantity: ${quantity} pcs`);
    if (notes) lines.push(`Notes: ${notes}`);
  } else if (intent === 'admin') {
    lines.push(
      'Hello NexOS Operations Desk — Connecting regarding supplier onboarding, production scheduling, or active PO tracking.'
    );
  } else {
    const wingObj = wing !== 'swatch' ? WINGS_BY_ID[wing] : undefined;
    lines.push(
      wingObj?.defaultQuotePrompt ||
        'Hello HANDS & HEAD × RAWx — I would like to request a factory-direct B2B production quote.'
    );
    if (productTitle) lines.push(`Reference Style: ${productTitle}`);
    if (sku) lines.push(`SKU: ${sku}`);
    if (quantity) lines.push(`Estimated Qty: ${quantity} pcs`);
  }

  if (notes && intent !== 'sku') {
    lines.push(`Specs / Notes: ${notes}`);
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export const GLOBAL_TRUST_GUARANTEES: WingSpecMetric[] = [
  {
    label: 'Low MOQ Program',
    value: '120 pcs / style',
    detail: '40 pcs per color · Mixed size ratios',
  },
  {
    label: 'Sampling Timeline',
    value: '7–12 Days',
    detail: 'Dhaka in-house pattern & CAD team',
  },
  {
    label: 'DHL Express Swatches',
    value: '3–4 Days Global',
    detail: 'Direct lanes to USA · KSA · Bahrain · EU',
  },
  {
    label: 'Dhaka Source QC',
    value: '4-Point AQL 1.5',
    detail: 'Zero middlemen · Direct factory inspection',
  },
];

export const B2B_WINGS: WingConfig[] = [
  {
    id: 'rmg',
    path: '/rmg',
    aliases: ['/rmg', '/streetwear', '/knits'],
    navLabel: 'RMG Streetwear',
    shortLabel: 'RMG',
    seoTitle: 'RMG Heavyweight Streetwear Manufacturer Bangladesh (240–300 GSM) | HANDS & HEAD × RAWx',
    seoDescription:
      'Dhaka direct heavyweight streetwear manufacturer: 240–300 GSM combed cotton boxy tees, double-layer collars, polos, casual & formal shirts. MOQ 120 pcs/style (40 pcs/color), 7–12 day sampling, 3–4 day DHL swatches.',
    eyebrow: 'WING 01 · DHAKA DIRECT RMG & HEAVYWEIGHT KNITS',
    h1: 'Heavyweight Streetwear, Polos & Woven Shirts — Direct From Dhaka',
    subtitle:
      '240–300 GSM combed ring-spun cotton, architectural boxy fits, double-layer 2×2 ribbed collars, pigment/acid mineral washes, and formal/casual woven shirts built for USA, KSA, Bahrain, and EU labels.',
    attributionTag: '[Via B2B - RMG Wing]',
    accentTone: 'crimson',
    heroImage: '/300 GSM Ultra-Heavyweight Vintage Boxy Blank Tee.jpg',
    divisionSlugs: ['rmg-knits', 'commercial-blanks', 'heavy-outerwear'],
    categoryIds: ['rmg-apparel'],
    searchKeywords: ['gsm', 'tee', 'cotton', 'hoodie', 'polo', 'shirt', 'sweatshirt', 'jersey', 'terry', 'boxy'],
    trustMetrics: [
      { label: 'Production MOQ', value: '120 pcs/style', detail: '40 pcs/color across S–XXL' },
      { label: 'Proto & Fit Sample', value: '7–12 Days', detail: 'Custom Pantone TCX lab dips' },
      { label: 'DHL Swatch Dispatch', value: '3–4 Days', detail: 'Worldwide air courier from DAC' },
      { label: 'Fabric Weights', value: '240–420 GSM', detail: 'Combed jersey & French terry' },
    ],
    capabilities: [
      {
        title: 'Heavyweight Streetwear Knits',
        specs: [
          '240 / 260 / 280 / 300 GSM 100% combed compact cotton jersey',
          '380–460 GSM loopback French terry & brushed fleece hoodies',
          'Double-layer 1.2" high-recovery Lycra neck ribs & drop-shoulder blocks',
          'Enzyme stone wash, sun-faded acid wash, pigment & ombre dip-dyeing',
        ],
      },
      {
        title: 'Polos, Casual & Formal Wovens',
        specs: [
          '220–260 GSM mercerized pique & knit-collar executive polos',
          'Oxford, poplin, twill & handspun Khadi casual/formal overshirts',
          'Custom high-density puff print, chainstitch embroidery & woven labels',
          'OEKO-TEX 100, GOTS organic & Tokyo JIS shrinkage tolerance (<3%)',
        ],
      },
      {
        title: 'Export Compliance & QC Protocol',
        specs: [
          'Dhaka direct-from-source 4-point fabric & inline stitch inspection',
          '50% deposit / 50% B/L escrow or irrevocable L/C at sight',
          'Chattogram FOB ocean freight & DAC Express air cargo lanes',
          'Pre-packed polybags, hangtags, barcode stickers & retail cartons',
        ],
      },
    ],
    showcaseItems: [
      {
        sku: 'RAWX-RMG-300BX',
        title: '300 GSM Ultra-Heavyweight Vintage Boxy Blank Tee',
        specSummary: '100% Combed Cotton · Double-Layer Collar · Drop-Shoulder Cut',
        moqLabel: 'MOQ 120 pcs (40/color)',
        fobRange: '$3.85 – $5.40 FOB',
        leadTime: '7–12d Sample · 22d Bulk',
        image: '/300 GSM Ultra-Heavyweight Vintage Boxy Blank Tee.jpg',
        badge: '300 GSM Flagship',
      },
      {
        sku: 'RAWX-RMG-420HD',
        title: '420 GSM French Terry Zip Hoodie with Anti-Brass Hardware',
        specSummary: 'Heavy Loopback Terry · Boxy Streetwear Block · YKK Metal Zip',
        moqLabel: 'MOQ 120 pcs (40/color)',
        fobRange: '$9.80 – $13.50 FOB',
        leadTime: '9–12d Sample · 25d Bulk',
        image: '/420 GSM French Terry Cotton Zip Hoodie with YKK Anti-Brass Hardware 1.jpg',
        badge: '420 GSM Terry',
      },
      {
        sku: 'RAWX-RMG-280AC',
        title: 'Acid-Washed Vintage Charcoal Heavyweight Streetwear Tee',
        specSummary: '280 GSM Mineral Enzyme Wash · Twin-Needle Architectural Hem',
        moqLabel: 'MOQ 120 pcs (40/color)',
        fobRange: '$4.40 – $6.10 FOB',
        leadTime: '7–12d Sample · 24d Bulk',
        image: '/Acid-Washed Vintage Charcoal Heavyweight Skater Blank.jpg',
        badge: 'Mineral Wash',
      },
      {
        sku: 'RAWX-RMG-KHADI',
        title: 'Handspun Indigo Overshirt & Structured Casual Woven Program',
        specSummary: 'Breathable Long-Staple Cotton · Custom Horn/Metal Buttons',
        moqLabel: 'MOQ 120 pcs (40/color)',
        fobRange: '$6.90 – $9.40 FOB',
        leadTime: '8–12d Sample · 26d Bulk',
        image: '/Handspun Khadi Indigo Handloom Men’s Kurta & Casual Over-Shirt .jpg',
        badge: 'Woven Program',
      },
    ],
    defaultQuotePrompt:
      'Hello HANDS & HEAD × RAWx RMG Desk — I need a B2B quote for heavyweight streetwear / polos / shirts (240–300 GSM, MOQ 120 pcs/style).',
    defaultSamplePrompt:
      'Hello HANDS & HEAD × RAWx RMG Desk — I would like to order a heavyweight cotton Sample Pack (240–300 GSM boxy tees / hoodies).',
  },
  {
    id: 'leather',
    path: '/leather',
    aliases: ['/leather', '/jacket', '/jackets'],
    navLabel: 'Leather & Jacket',
    shortLabel: 'Leather',
    seoTitle: 'Custom Leather Jacket & Full-Grain Leather Goods Manufacturer Bangladesh | RAWx × Arutemika',
    seoDescription:
      'Bespoke vintage-distressed & full-grain leather jackets, leather pants, bags & modular leather goods manufactured in Dhaka & Savar (RAWx & Arutemika). Low MOQ, 7–12 day prototyping, 3–4 day DHL hide swatches.',
    eyebrow: 'WING 02 · RAWx × ARUTEMIKA BESPOKE LEATHER & OUTERWEAR ATELIER',
    h1: 'Bespoke Vintage-Distressed & Full-Grain Leather Jackets, Pants & Goods',
    subtitle:
      'Hand-selected Savar CETP & LWG-audited full-grain cowhide, aniline lambskin, and distressed pull-up hides cut and finished by RAWx & Arutemika master leathercraft ateliers in Dhaka.',
    attributionTag: '[Via B2B - Leather & Jacket Wing]',
    accentTone: 'gold',
    heroImage: '/RAWx Atelier Stealth Matte Technical Leather Minimalist Bomber Jacket  1.jpg',
    divisionSlugs: ['flagship-leather', 'tannery-hides', 'leather-harness', 'heavy-outerwear'],
    categoryIds: ['leather-footwear'],
    searchKeywords: ['leather', 'jacket', 'bomber', 'cowhide', 'boot', 'bag', 'tote', 'duffle', 'briefcase', 'wallet'],
    trustMetrics: [
      { label: 'Capsule & Bulk MOQ', value: '120 pcs/style', detail: '40 pcs/color · Leather capsules negotiable' },
      { label: 'Bespoke Prototype', value: '7–12 Days', detail: 'Custom patterns, grading & distressing' },
      { label: 'DHL Hide Swatch Kit', value: '3–4 Days', detail: 'Physical leather hides & lining cards' },
      { label: 'Tannery Provenance', value: 'LWG & CETP', detail: 'Full-grain cowhide, calfskin & lambskin' },
    ],
    capabilities: [
      {
        title: 'Leather Jackets & Pants (RAWx Atelier)',
        specs: [
          '1.0–1.4mm full-grain lambskin, oily pull-up & vintage-distressed cowhide',
          'Moto bombers, cropped boxy leather jackets, racing coats & waxed leather pants',
          'Hand-rubbed wax patina, crackle distress, matte technical & drum-dyed finishes',
          'Custom jacquard / cupro / quilted satin linings with heavy-gauge metal zippers',
        ],
      },
      {
        title: 'Modular Leather Bags & Footwear (Arutemika)',
        specs: [
          'Vegetable-tanned full-grain weekender duffles, executive briefcases & origami totes',
          '360° Goodyear welted boots, Derby shoes & full-grain calfskin low-top sneakers',
          'Hand-burnished beeswax edges, reinforced saddlery stitching & debossed branding',
          'Japan retail JIS inspection tolerances & moisture-controlled export packaging',
        ],
      },
      {
        title: 'Dhaka Direct Tannery & QC Advantage',
        specs: [
          'Direct Savar tannery leather selection — zero broker markup',
          'Thickness calibration, rub-fastness & tensile strength lab verification',
          'Custom embossed leather patches, dust bags & rigid gift-box export packing',
          'Air express courier for boutique drops or temperature-safe sea containers',
        ],
      },
    ],
    showcaseItems: [
      {
        sku: 'RAWX-JKT-STEALTH01',
        title: 'RAWx Stealth Matte Technical Full-Grain Leather Bomber Jacket',
        specSummary: '1.2mm Drum-Dyed Calfskin · Custom Matte Metal Zip · Cropped Architectural Fit',
        moqLabel: 'MOQ 40 pcs/color · 120/style',
        fobRange: '$68.00 – $98.00 FOB',
        leadTime: '10–12d Sample · 28d Bulk',
        image: '/RAWx Atelier Stealth Matte Technical Leather Minimalist Bomber Jacket  1.jpg',
        badge: 'RAWx Outerwear',
      },
      {
        sku: 'ARTM-BAG-ORIGAMI',
        title: 'ARUTEMIKA Origami Triangle Slouch Calfskin Leather Shoulder Tote',
        specSummary: 'Full-Grain Supple Calfskin · Modular Fold Architecture · Suede Lining',
        moqLabel: 'MOQ 40 pcs/color · 120/style',
        fobRange: '$34.00 – $48.00 FOB',
        leadTime: '8–12d Sample · 26d Bulk',
        image: '/ARUTEMIKA Origami Triangle Slouch Bovine Calfskin Leather Shoulder Tote Bag 1.jpg',
        badge: 'Arutemika Atelier',
      },
      {
        sku: 'ARTM-DUF-VEGTAN',
        title: 'Full-Grain Vegetable-Tanned Cowhide Weekender Duffle Bag',
        specSummary: '1.8mm Veg-Tan Pull-Up Hide · Solid Brass / 316L Hardware · Reinforced Base',
        moqLabel: 'MOQ 40 pcs/color · 120/style',
        fobRange: '$46.00 – $64.00 FOB',
        leadTime: '9–12d Sample · 28d Bulk',
        image: '/Arutemika Full-Grain Vegetable-Tanned Cowhide Weekender Duffle.jpg',
        badge: 'Veg-Tan Flagship',
      },
      {
        sku: 'ARTM-BOOT-GYW01',
        title: 'LWG Gold Full-Grain Cowhide Goodyear Welted Heritage Boots',
        specSummary: '360° Goodyear Storm Welt · Cork Footbed · Hand-Lasted Savar Hide',
        moqLabel: 'MOQ 40 pairs/color · 120/style',
        fobRange: '$32.00 – $44.00 FOB',
        leadTime: '10–12d Sample · 32d Bulk',
        image: '/LWG Gold Certified Full Grain Cowhide Leather Goodyear Welted Boots 1.jpg',
        badge: 'Goodyear Welt',
      },
    ],
    defaultQuotePrompt:
      'Hello HANDS & HEAD × RAWx Leather Desk — I need a B2B quote for custom leather jackets / leather goods (RAWx & Arutemika).',
    defaultSamplePrompt:
      'Hello HANDS & HEAD × RAWx Leather Desk — I would like to order a Leather Jacket / Leather Goods Sample Pack and hide swatches.',
  },
  {
    id: 'hardware',
    path: '/hardware',
    aliases: ['/hardware', '/trims', '/metalwork'],
    navLabel: '316L Hardware',
    shortLabel: 'Hardware',
    seoTitle: 'Custom 316L / 516SS Surgical Stainless Steel Hardware & CNC Trims | HANDS & HEAD × RAWx',
    seoDescription:
      'Custom 316L and 516SS surgical-grade stainless steel clasps, heavy zippers, solid brass shackles & CNC-milled apparel/leather trims. Low MOQ, laser logo engraving & PVD finishes.',
    eyebrow: 'WING 03 · 316L / 516SS SURGICAL STEEL & CNC-MILLED TRIMS',
    h1: 'Custom 316L / 516SS Surgical Stainless Steel Clasps, Zippers & CNC Trims',
    subtitle:
      'Precision CNC-milled clasps, magnetic locks, heavy-gauge metal zippers, solid brass shackles, and PVD matte-obsidian or brushed gold brand trims engineered for luxury leatherwear and streetwear.',
    attributionTag: '[Via B2B - Hardware Wing]',
    accentTone: 'gold',
    heroImage: '/Arutemika Full-Grain Braided Cowhide Bracelet (316L Stainless Steel Clasp).jpg',
    divisionSlugs: ['leather-cuffs', 'leather-harness'],
    categoryIds: ['leather-footwear', 'handicrafts-brass'],
    searchKeywords: ['316l', 'stainless', 'clasp', 'bracelet', 'cuff', 'brass', 'buckle', 'shackle', 'zipper', 'hardware', 'belt'],
    trustMetrics: [
      { label: 'Trim & Cuff MOQ', value: '120 pcs/style', detail: '40 pcs/finish · Custom logo engraving' },
      { label: 'CNC Tooling & Sample', value: '7–12 Days', detail: '3D STEP CAD to physical prototype' },
      { label: 'DHL Finish Swatch Box', value: '3–4 Days', detail: 'PVD Black · Brushed Gold · Raw 316L' },
      { label: 'Metallurgy Spec', value: '316L / 516SS', detail: 'Salt-spray & REACH nickel-free tested' },
    ],
    capabilities: [
      {
        title: 'Surgical Stainless Steel (316L & 516SS)',
        specs: [
          'Marine & hypoallergenic 316L / 516SS CNC-milled clasps, magnetic locks & shackles',
          'Zero-tarnish PVD Matte Obsidian, Brushed Gold, Gunmetal & Mirror Steel plating',
          'Precision laser logo engraving, micro-debossing & serialized batch numbering',
          '72-hour salt-spray corrosion certification & EU REACH nickel-release compliance',
        ],
      },
      {
        title: 'Zippers, Buckles & Structural Apparel Trims',
        specs: [
          'Heavy #8 & #10 metal tooth zippers with custom-cast brand pullers',
          'Solid forged brass carabiners, D-rings, roller buckles & #9 copper burr rivets',
          'Snap fasteners, hoodie cord tips, metal bar logos & grommets',
          'Integrated BOM kitting — delivered pre-matched with your RMG or Leather bulk order',
        ],
      },
      {
        title: 'Direct Engineering & Quality Assurance',
        specs: [
          'Tolerance checks to ±0.05mm on every CNC clasp and magnetic housing',
          'Pull-strength & hinge-cycle endurance testing before Dhaka dispatch',
          'Low-cost custom mold amortization for repeat seasonal collections',
          'Anti-scratch individual poly-sleeve packaging for zero transit abrasion',
        ],
      },
    ],
    showcaseItems: [
      {
        sku: 'RAWX-HW-316MAG',
        title: '316L Surgical Steel Magnetic Clasp & 8-Strand Leather Cuff System',
        specSummary: 'CNC-Milled 316L Clasp · Laser Logo Engraving · PVD Black / Steel',
        moqLabel: 'MOQ 120 pcs (40/finish)',
        fobRange: '$3.80 – $5.90 FOB',
        leadTime: '7–10d Sample · 18d Bulk',
        image: '/Arutemika Full-Grain Braided Cowhide Bracelet (316L Stainless Steel Clasp).jpg',
        badge: '316L Surgical',
      },
      {
        sku: 'RAWX-HW-SHACKLE',
        title: 'CNC 316L Stainless Screw Shackle & Bridle Leather Hardware Assembly',
        specSummary: 'Marine-Grade Screw Pin · Brushed Matte Finish · Custom Brand Stamp',
        moqLabel: 'MOQ 120 pcs (40/finish)',
        fobRange: '$4.20 – $6.40 FOB',
        leadTime: '7–12d Sample · 18d Bulk',
        image: '/Rapid Turnaround Edition • Bridle Leather Double-Wrap Cuff with CNC 316L Surgical Stainless Shackle.jpg',
        badge: 'CNC Milled',
      },
      {
        sku: 'RAWX-HW-CARABINER',
        title: 'Custom Debossed Solid Brass & 516SS Key Shackle Carabiner',
        specSummary: 'High-Tensile Spring Gate · Brushed Gold / Matte Obsidian PVD',
        moqLabel: 'MOQ 120 pcs (40/finish)',
        fobRange: '$2.10 – $3.90 FOB',
        leadTime: '7–10d Sample · 16d Bulk',
        image: '/Custom Debossed Solid Brass Key Shackle Carabiner.jpg',
        badge: 'Brushed Gold',
      },
      {
        sku: 'RAWX-HW-BUCKLE',
        title: 'Heavy Cast Solid Brass & Stainless Roller Buckle Belt Hardware',
        specSummary: '40mm Architectural Profile · Paired with Full-Grain Cowhide Straps',
        moqLabel: 'MOQ 120 pcs (40/finish)',
        fobRange: '$5.50 – $9.20 FOB',
        leadTime: '7–12d Sample · 20d Bulk',
        image: '/Full-Grain Cowhide Artisan Leather Belt (Solid Brass Buckle).jpg',
        badge: 'Heavy Trim',
      },
    ],
    defaultQuotePrompt:
      'Hello HANDS & HEAD Hardware Desk — I need a B2B quote for custom 316L/516SS stainless steel clasps, zippers, or CNC-milled trims.',
    defaultSamplePrompt:
      'Hello HANDS & HEAD Hardware Desk — I would like to order a 316L/516SS Hardware & PVD Finish Sample Pack.',
  },
  {
    id: 'd2c',
    path: '/d2c',
    aliases: ['/d2c', '/drops', '/shop'],
    navLabel: 'D2C Drops',
    shortLabel: 'D2C',
    seoTitle: 'Direct Capsule Drops & Rapid Wholesale Stock Lots | HANDS & HEAD × RAWx',
    seoDescription:
      'Ready-to-ship RAWx & Arutemika direct capsule drops, heavyweight print-ready blanks, selvedge denim & rapid wholesale stock lots dispatched directly from Dhaka.',
    eyebrow: 'WING 04 · DIRECT DROPS & RAPID WHOLESALE STOCK',
    h1: 'Direct Capsule Drops & Ready-to-Ship Wholesale Blanks',
    subtitle:
      'Immediate stock allocation from RAWx & Arutemika commercial runs — heavyweight blanks, 13.5 oz raw selvedge denim, calfskin sneakers, and small-batch retail capsules with rapid global dispatch.',
    attributionTag: '[Via B2B - D2C Wing]',
    accentTone: 'crimson',
    heroImage: '/RAWx 13.5 oz Raw Indigo Selvedge Denim Heritage 5-Pocket Jeans 1.jpg',
    divisionSlugs: ['commercial-blanks', 'flagship-leather', 'heavy-outerwear'],
    categoryIds: ['rmg-apparel', 'leather-footwear'],
    searchKeywords: ['rawx', 'blank', 'denim', 'sneaker', 'activewear', 'rapid', 'drop', 'arutemika'],
    trustMetrics: [
      { label: 'Ready Stock MOQ', value: '40–120 pcs', detail: 'Mixed sizes · Fast private-label relabeling' },
      { label: 'Relabel & Dispatch', value: '5–10 Days', detail: 'Neck print, woven tags & custom polybags' },
      { label: 'DHL Express Swatches', value: '3–4 Days', detail: 'Blank fit packs & color cards worldwide' },
      { label: 'Quality Standard', value: 'Tokyo JIS QC', detail: 'Pre-shrunk, export-inspected stock lots' },
    ],
    capabilities: [
      {
        title: 'Rapid Wholesale Blanks (Print-Ready)',
        specs: [
          '260–300 GSM boxy tees & 420 GSM hoodies stocked in Pitch Black, Ecru & Washed Charcoal',
          'Tear-away / unbranded necklines engineered for instant DTG, screen-print & puff print',
          '40 pcs/color starter capsules for emerging USA, GCC & EU streetwear labels',
          'Same-week DHL air courier sample kits for immediate fit sign-off',
        ],
      },
      {
        title: 'RAWx & Arutemika Signature Drops',
        specs: [
          '13.5–14.5 oz shuttle-loom raw indigo selvedge denim & chore jackets',
          'Full-grain calfskin minimalist low-top sneakers & Goodyear welted boots',
          'High-compression performance activewear sets & technical outerwear',
          'White-label or co-branded B2B wholesale licensing available',
        ],
      },
    ],
    showcaseItems: [
      {
        sku: 'RAWX-D2C-SELVEDGE',
        title: 'RAWx 13.5 oz Raw Indigo Selvedge Denim Heritage 5-Pocket Jeans',
        specSummary: 'Shuttle-Loom Redline Selvedge · Antiqued Brass Rivets · Chainstitch Hem',
        moqLabel: 'MOQ 40 pcs/wash · 120/style',
        fobRange: '$11.50 – $16.80 FOB',
        leadTime: '7–10d Sample · 22d Bulk',
        image: '/RAWx 13.5 oz Raw Indigo Selvedge Denim Heritage 5-Pocket Jeans 1.jpg',
        badge: '13.5 oz Selvedge',
      },
      {
        sku: 'RAWX-D2C-SNK01',
        title: 'RAWx Minimalist Full-Grain Calfskin Leather Low-Top Sneakers',
        specSummary: 'Italian Margom-Style Cup Sole · Calfskin Lining · Waxed Laces',
        moqLabel: 'MOQ 40 pairs/color · 120/style',
        fobRange: '$24.50 – $34.00 FOB',
        leadTime: '9–12d Sample · 28d Bulk',
        image: '/RAWx Minimalist Full-Grain Calfskin Leather Low-Top Sneakers 1.jpg',
        badge: 'Full-Grain Sneaker',
      },
      {
        sku: 'RAWX-D2C-TOKYO280',
        title: 'Tokyo Atelier Standard 280 GSM Heavyweight Combed Cotton Blank',
        specSummary: 'Screen-Print Ready · Pre-Shrunk Silicon Wash · Heavy Rib Collar',
        moqLabel: 'MOQ 40 pcs/color · 120/style',
        fobRange: '$3.40 – $4.80 FOB',
        leadTime: '3–4d Swatch · 14d Bulk',
        image: '/Tokyo Atelier Standard 280 GSM Heavyweight Combed Cotton Blank.jpg',
        badge: 'Rapid Stock',
      },
      {
        sku: 'RAWX-D2C-ACT01',
        title: 'RAWx Crimson Performance Activewear 2-Piece Athletic Set',
        specSummary: '4-Way Stretch Moisture-Wicking · Flatlock Seams · Custom Heat Transfer',
        moqLabel: 'MOQ 120 sets (40/color)',
        fobRange: '$8.90 – $12.40 FOB',
        leadTime: '7–10d Sample · 21d Bulk',
        image: '/RAWx Crimson Red Performance Activewear 2-Piece Athletic Set 1.jpg',
        badge: 'Performance Drop',
      },
    ],
    defaultQuotePrompt:
      'Hello HANDS & HEAD × RAWx D2C Desk — I am inquiring about rapid wholesale blanks or direct capsule drops.',
    defaultSamplePrompt:
      'Hello HANDS & HEAD × RAWx D2C Desk — I would like to order a ready-stock Fit & Blank Sample Pack.',
  },
  {
    id: 'admin',
    path: '/admin',
    aliases: ['/admin', '/nexos'],
    navLabel: 'NexOS Admin',
    shortLabel: 'Admin',
    seoTitle: 'NexOS Supplier & Production Management Gateway | HANDS & HEAD × RAWx',
    seoDescription:
      'Unified NexOS B2B supplier management, live production line allocation, RFQ desk, and federated catalog administration for HANDS & HEAD × RAWx.',
    eyebrow: 'WING 05 · NEXOS SUPPLIER & PRODUCTION MANAGEMENT GATEWAY',
    h1: 'NexOS Production Control, Supplier Registry & Live RFQ Gateway',
    subtitle:
      'Centralized operational console for Dhaka factory production lines, incoming international RFQs, SKU catalog publishing, and real-time export compliance telemetry.',
    attributionTag: '[Via B2B - NexOS Admin Wing]',
    accentTone: 'gold',
    heroImage: '/1. handsandhead.ai.studio (Master Portal).jpg',
    divisionSlugs: ['all'],
    categoryIds: ['all'],
    searchKeywords: [],
    trustMetrics: [
      { label: 'Active Production Nodes', value: '3,105 Mills', detail: 'BGMEA · BKMEA · Savar CETP linked' },
      { label: 'Buyer Trade Network', value: '15,420+', detail: 'USA · KSA · Bahrain · EU · Japan' },
      { label: 'Ledger Volume', value: '6.5 Cr+ BDT', detail: 'Live federated sync bus' },
      { label: 'Customs SLA', value: '3.2 Days', detail: 'CGP & DAC digital EPB clearance' },
    ],
    capabilities: [],
    showcaseItems: [],
    defaultQuotePrompt:
      'Hello NexOS Operations Desk — Connecting from /admin regarding active production orders or supplier onboarding.',
    defaultSamplePrompt:
      'Hello NexOS Operations Desk — Requesting priority sample scheduling across production wings.',
  },
];

export const WINGS_BY_ID: Record<WingId, WingConfig> = B2B_WINGS.reduce(
  (acc, wing) => {
    acc[wing.id] = wing;
    return acc;
  },
  {} as Record<WingId, WingConfig>
);

export function resolveWingFromPath(pathname: string): WingId | null {
  const clean = (pathname || '/').split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/') return null;

  for (const wing of B2B_WINGS) {
    if (
      wing.path === clean ||
      wing.aliases.some((alias) => clean === alias || clean.startsWith(`${alias}/`))
    ) {
      return wing.id;
    }
  }
  return null;
}

export function inferWingFromProduct(product?: {
  divisionSlug?: string;
  categoryId?: string;
  categorySlug?: string;
  title?: string;
  sourceDomain?: string;
}): WingId {
  if (!product) return 'rmg';
  const combined = `${product.divisionSlug || ''} ${product.categoryId || ''} ${product.categorySlug || ''} ${
    product.title || ''
  } ${product.sourceDomain || ''}`.toLowerCase();

  if (
    combined.includes('316l') ||
    combined.includes('516ss') ||
    combined.includes('clasp') ||
    combined.includes('shackle') ||
    combined.includes('bracelet') ||
    combined.includes('cuff') ||
    combined.includes('hardware') ||
    combined.includes('buckle') ||
    combined.includes('carabiner') ||
    combined.includes('zipper')
  ) {
    return 'hardware';
  }

  if (
    combined.includes('leather') ||
    combined.includes('jacket') ||
    combined.includes('bomber') ||
    combined.includes('cowhide') ||
    combined.includes('calfskin') ||
    combined.includes('arutemika') ||
    combined.includes('tote') ||
    combined.includes('duffle') ||
    combined.includes('briefcase') ||
    combined.includes('boot') ||
    combined.includes('harness') ||
    combined.includes('tannery')
  ) {
    return 'leather';
  }

  if (combined.includes('commercial-blanks') || combined.includes('shop.handsandhead')) {
    return 'd2c';
  }

  return 'rmg';
}
