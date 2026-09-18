import { Product } from '../types';
import { PRODUCTS as BASE_PRODUCTS } from './mockData';
import { FEDERATED_PRODUCTS, buildTargetRoutingUrl } from './divisions';

// Domain-tagged base products
export const SEED_SHOP_HANDSANDHEAD: Product[] = [
  {
    id: 'sh-01',
    title: 'Heavyweight 240 GSM Combed Cotton Streetwear Drop-Shoulder Tee',
    categoryId: 'rmg-apparel',
    hsCode: '6109.10.00',
    description: 'Ultra-dense 240 GSM single jersey combed compact cotton. Silicon-washed with double-needle ribbed neckband. Export ready for EU/US streetwear brands.',
    moq: 100,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 100, maxQty: 499, priceUSD: 3.85 },
      { minQty: 500, maxQty: 1999, priceUSD: 3.20 },
      { minQty: 2000, priceUSD: 2.65 },
    ],
    leadTimeDays: 20,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['OEKO-TEX 100', 'GOTS Organic', 'WRAP Platinum'],
    supplierId: 'sup-plummy',
    supplierName: 'Plummy Fashions Ltd.',
    supplierVerified: true,
    supplierRating: 4.95,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Weight', value: '240 GSM Heavyweight Jersey' },
      { label: 'Yarn', value: '24/1 Combed Compact 100% Cotton' },
      { label: 'Fit', value: 'Oversized Boxy Drop Shoulder' },
    ],
    materials: ['Organic Cotton', 'Reactive Dye'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 30,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 46,
    deliveryDate: 'Delivery by Nov 18',
    yearsInBusiness: 12,
    totalSold: 42000,
  },
  {
    id: 'sh-02',
    title: '13.5 oz Raw Indigo Selvedge Denim Heritage 5-Pocket Jeans',
    categoryId: 'rmg-apparel',
    hsCode: '6203.42.00',
    description: 'Shuttle-loom woven selvedge denim from Envoy LEED Platinum mill. Pure vegetal indigo rope-dyed with antique brass copper rivets.',
    moq: 200,
    unit: 'Pairs',
    priceTiers: [
      { minQty: 200, maxQty: 999, priceUSD: 11.80 },
      { minQty: 1000, maxQty: 4999, priceUSD: 9.95 },
      { minQty: 5000, priceUSD: 8.50 },
    ],
    leadTimeDays: 30,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['LEED Platinum', 'Cradle to Cradle Gold', 'OEKO-TEX 100'],
    supplierId: 'sup-envoy',
    supplierName: 'Envoy Textiles Limited',
    supplierVerified: true,
    supplierRating: 4.92,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Weight', value: '13.5 oz Redline Selvedge' },
      { label: 'Weave', value: '3x1 Right Hand Twill' },
      { label: 'Dyeing', value: 'Vegetable Indigo Rope-Dyed' },
    ],
    materials: ['Organic Cotton', 'Vegetable Indigo'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 50,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 52,
    deliveryDate: 'Delivery by Nov 25',
    yearsInBusiness: 18,
    totalSold: 28500,
  },
  {
    id: 'sh-03',
    title: '420 GSM French Terry Cotton Zip Hoodie with YKK Anti-Brass Hardware',
    categoryId: 'rmg-apparel',
    hsCode: '6110.20.00',
    description: 'Heavy fleeceback loopback french terry with flatlock reinforced seams and heavyweight rib cuffs. Pre-shrunk garment dye finish.',
    moq: 150,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 150, maxQty: 499, priceUSD: 8.90 },
      { minQty: 500, maxQty: 1999, priceUSD: 7.75 },
      { minQty: 2000, priceUSD: 6.80 },
    ],
    leadTimeDays: 25,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['OEKO-TEX 100', 'BSCI Certified', 'GOTS'],
    supplierId: 'sup-dbl',
    supplierName: 'DBL Group (Dulal Brothers Ltd.)',
    supplierVerified: true,
    supplierRating: 4.88,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Fabric', value: '420 GSM 100% Combed Cotton Terry' },
      { label: 'Hardware', value: 'YKK Genuine Two-Way Antique Zipper' },
      { label: 'Rib', value: '2x2 Lycra Reinforced Rib' },
    ],
    materials: ['Combed Cotton', 'Lycra Rib'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 45,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 38,
    deliveryDate: 'Delivery by Nov 20',
    yearsInBusiness: 35,
    totalSold: 67000,
  },
  {
    id: 'sh-04',
    title: '650 GSM Combed Zero-Twist Luxury Egyptian Cotton Hotel Bath Towel Set',
    categoryId: 'home-textiles',
    hsCode: '6302.60.00',
    description: 'Deep-pile zero-twist terry woven on Dornier airjet looms. High water absorbency with reinforced double-stitched hems.',
    moq: 300,
    unit: 'Sets',
    priceTiers: [
      { minQty: 300, maxQty: 999, priceUSD: 5.40 },
      { minQty: 1000, maxQty: 4999, priceUSD: 4.60 },
      { minQty: 5000, priceUSD: 3.90 },
    ],
    leadTimeDays: 20,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['OEKO-TEX Made In Green', 'ISO 9001:2015'],
    supplierId: 'sup-zaber-zubair',
    supplierName: 'Zaber & Zubair Fabrics Ltd.',
    supplierVerified: true,
    supplierRating: 4.96,
    images: [
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'GSM', value: '650 GSM Ultra Plush' },
      { label: 'Yarn', value: 'Zero-Twist Micro Cotton Loop' },
      { label: 'Colorfast', value: 'Chlorine Resistant Vat Dyed' },
    ],
    materials: ['Long-Staple Cotton', 'Eco Softener'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 25,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 64,
    deliveryDate: 'Delivery by Nov 15',
    yearsInBusiness: 30,
    totalSold: 94000,
  },
  {
    id: 'sh-05',
    title: 'LWG Gold Certified Full Grain Cowhide Leather Goodyear Welted Boots',
    categoryId: 'leather-footwear',
    hsCode: '6403.51.00',
    description: 'Savar tannery drum-dyed oily pull-up leather. Hand-stitched Goodyear welted construction with Vibram rubber outsole.',
    moq: 100,
    unit: 'Pairs',
    priceTiers: [
      { minQty: 100, maxQty: 499, priceUSD: 34.50 },
      { minQty: 500, maxQty: 1999, priceUSD: 29.80 },
      { minQty: 2000, priceUSD: 26.00 },
    ],
    leadTimeDays: 35,
    portOfLoading: 'Chattogram Port (CGP) / Dhaka Air',
    incoterms: ['FOB', 'CIF'],
    certifications: ['LWG Gold Rated', 'SATRA Accredited', 'BSCI'],
    supplierId: 'sup-apex',
    supplierName: 'Apex Footwear & Tanning Enterprise',
    supplierVerified: true,
    supplierRating: 4.91,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Upper', value: '1.8-2.0mm Full Grain Pull-Up Cowhide' },
      { label: 'Sole', value: 'Goodyear Welt with Vibram Rubber' },
      { label: 'Insole', value: 'Orthopedic Leather Cushioned Bed' },
    ],
    materials: ['Full Grain Cowhide', 'Natural Rubber'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 85,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 48,
    deliveryDate: 'Delivery by Dec 02',
    yearsInBusiness: 34,
    totalSold: 18200,
  },
  {
    id: 'sh-06',
    title: 'High-Visibility EN ISO 20471 Waterproof Stormproof Workwear Shell Jacket',
    categoryId: 'rmg-apparel',
    hsCode: '6201.93.00',
    description: '3-layer ripstop polyester with breathable TPU membrane. 15,000mm hydrostatic head with 3M Scotchlite reflective bands.',
    moq: 200,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 200, maxQty: 999, priceUSD: 16.50 },
      { minQty: 1000, maxQty: 4999, priceUSD: 14.20 },
      { minQty: 5000, priceUSD: 12.50 },
    ],
    leadTimeDays: 30,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['EN ISO 20471', 'EN 343 4:4', 'LEED Platinum'],
    supplierId: 'sup-ananta',
    supplierName: 'Ananta Workwear & Technical Textiles Ltd.',
    supplierVerified: true,
    supplierRating: 4.89,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Waterproofness', value: '15,000 mm / Breathability 10,000 g/m²' },
      { label: 'Taping', value: 'Full Seam Sealing Hot Air Melded' },
      { label: 'Reflectors', value: '3M Scotchlite 8910 Silver Segments' },
    ],
    materials: ['Recycled Polyester Ripstop', 'TPU Membrane'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 60,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 59,
    deliveryDate: 'Delivery by Nov 28',
    yearsInBusiness: 25,
    totalSold: 32000,
  },
  {
    id: 'sh-07',
    title: 'Moisture-Wicking Seamless Anti-Bacterial Performance Athletic Gym Tee',
    categoryId: 'rmg-apparel',
    hsCode: '6109.90.00',
    description: 'Santoni circular knitted 4-way stretch polyamide-elastane blend with laser-cut ventilation zones. Quick-dry silver-ion finish.',
    moq: 250,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 250, maxQty: 999, priceUSD: 4.20 },
      { minQty: 1000, maxQty: 4999, priceUSD: 3.65 },
      { minQty: 5000, priceUSD: 3.10 },
    ],
    leadTimeDays: 20,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['OEKO-TEX 100', 'Bluesign Certified'],
    supplierId: 'sup-square-fashions',
    supplierName: 'Square Fashions Limited',
    supplierVerified: true,
    supplierRating: 4.93,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Yarn', value: '88% Micro-Nylon, 12% Spandex' },
      { label: 'Tech', value: 'Dry-Fit Hydrophilic Moisture Management' },
    ],
    materials: ['Recycled Nylon', 'Spandex'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 35,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 42,
    deliveryDate: 'Delivery by Nov 16',
    yearsInBusiness: 28,
    totalSold: 58000,
  },
  {
    id: 'sh-08',
    title: 'LWG Gold Finished Vegetable-Tanned Cowhide Minimalist Bifold Wallet',
    categoryId: 'leather-footwear',
    hsCode: '4202.31.00',
    description: 'Artisanal edge-painted vegetable tanned leather with RFID blocking brass mesh lining. Hand-creased border detail.',
    moq: 150,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 150, maxQty: 499, priceUSD: 6.80 },
      { minQty: 500, maxQty: 1999, priceUSD: 5.40 },
      { minQty: 2000, priceUSD: 4.50 },
    ],
    leadTimeDays: 18,
    portOfLoading: 'Dhaka Air (DAC) / CGP',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['LWG Gold', 'REACH Tested'],
    supplierId: 'sup-bay',
    supplierName: 'Bay Footwear & Leather Epz Ltd.',
    supplierVerified: true,
    supplierRating: 4.87,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Leather', value: '1.2mm Semi-Vegetable Crust Cowhide' },
      { label: 'Security', value: 'Full RFID Shielding 13.56 MHz' },
    ],
    materials: ['Cowhide', 'RFID Shield Fabric'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 25,
    customizationOffered: true,
    sourceDomain: 'shop.handsandhead.com',
    reorderRate: 35,
    deliveryDate: 'Delivery by Nov 12',
    yearsInBusiness: 32,
    totalSold: 24000,
  },
];

