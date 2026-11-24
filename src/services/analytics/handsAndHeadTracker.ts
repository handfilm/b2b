/**
 * HANDS & HEAD Multi-Subdomain Dual-Beacon & Failover Tracker
 *
 * Syncs ad-clip attribution, funnel events, and pre-orders across:
 *  - Primary: https://admin.handsandhead.com/api
 *  - Backup Mirror: https://handsandhead.ai.studio/api
 *  - Offline Durable Queue: localStorage (`hh_pending_sync_queue_v1`) with IndexedDB mirror
 *
 * Supports all ecosystem storefronts: handsandhead.com, storyboard, d2c, b2b, rawx.
 */

export const PRIMARY_API = 'https://admin.handsandhead.com/api';
export const BACKUP_API = 'https://handsandhead.ai.studio/api';

export const ATTRIBUTION_STORAGE_KEY = 'hh_attribution_v1';
export const PAGE_VIEW_SENT_KEY = 'hh_pageview_sent_v1';
export const PENDING_QUEUE_STORAGE_KEY = 'hh_pending_sync_queue_v1';
export const PUBLIC_CATALOG_CACHE_KEY = 'hh_public_catalog_cache_v1';

const FAILOVER_TIMEOUT_MS = 3000;
const MAX_QUEUE_SIZE = 100;
const IDB_NAME = 'hh_tracker_failover_db';
const IDB_STORE = 'pending_sync_queue';

export type HandsAndHeadSubdomain = 'storyboard' | 'd2c' | 'b2b' | 'rawx' | 'main';
export type TrackEventName =
  | 'page_view'
  | 'checkout_click'
  | 'whatsapp_open'
  | 'sample_order'
  | 'rfq_submit';

export interface AttributionState {
  session_id: string;
  subdomain: HandsAndHeadSubdomain;
  hostname: string;
  deal: string | null;
  clip_id: string | null;
  src: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  landing_path: string;
  referrer: string;
  captured_at: string;
}

export interface TrackEventMetadata {
  wing?: string;
  product_title?: string;
  sku?: string;
  quantity?: number;
  amount?: number;
  currency?: string;
  order_id?: string;
  channel?: string;
  target_url?: string;
  label?: string;
  [key: string]: unknown;
}

export interface PreCreateOrderInput {
  channel: 'whatsapp' | 'bkash' | 'nagad' | 'sample' | 'rfq' | 'pocket_pass';
  productTitle?: string;
  sku?: string;
  wing?: string;
  quantity?: number;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingCountry?: string;
  notes?: string;
  targetUrl?: string;
}

export interface PreCreateOrderResult {
  orderId: string;
  synced: boolean;
  endpoint: 'primary' | 'backup' | 'queued';
  attribution: AttributionState;
}

export interface PendingSyncItem {
  id: string;
  endpointPath: '/track' | '/orders/pre-create';
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

export interface PublicCatalogFetchResult<T = Record<string, unknown>> {
  items: T[];
  totalCount: number;
  source: 'primary' | 'backup' | 'cache' | 'none';
  updatedAt: string | null;
  raw?: unknown;
}

interface DualPostResult<T = Record<string, unknown>> {
  ok: boolean;
  endpoint: 'primary' | 'backup' | 'queued';
  data?: T;
}

let isInitialized = false;
let isFlushingQueue = false;
let clickInterceptorAttached = false;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function generateSessionId(): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `HHS-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

export function generateLocalOrderId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `#HF-LOCAL-${suffix}`;
}

/**
 * Automatically detects the active HANDS & HEAD subdomain.
 */
