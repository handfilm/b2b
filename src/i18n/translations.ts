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
    
    // Language Switcher
    language: 'Language',
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
    buyerPortal: 'ক্রেতা পোর্টাল',
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
    
    // Language Switcher
    language: 'ভাষা',
  },
};

export const getTranslation = (lang: LanguageCode) => TRANSLATIONS[lang] || TRANSLATIONS.EN;
