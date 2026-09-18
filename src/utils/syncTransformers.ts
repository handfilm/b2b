import {
  B2BProduct,
  RawGoogleDriveAsset,
  RawArutemikaProduct,
  PriceTier,
  ProductSpecification,
  CategoryId,
} from '../types';

/**
 * Auto-generates a 3-tier Volume Price Ladder from a base retail price:
 * - Tier 1 (MOQ to 499): 20% Wholesale Discount (baseRetail * 0.80)
 * - Tier 2 (500 to 1999): 30% Bulk Discount (baseRetail * 0.70)
 * - Tier 3 (2000+): 40% Container Discount (baseRetail * 0.60)
 */
export function generateVolumePriceLadder(baseRetailPrice: number, moq: number = 100): PriceTier[] {
  const cleanPrice = Number(baseRetailPrice) > 0 ? Number(baseRetailPrice) : 25.0;
  const tier1Price = Math.round(cleanPrice * 0.8 * 100) / 100;
  const tier2Price = Math.round(cleanPrice * 0.7 * 100) / 100;
  const tier3Price = Math.round(cleanPrice * 0.6 * 100) / 100;

  return [
    { minQty: Math.max(1, moq), maxQty: 499, priceUSD: tier1Price },
    { minQty: 500, maxQty: 1999, priceUSD: tier2Price },
    { minQty: 2000, priceUSD: tier3Price },
  ];
}

/**
 * Normalizes raw Google Drive asset records (from shop.handsandhead.com or Firestore)
 * into standard B2BProduct with the 3-tier Volume Price Ladder.
 */