export function detectSubdomain(hostname?: string, pathname?: string): HandsAndHeadSubdomain {
  const host = (hostname ?? (isBrowser() ? window.location.hostname : '')).toLowerCase();
  const path = (pathname ?? (isBrowser() ? window.location.pathname : '')).toLowerCase();

  if (host.includes('storyboard') || host.includes('handfilm') || path.startsWith('/studio')) {
    return 'storyboard';
  }
  if (host.includes('d2c') || host.includes('shop.') || path.startsWith('/d2c')) {
    return 'd2c';
  }
  if (host.includes('rawx')) {
    return 'rawx';
  }
  if (
    host.includes('b2b') ||
    host.includes('rmg.') ||
    host.includes('leather.') ||
    host.includes('jacket.') ||
    path.startsWith('/rmg') ||
    path.startsWith('/leather') ||
    path.startsWith('/jacket') ||
    path.startsWith('/hardware') ||
    path.startsWith('/catalog')
  ) {
    return 'b2b';
  }
  return 'main';
}

function safeReadSessionStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteSessionStorage(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function safeReadLocalStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteLocalStorage(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

/**
 * Lightweight best-effort IndexedDB mirror for the pending sync queue so
 * queued orders survive even if localStorage is cleared or restricted.
 */
function openFailoverDb(): Promise<IDBDatabase | null> {
  if (!isBrowser() || typeof window.indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function mirrorQueueToIdb(items: PendingSyncItem[]): Promise<void> {
  const db = await openFailoverDb();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.clear();
    for (const item of items) {
      store.put(item);
    }
  } catch {
    // Silent fallback — localStorage remains primary queue store
  } finally {
    db.close();
  }
}

async function readQueueFromIdb(): Promise<PendingSyncItem[]> {
  const db = await openFailoverDb();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve(Array.isArray(req.result) ? (req.result as PendingSyncItem[]) : []);
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    } catch {
      db.close();
      resolve([]);
    }
  });
}

function readPendingQueue(): PendingSyncItem[] {
  const stored = safeReadLocalStorage<PendingSyncItem[]>(PENDING_QUEUE_STORAGE_KEY);
  return Array.isArray(stored) ? stored : [];
}

function writePendingQueue(queue: PendingSyncItem[]): void {
  const trimmed = queue.slice(-MAX_QUEUE_SIZE);
  safeWriteLocalStorage(PENDING_QUEUE_STORAGE_KEY, trimmed);
  void mirrorQueueToIdb(trimmed);
}

function enqueueFailedPayload(
  endpointPath: '/track' | '/orders/pre-create',
  payload: Record<string, unknown>,
  lastError?: string
): PendingSyncItem {
  const queue = readPendingQueue();
  const item: PendingSyncItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    endpointPath,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 1,
    lastError,
  };
  queue.push(item);
  writePendingQueue(queue);
  return item;
}

/**
 * Reads ?deal=, ?clip=, ?src=, and ?utm_campaign= from window.location.search
 * and merges with sessionStorage (`hh_attribution_v1`).
 */
export function captureAttribution(): AttributionState {
  const existing = safeReadSessionStorage<AttributionState>(ATTRIBUTION_STORAGE_KEY);
  const hostname = isBrowser() ? window.location.hostname : 'b2b.handsandhead.com';
  const pathname = isBrowser() ? window.location.pathname : '/';
  const search = isBrowser() ? window.location.search : '';
  const params = new URLSearchParams(search);

  const pickParam = (name: string): string | null => {
    const val = params.get(name);
    return val && val.trim() ? val.trim().slice(0, 120) : null;
  };

  const deal = pickParam('deal') ?? existing?.deal ?? null;
  const clipId = pickParam('clip') ?? pickParam('clip_id') ?? existing?.clip_id ?? null;
  const src = pickParam('src') ?? pickParam('utm_source') ?? existing?.src ?? null;
  const utmCampaign = pickParam('utm_campaign') ?? existing?.utm_campaign ?? null;
  const utmSource = pickParam('utm_source') ?? existing?.utm_source ?? null;
  const utmMedium = pickParam('utm_medium') ?? existing?.utm_medium ?? null;

  const state: AttributionState = {
    session_id: existing?.session_id || generateSessionId(),
    subdomain: detectSubdomain(hostname, pathname),
    hostname,
    deal,
    clip_id: clipId,
    src,
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
    landing_path: existing?.landing_path || pathname || '/',
    referrer: existing?.referrer || (isBrowser() ? document.referrer || '' : ''),
    captured_at: existing?.captured_at || new Date().toISOString(),
  };

  safeWriteSessionStorage(ATTRIBUTION_STORAGE_KEY, state);
  return state;
}