export const SEED_ARUTEMIKA_HANDSANDHEAD: Product[] = [
  {
    id: 'ar-01',
    title: 'Heritage Nakshi Kantha Hand-Embroidered Organic Cotton Bedspread Quilt',
    categoryId: 'handicrafts-brass',
    hsCode: '6304.92.00',
    description: 'Master artisan hand-stitched folk motif running stitch on layers of soft handspun organic cotton. Requires 120 artisan hours per piece. ARUTEMIKA heritage line.',
    moq: 30,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 30, maxQty: 99, priceUSD: 42.00 },
      { minQty: 100, maxQty: 499, priceUSD: 36.50 },
      { minQty: 500, priceUSD: 31.00 },
    ],
    leadTimeDays: 45,
    portOfLoading: 'Dhaka Air (DAC) / CGP Port',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['WFTO Fair Trade', 'GOTS Cotton', 'GI Bengal Heritage'],
    supplierId: 'sup-arutemika',
    supplierName: 'ARUTEMIKA Bengal Atelier & Crafts',
    supplierVerified: true,
    supplierRating: 4.98,
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Artisan Technique', value: 'Authentic Nakshi Running Stitch' },
      { label: 'Fabric', value: '4-Ply Handloom Organic Muslin Voile' },
      { label: 'Dyes', value: '100% Madder Root & Natural Botanical Extract' },
    ],
    materials: ['Organic Handloom Cotton', 'Botanical Pigments'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 75,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 68,
    deliveryDate: 'Delivery by Dec 05',
    yearsInBusiness: 16,
    totalSold: 8400,
  },
  {
    id: 'ar-02',
    title: 'Luxury Golden Jute & Full Grain Leather Trim Designer Market Tote Bag',
    categoryId: 'jute-eco',
    hsCode: '4202.92.00',
    description: 'High-density 14x15 hydrocarbon-free braided golden jute weave paired with vegetable-tanned cowhide bridle handles and magnetic brass snap closure.',
    moq: 100,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 100, maxQty: 499, priceUSD: 8.50 },
      { minQty: 500, maxQty: 1999, priceUSD: 6.95 },
      { minQty: 2000, priceUSD: 5.60 },
    ],
    leadTimeDays: 25,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['OEKO-TEX ECO PASSPORT', 'USDA Biobased 100%'],
    supplierId: 'sup-janata',
    supplierName: 'Janata Jute Mills & Fibers',
    supplierVerified: true,
    supplierRating: 4.94,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Weave', value: 'Natural Tossah Jute 450 GSM' },
      { label: 'Handles', value: 'Vegetable Tanned Natural Saddle Leather' },
      { label: 'Lining', value: 'Unbleached Organic Cotton Canvas' },
    ],
    materials: ['Golden Jute Fiber', 'Saddle Leather'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 35,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 55,
    deliveryDate: 'Delivery by Nov 22',
    yearsInBusiness: 56,
    totalSold: 51000,
  },
  {
    id: 'ar-03',
    title: 'Translucent Fine Bone China 24-Piece Gold-Banded Royal Dinnerware Set',
    categoryId: 'ceramics-tableware',
    hsCode: '6911.10.00',
    description: '45% tricalcium phosphate natural bone ash content. Unmatched translucency and chip resistance with 24K real gold rim decal application.',
    moq: 50,
    unit: 'Sets',
    priceTiers: [
      { minQty: 50, maxQty: 199, priceUSD: 48.00 },
      { minQty: 200, maxQty: 499, priceUSD: 39.50 },
      { minQty: 500, priceUSD: 34.00 },
    ],
    leadTimeDays: 35,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['FDA Food Safe Approved', 'ISO 9001', 'LFGB German Grade'],
    supplierId: 'sup-shinepukur',
    supplierName: 'Shinepukur Ceramics Ltd.',
    supplierVerified: true,
    supplierRating: 4.97,
    images: [
      'https://images.unsplash.com/photo-1614983646436-b3d7a8398b3d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Composition', value: '45% Bovine Bone Ash / Kaolin Clay' },
      { label: 'Firing Temp', value: '1,280°C High Temp Glost Kiln' },
      { label: 'Safety', value: 'Lead & Cadmium Free Glaze' },
    ],
    materials: ['Bone Ash', 'Fine Kaolin', '24K Liquid Gold'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 90,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 61,
    deliveryDate: 'Delivery by Dec 10',
    yearsInBusiness: 29,
    totalSold: 14500,
  },
  {
    id: 'ar-04',
    title: 'Hand-Hammered Antique Brass Heavy Water Pitcher & Tumbler Artisan Set',
    categoryId: 'handicrafts-brass',
    hsCode: '7418.10.00',
    description: 'Traditional metalcraft forged by Dhamrai master coppersmiths. Hand-chiseled lotus patterns with tin-coated (kalai) interior for food & drink safety.',
    moq: 40,
    unit: 'Sets',
    priceTiers: [
      { minQty: 40, maxQty: 149, priceUSD: 28.00 },
      { minQty: 150, maxQty: 499, priceUSD: 23.50 },
      { minQty: 500, priceUSD: 19.80 },
    ],
    leadTimeDays: 30,
    portOfLoading: 'Dhaka Air (DAC) / CGP Port',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['Handicraft Export Council', 'Authentic Dhamrai Certified'],
    supplierId: 'sup-dhamrai',
    supplierName: 'Dhamrai Metal Heritage Guild',
    supplierVerified: true,
    supplierRating: 4.93,
    images: [
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Metal', value: '70% Copper, 30% Zinc Pure Brass' },
      { label: 'Internal Lining', value: 'Pure Food Grade Tin (Kalai)' },
      { label: 'Weight', value: '1.4 kg / Set' },
    ],
    materials: ['Virgin Brass', 'Food-Grade Pure Tin'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 60,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 49,
    deliveryDate: 'Delivery by Nov 30',
    yearsInBusiness: 48,
    totalSold: 9800,
  },
  {
    id: 'ar-05',
    title: 'Handspun Khadi Indigo Handloom Men’s Kurta & Casual Over-Shirt',
    categoryId: 'rmg-apparel',
    hsCode: '6205.20.00',
    description: 'Charkha handspun desi cotton woven on pit looms in Comilla. Hand-dipped in organic true indigo vat fermentation 8 times.',
    moq: 60,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 60, maxQty: 199, priceUSD: 14.50 },
      { minQty: 200, maxQty: 799, priceUSD: 12.00 },
      { minQty: 800, priceUSD: 10.20 },
    ],
    leadTimeDays: 28,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF'],
    certifications: ['Fair Trade Handloom', 'GOTS Organic Indigo'],
    supplierId: 'sup-arutemika',
    supplierName: 'ARUTEMIKA Bengal Atelier & Crafts',
    supplierVerified: true,
    supplierRating: 4.96,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Yarn', value: 'Handspun Desi Khadi Cotton 32s' },
      { label: 'Dye', value: 'Living Fermented Organic Indigo Vat' },
      { label: 'Buttons', value: 'Natural Mother-of-Pearl Shell' },
    ],
    materials: ['Handspun Khadi Cotton', 'Organic Indigo', 'MOP Shell'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 40,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 53,
    deliveryDate: 'Delivery by Dec 01',
    yearsInBusiness: 16,
    totalSold: 12400,
  },
  {
    id: 'ar-06',
    title: 'Biodegradable Braided Jute & Sustainable Palm Leaf Storage Basket Trio',
    categoryId: 'jute-eco',
    hsCode: '4602.19.00',
    description: 'Coil-sewn natural unbleached golden jute rope interlocked with wild river palm leaf fiber. Sturdy carrying loop handles.',
    moq: 80,
    unit: 'Sets of 3',
    priceTiers: [
      { minQty: 80, maxQty: 299, priceUSD: 11.20 },
      { minQty: 300, maxQty: 999, priceUSD: 9.40 },
      { minQty: 1000, priceUSD: 7.80 },
    ],
    leadTimeDays: 22,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['100% Bio-compostable', 'SEDEX SMETA'],
    supplierId: 'sup-akij-jute',
    supplierName: 'Akij Jute Mills Limited',
    supplierVerified: true,
    supplierRating: 4.91,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Sizes', value: 'Large 35cm, Medium 28cm, Small 22cm' },
      { label: 'Material', value: '70% Jute Twine, 30% Date Palm Leaf' },
    ],
    materials: ['Golden Jute', 'Palm Leaf Fiber'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 30,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 47,
    deliveryDate: 'Delivery by Nov 20',
    yearsInBusiness: 29,
    totalSold: 38000,
  },
  {
    id: 'ar-07',
    title: 'Jamdani Floral Motif Handwoven Pure Mulberry Silk Stole / Shawl',
    categoryId: 'handicrafts-brass',
    hsCode: '6214.10.00',
    description: 'UNESCO Intangible Cultural Heritage geometric floral weave woven on wooden throw-shuttle pit loom by Demra master weavers. Featherlight drape.',
    moq: 25,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 25, maxQty: 99, priceUSD: 32.00 },
      { minQty: 100, maxQty: 299, priceUSD: 27.50 },
      { minQty: 300, priceUSD: 23.00 },
    ],
    leadTimeDays: 35,
    portOfLoading: 'Dhaka Air (DAC) / CGP Port',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['UNESCO Heritage Craft Registry', 'Silk Mark Bangladesh'],
    supplierId: 'sup-arutemika',
    supplierName: 'ARUTEMIKA Bengal Atelier & Crafts',
    supplierVerified: true,
    supplierRating: 4.99,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Weave', value: 'Discontinuous Weft Jamdani Supplementary' },
      { label: 'Count', value: '100s Pure Mulberry Organza Silk' },
      { label: 'Dimension', value: '75 cm x 200 cm' },
    ],
    materials: ['Mulberry Silk', 'Fine Zari Thread'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 65,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 72,
    deliveryDate: 'Delivery by Dec 08',
    yearsInBusiness: 16,
    totalSold: 6500,
  },
  {
    id: 'ar-08',
    title: 'Natural Clay Terracotta Minimalist Plant Pots & Ceramic Glazed Vases',
    categoryId: 'ceramics-tableware',
    hsCode: '6912.00.00',
    description: 'Kagojipara pottery guild wheel-thrown terracotta with organic matte ash glaze finish. Breathable root aeration for high-end boutique plant decor.',
    moq: 60,
    unit: 'Pieces',
    priceTiers: [
      { minQty: 60, maxQty: 199, priceUSD: 6.50 },
      { minQty: 200, maxQty: 799, priceUSD: 5.20 },
      { minQty: 800, priceUSD: 4.10 },
    ],
    leadTimeDays: 20,
    portOfLoading: 'Chattogram Port (CGP)',
    incoterms: ['FOB', 'CIF', 'EXW'],
    certifications: ['100% Lead-Free Clay', 'Fair Trade Certified'],
    supplierId: 'sup-shinepukur',
    supplierName: 'Shinepukur Ceramics Ltd.',
    supplierVerified: true,
    supplierRating: 4.90,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614983646436-b3d7a8398b3d?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { label: 'Clay', value: 'High Density Alluvial Clay Soil' },
      { label: 'Finish', value: 'Unglazed Porous Body with Ash Ring Lip' },
    ],
    materials: ['Natural Alluvial Clay', 'Wood Ash Glaze'],
    ecoFriendly: true,
    sampleAvailable: true,
    samplePriceUSD: 25,
    customizationOffered: true,
    sourceDomain: 'arutemika.handsandhead.com',
    reorderRate: 44,
    deliveryDate: 'Delivery by Nov 19',
    yearsInBusiness: 29,
    totalSold: 21000,
  },
];

