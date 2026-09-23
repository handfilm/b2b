export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'JPY';
export type LanguageCode = 'EN' | 'BN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export type PersonaMode = 'buyer' | 'seller';

export interface ProductionSla {
  totalLines: number;
  bookedCapacityPercentage: number;
  sampleLeadDays: number;
  productionLeadDays: number;
  nextAvailableSlot: string;
}

export interface ComplianceVaultRecord {
  certificateId: string;
  auditDate: string;
  validUntil: string;
  auditorName: string;
  environmentalRating: string;
  waterTreatment: string;
  epbRegNo: string;
  bgmeaRegNo?: string;
  bkmeaRegNo?: string;
  auditScore?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  companyName: string;
  role: PersonaMode;
  country: string;
  avatarUrl?: string;
  verified: boolean;
  whatsappEnabled?: boolean;
  memberSince: string;
  loginMethod: 'google' | 'email_magic' | 'password';
}

export interface TechPackSpec {
  id: string;
  productType: string;
  productCategory: CategoryId;
  fabricWeight: string;
  colorTcx: string;
  colorName: string;
  colorHex: string;
  sizes: {
    XS: number;
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
  };
  totalPieces: number;
  stitchingNotes: string;
  incoterms: 'FOB' | 'CIF' | 'EXW' | 'CFR';
  targetDate: string;
  attachedFiles: TechPackAttachment[];
  submittedAt?: string;
  buyerCompany?: string;
  buyerEmail?: string;
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
  sourceDomain?: string;
  divisionTitle?: string;
  divisionSlug?: string;
  targetRoutingUrl?: string;
  sku?: string;
  provenance?: string;
  fobPort?: string;
  gsmSpec?: string;
  reorderRate?: number;
  deliveryDate?: string;
  yearsInBusiness?: number;
  totalSold?: number;
  colorVariants?: { name: string; hex: string; inStock?: boolean }[];
  colors?: { name: string; hex: string }[];
  customizationOptions?: string[];
  category?: string;
  bestseller?: boolean;
  trendingRank?: string;
  artisanDirect?: boolean;
  slug?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  subdivision?: string;
  exportComplianceStatus?: string;
  moqBadge?: string;
  techPackAvailable?: boolean;
  price?: number;
  complianceBadges?: string[];
  supplierLocation?: string;
  brand?: string;
  club?: string;
  frontPrint?: string;
  backPrint?: string;
}

export interface B2bSubcategory {
  id: string;
  slug: string;
  name: string;
  count?: number;
}

export interface B2bCatalogCategory {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  icon?: string;
  subcategories: B2bSubcategory[];
}

export interface B2bCatalogProduct extends Product {
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  exportComplianceStatus: string;
  moqBadge: string;
  price: number;
}


export interface Supplier {
  id: string;
  name: string;
  district: string;
  establishedYear: number;
  employeeCount: string;
  leedStatus?: 'Platinum' | 'Gold' | 'Certified';
  bgmeaMember: boolean;
  bondedWarehouse: boolean;
  epbRegistered: boolean;
  exportMarkets: string[];
  exportDestinations: string[];
  annualCapacity: string;
  certifications: string[];
  compliance: string[];
  complianceVault?: ComplianceVaultRecord;
  productionSla: ProductionSla;
  bankLcAccepted: boolean;
  responseRatePercent: number;
  verified: boolean;
  contactEmail: string;
  phone: string;
  whatsapp?: string;
  about: string;
  avatarUrl: string;
  coverUrl?: string;
  oekoTexCertified?: boolean;
  bsciAudited?: boolean;
  gotsCertified?: boolean;
  activeLines?: number;
  lineAvailabilityPercentage?: number;
  lat?: number;
  lng?: number;
  industrialZone?: string;
}

export interface TechPackAttachment {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
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
  techPackFile?: TechPackAttachment;
  status: 'Received' | 'Quotes Compiling' | 'Dispatched to 5 Factories' | 'Bid Placed' | string;
  createdAt: string;
  targetTimelineDays?: number;
  assignedFactories?: string[];
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
  status: 'Payment Pending' | 'Dispatched via Air Courier' | 'Sample In Production' | 'Factory Bid Pending' | string;
}

export interface SupplierFilterParams {
  category?: CategoryId;
  district?: string;
  bondedStatus?: boolean | 'all';
  bondedOnly?: boolean;
  searchTerm?: string;
  search?: string;
  leedOnly?: boolean;
}

export interface MarketplaceStats {
  verifiedExporters: number;
  bondedUnits: number;
  activeLines: number;
  annualExportUSD: string;
  leedGreenFactories: string;
  totalCatalogItems: number;
  averageResponseTimeHours: number;
}