export function normalizeDriveProduct(driveData: RawGoogleDriveAsset | any): B2BProduct {
  const d2cPrice = Number(driveData.d2cRetailPriceUSD || driveData.baseRetailPrice || driveData.price || 28.0);
  const moq = Number(driveData.moq) || 100;
  const volumePriceLadder = generateVolumePriceLadder(d2cPrice, moq);

  const sku = driveData.sku || `GDRV-${(driveData.driveFileId || driveData.id || Math.random().toString(36).substring(7)).toUpperCase().slice(0, 8)}`;
  const title = driveData.title || (driveData.fileName ? driveData.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Commercial Apparel Export Lot');

  const primaryImage =
    driveData.directImageUrl ||
    driveData.imageUrl ||
    driveData.webContentLink ||
    driveData.thumbnailUrl ||
    (driveData.images && driveData.images[0]) ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  const secondaryImage =
    driveData.thumbnailUrl ||
    (driveData.images && driveData.images[1]) ||
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80';

  let categoryId: CategoryId = (driveData.categoryId as CategoryId) || 'rmg-apparel';
  const folderLower = (driveData.folderPath || driveData.categoryFolder || driveData.category || '').toLowerCase();
  if (folderLower.includes('leather') || folderLower.includes('footwear')) {
    categoryId = 'leather-footwear';
  } else if (folderLower.includes('jute') || folderLower.includes('eco')) {
    categoryId = 'jute-eco';
  } else if (folderLower.includes('textile') || folderLower.includes('bedding')) {
    categoryId = 'home-textiles';
  } else if (folderLower.includes('ceramic')) {
    categoryId = 'ceramics-tableware';
  }

  const specs: ProductSpecification[] = [
    { label: 'Asset Repository', value: `Google Drive (${driveData.folderPath || '/D2C_Catalog/Blanks'})` },
    { label: 'D2C Retail Benchmark', value: `$${d2cPrice.toFixed(2)} USD` },
    { label: 'Fabric / Material', value: driveData.fabricComposition || '100% Combed Compact Cotton' },
    { label: 'Fabric Density', value: `${driveData.gsm || '260'} GSM` },
    { label: 'Drive File ID', value: driveData.driveFileId || 'DRV-ROOT-BLANK' },
  ];

  return {
    id: driveData.id ? String(driveData.id) : `drv-${driveData.driveFileId || sku.toLowerCase()}`,
    sku,
    title,
    categoryId,
    divisionSlug: driveData.divisionSlug || 'commercial-blanks',
    divisionTitle: driveData.divisionTitle || 'Ready Commercial Blanks',
    sourceDomain: 'shop.handsandhead.com',
    targetRoutingUrl: driveData.targetRoutingUrl || `https://shop.handsandhead.com/checkout?sku=${encodeURIComponent(sku)}&source=b2b_sync&ref=nexos_drive`,
    provenance: 'Google Drive Sync (shop.handsandhead.com)',
    hsCode: driveData.hsCode || '6109.10.00',
    fobPort: 'Chattogram Port (CGP)',
    gsmSpec: `${driveData.gsm || '260'} GSM • Single Jersey Enzyme Washed`,
    description:
      driveData.description ||
      `Headless D2C Commercial item ingested from shop.handsandhead.com. Pre-shrunk, export-ready lot with automated 3-tier volume price ladder.`,
    moq,
    unit: driveData.unit || 'pcs',
    priceTiers: volumePriceLadder,
    leadTimeDays: driveData.leadTimeDays || 14,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['OEKO-TEX 100', 'WRAP Platinum', 'Sedex SMETA'],
    supplierId: driveData.supplierId || 'sup-shop-handsandhead',
    supplierName: driveData.supplierName || 'Hands & Head Headless Hub (shop.handsandhead.com)',
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
 * Normalizes raw Arutemika atelier records (from arutemika.com or Firestore)
 * into standard B2BProduct with the 3-tier Volume Price Ladder.
 */
export function normalizeArutemikaProduct(arutemikaData: RawArutemikaProduct | any): B2BProduct {
  const baseRetailPrice = Number(
    arutemikaData.retailPriceUSD ||
    arutemikaData.baseRetailPrice ||
    arutemikaData.wholesalePriceUSD ||
    arutemikaData.price ||
    48.0
  );
  const moq = Number(arutemikaData.moq) || 50;
  const volumePriceLadder = generateVolumePriceLadder(baseRetailPrice, moq);

  const sku = arutemikaData.sku || `ARTM-${(arutemikaData.id || Math.random().toString(36).substring(7)).toUpperCase().replace(/^ARTM-?/, '')}`;
  const title = arutemikaData.title || 'Arutemika Cordwainer Leather Goods';

  const images = arutemikaData.images && arutemikaData.images.length > 0
    ? arutemikaData.images
    : [
        arutemikaData.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
      ];

  const specs: ProductSpecification[] = [
    { label: 'Provenance', value: 'Arutemika Heritage Atelier (Tokyo & Dhaka Guild)' },
    { label: 'Leather Grade', value: arutemikaData.leatherType || 'Full-Grain Drum-Dyed Bovine Crust' },
    { label: 'Construction', value: arutemikaData.construction || 'Hand-lasted 360° Goodyear Storm Welt' },
    { label: 'Hardware Spec', value: arutemikaData.hardware || 'Solid Antiqued Cast Brass & 316L Stainless' },
    { label: 'Sole Compound', value: arutemikaData.soling || 'Vibram Commando Lug / Dainite Studded' },
    { label: 'Japan D2C Retail', value: arutemikaData.japanRetailYen ? `¥${arutemikaData.japanRetailYen.toLocaleString()} JPY` : '¥39,800 JPY' },
  ];

  return {
    id: arutemikaData.id ? String(arutemikaData.id) : `artm-${sku.toLowerCase()}`,
    sku,
    title,
    categoryId: 'leather-footwear',
    divisionSlug: 'flagship-leather',
    divisionTitle: 'Arutemika Atelier',
    sourceDomain: 'arutemika.com',
    targetRoutingUrl: arutemikaData.targetRoutingUrl || `https://arutemika.com/wholesale?sku=${encodeURIComponent(sku)}&ref=nexos_b2b&partner=handsandhead`,
    provenance: 'Arutemika Heritage Atelier',
    hsCode: arutemikaData.hsCode || '6403.51.00',
    fobPort: 'Chattogram Port (CGP)',
    gsmSpec: '1.8-2.0mm Savar Drum-Dyed Oily Pull-Up Leather',
    description:
      arutemikaData.description ||
      `Master cordwainer bespoke leather goods handcrafted by Arutemika Heritage Atelier. Certified Full-Grain vegetable-tanned bovine hides with 3-tier volume price ladder.`,
    moq,
    unit: arutemikaData.unit || 'pairs',
    priceTiers: volumePriceLadder,
    leadTimeDays: arutemikaData.leadTimeDays || 30,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: [
      'LWG Gold Certified Tannery',
      'BSCI Audited',
      'ISO 14001 Environmental Management',
    ],
    supplierId: 'sup-arutemika-tokyo',
    supplierName: 'Arutemika Heritage Atelier (arutemika.com)',
    supplierVerified: true,
    supplierRating: 4.98,
    images,
    specifications: specs,
    materials: ['Full-Grain Leather', 'Vibram Soling', 'Vegetable Tanned Leather Insole'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: Math.round(baseRetailPrice * 1.2),
    customizationOffered: true,
    colorVariants: [
      { name: 'Tokyo Espresso', hex: '#3E2723', inStock: true },
      { name: 'Heritage Oxblood', hex: '#4A1525', inStock: true },
      { name: 'Raw Natural Vachetta', hex: '#D7CCC8', inStock: true },
    ],
    bestseller: true,
    trendingRank: '#1 Luxury Export Lot',
    artisanDirect: true,
    reorderRate: 88,
    totalSold: 12400,
  };
}