// Helper color swatch generator for Shein-style variant browsing
const APPAREL_SWATCHES = [
  { name: 'Pitch Black', hex: '#18181b', inStock: true },
  { name: 'Raw Indigo', hex: '#1e3a8a', inStock: true },
  { name: 'Heather Grey', hex: '#94a3b8', inStock: true },
  { name: 'Off White', hex: '#f8fafc', inStock: true },
  { name: 'Forest Olive', hex: '#365314', inStock: true },
];

const JUTE_SWATCHES = [
  { name: 'Golden Jute', hex: '#d97706', inStock: true },
  { name: 'Unbleached Desi', hex: '#fef3c7', inStock: true },
  { name: 'Charcoal Black', hex: '#27272a', inStock: true },
  { name: 'Sage Leaf', hex: '#4d7c0f', inStock: true },
];

const LEATHER_SWATCHES = [
  { name: 'Cognac Saddle', hex: '#9a3412', inStock: true },
  { name: 'Espresso Brown', hex: '#451a03', inStock: true },
  { name: 'Midnight Jet', hex: '#09090b', inStock: true },
];

const CRAFT_SWATCHES = [
  { name: 'Living Indigo', hex: '#1d4ed8', inStock: true },
  { name: 'Terracotta Red', hex: '#b45309', inStock: true },
  { name: 'Raw Desi Khadi', hex: '#e2e8f0', inStock: true },
  { name: 'Burnished Brass', hex: '#eab308', inStock: true },
];