export function getAttribution(): AttributionState {
  const existing = safeReadSessionStorage<AttributionState>(ATTRIBUTION_STORAGE_KEY);
  if (existing) return existing;
  return captureAttribution();
}

async function fetchJsonWithTimeout<T>(
  url: string,
  init: RequestInit,
  timeoutMs = FAILOVER_TIMEOUT_MS
): Promise<{ ok: boolean; status: number; data?: T }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    if (!response.ok) {
      return { ok: false, status: response.status };
    }
    let parsed: T | undefined;
    try {
      parsed = (await response.json()) as T;
    } catch {
      parsed = undefined;
    }
    return { ok: true, status: response.status, data: parsed };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Core dual-endpoint POST with 3-second timeout failover:
 * PRIMARY_API -> BACKUP_API -> durable localStorage + IndexedDB retry queue.
 */
async function postWithDualFailover<T = Record<string, unknown>>(
  endpointPath: '/track' | '/orders/pre-create',
  payload: Record<string, unknown>,
  options: { enqueueOnFailure?: boolean; keepalive?: boolean } = {}
): Promise<DualPostResult<T>> {
  const { enqueueOnFailure = true, keepalive = true } = options;
  const serialized = JSON.stringify(payload);
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: serialized,
    keepalive,
  };

  let lastError = '';

  // 1. Primary endpoint (admin.handsandhead.com)
  try {
    const primaryRes = await fetchJsonWithTimeout<T>(
      `${PRIMARY_API}${endpointPath}`,
      requestInit,
      FAILOVER_TIMEOUT_MS
    );
    if (primaryRes.ok) {
      return { ok: true, endpoint: 'primary', data: primaryRes.data };
    }
    lastError = `primary_http_${primaryRes.status}`;
  } catch (err) {
    lastError = err instanceof Error ? `primary_${err.name}` : 'primary_network_error';
  }

  // 2. Backup Mirror endpoint (handsandhead.ai.studio)
  try {
    const backupRes = await fetchJsonWithTimeout<T>(
      `${BACKUP_API}${endpointPath}`,
      requestInit,
      FAILOVER_TIMEOUT_MS
    );
    if (backupRes.ok) {
      return { ok: true, endpoint: 'backup', data: backupRes.data };
    }
    lastError = `${lastError}|backup_http_${backupRes.status}`;
  } catch (err) {
    lastError = `${lastError}|${err instanceof Error ? `backup_${err.name}` : 'backup_network_error'}`;
  }

  // 3. Durable local queue (zero lost orders/leads)
  if (enqueueOnFailure) {
    enqueueFailedPayload(endpointPath, payload, lastError);
  }

  return { ok: false, endpoint: 'queued' };
}

/**
 * Flushes queued events & pre-orders from localStorage / IndexedDB on page load
 * or browser `online` recovery.
 */
