import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
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
import { Footer } from './components/Footer';
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
  PRODUCTS,
  SUPPLIERS as INITIAL_SUPPLIERS,
  CUSTOMERS as INITIAL_CUSTOMERS,
  LIVE_TRADE_EVENTS as INITIAL_LIVE_EVENTS,
  CATEGORIES,
} from './data/mockData';
import { nexusApi } from './services/nexusApi';
import { generateRandomTradeEvent } from './services/realtimeEngine';
import { getTranslation } from './i18n/translations';
import {
  Filter,
  Layers,
  Sparkles,
  Building2,
  PackageCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Search,
  Users,
  Zap,
  Bot,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [lang, setLang] = useState<LanguageCode>('EN');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'products' | 'suppliers' | 'customers' | 'insights'>('products');
  const [persona, setPersona] = useState<PersonaMode>('buyer');
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  // Supplier & Customer dynamic data layer
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

  // AI Assistant States (Alibaba / IndiaMART Instant Sourcing Assistant)
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiProductContext, setAiProductContext] = useState<Product | null>(null);
  const [aiSupplierContext, setAiSupplierContext] = useState<Supplier | null>(null);

  // Active RFQs & Samples storage state
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

  // Fetch live or fallback suppliers, customers, events & stats via nexusApi
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
        console.error('Data layer sync notice:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadBackendData();

    // Pulse live trade event streaming every 20 seconds
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
      showNotification(lang === 'BN' ? 'রিয়েল-টাইম ডাটা সফলভাবে সিঙ্ক হয়েছে!' : 'Realtime trade data synced with Master Nexus!');
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category check
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      // Supplier filter
      if (supplierFilter && p.supplierId !== supplierFilter) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesHs = p.hsCode.toLowerCase().includes(query);
        const matchesSupplier = p.supplierName.toLowerCase().includes(query);
        const matchesMaterials = p.materials.some((m) => m.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesHs && !matchesSupplier && !matchesMaterials) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, supplierFilter, searchQuery]);

  // Filtered Suppliers List for Display
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff5500] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141414] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-[#ff5500]/40 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Header with Persona Switcher, Auth User Pill and Ecosystem Links */}
      <Header
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        lang={lang}
        onLanguageChange={setLang}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
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
      />

      {/* Sector Categories Bar (Buyer Mode) */}
      {persona === 'buyer' && (
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSupplierFilter(null);
            if (activeView !== 'products' && activeView !== 'customers') setActiveView('products');
          }}
        />
      )}

      {/* Hero Announcement Banner (Shown in Buyer mode on initial view) */}
      {persona === 'buyer' && activeView === 'products' && !searchQuery && !supplierFilter && (
        <HeroBanner
          onOpenRfq={() => setIsRfqModalOpen(true)}
          onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
          onExploreFactories={() => setActiveView('suppliers')}
          onOpenAutomation={() => setIsAutomationModalOpen(true)}
          stats={marketplaceStats}
          lang={lang}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
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
            {/* Active Filters / Supplier Filter Notice */}
            {supplierFilter && (
              <div className="mb-4 p-3.5 bg-[#141414] border border-[#ff5500]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-white">
                  <Building2 className="w-4 h-4 text-[#ff5500]" />
                  <span>
                    Filtering catalog by factory: <strong className="text-[#ff5500]">{suppliers.find((s) => s.id === supplierFilter)?.name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSupplierFilter(null)}
                  className="text-xs text-[#ff5500] font-bold hover:underline cursor-pointer"
                >
                  Clear Factory Filter
                </button>
              </div>
            )}

            {/* View 1: Wholesale Products Grid */}
            {activeView === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {selectedCategory === 'all'
                        ? 'All Export Sourcing Catalog'
                        : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showing {filteredProducts.length} verified export items with FOB/CIF port pricing
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <button
                      onClick={() => setIsRfqModalOpen(true)}
                      className="text-[#ff5500] hover:text-[#ff6a1a] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Custom spec needed? Post an RFQ</span>
                    </button>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-3 glass-panel rounded-2xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
                      <Filter className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-white">No matching export products found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try clearing your search query or submit a custom Request for Quotation (RFQ) to our manufacturer trade desk.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSupplierFilter(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#ff5500] text-white text-xs font-bold cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currency={currentCurrencyConfig}
                        onSelectProduct={setSelectedProduct}
                        onRequestSample={handleOpenSampleModal}
                        onInquire={handleInquireProduct}
                        onOpenAiAssistant={(p) => handleOpenAiAssistant(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View 2: Verified Bangladesh Suppliers / EPB Mills */}
            {activeView === 'suppliers' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Verified Bangladesh Exporters & Certified Green Mills
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct contact with BGMEA, BKMEA, and USGBC LEED Platinum compliant factories
                    </p>
                  </div>

                  {/* Supplier Filters: District & EPB Bonded Warehouse */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="flex items-center space-x-1.5 bg-[#141414] px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-slate-400">District:</span>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="all" className="bg-[#121212]">All Districts</option>
                        <option value="Narayanganj" className="bg-[#121212]">Narayanganj (Knit Hub)</option>
                        <option value="Gazipur" className="bg-[#121212]">Gazipur (Woven & Denim)</option>
                        <option value="Dhaka" className="bg-[#121212]">Dhaka (Apparel & Tech)</option>
                        <option value="Chattogram" className="bg-[#121212]">Chattogram (Port Mills)</option>
                        <option value="Savar" className="bg-[#121212]">Savar (Leather Tannery)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setBondedOnly(!bondedOnly)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        bondedOnly
                          ? 'bg-[#ff5500] text-white border-[#ff5500]'
                          : 'bg-[#141414] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>EPB Bonded Only</span>
                    </button>
                  </div>
                </div>

                {isLoadingData ? (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ff5500]" />
                    <div className="text-xs">Querying Nexus Supplier Registry...</div>
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="py-16 text-center space-y-3 glass-panel rounded-2xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-white">No factories match your filter</h3>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSelectedDistrict('all');
                          setBondedOnly(false);
                          setSearchQuery('');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#ff5500] text-white text-xs font-bold"
                      >
                        Reset District & Bond Filter
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSuppliers.map((supplier) => (
                      <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        onContactSupplier={(s) => {
                          setIsRfqModalOpen(true);
                        }}
                        onFilterBySupplier={(id) => {
                          setSupplierFilter(id);
                          setActiveView('products');
                        }}
                        onOpenComplianceVault={handleOpenComplianceVault}
                        onReserveLineSlot={handleReserveLineSlot}
                        onOpenAiAssistant={(s) => handleOpenAiAssistant(null, s)}
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        supplier={activeSupplier}
        currency={currentCurrencyConfig}
        onClose={() => setSelectedProduct(null)}
        onRequestSample={handleOpenSampleModal}
        onInquire={handleInquireProduct}
        onOpenShippingCalc={(port) => {
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
        defaultCategoryId={selectedCategory}
      />

      {/* Shipping / Freight Calculator Modal */}
      <ShippingCalculatorModal
        isOpen={isShippingCalcOpen}
        onClose={() => setIsShippingCalcOpen(false)}
        currency={currentCurrencyConfig}
      />

      {/* Super Automation Desk Modal */}
      <SuperAutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        lang={lang}
      />

      {/* Inquiries & Samples Tracking Drawer with JIT Escrow */}
      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        samples={samples}
        rfqs={rfqs}
        currency={currentCurrencyConfig}
        onOpenRfq={() => {
          setIsInquiryDrawerOpen(false);
          setIsRfqModalOpen(true);
        }}
      />

      {/* Enterprise Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
        initialRole={persona}
      />

      {/* Interactive TechPack & CAD Studio Modal */}
      <TechPackModal
        isOpen={isTechPackModalOpen}
        onClose={() => setIsTechPackModalOpen(false)}
        onSubmitTechPack={handleBroadcastTechPack}
      />

      {/* Compliance & ESG Audit Vault Slide-Over Drawer */}
      <ComplianceVaultDrawer
        supplier={vaultSupplier}
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onOpenRfq={(sup) => {
          setIsVaultOpen(false);
          setIsRfqModalOpen(true);
        }}
      />

      {/* Floating Instant AI Assistant Button (Alibaba & IndiaMART style) */}
      <button
        id="floating-ai-assistant-btn"
        onClick={() => handleOpenAiAssistant()}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-[#0e0e0e] hover:bg-[#161616] text-white border border-[#ff5500]/50 shadow-2xl shadow-[#ff5500]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Instant Sourcing & Trade AI Assistant (Alibaba / IndiaMART Style)"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#ff5500] flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0e0e0e] animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-white flex items-center space-x-1">
            <span>AI Trade Assistant</span>
            <Sparkles className="w-3 h-3 text-[#ff5500]" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Instant Sourcing & Queries</div>
        </div>
      </button>

      {/* AI Assistant Modal */}
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
        onOpenRfqWithContext={() => {
          setIsAiAssistantOpen(false);
          setIsRfqModalOpen(true);
        }}
        onOpenSampleOrder={(prod) => {
          setIsAiAssistantOpen(false);
          handleOpenSampleModal(prod);
        }}
        onOpenComplianceVault={(sup) => {
          setIsAiAssistantOpen(false);
          handleOpenComplianceVault(sup);
        }}
      />

      {/* Footer */}
      <Footer
        onOpenRfq={() => setIsRfqModalOpen(true)}
        onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
      />
    </div>
  );
};
