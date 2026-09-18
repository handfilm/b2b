import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import {
  B2BProduct,
  Supplier,
  Customer,
  NexosDatabaseMetrics,
  PipelineSyncEvent,
  CategoryId,
} from '../types';
import { nexusApi } from '../services/nexusApi';

interface NexosSyncContextType {
  // Catalog Data
  products: B2BProduct[];
  filteredProducts: B2BProduct[];
  totalProductsCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;

  // Suppliers & Buyers
  suppliers: Supplier[];
  buyers: Customer[];
  isLoadingSuppliers: boolean;
  isLoadingBuyers: boolean;

  // Database Metrics
  metrics: NexosDatabaseMetrics;

  // Filtering & Sorting (Instant Client-Side)
  selectedDivision: string;
  setSelectedDivision: (slug: string) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'ranking' | 'moq' | 'leadTime' | 'reorder';
  setSortBy: (sort: 'ranking' | 'moq' | 'leadTime' | 'reorder') => void;

  // Sync Pipeline State & Actions
  syncStatus: 'idle' | 'syncing' | 'live' | 'error';
  lastSyncedAt: string | null;
  syncEvents: PipelineSyncEvent[];
  triggerSync: (source?: 'all' | 'drive' | 'arutemika') => Promise<void>;
  addPublishedProduct: (product: B2BProduct) => void;
  isPipelineModalOpen: boolean;
  setIsPipelineModalOpen: (open: boolean) => void;

  // Mobile drawer / filter states
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
}

const NexosSyncContext = createContext<NexosSyncContextType | undefined>(undefined);