export async function flushPendingQueue(): Promise<{ flushed: number; remaining: number }> {
  if (!isBrowser() || isFlushingQueue) {
    return { flushed: 0, remaining: readPendingQueue().length };
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { flushed: 0, remaining: readPendingQueue().length };
  }

  isFlushingQueue = true;
  let flushed = 0;

  try {
    let queue = readPendingQueue();
    if (queue.length === 0) {
      const idbItems = await readQueueFromIdb();
      if (idbItems.length > 0) {
        queue = idbItems;
      }
    }
    if (queue.length === 0) {
      return { flushed: 0, remaining: 0 };
    }

    const remaining: PendingSyncItem[] = [];
    for (const item of queue) {
      const res = await postWithDualFailover(
        item.endpointPath,
        {
          ...item.payload,
          queued_retry: true,
          queued_at: item.createdAt,
          retry_attempt: item.attempts + 1,
        },
        { enqueueOnFailure: false, keepalive: false }
      );

      if (res.ok) {
        flushed += 1;
      } else {
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
        });
      }
    }

    writePendingQueue(remaining);
    return { flushed, remaining: remaining.length };
  } finally {
    isFlushingQueue = false;
  }
}

/**
 * Fires a non-blocking attribution/funnel event (`page_view`, `checkout_click`, `whatsapp_open`, etc.)
 * using dual-endpoint failover and durable queueing.
 */
export async function trackEvent(
  event: TrackEventName,
  metadata: TrackEventMetadata = {}
): Promise<DualPostResult> {
  const attribution = getAttribution();
  const payload: Record<string, unknown> = {
    event,
    subdomain: attribution.subdomain,
    hostname: attribution.hostname,
    session_id: attribution.session_id,
    deal: attribution.deal,
    clip_id: attribution.clip_id,
    src: attribution.src,
    utm_campaign: attribution.utm_campaign,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    path: isBrowser() ? window.location.pathname : '/',
    url: isBrowser() ? window.location.href : '',
    referrer: attribution.referrer,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  return postWithDualFailover('/track', payload, {
    enqueueOnFailure: true,
    keepalive: true,
  });
}

/**
 * Sends a fast non-blocking `navigator.sendBeacon` payload during page unload
 * when the browser is closing and pending tracking events remain.
 */
function dispatchUnloadBeacon(payload: Record<string, unknown>): void {
  if (!isBrowser() || typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
    return;
  }
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const sentPrimary = navigator.sendBeacon(`${PRIMARY_API}/track`, blob);
    if (!sentPrimary) {
      navigator.sendBeacon(`${BACKUP_API}/track`, blob);
    }
  } catch {
    // Ignore beacon errors on teardown
  }
}

/**
 * Logs a pre-order to PRIMARY_API (/api/orders/pre-create) with automatic 3s failover
 * to BACKUP_API and durable offline queueing + `#HF-LOCAL-XXXXXX` fallback ID.
 */
export async function preCreateOrder(
  input: PreCreateOrderInput
): Promise<PreCreateOrderResult> {
  const attribution = getAttribution();
  const fallbackOrderId = generateLocalOrderId();

  const payload: Record<string, unknown> = {
    local_order_id: fallbackOrderId,
    channel: input.channel,
    subdomain: attribution.subdomain,
    hostname: attribution.hostname,
    session_id: attribution.session_id,
    deal: attribution.deal,
    clip_id: attribution.clip_id,
    src: attribution.src,
    utm_campaign: attribution.utm_campaign,
    wing: input.wing || detectSubdomain(),
    product_title: input.productTitle || 'HANDS & HEAD B2B Inquiry',
    sku: input.sku || null,
    quantity: input.quantity ?? null,
    amount: input.amount ?? null,
    currency: input.currency || 'USD',
    customer_email: input.customerEmail || null,
    customer_phone: input.customerPhone || null,
    shipping_country: input.shippingCountry || null,
    notes: input.notes || null,
    target_url: input.targetUrl || null,
    page_url: isBrowser() ? window.location.href : '',
    created_at: new Date().toISOString(),
  };

  const res = await postWithDualFailover<{
    order_id?: string;
    orderId?: string;
    orderCode?: string;
    code?: string;
    id?: string;
  }>('/orders/pre-create', payload, {
    enqueueOnFailure: true,
    keepalive: true,
  });

  const serverOrderId =
    res.data?.order_id ||
    res.data?.orderId ||
    res.data?.orderCode ||
    res.data?.code ||
    res.data?.id;

  const formattedOrderId = serverOrderId
    ? serverOrderId.startsWith('#')
      ? serverOrderId
      : `#${serverOrderId}`
    : fallbackOrderId;

  return {
    orderId: formattedOrderId,
    synced: res.ok,
    endpoint: res.endpoint,
    attribution,
  };
}