// Combine federated showcase and base seeds, mapping each product to its dedicated satellite division
export const ALL_INITIAL_PRODUCTS: Product[] = [
  ...FEDERATED_PRODUCTS,
  ...BASE_PRODUCTS.map((p, idx) => {
    const isCraft = p.categoryId === 'handicrafts-brass' || p.categoryId === 'ceramics-tableware' || idx % 2 === 1;
    const isJute = p.categoryId === 'jute-eco';
    const isLeather = p.categoryId === 'leather-footwear';
    const swatches = isJute ? JUTE_SWATCHES : isLeather ? LEATHER_SWATCHES : isCraft ? CRAFT_SWATCHES : APPAREL_SWATCHES;
    
    // Determine federated division
    let divisionSlug = 'rmg-knits';
    let divisionTitle = 'RMG Knits';
    let sourceDomain = 'rmg.handsandhead.com';
    let provenance = 'OEKO-TEX Organic';

    if (p.categoryId === 'jute-eco') {
      divisionSlug = 'golden-jute';
      divisionTitle = 'Golden Jute & Eco';
      sourceDomain = 'jute.handsandhead.com';
      provenance = '100% Biodegradable Eco';
    } else if (p.categoryId === 'home-textiles') {
      divisionSlug = 'home-textiles';
      divisionTitle = 'Home Textiles & Linens';
      sourceDomain = 'textiles.handsandhead.com';
      provenance = 'Zero-Twist 650 GSM';
    } else if (p.categoryId === 'leather-footwear') {
      if (idx % 4 === 0) {
        divisionSlug = 'flagship-leather';
        divisionTitle = 'Arutemika Atelier';
        sourceDomain = 'arutemika.com';
        provenance = 'Arutemika Atelier';
      } else if (idx % 4 === 1) {
        divisionSlug = 'leather-cuffs';
        divisionTitle = 'Leather Cuffs & Hardware';
        sourceDomain = 'bracelets.handsandhead.com';
        provenance = 'Surgical Steel & Latigo';
      } else if (idx % 4 === 2) {
        divisionSlug = 'leather-harness';
        divisionTitle = 'Leather Gear & Harness';
        sourceDomain = 'harness.handsandhead.com';
        provenance = 'Heavy Harness Grade';
      } else {
        divisionSlug = 'tannery-hides';
        divisionTitle = 'Tannery Raw Hides';
        sourceDomain = 'leather.handsandhead.com';
        provenance = 'Full-Grain Veg-Tan';
      }
    } else if (p.title.toLowerCase().includes('denim') || p.title.toLowerCase().includes('jacket')) {
      divisionSlug = 'heavy-outerwear';
      divisionTitle = 'Heavy Outerwear & Denim';
      sourceDomain = 'jacket.handsandhead.com';
      provenance = 'LEED Platinum Selvedge';
    } else if (idx % 3 === 0) {
      divisionSlug = 'commercial-blanks';
      divisionTitle = 'Ready Commercial Blanks';
      sourceDomain = 'shop.handsandhead.com';
      provenance = 'D2C Commercial Lot';
    }

    const sku = p.sku || `RAWX-${(idx + 100).toString().padStart(4, '0')}`;
    const targetRoutingUrl = buildTargetRoutingUrl(sourceDomain, sku);

    return {
      ...p,
      sku,
      divisionSlug,
      divisionTitle,
      sourceDomain,
      targetRoutingUrl,
      provenance: p.provenance || provenance,
      fobPort: p.fobPort || 'Chattogram Port (CGP)',
      gsmSpec: p.specifications?.[0]?.value || 'Certified EPB Export Standard',
      reorderRate: p.reorderRate || (25 + ((idx * 7) % 45)),
      deliveryDate: p.deliveryDate || `Delivery by Oct ${18 + (idx % 12)}`,
      yearsInBusiness: p.yearsInBusiness || (5 + (idx % 25)),
      totalSold: p.totalSold || (1500 + idx * 2400),
      colorVariants: swatches.slice(0, 3 + (idx % 3)),
      bestseller: idx % 3 === 0,
      trendingRank: idx === 0 ? '#1 in Organic Cotton' : idx === 1 ? '#1 in Selvedge Denim' : idx % 2 === 0 ? `Top ${10 + (idx * 3)}% Reordered` : undefined,
      artisanDirect: isCraft || divisionSlug === 'flagship-leather' || divisionSlug === 'leather-cuffs',
    };
  }),
  ...SEED_SHOP_HANDSANDHEAD.map((p, idx) => {
    const sku = `RAWX-SH-${(idx + 10).toString()}`;
    return {
      ...p,
      sku,
      divisionSlug: 'commercial-blanks',
      divisionTitle: 'Ready Commercial Blanks',
      sourceDomain: 'shop.handsandhead.com',
      targetRoutingUrl: buildTargetRoutingUrl('shop.handsandhead.com', sku),
      provenance: 'D2C Commercial Lot',
      fobPort: 'Chattogram Port (CGP)',
      gsmSpec: p.specifications?.[0]?.value || 'Heavyweight Export Blank',
      colorVariants: APPAREL_SWATCHES.slice(0, 4),
      bestseller: idx === 0 || idx === 1,
      trendingRank: idx === 0 ? '#1 High-Density 240 GSM' : '#2 Raw Selvedge Shuttle-Loom',
      artisanDirect: false,
    };
  }),
  ...SEED_ARUTEMIKA_HANDSANDHEAD.map((p, idx) => {
    const sku = `RAWX-ARU-${(idx + 10).toString()}`;
    return {
      ...p,
      sku,
      divisionSlug: 'flagship-leather',
      divisionTitle: 'Arutemika Atelier',
      sourceDomain: 'arutemika.com',
      targetRoutingUrl: buildTargetRoutingUrl('arutemika.com', sku),
      provenance: 'Arutemika Atelier',
      fobPort: 'Chattogram Port (CGP)',
      gsmSpec: p.specifications?.[0]?.value || 'Master Cordwainer Spec',
      colorVariants: idx % 2 === 0 ? JUTE_SWATCHES : CRAFT_SWATCHES,
      bestseller: idx === 0,
      trendingRank: idx === 0 ? '#1 Artisan Khadi Indigo' : '#1 Eco Palm & Jute',
      artisanDirect: true,
    };
  }),
];