export const NexosSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Catalog State
  const [products, setProducts] = useState<B2BProduct[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(2749);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Suppliers & Buyers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [buyers, setBuyers] = useState<Customer[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState<boolean>(false);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState<boolean>(false);

  // Metrics: Central NexOS Database (6.5 Crore BDT, 15,420 buyers, 3,105 suppliers)
  const [metrics, setMetrics] = useState<NexosDatabaseMetrics>({
    activeBuyers: 15420,
    verifiedSuppliers: 3105,
    totalTradeVol: '6.5 Crore+',
    bdtSalesVolume: '65,000,000 BDT',
    pendingRfqs: 48,
    customsSpeedDays: 3.2,
    syncedSourcesCount: 2,
    lastSyncTimestamp: new Date().toISOString(),
  });

  // Filters & Sorting
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'ranking' | 'moq' | 'leadTime' | 'reorder'>('ranking');

  // Pipeline Sync Status
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'live' | 'error'>('live');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(new Date().toISOString());
  const [syncEvents, setSyncEvents] = useState<PipelineSyncEvent[]>([
    {
      id: 'init-gdrv-sync',
      source: 'google_drive',
      sourceDomain: 'shop.handsandhead.com',
      recordsProcessed: 380,
      recordsFailed: 0,
      latencyMs: 34,
      status: 'synced',
      timestamp: new Date().toISOString(),
      message: 'Initial sync: Google Drive assets transformed with auto volume ladder (30% MOQ 500, 40% MOQ 2000).',
    },
    {
      id: 'init-artm-sync',
      source: 'arutemika',
      sourceDomain: 'arutemika.com',
      recordsProcessed: 340,
      recordsFailed: 0,
      latencyMs: 41,
      status: 'synced',
      timestamp: new Date().toISOString(),
      message: 'Initial sync: Arutemika atelier goods mapped to Flagship Leather with heritage provenance badges.',
    },
    {
      id: 'init-admin-sync',
      source: 'nexos_admin',
      sourceDomain: 'admin.handsandhead.com',
      recordsProcessed: 2749,
      recordsFailed: 0,
      latencyMs: 28,
      status: 'synced',
      timestamp: new Date().toISOString(),
      message: 'Ledger connected: 6.5 Crore BDT trade volume, 15,420 buyers, 3,105 suppliers streamed.',
    },
  ]);

  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Initial Hydration from NexOS API
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      setIsLoading(true);
      try {
        const [catalogRes, suppliersRes, buyersRes, metricsRes] = await Promise.all([
          nexusApi.fetchB2BCatalog({ page: 1, limit: 120, division: 'all' }),
          nexusApi.fetchVerifiedSuppliers(),
          nexusApi.fetchGlobalBuyers(),
          nexusApi.fetchDatabaseMetrics(),
        ]);

        if (isMounted) {
          setProducts(catalogRes.products);
          setTotalProductsCount(catalogRes.totalCount);
          setHasMore(catalogRes.hasMore);
          setSuppliers(suppliersRes.suppliers);
          setBuyers(buyersRes.buyers);
          setMetrics(metricsRes);
          setSyncStatus('live');
          setLastSyncedAt(new Date().toISOString());
        }
      } catch (err) {
        console.error('[NexosSyncContext] Hydration error:', err);
        if (isMounted) setSyncStatus('error');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  // Infinite Scroll: Load More
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    try {
      const res = await nexusApi.fetchB2BCatalog({
        page: nextPage,
        limit: 24,
        division: 'all',
      });

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = res.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newOnes];
      });
      setPage(nextPage);
      setHasMore(res.hasMore);
    } catch (err) {
      console.warn('[NexosSyncContext] Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  // Trigger Manual / Scheduled Sync Pipeline
  const triggerSync = useCallback(
    async (source: 'all' | 'drive' | 'arutemika' = 'all') => {
      setSyncStatus('syncing');

      try {
        const newEvents: PipelineSyncEvent[] = [];

        if (source === 'all' || source === 'drive') {
          const driveResult = await nexusApi.syncGoogleDriveHeadless();
          newEvents.push(driveResult.event);
        }

        if (source === 'all' || source === 'arutemika') {
          const artmResult = await nexusApi.syncArutemikaHeadless();
          newEvents.push(artmResult.event);
        }

        // Re-fetch catalog & metrics
        const refreshed = await nexusApi.fetchB2BCatalog({
          page: 1,
          limit: 120,
          division: 'all',
          forceRefresh: true,
        });

        const refreshedMetrics = await nexusApi.fetchDatabaseMetrics();

        setProducts(refreshed.products);
        setTotalProductsCount(refreshed.totalCount);
        setMetrics(refreshedMetrics);
        setSyncEvents((prev) => [...newEvents, ...prev]);
        setSyncStatus('live');
        setLastSyncedAt(new Date().toISOString());
      } catch (e) {
        console.error('[NexosSyncContext] Manual sync failed:', e);
        setSyncStatus('error');
      }
    },
    []
  );

  /**
   * INSTANT CLIENT-SIDE FILTERING & SORTING
   * Ensures the Pavilion Switcher (RMG, Leather, Outerwear, etc.) filters
   * the live ingested data instantly WITHOUT API refetching!
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Division Pavilion Filter (Instant Client-Side)
    if (selectedDivision && selectedDivision !== 'all') {
      result = result.filter((p) => p.divisionSlug === selectedDivision);
    }

    // 2. Category Filter (Instant Client-Side)
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // 3. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.hsCode.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q)) ||
          (p.provenance && p.provenance.toLowerCase().includes(q))
      );
    }

    // 4. Sorting
    if (sortBy === 'moq') {
      result.sort((a, b) => a.moq - b.moq);
    } else if (sortBy === 'leadTime') {
      result.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    } else if (sortBy === 'reorder') {
      result.sort((a, b) => (b.reorderRate || 0) - (a.reorderRate || 0));
    }

    return result;
  }, [products, selectedDivision, selectedCategory, searchQuery, sortBy]);

  const addPublishedProduct = useCallback((newProduct: B2BProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setTotalProductsCount((prev) => prev + 1);
  }, []);

  const value = {
    products,
    filteredProducts,
    totalProductsCount,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    suppliers,
    buyers,
    isLoadingSuppliers,
    isLoadingBuyers,
    metrics,
    selectedDivision,
    setSelectedDivision,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    syncStatus,
    lastSyncedAt,
    syncEvents,
    triggerSync,
    addPublishedProduct,
    isPipelineModalOpen,
    setIsPipelineModalOpen,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
  };

  return <NexosSyncContext.Provider value={value}>{children}</NexosSyncContext.Provider>;
};

export function useNexosSync(): NexosSyncContextType {
  const context = useContext(NexosSyncContext);
  if (!context) {
    throw new Error('useNexosSync must be used within a NexosSyncProvider');
  }
  return context;
}
