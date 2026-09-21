import { LanguageCode } from '../types';

export const TRANSLATIONS = {
  EN: {
    // Brand & Ecosystem
    portalTitle: 'Made in BD',
    portalSubtitle: 'B2B Global Trade Portal',
    nexusLive: 'Nexus Live Connected',
    nexusFallback: 'Nexus Fail-Safe Sync',
    ecosystem: 'Ecosystem',
    freightMatrix: 'Port Freight Matrix',
    superAutomation: 'Super Automation',
    superAutomationDesc: 'Algorithmic RFQ routing, costing engine & smart escrow triggers',
    
    // Navigation Tabs
    wholesaleCatalog: 'Wholesale Catalog',
    verifiedFactories: 'Verified EPB Factories',
    globalCustomers: 'Global Buyers & Customers',
    bdExportAdvantage: 'BD Export Advantage',
    
    // Personas
    buyerPortal: 'Buyer Portal',
    manufacturerHub: 'Manufacturer Hub',
    
    // Trust Badges
    escrowBadge: '50% Advance JIT Escrow Protection',
    incotermsBadge: 'ICC Incoterms 2020 Compliant',
    bondedStatus: 'Bonded Warehouse Licensed',
    leedCertified: 'LEED Green Certified',
    
    // Search & Filters
    searchPlaceholderBuyer: 'Search HS codes (e.g. 6109), products, or bonded mills...',
    searchPlaceholderSeller: 'Search buyer RFQs, tech packs, or buyer companies...',
    allCategories: 'All Categories',
    allDistricts: 'All Districts',
    bondedOnly: 'Bonded EPB Only',
    leedOnly: 'LEED Certified Only',
    filterByDistrict: 'District',
    showingResults: 'Showing',
    productsCount: 'products from verified Bangladeshi exporters',
    factoriesCount: 'accredited manufacturing enterprises',
    customersCount: 'verified international sourcing enterprises',
    clearFilter: 'Clear',
    
    // Action CTAs
    postRfq: 'Post RFQ',
    requestSample: 'Request Courier Sample',
    contactFactory: 'Direct Factory Inquiry',
    viewDetails: 'View Specifications',
    inquiryTray: 'Inquiries & Orders',
    forceSync: 'Realtime Sync',
    syncing: 'Syncing Data...',
    syncedNow: 'Live Data Synchronized',
    techPackStudio: 'CAD TechPack',
    feederShipping: 'Feeder Shipping',
    rawxBot: 'RAWx Bot',
    
    // Catalog Card Details
    moq: 'MOQ',
    leadTime: 'Lead Time',
    days: 'days',
    portOfLoading: 'Port of Loading',
    incoterms: 'Incoterms',
    certifications: 'Certifications',
    pricePerUnit: 'Starting at',
    capacity: 'Annual Capacity',
    exportDestinations: 'Export Markets',
    responseRate: 'Response Rate',
    activeLines: 'Active Lines',
    fobPortVal: 'Chattogram Port (CGP)',
    directOrder: 'Direct Order',
    viewTechPack: 'View TechPack',
    
    // Hero & Search
    heroTitle: 'Bangladesh B2B Global Trade & Export Engine',
    heroSubtitle: 'Direct factory procurement from 3,100+ EPB accredited manufacturers, bonded mills, and curated ready catalogs with 50% JIT Escrow protection.',
    heroStatMills: 'Verified EPB Mills',
    heroStatBuyers: 'Global Buyers',
    heroStatVolume: 'BDT Sales Volume',
    heroStatUptime: 'Sync Pipeline SLA',
    quickSearch: 'Trending HS Codes:',
    
    // Sourcing Node Dropdown
    sourcingNode: 'Sourcing Node',
    allNodes: 'All 12 Federated Nodes',
    masterHubDesc: 'Central Backend API & Catalog',
    shopD2cDesc: 'D2C Commercial Blanks (shop.handsandhead.com)',
    arutemikaDesc: 'Japan Export Atelier (arutemika.com)',
    
    // Ecosystem Grid
    ecosystemGridTitle: 'Connected Federated Trade Portals',
    ecosystemGridSubtitle: 'Access specialized industrial divisions across the handsandhead.com B2B export network.',
    visitPortal: 'Visit Portal',
    filterDivision: 'Filter Products',
    allPortalsBadge: '12 Active Nodes',
    
    // Customer Hub
    customersTitle: 'Verified Global Buyers & Retail Conglomerates',
    customersSubtitle: 'International retail brands, department stores, and sourcing consortiums actively trading with Bangladesh.',
    liveTickerTitle: 'Realtime Bangladesh Export Trading Activity',
    sourcingBudget: 'Annual Sourcing Volume',
    activeContracts: 'Active Letters of Credit (L/C)',
    totalShipped: 'Total Export Delivered',
    preferredTerms: 'Preferred Incoterms',
    sectorsSourced: 'Sourcing Categories',
    buyerTestimonial: 'Executive Trade Endorsement',
    verifiedBuyerBadge: 'Verified Enterprise Buyer',
    
    // Realtime Events
    eventRfq: 'RFQ Broadcast',
    eventSample: 'Sample Dispatched',
    eventLc: 'Letter of Credit Issued',
    eventContainer: 'Container Shipped',
    eventQuote: 'Factory Bid Placed',
    
    // Automation Modal
    autoPilotTitle: 'Autonomous Trade Engine (AI Auto-Pilot)',
    autoPilotSubtitle: 'Zero-touch RFQ parsing, factory capability matching, and milestone escrow execution.',
    autoPilotActive: 'Engine Online - Auto Matching',
    autoPilotPaused: 'Engine Standby',
    toggleEngine: 'Toggle Auto-Pilot',
    algorithmicCosting: 'Dynamic CM & FOB Cost Calculator',
    fabricGsm: 'Fabric GSM',
    yarnIndex: 'Raw Cotton / Yarn Price ($/lb)',
    orderQuantity: 'Target Order Qty (Pcs)',
    estFobPrice: 'Estimated FOB Chittagong',
    yarnCost: 'Yarn & Fiber',
    knittingDyeing: 'Knitting & Eco-Dyeing',
    cutMake: 'Cut & Make (CM)',
    freightOverhead: 'Freight & Port Handling',
    webhookConfig: 'Real-Time ERP / Webhook Integration',
    webhookUrl: 'Destination Webhook URL',
    testWebhook: 'Dispatch Test Webhook',
    webhookSuccess: 'Webhook payload sent successfully (HTTP 200)',
    automationLogs: 'Live Automation Execution Stream',
    
    // Sorting & Filters
    sortBy: 'Sort by',
    sortRelevance: 'Best Match',
    sortMoqAsc: 'Lowest MOQ',
    sortLeadTime: 'Fastest Lead Time',
    sortReorder: 'Highest Reorder Rate',
    advancedFilters: 'Filters',
    resetFilters: 'Reset',
    divisionLabel: 'Division',
    allDivisions: 'All Divisions',
    
    // Categories
    catRmg: 'RMG & Apparel',
    catLeather: 'Leather & Footwear',
    catJute: 'Jute & Eco-Fiber',
    catTextiles: 'Home Textiles',
    catCeramics: 'Ceramics & Tableware',
    catActivewear: 'Activewear & Sport',
    catAccessories: 'Accessories & Trims',
    
    // Value Guarantees
    guaranteeEscrowTitle: '50% JIT Escrow Protection',
    guaranteeEscrowDesc: 'Funds held in tier-1 commercial escrow until pre-shipment SGS/Bureau Veritas inspection signoff.',
    guaranteePortsTitle: 'Chattogram & Mongla Seaports',
    guaranteePortsDesc: 'Direct feeder berthing to Colombo, Singapore, and Tanjung Pelepas with bonded green lane clearance.',
    guaranteeLeedTitle: 'LEED Platinum Green Mills',
    guaranteeLeedDesc: 'World highest density of USGBC certified green manufacturing facilities operating with net-zero emissions.',
    guaranteeRawxTitle: 'RAWx Algorithmic Routing',
    guaranteeRawxDesc: 'Instant tech pack parsing, capacity matching across 3,100+ audited factory lines, and instant FOB pricing.',
    
    // Footer
    footerTradeDesk: 'Dhaka Trade Desk & Statutory EPB Integration',
    footerRegionalHubs: 'Regional Manufacturing Hubs',
    footerLogistics: 'Logistics & Escrow Infrastructure',
    footerPlatform: 'Federated Infrastructure & Live Sync',
    footerCopyright: 'Made in Bangladesh B2B Trade Portal. Federated with handsandhead.ai.studio, shop.handsandhead.com & arutemika.com.',
    
    // Floating Dock
    dockPostRfq: 'Post RFQ',
    dockLiveSync: 'Live Sync',
    dockRawxAi: 'RAWx AI',
    dockTechPack: 'CAD TechPack',
    dockShipping: 'Feeder Calc',
    dockInquiries: 'Inquiry Tray',
    
    // Language Switcher
    language: 'Language',
    toggleBn: 'বাংলা',
    toggleEn: 'EN',
  },
  
  BN: {
    // Brand & Ecosystem
    portalTitle: 'মেড ইন বিডি',
    portalSubtitle: 'বি২বি গ্লোবাল ট্রেড পোর্টাল',
    nexusLive: 'নেক্সাস লাইভ সংযুক্ত',
    nexusFallback: 'নেক্সাস ফেইল-সেফ সিঙ্ক',
    ecosystem: 'ইকোসিস্টেম',
    freightMatrix: 'বন্দর ফ্রেইট মেট্রিক্স',
    superAutomation: 'সুপার অটোমেশন',
    superAutomationDesc: 'অ্যালগরিদমিক আরএফকিউ রাউটিং, কস্টিং ইঞ্জিন ও স্মার্ট এসক্রো',
    
    // Navigation Tabs
    wholesaleCatalog: 'পাইকারি ক্যাটালগ',
    verifiedFactories: 'যাচাইকৃত ইপিবি কারখানা',
    globalCustomers: 'আন্তর্জাতিক ক্রেতা ও প্রতিষ্ঠান',
    bdExportAdvantage: 'বাংলাদেশের রপ্তানি সুবিধা',
    
    // Personas
    buyerPortal: 'বায়ার পোর্টাল',
    manufacturerHub: 'প্রস্তুতকারক হাব',
    
    // Trust Badges
    escrowBadge: '৫০% অগ্রিম জেআইটি এসক্রো নিরাপত্তা',
    incotermsBadge: 'আইসিসি ইনকোটার্মস ২০২০ অনুমোদিত',
    bondedStatus: 'বন্ডেড ওয়্যারহাউস লাইসেন্সধারী',
    leedCertified: 'লিড গ্রিন সার্টিফাইড কারখানা',
    
    // Search & Filters
    searchPlaceholderBuyer: 'এইচএস কোড (যেমন: 6109), পণ্য বা বন্ডেড কারখানা খুঁজুন...',
    searchPlaceholderSeller: 'ক্রেতার আরএফকিউ, টেক-প্যাক বা ক্রেতা কোম্পানি খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    allDistricts: 'সকল জেলা',
    bondedOnly: 'কেবল বন্ডেড ইপিবি',
    leedOnly: 'লিড সার্টিফাইড কারখানা',
    filterByDistrict: 'জেলা',
    showingResults: 'প্রদর্শিত হচ্ছে',
    productsCount: 'টি যাচাইকৃত বাংলাদেশি রপ্তানি পণ্য',
    factoriesCount: 'টি আন্তর্জাতিক মানসম্পন্ন কারখানা',
    customersCount: 'টি যাচাইকৃত বৈশ্বিক ক্রেতা প্রতিষ্ঠান',
    clearFilter: 'মুছুন',
    
    // Action CTAs
    postRfq: 'আরএফকিউ পোস্ট করুন',
    requestSample: 'কুরিয়ার স্যাম্পল অর্ডার',
    contactFactory: 'কারখানায় সরাসরি যোগাযোগ',
    viewDetails: 'বিস্তারিত স্পেসিফিকেশন',
    inquiryTray: 'অনুসন্ধান ও অর্ডার',
    forceSync: 'রিয়েলটাইম সিঙ্ক',
    syncing: 'তথ্য সিঙ্ক হচ্ছে...',
    syncedNow: 'লাইভ তথ্য সিঙ্ক সম্পন্ন',
    techPackStudio: 'ক্যাড টেকপ্যাক',
    feederShipping: 'ফিডার শিপিং',
    rawxBot: 'রক্স বট',
    
    // Catalog Card Details
    moq: 'সর্বনিম্ন অর্ডার (MOQ)',
    leadTime: 'ডেলিভারি সময়',
    days: 'দিন',
    portOfLoading: 'রপ্তানি বন্দর',
    incoterms: 'ইনকোটার্মস',
    certifications: 'সার্টিফিকেশন',
    pricePerUnit: 'মূল্য শুরু',
    capacity: 'বার্ষিক উৎপাদন সক্ষমতা',
    exportDestinations: 'রপ্তানি বাজারসমূহ',
    responseRate: 'সাড়া দেওয়ার হার',
    activeLines: 'সক্রিয় প্রোডাকশন লাইন',
    fobPortVal: 'চট্টগ্রাম বন্দর (CGP)',
    directOrder: 'সরাসরি অর্ডার',
    viewTechPack: 'টেকপ্যাক দেখুন',
    
    // Hero & Search
    heroTitle: 'বাংলাদেশ বি২বি গ্লোবাল ট্রেড ও রপ্তানি ইঞ্জিন',
    heroSubtitle: '৩,১০০+ ইপিবি অনুমোদিত আন্তর্জাতিক মানের কারখানা, বন্ডেড মিল এবং ৫০% জেআইটি এসক্রো সুরক্ষাসহ বিশ্বস্ত পাইকারি সোর্সিং।',
    heroStatMills: 'যাচাইকৃত ইপিবি মিল',
    heroStatBuyers: 'বৈশ্বিক ক্রেতা প্রতিষ্ঠান',
    heroStatVolume: 'বিডিটি বিক্রয় ভলিউম',
    heroStatUptime: 'সিঙ্ক পাইপলাইন এসএলএ',
    quickSearch: 'জনপ্রিয় এইচএস কোড:',
    
    // Sourcing Node Dropdown
    sourcingNode: 'সোর্সিং নোড',
    allNodes: 'সকল ১২টি ফেডারেটেড নোড',
    masterHubDesc: 'সেন্ট্রাল ব্যাকএন্ড এপিআই ও ক্যাটালগ',
    shopD2cDesc: 'ডি২সি কমার্শিয়াল ব্ল্যাঙ্কস (shop.handsandhead.com)',
    arutemikaDesc: 'জাপান এক্সপোর্ট অ্যাটেলিয়ার (arutemika.com)',
    
    // Ecosystem Grid
    ecosystemGridTitle: 'সংযুক্ত ফেডারেটেড বাণিজ্য পোর্টালসমূহ',
    ecosystemGridSubtitle: 'handsandhead.com নেটওয়ার্কের বিশেষায়িত শিল্প বিভাগ ও প্রস্তুতকারক পোর্টালসমূহ ব্যবহার করুন।',
    visitPortal: 'পোর্টাল দেখুন',
    filterDivision: 'পণ্য ফিল্টার করুন',
    allPortalsBadge: '১২টি সক্রিয় নোড',
    
    // Customer Hub
    customersTitle: 'যাচাইকৃত বৈশ্বিক ক্রেতা ও রিটেল জায়ান্টস',
    customersSubtitle: 'আন্তর্জাতিক ব্র্যান্ড, ডিপার্টমেন্ট স্টোর এবং সোর্সিং কনসোর্টিয়াম যারা নিয়মিত বাংলাদেশ থেকে পাইকারি আমদানি করছে।',
    liveTickerTitle: 'বাংলাদেশ রপ্তানি বাণিজ্যের রিয়েলটাইম লাইভ লেনদেন',
    sourcingBudget: 'বার্ষিক সোর্সিং ভলিউম',
    activeContracts: 'সক্রিয় লেটার অফ ক্রেডিট (L/C)',
    totalShipped: 'মোট সফল রপ্তানি',
    preferredTerms: 'পছন্দনীয় ইনকোটার্মস',
    sectorsSourced: 'যেসব পণ্য আমদানি করে',
    buyerTestimonial: 'আন্তর্জাতিক ক্রেতার প্রশংসাপত্র',
    verifiedBuyerBadge: 'যাচাইকৃত এন্টারপ্রাইজ বায়ার',
    
    // Realtime Events
    eventRfq: 'আরএফকিউ সম্প্রচারিত',
    eventSample: 'কুরিয়ার স্যাম্পল প্রেরিত',
    eventLc: 'লেটার অফ ক্রেডিট (L/C) খোলা হয়েছে',
    eventContainer: 'কন্টেইনার জাহাজে লোড সম্পন্ন',
    eventQuote: 'কারখানার দরপ্রস্তাব জমা',
    
    // Automation Modal
    autoPilotTitle: 'স্বয়ংক্রিয় বাণিজ্য ইঞ্জিন (এআই অটো-পাইলট)',
    autoPilotSubtitle: 'জিরো-টাচ আরএফকিউ প্রসেসিং, কারখানা ম্যাচিং এবং মাইলস্টোন এসক্রো রিলিজ।',
    autoPilotActive: 'ইঞ্জিন সক্রিয় - স্বয়ংক্রিয় ম্যাচিং চলছে',
    autoPilotPaused: 'ইঞ্জিন স্ট্যান্ডবাই',
    toggleEngine: 'অটো-পাইলট টগল করুন',
    algorithmicCosting: 'ডায়নামিক সিএম ও এফওবি কস্টিং ক্যালকুলেটর',
    fabricGsm: 'ফেব্রিক জিএসএম (GSM)',
    yarnIndex: 'তুলা/সুতার আন্তর্জাতিক মূল্য ($/lb)',
    orderQuantity: 'কাঙ্ক্ষিত অর্ডার পরিমাণ (পিস)',
    estFobPrice: 'আনুমানিক এফওবি চট্টগ্রাম মূল্য',
    yarnCost: 'সুতা ও ফাইবার খরচ',
    knittingDyeing: 'নিটিং ও পরিবেশবান্ধব ডাইং',
    cutMake: 'কাট অ্যান্ড মেক (CM)',
    freightOverhead: 'বন্দর ফ্রেইট ও হ্যান্ডলিং',
    webhookConfig: 'রিয়েল-টাইম ইআরপি / ওয়েবহুক সংযোগ',
    webhookUrl: 'ডেস্টিনেশন ওয়েবহুক ইউআরএল',
    testWebhook: 'টেস্ট ওয়েবহুক পাঠান',
    webhookSuccess: 'ওয়েবহুক পেলোড সফলভাবে পাঠানো হয়েছে (HTTP 200)',
    automationLogs: 'লাইভ অটোমেশন এক্সিকিউশন স্ট্রিম',
    
    // Sorting & Filters
    sortBy: 'সাজান',
    sortRelevance: 'সেরা মিল',
    sortMoqAsc: 'সর্বনিম্ন MOQ',
    sortLeadTime: 'দ্রুততম ডেলিভারি',
    sortReorder: 'সর্বোচ্চ রি-অর্ডার রেট',
    advancedFilters: 'ফিল্টার',
    resetFilters: 'রিসেট',
    divisionLabel: 'ডিভিশন',
    allDivisions: 'সকল বিভাগ',
    
    // Categories
    catRmg: 'তৈরি পোশাক ও আরএমজি',
    catLeather: 'চামড়া ও ফুটওয়্যার',
    catJute: 'পাট ও পরিবেশবান্ধব ফাইবার',
    catTextiles: 'হোম টেক্সটাইলস',
    catCeramics: 'সিরামিকস ও তৈজসপত্র',
    catActivewear: 'অ্যাক্টিভওয়্যার ও স্পোর্টসওয়্যার',
    catAccessories: 'এক্সেসরিজ ও ট্রিমস',
    
    // Value Guarantees
    guaranteeEscrowTitle: '৫০% জেআইটি এসক্রো নিরাপত্তা',
    guaranteeEscrowDesc: 'প্রি-শিপমেন্ট এসজিএস/ব্যুরো ভেরিটাস কোয়ালিটি ইন্সপেকশন অনুমোদন না হওয়া পর্যন্ত অর্থ সম্পূর্ণ সুরক্ষিত।',
    guaranteePortsTitle: 'চট্টগ্রাম ও মোংলা সমুদ্রবন্দর',
    guaranteePortsDesc: 'কলম্বো, সিঙ্গাপুর ও তানজুং পেলেপাস ফিডার কানেক্টিভিটি এবং বন্ডেড কাস্টমস গ্রিন চ্যানেল সুবিধা।',
    guaranteeLeedTitle: 'লিড প্লাটিনাম গ্রিন মিলস',
    guaranteeLeedDesc: 'ইউএসজিবিসি স্বীকৃত বিশ্বের সর্বোচ্চ সংখ্যক পরিবেশবান্ধব ও কার্বন-নিউট্রাল গ্রিন কারখানা নেটওয়ার্ক।',
    guaranteeRawxTitle: 'রক্স অ্যালগরিদমিক রাউটিং',
    guaranteeRawxDesc: 'তাৎক্ষণিক টেকপ্যাক বিশ্লেষণ, ৩,১০০+ কারখানার সক্ষমতা ম্যাচিং এবং তাৎক্ষণিক এফওবি কস্টিং প্রাক্কলন।',
    
    // Footer
    footerTradeDesk: 'ঢাকা ট্রেড ডেস্ক ও সংবিধিবদ্ধ ইপিবি ইন্টিগ্রেশন',
    footerRegionalHubs: 'আঞ্চলিক ম্যানুফ্যাকচারিং হাবসমূহ',
    footerLogistics: 'লজিস্টিকস ও এসক্রো অবকাঠামো',
    footerPlatform: 'ফেডারেটেড ইনফ্রাস্ট্রাকচার ও লাইভ সিঙ্ক',
    footerCopyright: 'মেড ইন বাংলাদেশ বি২বি ট্রেড পোর্টাল। handsandhead.ai.studio, shop.handsandhead.com ও arutemika.com এর সাথে সংযুক্ত।',
    
    // Floating Dock
    dockPostRfq: 'আরএফকিউ',
    dockLiveSync: 'লাইভ সিঙ্ক',
    dockRawxAi: 'রক্স এআই',
    dockTechPack: 'ক্যাড টেকপ্যাক',
    dockShipping: 'শিপিং ক্যালক',
    dockInquiries: 'অনুসন্ধান ঝুড়ি',
    
    // Language Switcher
    language: 'ভাষা',
    toggleBn: 'বাংলা',
    toggleEn: 'EN',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.EN;

export const getTranslation = (lang: LanguageCode) => TRANSLATIONS[lang] || TRANSLATIONS.EN;

/**
 * Converts Western digits (0-9) to Bengali digits (০-৯) if language is BN.
 */
export function toBengaliDigits(input: string | number, lang: LanguageCode = 'BN'): string {
  if (lang !== 'BN') return String(input);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}
