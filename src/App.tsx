import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { FloatingRightDock } from './components/FloatingRightDock';
import { Footer } from './components/Footer';
import { NexosSyncProvider, useNexosSync } from './context/NexosSyncContext';
import { NexosPipelineModal } from './components/NexosPipelineModal';
import { MobileHighTechDock } from './components/MobileHighTechDock';
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
    isPipelineModalOpen,
    setIsPipelineModalOpen,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useNexosSync();

  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [lang, setLang] = useState<LanguageCode>('EN');
  const [activeView, setActiveView] = useState<'products' | 'suppliers' | 'customers' | 'insights'>('products');
  const [persona, setPersona] = useState<PersonaMode>('buyer');
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  // Alibaba Hero Tab ('ai' | 'products' | 'suppliers' | 'customers')
  const [activeHeroTab, setActiveHeroTab] = useState<'ai' | 'products' | 'suppliers' | 'customers'>('products');

  // Federated Division and Domain Source State
  const [selectedDomainSource, setSelectedDomainSource] = useState<'all' | 'shop.handsandhead.com' | 'arutemika.handsandhead.com'>('all');
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sampleProduct, setSampleProduct] = useState<Product | null>(null);
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
    return result;
  }, [nexosFilteredProducts, selectedDomainSource, supplierFilter]);

  // Filtered Suppliers List
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (bondedOnly && !s.bondedWarehouse) return false;
      if (selectedDistrict !== 'all' && s.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
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

  const handleOpenSampleModal = (product: Product) => {
    setSampleProduct(product);
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
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#e11d48] selection:text-white ${
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
        apiSource={apiSource}
        onForceSync={handleForceSync}
        isSyncing={isSyncing}
        authUser={authUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenTechPackStudio={() => setIsTechPackModalOpen(true)}
        activeRfqCount={rfqs.length}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPipeline={() => setIsPipelineModalOpen(true)}
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
      <main className="max-w-7xl mx-auto px-4 py-4 flex-1 w-full pb-24 lg:pb-8">
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
                {/* Control Bar: Source Domains, Sort By & Product Count */}
                <div
                  className={`rounded-2xl border p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    theme === 'dark'
                      ? 'bg-[#141414] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Sourcing Feeds Filter Tabs: Federated Divisions */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-0.5 max-w-2xl">
                    <span className="font-bold text-slate-400 mr-1 text-[11px] uppercase tracking-wider font-mono shrink-0">
                      Sourcing Node:
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDivision('all');
                        setSelectedDomainSource('all');
                      }}
                      className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                        selectedDivision === 'all' && selectedDomainSource === 'all'
                          ? 'bg-[#e11d48] text-white shadow-xs'
                          : theme === 'dark'
                          ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      All Verticals ({nexosCatalog.length})
                    </button>
                    {FEDERATED_DIVISIONS.slice(1, 8).map((div) => {
                      const isActive = selectedDivision === div.slug;
                      return (
                        <button
                          key={div.slug}
                          onClick={() => {
                            setSelectedDivision(div.slug);
                            if (div.slug === 'rmg-knits' || div.slug === 'commercial-blanks') {
                              setSelectedDomainSource('shop.handsandhead.com');
                            } else if (div.slug === 'flagship-leather' || div.slug === 'leather-cuffs') {
                              setSelectedDomainSource('arutemika.handsandhead.com');
                            } else {
                              setSelectedDomainSource('all');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                            isActive
                              ? 'bg-[#e11d48] text-white shadow-xs'
                              : theme === 'dark'
                              ? 'bg-white/5 text-slate-300 hover:bg-white/15 border border-white/10'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-white' : 'bg-[#e11d48]'
                            }`}
                          />
                          <span>{div.divisionTitle}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Sort By Dropdown & Count */}
                  <div className="flex items-center space-x-3 text-xs shrink-0">
                    <div className="flex items-center space-x-1">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className={`rounded-lg px-2 py-1 text-xs font-bold focus:outline-none cursor-pointer border ${
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
                      {displayedProducts.length} items
                    </span>
                  </div>
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

                {/* Empty State */}
                {displayedProducts.length === 0 ? (
                  <div
                    className={`py-16 text-center space-y-3 rounded-2xl border shadow-xs ${
                      theme === 'dark'
                        ? 'bg-[#141414] border-white/10 text-white'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-400 mx-auto flex items-center justify-center">
                      <Filter className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base">No matching export products found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try clearing your search query or reset your domain feed filter to discover verified Bangladesh products.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSelectedDivision('all');
                          setSelectedDomainSource('all');
                          setSupplierFilter(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#ff1e42] text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Unlimited Products Grid (High-Tech 2-cols on mobile, 3-4 cols on desktop 1:1 Cards) */
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
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
                      />
                    ))}
                  </div>
                )}

                {/* Infinite Scroll Trigger Sentinel & Loading Indicator */}
                <div
                  ref={sentinelRef}
                  className="py-8 flex flex-col items-center justify-center space-y-2"
                >
                  {isLoadingMore && (
                    <div
                      className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-full border shadow-xs animate-in fade-in ${
                        theme === 'dark'
                          ? 'bg-[#141414] border-white/10 text-white'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-[#e11d48]" />
                      <span>Loading more products from shop.handsandhead.com & arutemika.handsandhead.com...</span>
                    </div>
                  )}

                  {!isLoadingMore && hasMore && (
                    <button
                      onClick={loadMore}
                      className={`px-5 py-2 rounded-full border text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#141414] hover:bg-white/10 border-white/20 text-white hover:text-[#ff1e42]'
                          : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-[#e11d48]'
                      }`}
                    >
                      Load More Products (or keep scrolling)
                    </button>
                  )}

                  {!hasMore && displayedProducts.length > 0 && (
                    <div className="text-xs text-slate-400 font-medium font-mono">
                      You've browsed all current live export lots from Bangladesh mills.
                    </div>
                  )}
                </div>
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
                    <h2 className="text-lg font-black tracking-tight">
                      Verified Bangladesh Exporters & Certified Green Mills
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct contact with BGMEA, BKMEA, and USGBC LEED Platinum compliant factories
                    </p>
                  </div>

                  {/* Supplier Filters */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
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
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="bg-transparent font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="all" className="bg-[#141414] text-white">All Districts</option>
                        <option value="Narayanganj" className="bg-[#141414] text-white">Narayanganj (Knit Hub)</option>
                        <option value="Gazipur" className="bg-[#141414] text-white">Gazipur (Woven & Denim)</option>
                        <option value="Dhaka" className="bg-[#141414] text-white">Dhaka (Apparel & Tech)</option>
                        <option value="Chattogram" className="bg-[#141414] text-white">Chattogram (Port Mills)</option>
                        <option value="Savar" className="bg-[#141414] text-white">Savar (Leather Tannery)</option>
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

                {isLoadingData ? (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSuppliers.map((supplier) => (
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
                        theme={theme}
                      />
                    ))}
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
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <NexosSyncProvider>
      <AppContent />
    </NexosSyncProvider>
  );
};