export interface FactoryProductionLine {
  id: string;
  lineName: string;
  category: string;
  monthlyCapacityPcs: number;
  currentBookedPct: number;
  nextOpenSlotDate: string;
  status: 'Open' | 'Partially Booked' | 'Fully Booked';
  operatorCount: number;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  role: string;
  country: string;
  countryCode: string;
  flag: string;
  logoUrl: string;
  annualSourcingBudgetUSD: string;
  sourcingBudgetUSD?: number | string;
  minOrderQty?: number;
  sectorsOfInterest: CategoryId[];
  verifiedStatus: 'Gold Verified Enterprise' | 'Retail Conglomerate' | 'Chamber Registered' | 'Global Sourcing Agent' | 'Verified B2B Lead';
  totalOrdersPlaced: number;
  activeLcs: number;
  totalVolumeExported: string;
  joinedYear: number;
  recentInquiry: string;
  preferredIncoterms: ('FOB' | 'CIF' | 'CFR' | 'DDP' | 'EXW')[];
  testimonial: {
    quote: string;
    quoteBn: string;
    rating: number;
    date: string;
  };
  customerId?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  totalSpentUSD?: number;
  tags?: string[];
  note?: string;
  taxExempt?: boolean;
  leadType?: 'RMG' | 'RMLG' | 'Leather Goods';
  pendingInquiriesCount?: number;
  recentActivityTime?: string;
  recentActivitySummary?: string;
}

export interface LiveTradeEvent {
  id: string;
  timestamp: string;
  type: 'rfq_broadcast' | 'sample_dispatched' | 'lc_opened' | 'container_shipped' | 'quote_placed';
  title: string;
  titleBn: string;
  details: string;
  detailsBn: string;
  description?: string;
  valueUSD?: number;
  partyName: string;
  partner?: string;
  targetFactory?: string;
  country: string;
  flag: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  status: 'active' | 'standby';
  triggersCount: number;
  lastExecution: string;
  latencyMs: number;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  workflowId: string;
  workflowName: string;
  status: 'success' | 'processing' | 'routed';
  details: string;
  detailsBn: string;
  payloadPreview?: string;
}

// ============================================================================
// NEXOS DATA SYNCING PIPELINE INTERFACES
// ============================================================================

export type B2BProduct = Product;

export interface RawGoogleDriveAsset {
  driveFileId: string;
  fileName: string;
  folderPath: string;
  d2cRetailPriceUSD: number;
  thumbnailUrl?: string;
  webContentLink?: string;
  directImageUrl?: string;
  mimeType?: string;
  sku?: string;
  title?: string;
  description?: string;
  categoryFolder?: string;
  fabricComposition?: string;
  gsm?: string | number;
  availableColors?: Array<{ name: string; hex: string }>;
  leadTimeDays?: number;
  moq?: number;
  inStock?: boolean;
  metadata?: Record<string, any>;
  lastModified?: string;
}

export interface RawArutemikaProduct {
  id: string;
  handle: string;
  title: string;
  leatherType: string;
  tanneryOrigin?: string;
  construction: string;
  japanRetailYen?: number;
  wholesalePriceUSD: number;
  moq: number;
  images: string[];
  hardware?: string;
  soling?: string;
  colors: Array<{ name: string; hex: string }>;
  atelierLocation?: string;
  sku?: string;
  leadTimeDays?: number;
  weightGrams?: number;
  tags?: string[];
  description?: string;
}

export interface NexosDatabaseMetrics {
  activeBuyers: number;
  verifiedSuppliers: number;
  totalTradeVol: string;
  bdtSalesVolume: string;
  pendingRfqs?: number;
  customsSpeedDays?: number;
  syncedSourcesCount?: number;
  lastSyncTimestamp?: string;
}

export interface PipelineSyncEvent {
  id: string;
  source: 'google_drive' | 'arutemika' | 'nexos_admin';
  sourceDomain: string;
  recordsProcessed: number;
  recordsFailed: number;
  latencyMs: number;
  status: 'synced' | 'streaming' | 'cached' | 'error';
  timestamp: string;
  message: string;
}

// ============================================================================
// B2B INQUIRY CART & RAWX BOT RFQ THREAD TYPES
// ============================================================================

export interface InquiryCartItem {
  id: string;
  product: Product;
  sku: string;
  requestedQty: number;
  targetPrice: number; // in USD
  itemMessage: string;
  selectedColor?: string;
  supplierId?: string;
  supplierName?: string;
}

export interface RfqThreadProduct {
  sku: string;
  title?: string;
  productId?: string;
  requestedQty: number;
  targetPrice: number;
  supplierId?: string;
  supplierName?: string;
  imageUrl?: string;
  customNotes?: string;
}

export interface RfqThreadMessage {
  id: string;
  sender: 'buyer' | 'ai' | 'human';
  senderName: string;
  content: string;
  timestamp: string;
  isAutomated?: boolean;
}

export interface RfqThread {
  id: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  supplierId: string;
  supplierName?: string;
  products: RfqThreadProduct[];
  initialMessage: string;
  status: 'active' | 'pending_approval' | 'quote_issued' | 'closed';
  handledBy: 'ai' | 'human';
  createdAt: any;
  updatedAt?: any;
  messages?: RfqThreadMessage[];
  lastMessage?: string;
}

