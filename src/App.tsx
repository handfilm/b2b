import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SupplierCard } from './components/SupplierCard';
import { RfqModal } from './components/RfqModal';
import { ShippingCalculatorModal } from './components/ShippingCalculatorModal';
import { SampleOrderModal } from './components/SampleOrderModal';
import { InquiryDrawer } from './components/InquiryDrawer';
import { InsightsView } from './components/InsightsView';
import { Footer } from './components/Footer';
import {
  CurrencyCode,
  CategoryId,
  Product,
  Supplier,
  RfqSubmission,
  SampleInquiry,
} from './types';
import {
  CURRENCIES,
  PRODUCTS,
  SUPPLIERS,
  CATEGORIES,
} from './data/mockData';
import {
  Filter,
  Layers,
  Sparkles,
  Building2,
  PackageCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'products' | 'suppliers' | 'insights'>('products');
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sampleProduct, setSampleProduct] = useState<Product | null>(null);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isShippingCalcOpen, setIsShippingCalcOpen] = useState(false);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = useState(false);

  // Active RFQs & Samples storage state
  const [rfqs, setRfqs] = useState<RfqSubmission[]>([
    {
      id: 'rfq-init-1',
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
      specNotes: 'GOTS Organic certified, custom dyed Pantone 19-4052 TCX Classic Blue.',
      status: 'Dispatched to 5 Factories',
      createdAt: '2026-09-15',
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

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return SUPPLIERS.filter((s) => {
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
  }, [searchQuery]);

  // Handlers
  const handleOpenSampleModal = (product: Product) => {
    setSampleProduct(product);
  };

  const handleInquireProduct = (product: Product, customMessage?: string) => {
    // Add quick sample/inquiry to drawer
    const newInquiry: SampleInquiry = {
      id: `inq-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      supplierName: product.supplierName,
      quantity: product.moq,
      sampleFeeUSD: 0,
      courierFeeUSD: 0,
      customNotes: customMessage || `General wholesale quote request for ${product.moq} units`,
      buyerEmail: 'international.buyer@trade.com',
      shippingCountry: 'International Dispatch',
      createdAt: new Date().toLocaleDateString(),
      trackingNumber: `INQ-BD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Sample In Production',
    };
    setSamples((prev) => [newInquiry, ...prev]);
    showNotification(`Inquiry dispatched to ${product.supplierName}! View in Inquiries drawer.`);
  };

  const handleSubmitRfq = (rfq: RfqSubmission) => {
    setRfqs((prev) => [rfq, ...prev]);
    showNotification(`RFQ for "${rfq.productRequirement}" broadcasted to 5 verified factories!`);
  };

  const handleConfirmSampleOrder = (order: SampleInquiry) => {
    setSamples((prev) => [order, ...prev]);
    showNotification(`Sample order dispatched via DHL Air Courier!`);
  };

  const activeSupplier = selectedProduct
    ? SUPPLIERS.find((s) => s.id === selectedProduct.supplierId)
    : undefined;

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-neutral-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Header */}
      <Header
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenRfq={() => setIsRfqModalOpen(true)}
        onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
        onOpenInquiries={() => setIsInquiryDrawerOpen(true)}
        inquiryCount={rfqs.length + samples.length}
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSupplierFilter(null);
        }}
      />

      {/* Sector Categories Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSupplierFilter(null);
          if (activeView !== 'products') setActiveView('products');
        }}
      />

      {/* Hero Announcement Banner (Shown on initial view or when searching) */}
      {activeView === 'products' && !searchQuery && !supplierFilter && (
        <HeroBanner
          onOpenRfq={() => setIsRfqModalOpen(true)}
          onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
          onExploreFactories={() => setActiveView('suppliers')}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Active Filters / Supplier Filter Notice */}
        {supplierFilter && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-emerald-900">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>
                Filtering items by factory: <strong>{SUPPLIERS.find((s) => s.id === supplierFilter)?.name}</strong>
              </span>
            </div>
            <button
              onClick={() => setSupplierFilter(null)}
              className="text-xs text-emerald-800 font-bold hover:underline"
            >
              Clear Factory Filter
            </button>
          </div>
        )}

        {/* View 1: Wholesale Products Grid */}
        {activeView === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                  {selectedCategory === 'all'
                    ? 'All Export Sourcing Catalog'
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Showing {filteredProducts.length} verified export items with FOB/CIF port pricing
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={() => setIsRfqModalOpen(true)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Can't find your exact spec? Post an RFQ</span>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-neutral-200">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-neutral-800">No matching export products found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search query or submit a custom Request for Quotation (RFQ) to our manufacturer trade desk.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSupplierFilter(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
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
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Verified Bangladesh Suppliers / Mills */}
        {activeView === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                  Verified Bangladesh Exporters & Certified Green Mills
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Direct contact with BGMEA, BKMEA, and USGBC LEED Platinum compliant factories
                </p>
              </div>

              <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                100% Export Tax ID & Trade License Audited
              </div>
            </div>

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
                />
              ))}
            </div>
          </div>
        )}

        {/* View 3: BD Export Advantage & Insights */}
        {activeView === 'insights' && (
          <InsightsView
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
          />
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

      {/* Inquiries & Samples Tracking Drawer */}
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

      {/* Footer */}
      <Footer
        onOpenRfq={() => setIsRfqModalOpen(true)}
        onOpenShippingCalc={() => setIsShippingCalcOpen(true)}
      />
    </div>
  );
};