/**
 * Injects the pre-created Order ID (e.g., `Order #HF-1001` or `#HF-LOCAL-...`) and
 * active ad-clip attribution into any `https://wa.me/...` URL cleanly.
 */
export function appendOrderIdToWhatsAppUrl(
  rawUrl: string,
  orderId: string,
  attribution?: AttributionState
): string {
  try {
    const parsed = new URL(rawUrl);
    const existingText = parsed.searchParams.get('text') || '';
    const attr = attribution || getAttribution();

    const prefixLines: string[] = [];
    if (!existingText.includes(orderId)) {
      prefixLines.push(`Order ${orderId}`);
    }
    if (attr.clip_id && !existingText.includes(attr.clip_id)) {
      prefixLines.push(`Clip: ${attr.clip_id}${attr.src ? ` (${attr.src})` : ''}`);
    }
    if (attr.deal && !existingText.includes(attr.deal)) {
      prefixLines.push(`Deal: ${attr.deal}`);
    }

    const combinedText =
      prefixLines.length > 0
        ? `${prefixLines.join(' | ')}\n${existingText}`.trim()
        : existingText;

    parsed.searchParams.set('text', combinedText);
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Fetches live public catalog/prices from PRIMARY_API (`/api/catalog/public`) with
 * automatic 3s failover to BACKUP_API and cached localStorage snapshot fallback.
 */
export async function fetchPublicCatalogWithFailover<T = Record<string, unknown>>(
  queryParams: Record<string, string | number | undefined> = {}
): Promise<PublicCatalogFetchResult<T>> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(queryParams)) {
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      qs.set(k, String(v));
    }
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  const cacheKey = `${PUBLIC_CATALOG_CACHE_KEY}:${qs.toString() || 'default'}`;

  const extractItems = (json: unknown): { items: T[]; totalCount: number } => {
    if (Array.isArray(json)) {
      return { items: json as T[], totalCount: json.length };
    }
    if (json && typeof json === 'object') {
      const obj = json as Record<string, unknown>;
      const list = (obj.products || obj.items || obj.catalog || obj.data) as T[] | undefined;
      if (Array.isArray(list)) {
        const total =
          typeof obj.totalCount === 'number'
            ? obj.totalCount
            : typeof obj.totalRecords === 'number'
            ? obj.totalRecords
            : list.length;
        return { items: list, totalCount: total };
      }
    }
    return { items: [], totalCount: 0 };
  };

  // 1. Primary API (/api/catalog/public)
  try {
    const primaryRes = await fetchJsonWithTimeout<unknown>(
      `${PRIMARY_API}/catalog/public${suffix}`,
      { method: 'GET', headers: { Accept: 'application/json' } },
      FAILOVER_TIMEOUT_MS
    );
    if (primaryRes.ok && primaryRes.data) {
      const { items, totalCount } = extractItems(primaryRes.data);
      if (items.length > 0) {
        const updatedAt = new Date().toISOString();
        safeWriteLocalStorage(cacheKey, { items, totalCount, updatedAt });
        return { items, totalCount, source: 'primary', updatedAt, raw: primaryRes.data };
      }
    }
  } catch {
    // Fall through to backup mirror
  }

  // 2. Backup Mirror API (/api/catalog/public)
  try {
    const backupRes = await fetchJsonWithTimeout<unknown>(
      `${BACKUP_API}/catalog/public${suffix}`,
      { method: 'GET', headers: { Accept: 'application/json' } },
      FAILOVER_TIMEOUT_MS
    );
    if (backupRes.ok && backupRes.data) {
      const { items, totalCount } = extractItems(backupRes.data);
      if (items.length > 0) {
        const updatedAt = new Date().toISOString();
        safeWriteLocalStorage(cacheKey, { items, totalCount, updatedAt });
        return { items, totalCount, source: 'backup', updatedAt, raw: backupRes.data };
      }
    }
  } catch {
    // Fall through to cached localStorage snapshot
  }

  // 3. Cached localStorage snapshot
  const cached = safeReadLocalStorage<{ items: T[]; totalCount: number; updatedAt: string }>(
    cacheKey
  );
  if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
    return {
      items: cached.items,
      totalCount: cached.totalCount || cached.items.length,
      source: 'cache',
      updatedAt: cached.updatedAt || null,
    };
  }

  return {
    items: [],
    totalCount: 0,
    source: 'none',
    updatedAt: null,
  };
}

