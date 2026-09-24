import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { LiveTradeMatrixStrip } from './components/LiveTradeMatrixStrip';
import { CategoriesSlidersSection } from './components/CategoriesSlidersSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SupplierCard } from './components/SupplierCard';
import { CustomerTradeHub } from './components/CustomerTradeHub';
import { SuperAutomationModal } from './components/SuperAutomationModal';
import { RfqModal } from './components/RfqModal';
import { ShippingCalculatorModal } from './components/ShippingCalculatorModal';
import { SampleOrderModal } from './components/SampleOrderModal';
import { InquiryDrawer } from './components/InquiryDrawer';
import { InsightsView } from './components/InsightsView';
import { ManufacturerHub } from './components/ManufacturerHub';
import { AuthModal } from './components/AuthModal';
import { TechPackModal } from './components/TechPackModal';
import { ComplianceVaultDrawer } from './components/ComplianceVaultDrawer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { EcosystemGridSection } from './components/EcosystemGridSection';
import { FloatingRightDock } from './components/FloatingRightDock';
import { Footer } from './components/Footer';
import { NexosSyncProvider, useNexosSync } from './context/NexosSyncContext';
import { InquiryCartProvider, useInquiryCart } from './context/InquiryCartContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import { InquiryCart } from './components/InquiryCart';
import { RawxBotChat } from './components/RawxBotChat';
import { NexosPipelineModal } from './components/NexosPipelineModal';
import { MobileHighTechDock } from './components/MobileHighTechDock';
import { BangladeshManufacturerMap } from './components/BangladeshManufacturerMap';
import { GoogleMapsManufacturerDirectory } from './components/GoogleMapsManufacturerDirectory';
import { CatalogGrid } from './components/CatalogGrid';
import { FactoryProfileDrawer } from './components/FactoryProfileDrawer';
import { RequestSpecDrawer } from './components/RequestSpecDrawer';
import { BuyerDashboardShell } from './pages/BuyerDashboard';
import { SellerDashboardShell } from './pages/SellerDashboard';
import { B2bCatalogPage } from './pages/B2bCatalogPage';
import {
  saveRfqToFirestore,
  saveSampleToFirestore,
  subscribeToRfqs,
  subscribeToSamples,
  logoutUser,
} from './firebase';
import {
  CurrencyCode,
  CategoryId,
  Product,
  Supplier,
  Customer,
  LiveTradeEvent,
  RfqSubmission,
  SampleInquiry,
  PersonaMode,
  MarketplaceStats,
  LanguageCode,
  AuthUser,
  TechPackSpec,
} from './types';
import {
  CURRENCIES,
  SUPPLIERS as INITIAL_SUPPLIERS,
  CUSTOMERS as INITIAL_CUSTOMERS,
  LIVE_TRADE_EVENTS as INITIAL_LIVE_EVENTS,
  CATEGORIES,
} from './data/mockData';
import { generateMoreProducts } from './data/unlimitedCatalog';
import { FEDERATED_DIVISIONS } from './data/divisions';
import { nexusApi } from './services/nexusApi';
import { generateRandomTradeEvent } from './services/realtimeEngine';
import { getTranslation } from './i18n/translations';
import {
  Filter,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Loader2,
  Search,
  Sparkles,
  ArrowUpDown,
  Layers,
  Globe2,
  LayoutGrid,
  MapPin,
  Map,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  X,
  Check,
  DollarSign,
  Clock,
  Tag,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('portal_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('portal_theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const {
    products: nexosCatalog,
    filteredProducts: nexosFilteredProducts,
    suppliers: nexosSuppliers,
    buyers: nexosBuyers,
    metrics: nexosMetrics,
    selectedDivision,
    setSelectedDivision,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    syncStatus,
    triggerSync,
    addPublishedProduct,
    isPipelineModalOpen,
    setIsPipelineModalOpen,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useNexosSync();

  const { addToCart } = useInquiryCart();

  // URL / Route Navigation State: supporting /buyer/dashboard and /seller/dashboard
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const { lang, setLang, t, toDigits } = useI18n();
  const [activeView, setActiveView] = useState<'products' | 'suppliers' | 'customers' | 'insights'>('products');
  const [persona, setPersona] = useState<PersonaMode>('buyer');
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
  const [supplierViewMode, setSupplierViewMode] = useState<'list' | 'map' | 'google_map'>('google_map');

  // Alibaba Hero Tab ('ai' | 'products' | 'suppliers' | 'customers')
  const [activeHeroTab, setActiveHeroTab] = useState<'ai' | 'products' | 'suppliers' | 'customers'>('products');

  // Federated Division and Domain Source State
  const [selectedDomainSource, setSelectedDomainSource] = useState<'all' | 'shop.handsandhead.com' | 'arutemika.handsandhead.com'>('all');
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sourcing Node Dropdown & Advanced Search / Filter States
  const [isSourcingNodeDropdownOpen, setIsSourcingNodeDropdownOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [moqFilter, setMoqFilter] = useState<'all' | 'low' | 'mid' | 'bulk'>('all');
  const [leadTimeFilter, setLeadTimeFilter] = useState<'all' | 'fast' | 'standard'>('all');
  const [certFilter, setCertFilter] = useState<'all' | 'leed' | 'oeko' | 'gots' | 'lwg'>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | 'under3' | '3to10' | 'over10'>('all');

  const activeAdvancedFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDivision !== 'all') count++;
    if (moqFilter !== 'all') count++;
    if (leadTimeFilter !== 'all') count++;
    if (certFilter !== 'all') count++;
    if (priceRangeFilter !== 'all') count++;
    return count;
  }, [selectedDivision, moqFilter, leadTimeFilter, certFilter, priceRangeFilter]);

  const handleResetAdvancedFilters = () => {
    setSelectedDivision('all');
    setSelectedDomainSource('all');
    setMoqFilter('all');
    setLeadTimeFilter('all');
    setCertFilter('all');
    setPriceRangeFilter('all');
  };

  // Dynamic Dock Height Tracking for Screen Clearances
  const [mobileDockHeight, setMobileDockHeight] = useState<number>(84);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 1023px)');
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileScreen(e.matches);
    };
    handleMediaChange(mql);
    try {
      mql.addEventListener('change', handleMediaChange);
      return () => mql.removeEventListener('change', handleMediaChange);
    } catch {
      mql.addListener(handleMediaChange);
      return () => mql.removeListener(handleMediaChange);
    }
  }, []);

  // Dynamic data layer
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [liveEvents, setLiveEvents] = useState<LiveTradeEvent[]>(INITIAL_LIVE_EVENTS);
  const [marketplaceStats, setMarketplaceStats] = useState<MarketplaceStats | undefined>(undefined);
  const [apiSource, setApiSource] = useState<'live' | 'fallback'>('live');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [bondedOnly, setBondedOnly] = useState<boolean>(false);
  const [visibleSupplierLimit, setVisibleSupplierLimit] = useState<number>(100);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sampleProduct, setSampleProduct] = useState<Product | null>(null);
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);
  const [specDrawerProduct, setSpecDrawerProduct] = useState<{
    skuId?: string;
    title?: string;
    category?: 'leather_goods' | 'heavyweight_knits' | 'accessories';
    hsCode?: string;
    targetFob?: number;
    requestedQuantity?: number;
    leadTimeFobDays?: number;
    imageUrl?: string;
  } | undefined>(undefined);
  const [specDrawerType, setSpecDrawerType] = useState<
    'SAMPLE_DISPATCH' | 'BULK_QUOTATION' | 'CUSTOM_TECHPACK'
  >('SAMPLE_DISPATCH');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isShippingCalcOpen, setIsShippingCalcOpen] = useState(false);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);

  // Enterprise Auth, TechPack Studio, and Compliance Vault States
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('nexus_b2b_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTechPackModalOpen, setIsTechPackModalOpen] = useState(false);
  const [vaultSupplier, setVaultSupplier] = useState<Supplier | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [profileDrawerSupplier, setProfileDrawerSupplier] = useState<Supplier | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // AI Assistant States (RAWx Bot / Sourcing Assistant)
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiProductContext, setAiProductContext] = useState<Product | null>(null);
  const [aiSupplierContext, setAiSupplierContext] = useState<Supplier | null>(null);

  // Active RFQs & Samples
  const [rfqs, setRfqs] = useState<RfqSubmission[]>([
    {
      id: 'BD-RFQ-8821',
      buyerName: 'Alexander Lind',
      companyName: 'Nordic Apparel Group AB',
      buyerCountry: 'Sweden',
      email: 'alexander@nordicapparel.se',
      categoryId: 'rmg-apparel',
      productRequirement: 'Combed Organic Cotton 240 GSM Crewneck Heavyweight Tees',
      targetQuantity: 5000,
      targetUnitPriceUSD: 2.85,
      incoterms: 'FOB Chattogram Port',
      destinationPort: 'Gothenburg Port, Sweden',
      targetTimelineDays: 45,
      specNotes: 'GOTS Organic certified, custom dyed Pantone 19-4052 TCX Classic Blue.',
      status: 'Dispatched to 5 Factories',
      createdAt: '2026-09-15',
    },
    {
      id: 'BD-RFQ-9142',
      buyerName: 'Elena Rostova',
      companyName: 'Kaufland Global Sourcing',
      buyerCountry: 'Germany',
      email: 'e.rostova@kaufland.de',
      categoryId: 'jute-eco',
      productRequirement: 'Biodegradable Hydrocarbon-Free Jute Coffee Bags (60kg capacity)',
      targetQuantity: 25000,
      targetUnitPriceUSD: 1.45,
      incoterms: 'CIF Hamburg Port',
      destinationPort: 'Hamburg Port, Germany',
      targetTimelineDays: 60,
      specNotes: 'Food-grade certified with organic botanical batch oil.',
      status: 'Dispatched to 5 Factories',
      createdAt: '2026-09-16',
    },
  ]);

  const [samples, setSamples] = useState<SampleInquiry[]>([
    {
      id: 'sample-init-1',
      productId: 'prod-01',
      productTitle: '100% Organic Combed Ring-Spun Cotton Heavyweight Crewneck T-Shirt',
      supplierName: 'Plummy Fashions Ltd.',
      quantity: 2,
      sampleFeeUSD: 50.0,
      courierFeeUSD: 35.0,
      customNotes: 'Size M & L in ecru raw wash for lab dip test',
      buyerEmail: 'sourcing@atelierlondon.co.uk',
      shippingCountry: 'United Kingdom',
      createdAt: '2026-09-14',
      trackingNumber: 'BD-DHL-88492019',
      status: 'Dispatched via Air Courier',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Observer for automatic infinite scrolling as user reaches bottom
  useEffect(() => {
    if (!sentinelRef.current || activeView !== 'products') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoadingMore, hasMore, activeView]);

  // Sync backend suppliers and customer events
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      setIsLoadingData(true);
      try {
        const [supplierRes, statsRes, customerRes, eventsRes] = await Promise.all([
          nexusApi.fetchSuppliers({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
            bondedOnly: bondedOnly || undefined,
            search: searchQuery || undefined,
          }),
          nexusApi.fetchMarketplaceStats(),
          nexusApi.fetchCustomers(selectedCategory !== 'all' ? selectedCategory : undefined),
          nexusApi.fetchLiveTradeEvents(),
        ]);

        if (isMounted) {
          setSuppliers(supplierRes.suppliers);
          setCustomers(customerRes.customers);
          setLiveEvents(eventsRes.events);
          setApiSource(supplierRes.source);
          setMarketplaceStats(statsRes.stats);
        }
      } catch (err) {
        console.error('Data layer notice:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadBackendData();

    const intervalTimer = setInterval(() => {
      if (isMounted) {
        const newEvt = generateRandomTradeEvent();
        setLiveEvents((prev) => [newEvt, ...prev.slice(0, 9)]);
      }
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(intervalTimer);
    };
  }, [selectedCategory, selectedDistrict, bondedOnly, searchQuery]);

  // Real-time Firestore synchronization for RFQs and Samples
  useEffect(() => {
    const unsubRfqs = subscribeToRfqs((firestoreRfqs) => {
      if (firestoreRfqs && firestoreRfqs.length > 0) {
        setRfqs((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newOnes = firestoreRfqs.filter((r) => !existingIds.has(r.id));
          return [...newOnes, ...prev];
        });
      }
    });

    const unsubSamples = subscribeToSamples((firestoreSamples) => {
      if (firestoreSamples && firestoreSamples.length > 0) {
        setSamples((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newOnes = firestoreSamples.filter((s) => !existingIds.has(s.id));
          return [...newOnes, ...prev];
        });
      }
    });

    return () => {
      unsubRfqs();
      unsubSamples();
    };
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await triggerSync();
      const [supplierRes, customerRes, eventsRes, statsRes] = await Promise.all([
        nexusApi.fetchSuppliers({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
          bondedOnly: bondedOnly || undefined,
          search: searchQuery || undefined,
        }),
        nexusApi.fetchCustomers(selectedCategory !== 'all' ? selectedCategory : undefined),
        nexusApi.fetchLiveTradeEvents(),
        nexusApi.fetchMarketplaceStats(),
      ]);
      setSuppliers(supplierRes.suppliers);
      setCustomers(customerRes.customers);
      const freshEvt = generateRandomTradeEvent();
      setLiveEvents([freshEvt, ...eventsRes.events]);
      setMarketplaceStats(statsRes.stats);
      showNotification('Realtime trade data synchronized with Master Nexus (6.5 Cr ledger + Google Drive + Arutemika)!');
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered & Sorted Products from Nexos Hydrated Catalog
  const displayedProducts = useMemo(() => {
    let result = nexosFilteredProducts;
    if (selectedDomainSource !== 'all') {
      result = result.filter((p) => p.sourceDomain === selectedDomainSource);
    }
    if (supplierFilter) {
      result = result.filter((p) => p.supplierId === supplierFilter);
    }
    // MOQ Filter
    if (moqFilter === 'low') {
      result = result.filter((p) => (p.moq || 500) <= 500);
    } else if (moqFilter === 'mid') {
      result = result.filter((p) => (p.moq || 500) > 500 && (p.moq || 500) <= 2500);
    } else if (moqFilter === 'bulk') {
      result = result.filter((p) => (p.moq || 500) > 2500);
    }
    // SLA Lead Time Filter
    if (leadTimeFilter === 'fast') {
      result = result.filter((p) => (p.leadTimeDays || 30) <= 20);
    } else if (leadTimeFilter === 'standard') {
      result = result.filter((p) => (p.leadTimeDays || 30) > 20);
    }
    // Compliance Certifications Filter
    if (certFilter === 'leed') {
      result = result.filter((p) => p.certifications?.some((c) => c.toLowerCase().includes('leed')));
    } else if (certFilter === 'oeko') {
      result = result.filter((p) => p.certifications?.some((c) => c.toLowerCase().includes('oeko')));
    } else if (certFilter === 'gots') {
      result = result.filter((p) => p.certifications?.some((c) => c.toLowerCase().includes('gots') || c.toLowerCase().includes('organic')));
    } else if (certFilter === 'lwg') {
      result = result.filter((p) => p.certifications?.some((c) => c.toLowerCase().includes('lwg') || c.toLowerCase().includes('leather')));
    }
    // FOB Price Range Filter
    if (priceRangeFilter === 'under3') {
      result = result.filter((p) => (p.priceTiers?.[0]?.priceUSD || 3) < 3);
    } else if (priceRangeFilter === '3to10') {
      result = result.filter((p) => {
        const pr = p.priceTiers?.[0]?.priceUSD || 5;
        return pr >= 3 && pr <= 10;
      });
    } else if (priceRangeFilter === 'over10') {
      result = result.filter((p) => (p.priceTiers?.[0]?.priceUSD || 5) > 10);
    }
    return result;
  }, [
    nexosFilteredProducts,
    selectedDomainSource,
    supplierFilter,
    moqFilter,
    leadTimeFilter,
    certFilter,
    priceRangeFilter,
  ]);

  // Filtered Suppliers List
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (bondedOnly && !s.bondedWarehouse) return false;
      if (selectedDistrict !== 'all' && !s.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesDistrict = s.district.toLowerCase().includes(query);
        const matchesAbout = s.about.toLowerCase().includes(query);
        const matchesMarkets = s.exportMarkets.some((m) => m.toLowerCase().includes(query));
        return matchesName || matchesDistrict || matchesAbout || matchesMarkets;
      }
      return true;
    });
  }, [suppliers, bondedOnly, selectedDistrict, searchQuery]);

  // Paginated/windowed displayed suppliers for smooth performance
  const displayedSuppliers = useMemo(() => {
    return filteredSuppliers.slice(0, visibleSupplierLimit);
  }, [filteredSuppliers, visibleSupplierLimit]);

  // Handlers
  const handleHeroTabChange = (tab: 'ai' | 'products' | 'suppliers' | 'customers') => {
    setActiveHeroTab(tab);
    if (tab === 'ai') {
      handleOpenAiAssistant();
    } else {
      setActiveView(tab);
    }
  };

  const handleOpenAiAssistant = (product?: Product | null, supplier?: Supplier | null) => {
    setAiProductContext(product || null);
    setAiSupplierContext(supplier || null);
    setIsAiAssistantOpen(true);
  };

  const handleOpenSpecDrawer = (
    product?: any,
    requestType: 'SAMPLE_DISPATCH' | 'BULK_QUOTATION' | 'CUSTOM_TECHPACK' = 'SAMPLE_DISPATCH'
  ) => {
    if (product) {
      const isLeather =
        product.category === 'leather' ||
        product.category === 'leather_goods' ||
        product.subcategorySlug?.includes('leather') ||
        product.title?.toLowerCase().includes('leather') ||
        product.title?.toLowerCase().includes('cowhide') ||
        product.title?.toLowerCase().includes('tote') ||
        product.title?.toLowerCase().includes('duffle');

      const isAccessory =
        product.category === 'accessories' ||
        product.subcategorySlug?.includes('access') ||
        product.title?.toLowerCase().includes('bracelet') ||
        product.title?.toLowerCase().includes('clasp');

      const cat: 'leather_goods' | 'heavyweight_knits' | 'accessories' = isLeather
        ? 'leather_goods'
        : isAccessory
        ? 'accessories'
        : 'heavyweight_knits';

      const cleanHs = product.hsCode
        ? String(product.hsCode).replace(/^HS\s*/i, '')
        : cat === 'leather_goods'
        ? '4202.12.00'
        : '6109.10.00';

      setSpecDrawerProduct({
        skuId: product.sku || product.skuId || (product.id ? `SKU-${product.id}` : 'RAWX-BOX-280-BLK'),
        title: product.title || product.name || 'Architectural 260–300 GSM Heavyweight Box-Tee',
        category: cat,
        hsCode: cleanHs,
        targetFob: Number(product.price) || 4.25,
        requestedQuantity: Number(product.moq) || 2500,
        leadTimeFobDays: Number(product.leadTimeDays) || 35,
        imageUrl: product.imageUrl || product.images?.[0] || product.image,
      });
    } else {
      setSpecDrawerProduct(undefined);
    }
    setSpecDrawerType(requestType);
    setIsSpecDrawerOpen(true);
  };

  const handleOpenSampleModal = (
    product: any,
    reqType: 'SAMPLE_DISPATCH' | 'BULK_QUOTATION' | 'CUSTOM_TECHPACK' = 'SAMPLE_DISPATCH'
  ) => {
    setSampleProduct(product);
    handleOpenSpecDrawer(product, reqType);
  };

  const handleInquireProduct = (product: Product, customMessage?: string) => {
    const newInquiry: SampleInquiry = {
      id: `inq-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      supplierName: product.supplierName,
      quantity: product.moq,
      sampleFeeUSD: 0,
      courierFeeUSD: 0,
      customNotes: customMessage || `General wholesale quote request for ${product.moq} units`,
      buyerEmail: authUser?.email || 'international.buyer@trade.com',
      shippingCountry: authUser?.country || 'International Dispatch',
      createdAt: new Date().toLocaleDateString(),
      trackingNumber: `INQ-BD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Factory Bid Pending',
    };
    setSamples((prev) => [newInquiry, ...prev]);
    saveSampleToFirestore(newInquiry);
    showNotification(`Inquiry dispatched to ${product.supplierName}! View in Inquiries drawer.`);
  };

  const handleSubmitRfq = (rfq: RfqSubmission) => {
    setRfqs((prev) => [rfq, ...prev]);
    saveRfqToFirestore(rfq);
    showNotification(`RFQ for "${rfq.productRequirement}" broadcasted to verified factories!`);
  };

  const handleConfirmSampleOrder = (order: SampleInquiry) => {
    setSamples((prev) => [order, ...prev]);
    saveSampleToFirestore(order);
    showNotification(`Sample order dispatched via DHL Air Courier!`);
  };

  const handleFactoryRespondToRfq = (rfqId: string, quoteUSD: number, leadTimeDays: number) => {
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status: `Factory Quoted $${quoteUSD} FOB (${leadTimeDays}d)`,
            }
          : r
      )
    );
    showNotification(`Formal quotation submitted for ${rfqId}`);
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    try {
      localStorage.setItem('nexus_b2b_auth_user', JSON.stringify(user));
    } catch {}
    setPersona(user.role);
    showNotification(`Welcome, ${user.name}! (${user.role === 'buyer' ? 'Buyer Mode' : 'Exporter Console'} active)`);
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem('nexus_b2b_auth_user');
      logoutUser();
    } catch {}
    showNotification('Session terminated. You are now browsing as Guest.');
  };

  const handleBroadcastTechPack = (spec: TechPackSpec) => {
    const newRfq: RfqSubmission = {
      id: `BD-TP-${Date.now().toString().slice(-4)}`,
      buyerName: authUser?.name || 'International Sourcing Partner',
      companyName: authUser?.companyName || spec.buyerCompany || 'Global Brand Enterprise',
      buyerCountry: authUser?.country || 'Germany',
      email: authUser?.email || spec.buyerEmail || 'sourcing@brandenterprise.com',
      categoryId: spec.productCategory || 'rmg-apparel',
      productRequirement: `${spec.productType} - ${spec.totalPieces.toLocaleString()} units (${spec.colorName} / ${spec.colorTcx})`,
      targetQuantity: spec.totalPieces,
      targetUnitPriceUSD: 3.25,
      incoterms: `${spec.incoterms} Chattogram Port`,
      destinationPort: 'Hamburg / Rotterdam / New York Hub',
      targetTimelineDays: 45,
      specNotes: `CAD TechPack Spec: ${spec.fabricWeight}, Pantone: ${spec.colorName} (${spec.colorTcx}). Stitching: ${spec.stitchingNotes || 'Standard reinforced double-needle seams'}. Size Breakdown: ${Object.entries(spec.sizes).map(([k, v]) => `${k}:${v}`).join(', ')}. Target Delivery: ${spec.targetDate || 'ASAP'}`,
      status: `Broadcast to 12 Verified Factories`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRfqs((prev) => [newRfq, ...prev]);
    saveRfqToFirestore(newRfq);
    showNotification(`TechPack for "${spec.productType}" dispatched to verified factories!`);
  };

  const handleOpenComplianceVault = (supplier: Supplier) => {
    setVaultSupplier(supplier);
    setIsVaultOpen(true);
  };

  const handleReserveLineSlot = (supplier: Supplier) => {
    setVaultSupplier(supplier);
    setIsRfqModalOpen(true);
    showNotification(`Initiated Expedited Line Reservation with ${supplier.name}`);
  };

  const activeSupplier = selectedProduct
    ? suppliers.find((s) => s.id === selectedProduct.supplierId) ||
      INITIAL_SUPPLIERS.find((s) => s.id === selectedProduct.supplierId)
    : undefined;

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans transition-colors duration-200 selection:bg-[#e11d48] selection:text-white ${
        theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Route Switcher: Buyer Dashboard Shell */}
      {currentPath.startsWith('/buyer') ? (
        <BuyerDashboardShell
          authUser={authUser}
          onNavigateHome={() => navigate('/')}
          onNavigateToSeller={() => navigate('/seller/dashboard')}
          onOpenRfqModal={() => setIsRfqModalOpen(true)}
          onOpenTechPackModal={() => setIsTechPackModalOpen(true)}
          onOpenInquiries={() => setIsInquiryDrawerOpen(true)}
          onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
          onLogout={handleLogout}
          theme={theme}
        />
      ) : currentPath.startsWith('/seller') ? (
        <SellerDashboardShell
          authUser={authUser}
          onNavigateHome={() => navigate('/')}
          onNavigateToBuyer={() => navigate('/buyer/dashboard')}
          onProductPublished={(newProd) => {
            addPublishedProduct(newProd);
            setNotification(`Published "${newProd.title}" live to federated catalog!`);
          }}
          onLogout={handleLogout}
          theme={theme}
        />
      ) : currentPath.startsWith('/catalog') ? (
        <>
          <Header
            currentCurrency={currency}
            onCurrencyChange={setCurrency}
            lang={lang}
            onLanguageChange={setLang}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              navigate('/');
              setSelectedCategory(cat);
            }}
            selectedDivision={selectedDivision}
            onSelectDivision={(div) => {
              navigate('/');
              setSelectedDivision(div);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
            onOpenInquiries={() => setIsInquiryDrawerOpen(true)}
            onOpenAutomation={() => setIsAutomationModalOpen(true)}
            inquiryCount={rfqs.length + samples.length}
            activeView={activeView}
            onViewChange={(v) => {
              navigate('/');
              setActiveView(v);
              setActiveHeroTab(v === 'suppliers' ? 'suppliers' : v === 'customers' ? 'customers' : 'products');
              setSupplierFilter(null);
            }}
            persona={persona}
            onPersonaChange={setPersona}
            authUser={authUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
            activeRfqCount={rfqs.length}
            onOpenAiAssistant={() => handleOpenAiAssistant()}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
            onNavigateToBuyerDashboard={() => navigate('/buyer/dashboard')}
            onNavigateToSellerDashboard={() => navigate('/seller/dashboard')}
            onNavigateToCatalog={(path) => navigate(path || '/catalog')}
            currentPath={currentPath}
          />

          <B2bCatalogPage
            currentPath={currentPath}
            onNavigate={navigate}
            currency={currentCurrencyConfig}
            onRequestSample={(prod) => handleOpenSampleModal(prod, 'SAMPLE_DISPATCH')}
            onRequestTechPack={(prod) => handleOpenSampleModal(prod, 'CUSTOM_TECHPACK')}
            onAddToCart={(prod) => {
              addToCart(prod, { requestedQty: prod.moq || 50, targetPrice: prod.price || 4.85 });
              showNotification(`Added "${prod.title}" (${prod.moq || 50} pcs) to B2B Inquiry Cart`);
            }}
          />
        </>
      ) : (
        <>
          {/* 1. TOP BAR: Consolidated 3-Tier Alibaba/Etsy Hybrid Header */}
          <Header
            currentCurrency={currency}
            onCurrencyChange={setCurrency}
            lang={lang}
            onLanguageChange={setLang}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDivision={selectedDivision}
            onSelectDivision={setSelectedDivision}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
            onOpenInquiries={() => setIsInquiryDrawerOpen(true)}
            onOpenAutomation={() => setIsAutomationModalOpen(true)}
            inquiryCount={rfqs.length + samples.length}
            activeView={activeView}
            onViewChange={(v) => {
              setActiveView(v);
              setActiveHeroTab(v === 'suppliers' ? 'suppliers' : v === 'customers' ? 'customers' : 'products');
              setSupplierFilter(null);
            }}
            persona={persona}
            onPersonaChange={setPersona}
            authUser={authUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
            activeRfqCount={rfqs.length}
            onOpenAiAssistant={() => handleOpenAiAssistant()}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
            onNavigateToBuyerDashboard={() => navigate('/buyer/dashboard')}
            onNavigateToSellerDashboard={() => navigate('/seller/dashboard')}
            onNavigateToCatalog={(path) => navigate(path || '/catalog')}
            currentPath={currentPath}
          />

      {/* 2. HERO SECTION: AI Mode, Products, BD Exporters, Global Buyer with Big Search Bar */}
      {persona === 'buyer' && (
        <HeroBanner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeHeroTab={activeHeroTab}
          onHeroTabChange={handleHeroTabChange}
          onOpenRfq={() => setIsRfqModalOpen(true)}
          onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
          onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
          onOpenAiAssistant={() => handleOpenAiAssistant()}
          authUser={authUser}
          lang={lang}
          theme={theme}
        />
      )}

      {/* 2.5 LIVE COMMODITY & EXPORT LOGISTICS MATRIX STRIP */}
      {persona === 'buyer' && (
        <LiveTradeMatrixStrip
          metrics={nexosMetrics}
          onOpenFreightMatrix={() => setIsShippingCalcOpen(true)}
          onOpenShipping={() => setIsShippingCalcOpen(true)}
          onOpenFactories={() => {
            setActiveView('suppliers');
            setActiveHeroTab('suppliers');
          }}
          onOpenBuyers={() => {
            setActiveView('customers');
            setActiveHeroTab('customers');
          }}
          onOpenPipeline={() => setIsPipelineModalOpen(true)}
          theme={theme}
        />
      )}

      {/* 3. FEDERATED PAVILIONS & PRODUCT CARD SLIDERS */}
      {persona === 'buyer' && activeView === 'products' && !searchQuery && !supplierFilter && (
        <CategoriesSlidersSection
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSupplierFilter(null);
          }}
          selectedDivision={selectedDivision}
          onSelectDivision={setSelectedDivision}
          currency={currentCurrencyConfig}
          onSelectProduct={setSelectedProduct}
          onRequestSample={handleOpenSampleModal}
          onInquire={handleInquireProduct}
          onOpenAiAssistant={(p) => handleOpenAiAssistant(p)}
          onExploreFactories={() => {
            setActiveView('suppliers');
            setActiveHeroTab('suppliers');
          }}
          theme={theme}
        />
      )}

      {/* Main Content Area */}
      <main
        id="main-content"
        className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 flex-1 lg:pb-8"
        style={{
          paddingBottom: isMobileScreen
            ? `calc(${mobileDockHeight}px + env(safe-area-inset-bottom, 0px) + 1.75rem)`
            : undefined,
        }}
      >
        {/* SELLER / EXPORTER HUB WORKSPACE */}
        {persona === 'seller' ? (
          <ManufacturerHub
            rfqs={rfqs}
            currency={currentCurrencyConfig}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onRespondToRfq={handleFactoryRespondToRfq}
          />
        ) : (
          /* BUYER PORTAL WORKSPACE */
          <>
            {/* Active Factory Filter Notice */}
            {supplierFilter && (
              <div
                className={`mb-4 p-3 rounded-xl flex items-center justify-between shadow-xs border ${
                  theme === 'dark'
                    ? 'bg-[#141414] border-[#e11d48]/40 text-white'
                    : 'bg-white border-[#e11d48]/40 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs">
                  <Building2 className="w-4 h-4 text-[#e11d48]" />
                  <span>
                    Filtering catalog by factory: <strong className="text-[#e11d48]">{suppliers.find((s) => s.id === supplierFilter)?.name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSupplierFilter(null)}
                  className="text-xs text-[#e11d48] font-bold hover:underline cursor-pointer"
                >
                  Clear Factory Filter
                </button>
              </div>
            )}

            {/* View 1: 4. UNLIMITED PRODUCTS GRID LOADING THROUGH SCROLLING */}
            {activeView === 'products' && (
              <div className="space-y-4">
                {/* 1 x 4 SQUARE GRID: 12 Master Portals with Dynamic Hover Effects and Direct Website Links */}
                {persona === 'buyer' && !supplierFilter && !searchQuery && (
                  <EcosystemGridSection
                    onSelectDivision={(slug) => {
                      setSelectedDivision(slug);
                      setSelectedDomainSource('all');
                    }}
                    selectedDivision={selectedDivision}
                    onOpenAiAssistant={() => handleOpenAiAssistant()}
                    theme={theme}
                  />
                )}

                {/* Control Bar: Source Domains, Sort By & Product Count */}
                <div
                  className={`rounded-2xl border p-3 shadow-xs flex flex-col gap-3 relative z-30 ${
                    theme === 'dark'
                      ? 'bg-[#141414] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Sourcing Node Dropdown & Advanced Search Button */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* 1. SOURCING NODE DROPDOWN MENU */}
                      <div className="relative">
                        <button
                          type="button"
                          id="sourcing-node-dropdown-button"
                          onClick={() => {
                            setIsSourcingNodeDropdownOpen((prev) => !prev);
                            if (isAdvancedSearchOpen) setIsAdvancedSearchOpen(false);
                          }}
                          className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 border shadow-xs ${
                            selectedDivision !== 'all'
                              ? 'bg-[#e11d48] text-white border-[#e11d48]'
                              : theme === 'dark'
                              ? 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                              : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <Building2 className={`w-3.5 h-3.5 ${selectedDivision !== 'all' ? 'text-white' : 'text-[#e11d48]'}`} />
                          <span className="font-mono text-[10px] uppercase text-slate-400">Node:</span>
                          <span className="max-w-[160px] truncate font-black">
                            {selectedDivision === 'all'
                              ? `All Verticals (${nexosCatalog.length})`
                              : FEDERATED_DIVISIONS.find((d) => d.slug === selectedDivision)?.divisionTitle || selectedDivision}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isSourcingNodeDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Sourcing Node Dropdown Popover */}
                        <AnimatePresence>
                          {isSourcingNodeDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsSourcingNodeDropdownOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                transition={{ duration: 0.16 }}
                                className={`absolute left-0 top-full mt-1.5 w-72 sm:w-80 rounded-2xl border shadow-2xl z-50 p-2 overflow-hidden ${
                                  theme === 'dark'
                                    ? 'bg-[#181818] border-white/15 text-white'
                                    : 'bg-white border-slate-200 text-slate-800'
                                }`}
                              >
                                <div className="px-3 py-2 border-b border-inherit mb-1 flex items-center justify-between">
                                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400">
                                    Select Sourcing Node
                                  </span>
                                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    8 Active Clusters
                                  </span>
                                </div>

                                <div className="max-h-72 overflow-y-auto space-y-1">
                                  {/* All Verticals */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDivision('all');
                                      setSelectedDomainSource('all');
                                      setIsSourcingNodeDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                      selectedDivision === 'all' && selectedDomainSource === 'all'
                                        ? 'bg-[#e11d48] text-white shadow-xs'
                                        : theme === 'dark'
                                        ? 'hover:bg-white/5 text-slate-200'
                                        : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Globe2 className="w-3.5 h-3.5 text-[#10b981]" />
                                      <span>All Verticals (Master Catalog)</span>
                                    </div>
                                    <span className="text-[10px] font-mono opacity-80">{nexosCatalog.length}</span>
                                  </button>

                                  {/* Federated Divisions */}
                                  {FEDERATED_DIVISIONS.slice(1, 9).map((div) => {
                                    const isActive = selectedDivision === div.slug;
                                    return (
                                      <button
                                        key={div.slug}
                                        type="button"
                                        onClick={() => {
                                          setSelectedDivision(div.slug);
                                          setSelectedDomainSource('all');
                                          setIsSourcingNodeDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                          isActive
                                            ? 'bg-[#e11d48] text-white shadow-xs'
                                            : theme === 'dark'
                                            ? 'hover:bg-white/5 text-slate-200'
                                            : 'hover:bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2 min-w-0">
                                          <span
                                            className={`w-2 h-2 rounded-full shrink-0 ${
                                              isActive ? 'bg-white' : 'bg-[#e11d48]'
                                            }`}
                                          />
                                          <span className="truncate">{div.divisionTitle}</span>
                                        </div>
                                        {isActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* 2. ADVANCED SEARCH OPTION BUTTON */}
                      <button
                        type="button"
                        id="advanced-search-toggle-button"
                        onClick={() => {
                          setIsAdvancedSearchOpen((prev) => !prev);
                          if (isSourcingNodeDropdownOpen) setIsSourcingNodeDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 border shadow-xs ${
                          isAdvancedSearchOpen || activeAdvancedFiltersCount > 0
                            ? 'bg-[#10b981] text-slate-950 border-[#10b981]'
                            : theme === 'dark'
                            ? 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10 hover:text-white'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Open Advanced Filters: MOQ, Lead Time, Certifications, and Price Options"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Advanced Filters</span>
                        {activeAdvancedFiltersCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#e11d48] text-white text-[10px] font-bold flex items-center justify-center">
                            {activeAdvancedFiltersCount}
                          </span>
                        )}
                      </button>

                      {/* Quick reset button if filters active */}
                      {activeAdvancedFiltersCount > 0 && (
                        <button
                          type="button"
                          onClick={handleResetAdvancedFilters}
                          className="text-[11px] text-slate-400 hover:text-[#e11d48] transition-colors flex items-center space-x-1 cursor-pointer font-bold ml-1"
                          title="Reset All Filters"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* Right: Sort By Dropdown & Count */}
                    <div className="flex items-center space-x-3 text-xs shrink-0">
                      <div className="flex items-center space-x-1">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] text-slate-400">Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className={`rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none cursor-pointer border ${
                            theme === 'dark'
                              ? 'bg-[#1c1c1c] border-white/10 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="ranking">Top Ranking</option>
                          <option value="moq">Lowest MOQ</option>
                          <option value="leadTime">Fastest SLA Lead Time</option>
                          <option value="reorder">Reorder Rate</option>
                        </select>
                      </div>

                      <span className="text-slate-400 hidden sm:inline">|</span>
                      <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                        <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                          {displayedProducts.length}
                        </strong>{' '}
                        items
                      </span>
                    </div>
                  </div>

                  {/* 3. ADVANCED SEARCH & FILTER OPTIONS PANEL (EXPANDABLE) */}
                  <AnimatePresence>
                    {isAdvancedSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`pt-3 border-t overflow-hidden ${
                          theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          {/* Option 1: Minimum Order Quantity (MOQ) */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5">
                              Minimum Order (MOQ)
                            </span>
                            <div className="grid grid-cols-2 gap-1 font-medium">
                              <button
                                type="button"
                                onClick={() => setMoqFilter('all')}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  moqFilter === 'all'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                All MOQs
                              </button>
                              <button
                                type="button"
                                onClick={() => setMoqFilter('low')}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  moqFilter === 'low'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                ≤ 500 pcs (Low)
                              </button>
                              <button
                                type="button"
                                onClick={() => setMoqFilter('mid')}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  moqFilter === 'mid'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                500 - 2,500 pcs
                              </button>
                              <button
                                type="button"
                                onClick={() => setMoqFilter('bulk')}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  moqFilter === 'bulk'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                2,500+ pcs (Bulk)
                              </button>
                            </div>
                          </div>

                          {/* Option 2: Production SLA Lead Time */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-[#10b981]" />
                              <span>Production Lead Time</span>
                            </span>
                            <div className="flex flex-col gap-1 font-medium">
                              <button
                                type="button"
                                onClick={() => setLeadTimeFilter('all')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  leadTimeFilter === 'all'
                                    ? 'bg-[#10b981] text-slate-950 font-black'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                All Production SLAs
                              </button>
                              <button
                                type="button"
                                onClick={() => setLeadTimeFilter('fast')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  leadTimeFilter === 'fast'
                                    ? 'bg-[#10b981] text-slate-950 font-black'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                Fast Track (≤ 20 Days)
                              </button>
                              <button
                                type="button"
                                onClick={() => setLeadTimeFilter('standard')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  leadTimeFilter === 'standard'
                                    ? 'bg-[#10b981] text-slate-950 font-black'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                Standard (21 - 40 Days)
                              </button>
                            </div>
                          </div>

                          {/* Option 3: Certifications & Factory Audits */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5 flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                              <span>Compliance Certification</span>
                            </span>
                            <div className="grid grid-cols-2 gap-1 font-medium">
                              <button
                                type="button"
                                onClick={() => setCertFilter('all')}
                                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                                  certFilter === 'all'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                All Audits
                              </button>
                              <button
                                type="button"
                                onClick={() => setCertFilter('leed')}
                                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                                  certFilter === 'leed'
                                    ? 'bg-[#10b981] text-slate-950'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                LEED Green
                              </button>
                              <button
                                type="button"
                                onClick={() => setCertFilter('oeko')}
                                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                                  certFilter === 'oeko'
                                    ? 'bg-[#10b981] text-slate-950'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                OEKO-TEX
                              </button>
                              <button
                                type="button"
                                onClick={() => setCertFilter('gots')}
                                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                                  certFilter === 'gots'
                                    ? 'bg-[#10b981] text-slate-950'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                GOTS Organic
                              </button>
                            </div>
                          </div>

                          {/* Option 4: FOB Price Range */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5 flex items-center space-x-1">
                              <DollarSign className="w-3 h-3 text-[#10b981]" />
                              <span>FOB Price (USD)</span>
                            </span>
                            <div className="flex flex-col gap-1 font-medium">
                              <button
                                type="button"
                                onClick={() => setPriceRangeFilter('all')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  priceRangeFilter === 'all'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                All Price Ranges
                              </button>
                              <button
                                type="button"
                                onClick={() => setPriceRangeFilter('under3')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  priceRangeFilter === 'under3'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                Economy (Under $3.00)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPriceRangeFilter('3to10')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  priceRangeFilter === '3to10'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                Mid-Tier ($3.00 - $10.00)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPriceRangeFilter('over10')}
                                className={`text-left px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  priceRangeFilter === 'over10'
                                    ? 'bg-[#e11d48] text-white'
                                    : theme === 'dark'
                                    ? 'hover:bg-white/10 text-slate-300'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                Premium / Outerwear (&gt; $10.00)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-mono text-[11px]">
                            Filtered: <strong className="text-emerald-400">{displayedProducts.length}</strong> products matching criteria
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={handleResetAdvancedFilters}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reset All
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAdvancedSearchOpen(false)}
                              className="px-3 py-1 rounded-lg bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-black transition-colors cursor-pointer shadow-xs"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active Division Banner (if filtered) */}
                {selectedDivision !== 'all' && (
                  <div
                    className={`p-3 rounded-xl flex items-center justify-between text-xs border ${
                      theme === 'dark'
                        ? 'bg-[#181818] border-white/10 text-white'
                        : 'bg-rose-50/60 border-rose-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse" />
                      <span>
                        Sourcing Pavilion:{' '}
                        <strong className="text-[#e11d48]">
                          {FEDERATED_DIVISIONS.find((d) => d.slug === selectedDivision)?.divisionTitle || selectedDivision}
                        </strong>{' '}
                        —{' '}
                        <span className="text-slate-400">
                          {FEDERATED_DIVISIONS.find((d) => d.slug === selectedDivision)?.tagline}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDivision('all');
                        setSelectedDomainSource('all');
                      }}
                      className="text-xs font-bold text-[#e11d48] hover:underline cursor-pointer"
                    >
                      Show All Pavilions
                    </button>
                  </div>
                )}

                {/* Unified Catalog Grid with Glassmorphic Skeleton Loader & Infinite Scroll */}
                <CatalogGrid
                  products={displayedProducts}
                  isLoading={isLoadingData}
                  isLoadingMore={isLoadingMore}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  currency={currentCurrencyConfig}
                  onSelectProduct={setSelectedProduct}
                  onRequestSample={handleOpenSampleModal}
                  onInquire={handleInquireProduct}
                  onOpenAiAssistant={(p) => handleOpenAiAssistant(p)}
                  onAddToTechPack={(p) => {
                    setSelectedProduct(p);
                    setIsTechPackModalOpen(true);
                  }}
                  onProcureDirect={(p) => {
                    const target =
                      p.targetRoutingUrl ||
                      `https://${p.sourceDomain || 'b2b.handsandhead.com'}/order?sku=${encodeURIComponent(
                        p.sku || p.id
                      )}&ref=b2b_portal&utm_source=b2b_hub`;
                    window.open(target, '_blank', 'noopener,noreferrer');
                  }}
                  theme={theme}
                  emptyAction={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDivision('all');
                    setSelectedDomainSource('all');
                    setSupplierFilter(null);
                  }}
                />
              </div>
            )}

            {/* View 2: Verified Bangladesh Suppliers / EPB Mills */}
            {activeView === 'suppliers' && (
              <div className="space-y-4">
                <div
                  className={`rounded-2xl border p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    theme === 'dark'
                      ? 'bg-[#141414] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-black tracking-tight">
                        Verified Bangladesh Exporters & Certified Green Mills
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                        {filteredSuppliers.length} Exporters
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct contact with BGMEA, BKMEA, and USGBC LEED Platinum compliant factories (admin.handsandhead.com database)
                    </p>
                  </div>

                  {/* Supplier Filters & View Mode Toggle */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* List vs Mini-Map vs Google Maps Toggle Button */}
                    <div
                      className={`flex items-center p-0.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      <button
                        id="supplier-toggle-google-map-view"
                        onClick={() => setSupplierViewMode('google_map')}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          supplierViewMode === 'google_map'
                            ? 'bg-[#e11d48] text-white shadow-xs'
                            : theme === 'dark'
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        <span>Google Maps™ Live</span>
                      </button>
                      <button
                        id="supplier-toggle-list-view"
                        onClick={() => setSupplierViewMode('list')}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          supplierViewMode === 'list'
                            ? 'bg-[#e11d48] text-white shadow-xs'
                            : theme === 'dark'
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>List View</span>
                      </button>
                      <button
                        id="supplier-toggle-map-view"
                        onClick={() => setSupplierViewMode('map')}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          supplierViewMode === 'map'
                            ? 'bg-[#e11d48] text-white shadow-xs'
                            : theme === 'dark'
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Vector Clusters</span>
                      </button>
                    </div>

                    <div
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-slate-400">District:</span>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setVisibleSupplierLimit(36);
                        }}
                        className="bg-transparent font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="all" className="bg-[#141414] text-white">All Industrial Districts</option>
                        <option value="Dhaka" className="bg-[#141414] text-white">Dhaka & Ashulia (Apparel & Tech)</option>
                        <option value="Gazipur" className="bg-[#141414] text-white">Gazipur (Woven, Denim & LEED Mills)</option>
                        <option value="Narayanganj" className="bg-[#141414] text-white">Narayanganj (Knit Hub & Adamjee)</option>
                        <option value="Chattogram" className="bg-[#141414] text-white">Chattogram (Port & EPZ Mills)</option>
                        <option value="Narsingdi" className="bg-[#141414] text-white">Narsingdi (Textile & Weaving)</option>
                        <option value="Savar" className="bg-[#141414] text-white">Savar (Leather Tannery Park)</option>
                        <option value="Mymensingh" className="bg-[#141414] text-white">Bhaluka / Mymensingh (Spinning)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setBondedOnly(!bondedOnly)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        bondedOnly
                          ? 'bg-[#e11d48] text-white border-[#e11d48]'
                          : theme === 'dark'
                          ? 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>EPB Bonded Only</span>
                    </button>
                  </div>
                </div>

                {supplierViewMode === 'google_map' ? (
                  <GoogleMapsManufacturerDirectory
                    suppliers={suppliers}
                    selectedDistrict={selectedDistrict}
                    onSelectDistrict={(district) => setSelectedDistrict(district)}
                    onSwitchToListView={() => setSupplierViewMode('list')}
                    onContactSupplier={() => setIsRfqModalOpen(true)}
                    onOpenComplianceVault={handleOpenComplianceVault}
                    onReserveLineSlot={handleReserveLineSlot}
                    onOpenAiAssistant={(s) => handleOpenAiAssistant(null, s)}
                    theme={theme}
                  />
                ) : supplierViewMode === 'map' ? (
                  <BangladeshManufacturerMap
                    suppliers={suppliers}
                    selectedDistrict={selectedDistrict}
                    onSelectDistrict={(district) => setSelectedDistrict(district)}
                    onSwitchToListView={() => setSupplierViewMode('list')}
                    onContactSupplier={() => setIsRfqModalOpen(true)}
                    onOpenComplianceVault={handleOpenComplianceVault}
                    onReserveLineSlot={handleReserveLineSlot}
                    onOpenAiAssistant={(s) => handleOpenAiAssistant(null, s)}
                    theme={theme}
                  />
                ) : isLoadingData ? (
                  <div
                    className={`py-16 text-center space-y-2 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-[#141414] border-white/10 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#e11d48]" />
                    <div className="text-xs">Querying Nexus Supplier Registry...</div>
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div
                    className={`py-16 text-center space-y-3 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-[#141414] border-white/10 text-white'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-400 mx-auto flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base">No factories match your filter</h3>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSelectedDistrict('all');
                          setBondedOnly(false);
                          setSearchQuery('');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold cursor-pointer"
                      >
                        Reset District & Bond Filter
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 w-full">
                      {displayedSuppliers.map((supplier) => (
                        <SupplierCard
                          key={supplier.id}
                          supplier={supplier}
                          onContactSupplier={() => {
                            setIsRfqModalOpen(true);
                          }}
                          onFilterBySupplier={(id) => {
                            setSupplierFilter(id);
                            setActiveView('products');
                          }}
                          onOpenComplianceVault={handleOpenComplianceVault}
                          onReserveLineSlot={handleReserveLineSlot}
                          onOpenAiAssistant={(s) => handleOpenAiAssistant(null, s)}
                          onOpenFactoryDrawer={(s) => {
                            setProfileDrawerSupplier(s);
                            setIsProfileDrawerOpen(true);
                          }}
                          theme={theme}
                        />
                      ))}
                    </div>

                    {/* Pagination / Load More Bar */}
                    <div
                      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-[#141414] border-white/10 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-medium flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>
                          Showing <strong className="text-rose-500">{displayedSuppliers.length}</strong> of{' '}
                          <strong className="text-rose-500">{filteredSuppliers.length}</strong> Verified Exporters
                          (admin.handsandhead.com database)
                        </span>
                      </div>

                      {displayedSuppliers.length < filteredSuppliers.length && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setVisibleSupplierLimit((prev) => prev + 36)}
                            className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                          >
                            Load More Factories (+36)
                          </button>
                          <button
                            type="button"
                            onClick={() => setVisibleSupplierLimit(filteredSuppliers.length)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              theme === 'dark'
                                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                            }`}
                          >
                            Show All ({filteredSuppliers.length})
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View 3: Verified Global Customers & Buyers Hub */}
            {activeView === 'customers' && (
              <CustomerTradeHub
                customers={customers}
                liveEvents={liveEvents}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                lang={lang}
                onOpenRfq={() => setIsRfqModalOpen(true)}
                onOpenAutomation={() => setIsAutomationModalOpen(true)}
                theme={theme}
              />
            )}

            {/* View 4: BD Export Advantage & Insights */}
            {activeView === 'insights' && (
              <InsightsView
                onOpenRfq={() => setIsRfqModalOpen(true)}
                onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Right Dock (Alibaba Style) */}
      <FloatingRightDock
        onOpenInquiries={() => setIsInquiryDrawerOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
        onOpenRfq={() => setIsRfqModalOpen(true)}
        onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
        inquiryCount={rfqs.length + samples.length > 0 ? rfqs.length + samples.length : 64}
        theme={theme}
      />

      {/* 5. FOOTER: Like Alibaba but relevant to handsandhead.com */}
      <Footer
        onOpenRfq={() => setIsRfqModalOpen(true)}
        onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
        onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
        theme={theme}
      />
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        supplier={activeSupplier}
        currency={currentCurrencyConfig}
        onClose={() => setSelectedProduct(null)}
        onRequestSample={handleOpenSampleModal}
        onInquire={handleInquireProduct}
        onOpenShippingCalc={() => {
          setSelectedProduct(null);
          setIsShippingCalcOpen(true);
        }}
        onOpenAiAssistant={(p) => handleOpenAiAssistant(p)}
      />

      {/* Tokyo Standard JIS Requisition & RFQ Spec Drawer */}
      <RequestSpecDrawer
        isOpen={isSpecDrawerOpen}
        onClose={() => setIsSpecDrawerOpen(false)}
        currency={currentCurrencyConfig}
        initialProduct={specDrawerProduct}
        initialRequestType={specDrawerType}
      />

      {/* Sample Order Modal */}
      <SampleOrderModal
        product={sampleProduct}
        currency={currentCurrencyConfig}
        isOpen={!!sampleProduct}
        onClose={() => setSampleProduct(null)}
        onConfirmSampleOrder={handleConfirmSampleOrder}
      />

      {/* RFQ Submission Modal */}
      <RfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        onSubmitRfq={handleSubmitRfq}
        defaultCategoryId={selectedCategory !== 'all' ? selectedCategory : 'rmg-apparel'}
      />

      {/* 50% JIT Trade Escrow & Chattogram Port Shipping Calculator Modal */}
      <ShippingCalculatorModal
        isOpen={isShippingCalcOpen}
        onClose={() => setIsShippingCalcOpen(false)}
        currency={currentCurrencyConfig}
      />

      {/* Inquiries & RFQs Drawer */}
      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        rfqs={rfqs}
        samples={samples}
        currency={currentCurrencyConfig}
        onOpenRfq={() => {
          setIsInquiryDrawerOpen(false);
          setIsRfqModalOpen(true);
        }}
      />

      {/* Super Automation Modal */}
      <SuperAutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        lang={lang}
      />

      {/* Enterprise Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
      />

      {/* TechPack Studio Modal */}
      <TechPackModal
        isOpen={isTechPackModalOpen}
        onClose={() => setIsTechPackModalOpen(false)}
        onSubmitTechPack={handleBroadcastTechPack}
      />

      {/* Compliance & ESG Vault Drawer */}
      <ComplianceVaultDrawer
        isOpen={isVaultOpen}
        onClose={() => {
          setIsVaultOpen(false);
          setVaultSupplier(null);
        }}
        supplier={vaultSupplier}
        onOpenRfq={(s: Supplier) => {
          setIsVaultOpen(false);
          handleReserveLineSlot(s);
        }}
        theme={theme}
      />

      {/* Enterprise Factory Profile & Logistics Drawer */}
      <FactoryProfileDrawer
        supplier={profileDrawerSupplier}
        isOpen={isProfileDrawerOpen}
        onClose={() => {
          setIsProfileDrawerOpen(false);
          setProfileDrawerSupplier(null);
        }}
        onContactSupplier={() => setIsRfqModalOpen(true)}
        onOpenComplianceVault={handleOpenComplianceVault}
        onReserveLineSlot={handleReserveLineSlot}
        theme={theme}
      />

      {/* RAWx Bot AI Sourcing Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => {
          setIsAiAssistantOpen(false);
          setAiProductContext(null);
          setAiSupplierContext(null);
        }}
        activeProduct={aiProductContext}
        activeSupplier={aiSupplierContext}
        currency={currentCurrencyConfig}
        authUser={authUser}
        onOpenRfqWithContext={(notes) => {
          setIsAiAssistantOpen(false);
          setIsRfqModalOpen(true);
        }}
        onOpenSampleOrder={(p) => {
          setIsAiAssistantOpen(false);
          setSampleProduct(p);
        }}
      />

      {/* NexOS Pipeline Inspector Modal */}
      <NexosPipelineModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        theme={theme}
      />

      {/* High-Tech Mobile Bottom Dock */}
      {!currentPath.startsWith('/buyer') && !currentPath.startsWith('/seller') && (
        <MobileHighTechDock
          activeView={activeView}
          onViewChange={(v) => {
            setActiveView(v);
            setActiveHeroTab(v === 'suppliers' ? 'suppliers' : v === 'customers' ? 'customers' : 'products');
          }}
          onOpenAiAssistant={() => handleOpenAiAssistant()}
          onOpenRfq={() => setIsRfqModalOpen(true)}
          onOpenPipeline={() => setIsPipelineModalOpen(true)}
          theme={theme}
          onHeightChange={(height) => setMobileDockHeight(height)}
        />
      )}

      {/* B2B Inquiry Cart Drawer */}
      <InquiryCart
        authUser={authUser}
        currency={currentCurrencyConfig}
        onExploreProducts={() => {
          setActiveView('products');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* RAWx Autonomous Trade Agent Chat Window */}
      <RawxBotChat
        authUser={authUser}
        onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <NexosSyncProvider>
        <InquiryCartProvider>
          <AppContent />
        </InquiryCartProvider>
      </NexosSyncProvider>
    </I18nProvider>
  );
};
