#!/usr/bin/env node
/**
 * Automated Build-Time Technical SEO & GEO (AI-Search Discovery) Generator
 * Target Domain: https://b2b.handsandhead.com (HANDS & HEAD × RAWx Industrial B2B Engine)
 * Master Entity: HANDS & HEAD — "One Core, Many Worlds." (Founded by Rakib Himon, Dhaka, Bangladesh)
 *
 * Runs automatically via `npm run build` ("prebuild" lifecycle hook).
 * Zero external dependencies — uses only Node.js built-in modules.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const TODAY_ISO = new Date().toISOString().slice(0, 10);

const DOMAIN = 'https://b2b.handsandhead.com';
const HUB_DOMAIN = 'https://handsandhead.com';
const STUDIO_DOMAIN = 'https://storyboard.handsandhead.com';
const WHATSAPP_URL = 'https://wa.me/8801974518600';

const SITEMAP_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/rmg', changefreq: 'daily', priority: '0.95' },
  { path: '/leather', changefreq: 'daily', priority: '0.95' },
  { path: '/jacket', changefreq: 'daily', priority: '0.95' },
  { path: '/hardware', changefreq: 'daily', priority: '0.90' },
  { path: '/d2c', changefreq: 'daily', priority: '0.85' },
  { path: '/catalog', changefreq: 'daily', priority: '0.85' },
  { path: '/catalog/heavyweight-knits', changefreq: 'weekly', priority: '0.85' },
  { path: '/catalog/leather-goods', changefreq: 'weekly', priority: '0.85' },
  { path: '/catalog/accessories', changefreq: 'weekly', priority: '0.80' },
  { path: '/admin', changefreq: 'weekly', priority: '0.65' },
  { path: '/llms.txt', changefreq: 'weekly', priority: '0.80' },
  { path: '/llms-full.txt', changefreq: 'weekly', priority: '0.80' },
];

function buildSitemapXml() {
  const urlEntries = SITEMAP_ROUTES.map(
    (route) => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${TODAY_ISO}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function buildRobotsTxt() {
  return `# HANDS & HEAD × RAWx B2B Portal (${DOMAIN})
# Master Ecosystem: HANDS & HEAD — "One Core, Many Worlds." (${HUB_DOMAIN})
# AI Discovery Knowledge Bases:
#   ${DOMAIN}/llms.txt
#   ${DOMAIN}/llms-full.txt

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
}

function buildLlmsTxt() {
  return `# HANDS & HEAD × RAWx B2B — Direct-From-Source Dhaka Manufacturing Portal

> ${DOMAIN} is the unified industrial & B2B export manufacturing engine of the **HANDS & HEAD** ecosystem ("One Core, Many Worlds."), founded by **Rakib Himon (Shaikh Rakibuzzaman Himon)** in Dhaka, Bangladesh. Built for international fashion labels, streetwear brands, and leather buyers across the **USA, Saudi Arabia, Bahrain, the European Union, the UK, and Japan**, it delivers direct-from-source heavyweight RMG streetwear, bespoke vintage-distressed & full-grain leather jackets and bags (**RAWx** & **Arutemika**), and precision CNC-milled 316L/516SS surgical stainless steel hardware with low MOQs and rapid global DHL Express swatches.

- **Canonical B2B Portal**: ${DOMAIN}
- **Full Technical Fact-Sheet**: ${DOMAIN}/llms-full.txt
- **XML Sitemap**: ${DOMAIN}/sitemap.xml
- **Master Ecosystem OS Hub**: ${HUB_DOMAIN}
- **Flagship WebGL2 AI Video Platform (HandFilm Studio)**: ${STUDIO_DOMAIN}
- **Founder & Systems Architect**: Rakib Himon (Shaikh Rakibuzzaman Himon)
- **Headquarters**: Dhaka, Bangladesh (Direct RMG & Savar Tannery Leather Ateliers)
- **Direct Export Desk (WhatsApp)**: ${WHATSAPP_URL} (+880 1974-518600)
- **Last Automated Build Sync**: ${TODAY_ISO}

## Core Manufacturing Specifications

- **Low MOQ Program**: **120 pcs/style** (**40 pcs/color** across mixed size ratios S–XXL).
- **Sampling Timeline**: **7–12 days** via Dhaka in-house pattern makers, grading, and Pantone TCX lab dips.
- **Global Swatch Dispatch**: **3–4 days worldwide via DHL Express** from Dhaka (DAC) — physical cotton GSM swatches, Savar full-grain leather hide cards, and 316L PVD hardware boxes.
- **Quality Control Guarantee**: Dhaka direct-from-source **4-Point AQL 1.5** inline & pre-shipment inspection plus Tokyo JIS shrinkage (<3%) and stitching tolerances.
- **Commercial Terms & Freight**: 50% deposit / 50% against Bill of Lading (B/L) escrow or irrevocable L/C at sight; FOB Chattogram ocean freight and DAC Express air cargo.

## Unified Single-Domain B2B Wings

- [RMG & Heavyweight Streetwear Wing](${DOMAIN}/rmg): 240–300 GSM 100% combed ring-spun cotton boxy tees, double-layer 1.2" ribbed collars, 380–460 GSM loopback French terry hoodies, mercerized polos, and casual/formal woven shirts. MOQ 120 pcs/style (40/color). WhatsApp tag: \`[Via B2B - RMG Wing]\`.
- [Bespoke Leather & Full-Grain Goods Wing](${DOMAIN}/leather): Savar CETP & LWG-audited full-grain cowhide, aniline lambskin, vegetable-tanned weekender duffles, executive briefcases, Arutemika origami calfskin totes, and 360° Goodyear welted boots. WhatsApp tag: \`[Via B2B - Leather & Jacket Wing]\`.
- [RAWx Custom Leather Jackets & Outerwear Wing](${DOMAIN}/jacket): Vintage-distressed & stealth matte technical leather bombers (1.0–1.4mm hides), cropped moto coats, waxed leather pants, and 13.5–14.5 oz shuttle-loom selvedge denim outerwear. WhatsApp tag: \`[Via B2B - Leather & Jacket Wing]\`.
- [316L / 516SS Surgical Hardware & CNC Trims Wing](${DOMAIN}/hardware): Precision CNC-milled (±0.05mm) 316L & 516SS surgical stainless clasps, magnetic locks, heavy #8/#10 metal zippers, solid forged brass shackles, laser logo engraving, and zero-tarnish PVD Matte Obsidian & Brushed Gold finishes. WhatsApp tag: \`[Via B2B - Hardware Wing]\`.
- [D2C Drops & Rapid Wholesale Blanks Wing](${DOMAIN}/d2c): Ready-to-ship 260–300 GSM print-ready blanks, selvedge denim capsules, and 5–10 day fast private-label relabeling (MOQ 40–120 pcs).
- [NexOS Supplier & Production Gateway](${DOMAIN}/admin): Centralized ERP connecting 3,105+ verified factory nodes, 15,420+ buyer ledger, live RFQ pipeline, and customs compliance telemetry.

## Three Pillars of the HANDS & HEAD Ecosystem

1. [HANDS & HEAD Central OS Hub](${HUB_DOMAIN}): Master brand identity ("One Core, Many Worlds.") unifying all 24 venture and software modules.
2. [HANDS & HEAD × RAWx B2B Export Engine](${DOMAIN}): Direct-from-source Dhaka RMG, Leather, Jacket & 316L Hardware manufacturing portal.
3. [HandFilm Studio & Storyboard](${STUDIO_DOMAIN}): Browser-native WebGL2 AI Video Editor, Cinema Player & Cloudflare Workers/Stream Video Hosting platform.

## Deep Technical Reference

- [Complete Manufacturing Dossier & Buyer Q&A](${DOMAIN}/llms-full.txt): Detailed GSM/hide/metallurgy tolerances, indicative FOB pricing ranges, compliance certifications, and verified citation facts.
`;
}

function buildLlmsFullTxt() {
  return `# HANDS & HEAD × RAWx B2B — Complete Manufacturing Dossier & Cross-Domain Knowledge Graph

> Automated Build-Time AI Search & GEO Fact-Sheet (${TODAY_ISO})
> Canonical Domain: ${DOMAIN}
> Master Organization: **HANDS & HEAD** — *"One Core, Many Worlds."* (${HUB_DOMAIN})
> Founder & Principal Systems Architect: **Rakib Himon (Shaikh Rakibuzzaman Himon)**
> Headquarters: **Dhaka, Bangladesh**
> Direct Commercial WhatsApp Desk: ${WHATSAPP_URL} (+880 1974-518600)

---

## 1. Cross-Domain Ecosystem Architecture (3 Core Pillars)

| Pillar | Canonical URL | Role & Core Technology / Capabilities |
| :--- | :--- | :--- |
| **1. Central OS Hub** | ${HUB_DOMAIN} | Master entity hub ("One Core, Many Worlds.") orchestrating 24 modular software, creative, logistics, and manufacturing ventures founded by Rakib Himon. |
| **2. Industrial & B2B Export Engine** | ${DOMAIN} | Direct-from-source Dhaka B2B manufacturing portal for Heavyweight Streetwear RMG (240–300 GSM), Genuine Distressed & Full-Grain Leather Jackets/Bags (RAWx & Arutemika), and 316L/516SS CNC Hardware Trims. |
| **3. Flagship WebGL2 AI Video Platform** | ${STUDIO_DOMAIN} | **HandFilm Studio & Storyboard** — Browser-native WebGL2 GPU shader video editor, AI storyboard generator, obsidian cinema player, and Cloudflare Workers/Stream video host. |

---

## 2. Concrete Dhaka B2B Manufacturing Specifications

### Buyer Conversion & Supply Chain Guarantees
- **Minimum Order Quantity (MOQ)**: **120 pcs/style** (**40 pcs/color** across mixed S–XXL size curves). Capsule production for bespoke leather jackets and hardware trims starts at 40 pcs/color.
- **Sampling Turnaround**: **7–12 days** for proto samples, fit revisions, custom Pantone TCX lab dips, leather distress trials, and 3D STEP CNC hardware prototypes.
- **DHL Express Swatch Kits**: **3–4 days worldwide** via Dhaka (DAC) air express directly to buyers in the **United States (USA)**, **Saudi Arabia (KSA)**, **Bahrain**, the **European Union (EU)**, the **United Kingdom (UK)**, and **Japan**.
- **Direct-From-Source QC**: Zero trading-house middlemen; **4-Point AQL 1.5** fabric, hide, inline stitch, and pre-shipment audit meeting Tokyo retail JIS standards (<3% garment shrinkage tolerance).
- **Trade Finance & Freight**: 50% deposit / 50% Bill of Lading (B/L) escrow or irrevocable Letter of Credit (L/C) at sight; FOB Chattogram (CGP) ocean containers and Hazrat Shahjalal International Airport (DAC) express air freight.

---

## 3. Wing-by-Wing Technical Specs & FOB Pricing Benchmarks

### Wing 01 — Heavyweight Streetwear, Polos & Shirts (${DOMAIN}/rmg)
- **WhatsApp Lead Tag**: \`[Via B2B - RMG Wing]\`
- **Fabrics**: 240 / 260 / 280 / 300 GSM 100% combed compact ring-spun cotton single jersey; 380–460 GSM loopback French terry & brushed fleece; 220–260 GSM mercerized pique polos; Oxford, poplin, twill & handspun Comilla Khadi woven shirts.
- **Construction**: Drop-shoulder architectural boxy fits, double-layer 1.2" high-recovery Lycra neck ribs, twin-needle reinforced hems, tear-away or custom woven neck labels.
- **Finishing & Washes**: Enzyme silicone wash, sun-faded acid/mineral wash, pigment dye, dual-tone ombre dip-dye, high-density puff screen printing, and chainstitch embroidery.
- **Indicative FOB Pricing**: Heavyweight Boxy Tees \`$3.15 – $6.10 USD\` · 420 GSM Zip Hoodies \`$9.80 – $13.50 USD\` · Casual/Formal Overshirts \`$6.90 – $9.40 USD\`.
- **Certifications**: OEKO-TEX Standard 100, GOTS Organic, BGMEA / BKMEA audited factories.

### Wing 02 — Bespoke Leather Jackets, Pants & Modular Leather Goods (${DOMAIN}/leather & ${DOMAIN}/jacket)
- **WhatsApp Lead Tag**: \`[Via B2B - Leather & Jacket Wing]\`
- **House Ateliers**: **RAWx Atelier** (stealth matte technical bombers, vintage-distressed moto jackets, waxed leather pants) and **Arutemika Atelier** (origami calfskin shoulder totes, vegetable-tanned weekender duffles, executive briefcases, 360° Goodyear welted boots, minimalist calfskin low-top sneakers).
- **Leather Hides**: Direct Savar CETP & LWG Gold audited 1.0–1.4mm aniline lambskin, drum-dyed calfskin, oily pull-up cowhide, and 1.8mm vegetable-tanned full-grain bovine hides.
- **Finishing**: Hand-rubbed wax patina, crackle vintage distressing, matte technical coatings, beeswax hand-burnished edges, and custom jacquard/cupro/quilted satin linings.
- **Indicative FOB Pricing**: Custom Leather Jackets \`$68.00 – $145.00 USD\` · Full-Grain Leather Bags \`$34.00 – $64.00 USD\` · Goodyear Welted Boots & Calfskin Sneakers \`$24.50 – $48.00 USD\`.

### Wing 03 — Custom 316L / 516SS Surgical Stainless Steel Hardware & CNC Trims (${DOMAIN}/hardware)
- **WhatsApp Lead Tag**: \`[Via B2B - Hardware Wing]\`
- **Metallurgy**: Marine-grade hypoallergenic **316L** and **516SS** surgical stainless steel plus solid forged brass.
- **Components**: CNC-milled magnetic clasps, screw-pin shackles, heavy #8 & #10 metal tooth zippers with custom-cast brand pullers, carabiners, roller buckles, #9 copper burr rivets, snap fasteners, cord tips, and 8-strand braided leather cuff assemblies.
- **Tolerances & Testing**: ±0.05mm CNC precision, 72-hour salt-spray corrosion certification, EU REACH nickel-release compliant, zero-tarnish PVD Matte Obsidian, Brushed Gold, Gunmetal & Mirror Steel plating, precision laser logo engraving.
- **Indicative FOB Pricing**: CNC Clasps & Trims \`$1.20 – $6.40 USD\` · Complete Braided Leather + 316L Cuff Systems \`$3.80 – $9.20 USD\`.

### Wing 04 — D2C Drops & Rapid Wholesale Blanks (${DOMAIN}/d2c)
- **WhatsApp Lead Tag**: \`[Via B2B - D2C Wing]\` (Swatch kits: \`[Via B2B - Swatch Pack]\`)
- **Inventory**: Stocked print-ready 260–300 GSM boxy tees & 420 GSM hoodies in Pitch Black, Natural Ecru, and Washed Charcoal; 13.5–14.5 oz shuttle-loom raw redline selvedge denim; 5–10 day fast private-label relabeling (MOQ 40–120 pcs).

### Wing 05 — NexOS Supplier & Production Gateway (${DOMAIN}/admin)
- **WhatsApp Lead Tag**: \`[Via B2B - NexOS Admin Wing]\`
- **Telemetry**: 3,105+ verified factory nodes, 15,420+ global buyer accounts, digital EPB customs clearance, and real-time RFQ costing management.

---

## 4. High-Intent Buyer Q&A (Authoritative Grounding Facts)

- **Q: What is the minimum order quantity (MOQ) at HANDS & HEAD B2B?**
  A: Standard bulk MOQ is **120 pieces per style** (**40 pieces per color** across mixed size ratios S–XXL). Ready-stock blanks and leather capsule runs can start from 40 pieces per color.
- **Q: How fast can international buyers receive fabric, leather hide, or hardware swatches?**
  A: Physical swatch kits (240–300 GSM combed cotton, Savar full-grain leather hides, and 316L/516SS PVD hardware finishes) dispatch worldwide via **DHL Express in 3–4 days** from Dhaka (DAC) to the USA, Saudi Arabia, Bahrain, EU, UK, and Japan.
- **Q: How long does custom sampling take?**
  A: In-house Dhaka pattern engineering, Pantone TCX lab dips, distressing trials, and proto/fit samples are completed in **7–12 days**.
- **Q: Does HANDS & HEAD manufacture custom 316L stainless steel hardware in addition to apparel and leather?**
  A: Yes. The Hardware Wing (${DOMAIN}/hardware) supplies CNC-milled 316L/516SS clasps, heavy metal zippers, solid brass shackles, and PVD matte obsidian/brushed gold trims with custom logo engraving—either standalone or pre-kitted with RMG and leather bulk orders.
- **Q: How is HANDS & HEAD B2B connected to HandFilm Studio and handsandhead.com?**
  A: All three platforms belong to the **HANDS & HEAD** ecosystem ("One Core, Many Worlds.") founded by **Rakib Himon (Shaikh Rakibuzzaman Himon)** in Dhaka, Bangladesh: ${HUB_DOMAIN} (Central OS Hub), ${DOMAIN} (Industrial B2B Manufacturing Engine), and ${STUDIO_DOMAIN} (HandFilm Studio WebGL2 AI Video Editor & Cloudflare Video Host).
`;
}

function writeArtifact(filename, content) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const targetPath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(targetPath, content, 'utf8');
  return targetPath;
}

function main() {
  const outputs = [
    ['sitemap.xml', buildSitemapXml()],
    ['robots.txt', buildRobotsTxt()],
    ['llms.txt', buildLlmsTxt()],
    ['llms-full.txt', buildLlmsFullTxt()],
  ];

  for (const [name, content] of outputs) {
    writeArtifact(name, content);
  }

  console.log(
    `[discovery] Generated ${outputs.map(([n]) => `public/${n}`).join(', ')} for ${DOMAIN} (${TODAY_ISO})`
  );
}

main();