function extractWhatsAppContext(rawUrl: string, anchor: HTMLAnchorElement): {
  wing: string;
  productTitle: string;
  sku?: string;
  quantity?: number;
} {
  let decodedText = '';
  try {
    const parsed = new URL(rawUrl);
    decodedText = parsed.searchParams.get('text') || '';
  } catch {
    decodedText = '';
  }

  let wing = detectSubdomain() as string;
  if (decodedText.includes('RMG Wing')) wing = 'rmg';
  else if (decodedText.includes('Leather & Jacket Wing')) wing = 'leather';
  else if (decodedText.includes('Hardware Wing')) wing = 'hardware';
  else if (decodedText.includes('Swatch Pack')) wing = 'swatch';
  else if (decodedText.includes('D2C Wing')) wing = 'd2c';
  else if (decodedText.includes('NexOS Admin')) wing = 'admin';

  const productMatch = decodedText.match(/(?:Product|Style \/ Reference|Reference Style):\s*(.+)/i);
  const skuMatch = decodedText.match(/SKU:\s*([A-Za-z0-9_-]+)/i);
  const qtyMatch = decodedText.match(/(?:Target Quantity|Estimated Qty):\s*(\d+)/i);

  const labelText = (anchor.textContent || anchor.getAttribute('title') || '').trim();

  return {
    wing,
    productTitle: productMatch?.[1]?.trim() || labelText || 'WhatsApp B2B Lead',
    sku: skuMatch?.[1]?.trim(),
    quantity: qtyMatch ? Number(qtyMatch[1]) : undefined,
  };
}

function triggerAnchorNavigation(href: string, target: string): void {
  if (!isBrowser()) return;
  const synthetic = document.createElement('a');
  synthetic.href = href;
  synthetic.target = target || '_blank';
  synthetic.rel = 'noopener noreferrer';
  synthetic.dataset.hhTrackedBypass = '1';
  synthetic.style.display = 'none';
  document.body.appendChild(synthetic);
  synthetic.click();
  synthetic.remove();
}

/**
 * Handles tracked WhatsApp / Checkout navigation:
 * fires `checkout_click`, pre-creates order with dual-endpoint failover (returning
 * `#HF-...` or `#HF-LOCAL-...`), fires `whatsapp_open`, and navigates with the Order ID.
 */
export async function openTrackedWhatsApp(
  rawUrl: string,
  meta: Omit<PreCreateOrderInput, 'channel' | 'targetUrl'> = {},
  target = '_blank'
): Promise<PreCreateOrderResult> {
  void trackEvent('checkout_click', {
    channel: 'whatsapp',
    wing: meta.wing,
    product_title: meta.productTitle,
    sku: meta.sku,
    quantity: meta.quantity,
    amount: meta.amount,
    currency: meta.currency,
  });

  const preOrder = await preCreateOrder({
    ...meta,
    channel: 'whatsapp',
    targetUrl: rawUrl,
  });

  const enrichedUrl = appendOrderIdToWhatsAppUrl(rawUrl, preOrder.orderId, preOrder.attribution);

  void trackEvent('whatsapp_open', {
    channel: 'whatsapp',
    order_id: preOrder.orderId,
    synced: preOrder.synced,
    endpoint: preOrder.endpoint,
    wing: meta.wing,
    product_title: meta.productTitle,
    sku: meta.sku,
    target_url: enrichedUrl,
  });

  triggerAnchorNavigation(enrichedUrl, target);
  return preOrder;
}

