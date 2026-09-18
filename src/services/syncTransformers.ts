import {
  B2BProduct,
  RawGoogleDriveAsset,
  RawArutemikaProduct,
  PriceTier,
  ProductSpecification,
  CategoryId,
} from '../types';

/**
 * ----------------------------------------------------------------------------
 * 1. GOOGLE DRIVE ASSET TO B2B TRANSFORMER
 * ----------------------------------------------------------------------------
 * Normalizes raw Google Drive metadata & file assets from shop.handsandhead.com
 * into the strict NexOS B2BProduct schema.
 *
 * Core Business Logic:
 * - Generates an automated Volume Price Ladder:
 *     * MOQ 100 - 499:  ~20% Wholesale Discount
 *     * MOQ 500 - 1999:  30% Bulk Discount (User Requirement)
 *     * MOQ 2000+:       40% Container Discount (User Requirement)
 * - Assigns origin targetRoutingUrl back to shop.handsandhead.com for checkout.
 */
export function normalizeDriveProduct(driveData: RawGoogleDriveAsset): B2BProduct {
  const d2cPrice = Number(driveData.d2cRetailPriceUSD) || 28.0;

  // Auto-generate Volume Price Ladder from single D2C retail price
  // 30% discount for MOQ 500, 40% discount for MOQ 2000
  const tier1Price = Math.round(d2cPrice * 0.8 * 100) / 100; // 20% discount
  const tier2Price = Math.round(d2cPrice * 0.7 * 100) / 100; // 30% discount (MOQ 500)
  const tier3Price = Math.round(d2cPrice * 0.6 * 100) / 100; // 40% discount (MOQ 2000)

  const volumePriceLadder: PriceTier[] = [
    { minQty: driveData.moq || 100, maxQty: 499, priceUSD: tier1Price },
    { minQty: 500, maxQty: 1999, priceUSD: tier2Price },
    { minQty: 2000, priceUSD: tier3Price },
  ];

  const sku = driveData.sku || `GDRV-${(driveData.driveFileId || Math.random().toString(36).substring(7)).toUpperCase().slice(0, 8)}`;
  const title = driveData.title || driveData.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  // Parse Google Drive image or web links
  const primaryImage =
    driveData.directImageUrl ||
    driveData.webContentLink ||
    driveData.thumbnailUrl ||
    (driveData.driveFileId ? `https://drive.google.com/uc?export=view&id=${driveData.driveFileId}` : '') ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  const secondaryImage =
    driveData.thumbnailUrl ||
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80';

  // Origin routing URL back to shop.handsandhead.com for checkout
  const targetRoutingUrl = `https://shop.handsandhead.com/checkout?sku=${encodeURIComponent(sku)}&source=b2b_sync&ref=nexos_drive`;

  // Determine category based on folder or fabric
  let categoryId: CategoryId = 'rmg-apparel';
  const folderLower = (driveData.folderPath || driveData.categoryFolder || '').toLowerCase();
  if (folderLower.includes('leather') || folderLower.includes('footwear')) {
    categoryId = 'leather-footwear';
  } else if (folderLower.includes('jute') || folderLower.includes('eco')) {
    categoryId = 'jute-eco';
  } else if (folderLower.includes('textile') || folderLower.includes('bedding')) {
    categoryId = 'home-textiles';
  }

  const specs: ProductSpecification[] = [
    { label: 'Asset Repository', value: `Google Drive (${driveData.folderPath || '/D2C_Catalog/Blanks'})` },
    { label: 'D2C Retail Benchmark', value: `$${d2cPrice.toFixed(2)} USD` },
    { label: 'Fabric / Material', value: driveData.fabricComposition || '100% Combed Compact Cotton' },
    { label: 'Fabric Density', value: `${driveData.gsm || '260'} GSM` },
    { label: 'Drive File ID', value: driveData.driveFileId || 'DRV-ROOT-BLANK' },
  ];

  return {
    id: `drv-${driveData.driveFileId || sku.toLowerCase()}`,
    sku,
    title,
    categoryId,
    divisionSlug: 'commercial-blanks',
    divisionTitle: 'Ready Commercial Blanks',
    sourceDomain: 'shop.handsandhead.com',
    targetRoutingUrl,
    provenance: 'Google Drive Sync (shop.handsandhead.com)',
    hsCode: '6109.10.00',
    fobPort: 'Chattogram Port (CGP)',
    gsmSpec: `${driveData.gsm || '260'} GSM • Single Jersey Enzyme Washed`,
    description:
      driveData.description ||
      `Headless D2C Commercial item ingested from shop.handsandhead.com Google Drive repository. Pre-shrunk, print-ready blank stock available for direct container procurement with instant volume price ladder.`,
    moq: driveData.moq || 100,
    unit: 'pcs',
    priceTiers: volumePriceLadder,
    leadTimeDays: driveData.leadTimeDays || 14,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['OEKO-TEX 100', 'WRAP Platinum', 'Sedex SMETA'],
    supplierId: 'sup-shop-handsandhead',
    supplierName: 'Hands & Head Headless Hub (shop.handsandhead.com)',
    supplierVerified: true,
    supplierRating: 4.96,
    images: [primaryImage, secondaryImage],
    specifications: specs,
    materials: [driveData.fabricComposition || '100% Combed Cotton', 'Eco-Reactive Dye'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: Math.round(d2cPrice * 1.15),
    customizationOffered: true,
    colorVariants: driveData.availableColors || [
      { name: 'Pitch Black', hex: '#0f172a', inStock: true },
      { name: 'Raw Natural Ecru', hex: '#f4f0ea', inStock: true },
      { name: 'Mineral Stone Grey', hex: '#64748b', inStock: true },
    ],
    bestseller: true,
    trendingRank: '#1 Drive Ingestion',
    artisanDirect: false,
    reorderRate: 76,
    totalSold: 48000,
  };
}

/**
 * ----------------------------------------------------------------------------
 * 2. ARUTEMIKA FLAGSHIP NORMALIZER
 * ----------------------------------------------------------------------------
 * Maps high-end Japanese atelier leather goods into the B2B Wholesale Portal.
 *
 * Core Business Logic:
 * - Automatically appends provenance badges:
 *     * "Arutemika Heritage Atelier"
 *     * "Full-Grain Leather"
 *     * Construction Badge (e.g. "Goodyear Welted", "Hand-Lasted")
 * - Sets division to 'flagship-leather' & divisionTitle to 'Arutemika Atelier'.
 * - Sets category to 'leather-footwear'.
 * - Assigns origin targetRoutingUrl back to arutemika.com/wholesale.
 */
export function normalizeArutemikaProduct(arutemikaData: RawArutemikaProduct): B2BProduct {
  const baseWholesale = Number(arutemikaData.wholesalePriceUSD) || 38.0;
  const sku = arutemikaData.sku || `ARTM-${arutemikaData.id.toUpperCase().replace(/^ARTM-?/, '')}`;

  // Luxury wholesale tiered pricing
  const priceTiers: PriceTier[] = [
    { minQty: arutemikaData.moq || 50, maxQty: 149, priceUSD: Math.round(baseWholesale * 100) / 100 },
    { minQty: 150, maxQty: 499, priceUSD: Math.round(baseWholesale * 0.88 * 100) / 100 },
    { minQty: 500, priceUSD: Math.round(baseWholesale * 0.78 * 100) / 100 },
  ];

  // Target routing URL back to arutemika.com wholesale checkout
  const targetRoutingUrl = `https://arutemika.com/wholesale?sku=${encodeURIComponent(sku)}&ref=nexos_b2b&partner=handsandhead`;

  // Provenance badges strictly enforced
  const provenanceBadges = [
    'Arutemika Heritage Atelier',
    'Full-Grain Leather',
    arutemikaData.construction || '360° Goodyear Storm Welt',
    arutemikaData.tanneryOrigin || 'Savar CETP Eco Tannery',
  ];

  const specs: ProductSpecification[] = [
    { label: 'Provenance', value: 'Arutemika Heritage Atelier (Tokyo & Dhaka Guild)' },
    { label: 'Leather Grade', value: arutemikaData.leatherType || 'Full-Grain Drum-Dyed Bovine Crust' },
    { label: 'Construction', value: arutemikaData.construction || 'Hand-lasted 360° Goodyear Storm Welt' },
    { label: 'Hardware Spec', value: arutemikaData.hardware || 'Solid Antiqued Cast Brass & 316L Stainless' },
    { label: 'Sole Compound', value: arutemikaData.soling || 'Vibram Commando Lug / Dainite Studded' },
    { label: 'Japan D2C Retail', value: arutemikaData.japanRetailYen ? `¥${arutemikaData.japanRetailYen.toLocaleString()} JPY` : '¥39,800 JPY' },
  ];

  const images = arutemikaData.images && arutemikaData.images.length > 0
    ? arutemikaData.images
    : [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
      ];

  return {
    id: `artm-${arutemikaData.id}`,
    sku,
    title: arutemikaData.title,
    categoryId: 'leather-footwear',
    divisionSlug: 'flagship-leather',
    divisionTitle: 'Arutemika Atelier',
    sourceDomain: 'arutemika.com',
    targetRoutingUrl,
    provenance: 'Arutemika Heritage Atelier',
    hsCode: '6403.51.00',
    fobPort: 'Chattogram Port (CGP)',
    gsmSpec: '1.8-2.0mm Savar Drum-Dyed Oily Pull-Up Leather',
    description:
      arutemikaData.description ||
      `Master cordwainer bespoke leather goods handcrafted by Arutemika Heritage Atelier. Certified Full-Grain vegetable-tanned bovine hides, hand-lasted with cork bed filling and tempered steel shank. Wholesale export edition.`,
    moq: arutemikaData.moq || 50,
    unit: 'pairs',
    priceTiers,
    leadTimeDays: arutemikaData.leadTimeDays || 30,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: [
      'LWG Gold Certified Tannery',
      'BSCI Audited',
      'Arutemika Heritage Atelier Certified',
      'Full-Grain Leather Stamp',
    ],
    supplierId: 'sup-arutemika-atelier',
    supplierName: 'Arutemika Atelier & Wholesale (arutemika.com)',
    supplierVerified: true,
    supplierRating: 4.99,
    images,
    specifications: specs,
    materials: [arutemikaData.leatherType || 'Full-Grain Veg-Tan Leather', 'Cork Midsole', 'Solid Brass'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: Math.round(baseWholesale * 1.8),
    customizationOffered: true,
    colorVariants: arutemikaData.colors || [
      { name: 'Cognac Oily Pull-Up', hex: '#78350f', inStock: true },
      { name: 'Espresso Cordovan', hex: '#3b1d11', inStock: true },
      { name: 'Onyx Black', hex: '#111827', inStock: true },
    ],
    bestseller: true,
    trendingRank: '#1 Flagship Atelier',
    artisanDirect: true,
    reorderRate: 64,
    totalSold: 19800,
  };
}

/**
 * ----------------------------------------------------------------------------
 * 3. BATCH TRANSFORMERS
 * ----------------------------------------------------------------------------
 */
export function normalizeDriveBatch(items: RawGoogleDriveAsset[]): B2BProduct[] {
  return items.map((item) => normalizeDriveProduct(item));
}

export function normalizeArutemikaBatch(items: RawArutemikaProduct[]): B2BProduct[] {
  return items.map((item) => normalizeArutemikaProduct(item));
}

/**
 * ----------------------------------------------------------------------------
 * 4. RAW HEADLESS SEED STREAMS (for instantaneous synchronization)
 * ----------------------------------------------------------------------------
 */
export const RAW_GOOGLE_DRIVE_FEED: RawGoogleDriveAsset[] = [
  {
    driveFileId: 'DRV-TEE-280-RAW',
    fileName: '280_GSM_Heavyweight_Oversized_Boxy_Tee_Catalog.png',
    folderPath: '/D2C_Catalog/Commercial_Blanks/Heavyweight_Tees',
    d2cRetailPriceUSD: 24.0,
    sku: 'GDRV-TEE-280',
    title: '280 GSM Heavyweight Boxy Cut Streetwear Tee Blank',
    description: 'High-density 280 GSM single jersey compact combed cotton. Pre-shrunk with 1x1 heavy ribbed collar, drop shoulder silhouette. Ingested from shop.handsandhead.com Google Drive.',
    fabricComposition: '100% Compact Combed Ring-Spun Cotton',
    gsm: 280,
    leadTimeDays: 14,
    moq: 100,
    availableColors: [
      { name: 'Washed Ash Grey', hex: '#64748b' },
      { name: 'Pitch Black', hex: '#0f172a' },
      { name: 'Natural Ecru Chalk', hex: '#f1f5f9' },
      { name: 'Vintage Olive', hex: '#3f4f34' },
    ],
    directImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  },
  {
    driveFileId: 'DRV-HOOD-450-FR',
    fileName: '450_GSM_Fleece_French_Terry_Oversized_Hoodie.png',
    folderPath: '/D2C_Catalog/Commercial_Blanks/Hoodies',
    d2cRetailPriceUSD: 52.0,
    sku: 'GDRV-HOOD-450',
    title: '450 GSM Heavy French Terry Loopback Boxy Pullover Hoodie',
    description: 'Ultra-dense loopback French terry with double-layer crossover hood, metal aglets, flatlock seams, and kangaroo pocket. Zero pill finish.',
    fabricComposition: '100% Long-Staple Combed Cotton Fleeceback',
    gsm: 450,
    leadTimeDays: 18,
    moq: 100,
    availableColors: [
      { name: 'Mineral Stone', hex: '#475569' },
      { name: 'Jet Carbon', hex: '#1e293b' },
      { name: 'Deep Burgundy', hex: '#831843' },
    ],
    directImageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  },
  {
    driveFileId: 'DRV-DEN-CHORE-13',
    fileName: '13_5_oz_Selvedge_Chore_Jacket_Lookbook.png',
    folderPath: '/D2C_Catalog/Denim/Chore_Coats',
    d2cRetailPriceUSD: 68.0,
    sku: 'GDRV-DNM-CHORE',
    title: '13.5 oz Shuttle-Loom Selvedge Denim Workwear Chore Coat',
    description: 'Raw unwashed redline selvedge denim woven on classic shuttle looms. Donut brass shanks and triple-needle chainstitching.',
    fabricComposition: '100% US Cotton Selvedge Denim',
    gsm: '13.5 oz',
    leadTimeDays: 25,
    moq: 150,
    availableColors: [
      { name: 'Pure Indigo Raw', hex: '#1e3a8a' },
      { name: 'Overdyed Black', hex: '#0a0a0a' },
    ],
    directImageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
  },
];

export const RAW_ARUTEMIKA_FEED: RawArutemikaProduct[] = [
  {
    id: '7209-chelsea',
    handle: 'goodyear-welted-leather-chelsea-boot',
    title: 'Arutemika Goodyear Welted Full-Grain Veg-Tan Chelsea Boot',
    leatherType: 'Full-Grain Drum-Dyed Veg-Tan Pull-Up Cowhide',
    tanneryOrigin: 'Savar Ecological CETP Tannery Estate',
    construction: '360° Goodyear Storm Welt (Cork Bed Insole)',
    japanRetailYen: 42000,
    wholesalePriceUSD: 44.0,
    moq: 50,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    ],
    hardware: 'Reinforced Italian Herringbone Elastic Gusset',
    soling: 'Vibram #430 Mini-Lug Commando Sole',
    colors: [
      { name: 'Cognac Oily Pull-Up', hex: '#78350f' },
      { name: 'Espresso Cordovan', hex: '#3b1d11' },
      { name: 'Midnight Jet', hex: '#111827' },
    ],
    atelierLocation: 'Arutemika Atelier Tokyo & Savar Tanning Guild',
    sku: 'ARTM-7209-CHL',
    leadTimeDays: 32,
    description: 'Benchmade by Arutemika cordwainers with cork bed filling, tempered steel shank, genuine leather midsole, and Vibram commando half-sole. Hand-burnished patina finish.',
  },
  {
    id: '8102-oxford',
    handle: 'atelier-wholecut-oxford-shoe',
    title: 'Arutemika Wholecut Hand-Patina Veg-Tan Oxford Dress Shoe',
    leatherType: 'Grade-A French Calfskin Veg-Tan Crust',
    tanneryOrigin: 'Savar CETP Finished Leather Estate',
    construction: 'Blake-Rapid Stitched with Channelled Leather Sole',
    japanRetailYen: 48000,
    wholesalePriceUSD: 52.0,
    moq: 50,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop&q=80',
    ],
    hardware: 'Concealed Blind Eyelets & Waxed Cotton Laces',
    soling: '5mm Vegetable-Tanned Sole Leather with Brass Toe Taps',
    colors: [
      { name: 'Museum Antique Brown', hex: '#451a03' },
      { name: 'Burgundy Patina', hex: '#701a75' },
      { name: 'Piano Black', hex: '#09090b' },
    ],
    atelierLocation: 'Arutemika Atelier Tokyo & Dhaka Craft Guild',
    sku: 'ARTM-8102-OXF',
    leadTimeDays: 35,
    description: 'Cut from a single unblemished hide with museum calf hand-sponged patina. Beveled waist, fiddleback fiddle sole, and gentlemans corner rubber heel inset.',
  },
  {
    id: '9301-satchel',
    handle: 'bridle-leather-executive-briefcase',
    title: 'Arutemika Heavy English Bridle Leather Executive Commuter Briefcase',
    leatherType: '3.5mm Heavy English Bridle Leather (Wax Infused)',
    tanneryOrigin: 'Savar Ecological Tannery Guild',
    construction: 'Saddle-Stitched by Hand with Waxed Linen Thread',
    japanRetailYen: 68000,
    wholesalePriceUSD: 78.0,
    moq: 30,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    ],
    hardware: 'Solid Forged British Brass Quick-Release Tuck Locks',
    soling: 'Reinforced Suede Lining with 16-inch Laptop Divider',
    colors: [
      { name: 'London Tan', hex: '#b45309' },
      { name: 'Dark Havana Brown', hex: '#3f1d0b' },
      { name: 'Onyx Black', hex: '#18181b' },
    ],
    atelierLocation: 'Arutemika Flagship Atelier',
    sku: 'ARTM-9301-BC',
    leadTimeDays: 28,
    description: 'Rigid bridle leather structured briefcase designed for decades of daily executive use. Solid forged brass hardware and hand-skived, beeswax-burnished edges.',
  },
];