// Procedural infinite generator to supply unlimited products on scroll
export function generateMoreProducts(
  page: number,
  pageSize: number = 8,
  sourceDomainFilter?: string,
  categoryFilter?: string,
  searchQuery?: string,
  divisionFilter?: string
): Product[] {
  let pool = [...ALL_INITIAL_PRODUCTS];

  if (divisionFilter && divisionFilter !== 'all') {
    pool = pool.filter((p) => p.divisionSlug === divisionFilter);
  }

  if (sourceDomainFilter && sourceDomainFilter !== 'all') {
    pool = pool.filter((p) => p.sourceDomain === sourceDomainFilter);
  }

  if (categoryFilter && categoryFilter !== 'all') {
    pool = pool.filter((p) => p.categoryId === categoryFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    pool = pool.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.divisionTitle && p.divisionTitle.toLowerCase().includes(q)) ||
        (p.materials && p.materials.some((m) => m.toLowerCase().includes(q))) ||
        (p.supplierName && p.supplierName.toLowerCase().includes(q))
    );
  }

  if (pool.length === 0) return [];

  // Generate unique procedural items for higher pages so user can scroll indefinitely
  const effectivePageIndex = Math.max(0, page > 0 ? page - 1 : 0);
  const results: Product[] = [];
  const startIndex = effectivePageIndex * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const virtualIndex = startIndex + i;
    const poolIndex = ((virtualIndex % pool.length) + pool.length) % pool.length;
    const baseItem = pool[poolIndex];
    if (!baseItem) continue;

    const cycle = Math.floor(Math.max(0, virtualIndex) / pool.length);

    if (cycle === 0) {
      results.push(baseItem);
    } else {
      const variationAdjectives = [
        'Premium Export Spec',
        'Bulk Custom Batch',
        'Rapid Turnaround Edition',
        'Eco-Wash Sustainable',
        'Organic Certified Lot',
        'High-Tensile Contract',
        'Private Label Ready',
      ];
      const adj = variationAdjectives[cycle % variationAdjectives.length];
      const baseMoq = baseItem.moq || 100;
      const newMoq = Math.max(50, Math.round(baseMoq * (0.8 + ((cycle * 0.15) % 0.6))));
      const priceMultiplier = 0.92 + ((cycle * 0.05) % 0.25);

      const modifiedPriceTiers = (baseItem.priceTiers || []).map((t) => ({
        ...t,
        priceUSD: Number((t.priceUSD * priceMultiplier).toFixed(2)),
      }));

      const newSku = `${baseItem.sku || 'RAWX'}-c${cycle}-v${i}`;
      const newUrl = buildTargetRoutingUrl(baseItem.sourceDomain || 'b2b.handsandhead.com', newSku);

      results.push({
        ...baseItem,
        id: `${baseItem.id}-c${cycle}-v${i}`,
        sku: newSku,
        title: `${adj} • ${baseItem.title}`,
        moq: newMoq,
        priceTiers: modifiedPriceTiers,
        targetRoutingUrl: newUrl,
        reorderRate: Math.min(88, Math.max(18, (baseItem.reorderRate || 35) + ((cycle * 3) % 15))),
        totalSold: (baseItem.totalSold || 1000) + cycle * 3500 + i * 400,
        deliveryDate: `Delivery by Nov ${10 + ((virtualIndex * 3) % 20)}`,
      });
    }
  }

  return results;
}
