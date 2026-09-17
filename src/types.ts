export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export type CategoryId =
  | 'all'
  | 'rmg-apparel'
  | 'jute-eco'
  | 'leather-footwear'
  | 'home-textiles'
  | 'ceramics-tableware'
  | 'agro-seafood'
  | 'pharmaceuticals'
  | 'handicrafts-brass';

export interface Category {
  id: CategoryId;
  name: string;
  shortDesc: string;
  iconName: string;
  itemCount: number;
}

export interface PriceTier {
  minQty: number;
  maxQty?: number;
  priceUSD: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  categoryId: CategoryId;
  hsCode: string;
  description: string;
  moq: number;
  unit: string;
  priceTiers: PriceTier[];
  leadTimeDays: number;
  portOfLoading: string;
  incoterms: ('FOB' | 'CIF' | 'CFR' | 'EXW')[];
  certifications: string[];
  supplierId: string;
  supplierName: string;
  supplierVerified: boolean;
  supplierRating: number;
  images: string[];
  specifications: ProductSpecification[];
  materials: string[];
  ecoFriendly: boolean;
  sampleAvailable: boolean;
  samplePriceUSD: number;
  customizationOffered: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  district: string;
  establishedYear: number;
  employeeCount: string;
  leedStatus?: 'Platinum' | 'Gold' | 'Certified';
  bgmeaMember: boolean;
  exportMarkets: string[];
  annualCapacity: string;
  certifications: string[];
  responseRatePercent: number;
  verified: boolean;
  contactEmail: string;
  phone: string;
  about: string;
  avatarUrl: string;
}

export interface RfqSubmission {
  id: string;
  buyerName: string;
  companyName: string;
  buyerCountry: string;
  email: string;
  categoryId: CategoryId;
  productRequirement: string;
  targetQuantity: number;
  targetUnitPriceUSD: number;
  incoterms: string;
  destinationPort: string;
  specNotes: string;
  status: 'Received' | 'Quotes Compiling' | 'Dispatched to 5 Factories';
  createdAt: string;
}

export interface SampleInquiry {
  id: string;
  productId: string;
  productTitle: string;
  supplierName: string;
  quantity: number;
  sampleFeeUSD: number;
  courierFeeUSD: number;
  customNotes: string;
  buyerEmail: string;
  shippingCountry: string;
  createdAt: string;
  trackingNumber: string;
  status: 'Payment Pending' | 'Dispatched via Air Courier' | 'Sample In Production';
}