/**
 * Globally intercepts every `<a href="https://wa.me/...">` click so all storefront
 * WhatsApp buttons automatically log pre-orders & attribution before opening chat.
 */
function attachGlobalWhatsAppInterceptor(): void {
  if (!isBrowser() || clickInterceptorAttached) return;
  clickInterceptorAttached = true;

  document.addEventListener(
    'click',
    (event) => {
      const targetEl = event.target as HTMLElement | null;
      if (!targetEl) return;

      const anchor = targetEl.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.dataset.hhTrackedBypass === '1') return;

      const href = anchor.getAttribute('href') || '';
      if (!/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return;

      // Prevent duplicate concurrent pre-create if user double-clicks
      if (anchor.dataset.hhPending === '1') {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      anchor.dataset.hhPending = '1';

      const ctx = extractWhatsAppContext(href, anchor);
      const linkTarget = anchor.getAttribute('target') || '_blank';

      void openTrackedWhatsApp(
        href,
        {
          wing: ctx.wing,
          productTitle: ctx.productTitle,
          sku: ctx.sku,
          quantity: ctx.quantity,
        },
        linkTarget
      ).finally(() => {
        delete anchor.dataset.hhPending;
      });
    },
    true
  );
}

/**
 * Initializes the HANDS & HEAD Dual-Beacon & Failover Tracker once per app boot:
 *  1. Captures ?deal, ?clip, ?src, ?utm_campaign into sessionStorage (`hh_attribution_v1`).
 *  2. Auto-flushes `hh_pending_sync_queue_v1` immediately and on `online` events.
 *  3. Fires a single non-blocking `page_view` per session via dual failover.
 *  4. Attaches the global WhatsApp pre-order beacon interceptor.
 */
export function initHandsAndHeadTracker(): AttributionState {
  const attribution = captureAttribution();

  if (!isBrowser() || isInitialized) {
    return attribution;
  }
  isInitialized = true;

  // Flush any previously failed payloads from offline sessions
  void flushPendingQueue();

  // Re-flush automatically whenever connectivity returns
  window.addEventListener('online', () => {
    void flushPendingQueue();
  });

  // Best-effort beacon on tab hide/unload if queued items remain
  window.addEventListener('pagehide', () => {
    const pending = readPendingQueue();
    if (pending.length > 0) {
      dispatchUnloadBeacon({
        event: 'queue_heartbeat',
        subdomain: attribution.subdomain,
        session_id: attribution.session_id,
        pending_count: pending.length,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Fire page_view once per session (non-blocking dual-beacon)
  const alreadySentPageView = safeReadSessionStorage<boolean>(PAGE_VIEW_SENT_KEY);
  if (!alreadySentPageView) {
    safeWriteSessionStorage(PAGE_VIEW_SENT_KEY, true);
    void trackEvent('page_view', {
      title: document.title,
    });
  }

  attachGlobalWhatsAppInterceptor();

  return attribution;
}

export const handsAndHeadTracker = {
  PRIMARY_API,
  BACKUP_API,
  init: initHandsAndHeadTracker,
  detectSubdomain,
  captureAttribution,
  getAttribution,
  trackEvent,
  preCreateOrder,
  openTrackedWhatsApp,
  appendOrderIdToWhatsAppUrl,
  fetchPublicCatalogWithFailover,
  flushPendingQueue,
};

export default handsAndHeadTracker;
