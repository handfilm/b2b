import rawCatalogData from './b2bCatalogData.json';
import { B2bCatalogCategory, B2bCatalogProduct } from '../types';

export interface CatalogFilterOptions {
  categorySlug?: string;
  subcategorySlug?: string;
  query?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'moq-asc' | 'lead-time';
}

// Memory cache for runtime additions/decoupled Firestore hydration
let cachedCategories: B2bCatalogCategory[] = rawCatalogData.categories as B2bCatalogCategory[];
let cachedProducts: B2bCatalogProduct[] = (rawCatalogData.products as unknown) as B2bCatalogProduct[];

/**
 * Returns all top-level categories (All, T-Shirts, Accessories, Leather Bags, etc.)
 */
export function getCatalogCategories(): B2bCatalogCategory[] {
  return cachedCategories;
}

/**
 * Returns a category by its slug
 */
export function getCatalogCategory(slug: string): B2bCatalogCategory | undefined {
  const cleanSlug = (slug || '').toLowerCase().trim();
  if (!cleanSlug || cleanSlug === 'all') {
    return cachedCategories.find((c) => c.slug === 'all') || cachedCategories[0];
  }
  return cachedCategories.find((c) => c.slug.toLowerCase() === cleanSlug);
}

/**
 * Returns subcategories for a category slug
 */
export function getSubcategoriesForCategory(categorySlug: string) {
  const cat = getCatalogCategory(categorySlug);
  return cat ? cat.subcategories : [];
}

/**
 * Returns filtered products
 */
export function getCatalogProducts(options?: CatalogFilterOptions): B2bCatalogProduct[] {
  const { categorySlug, subcategorySlug, query, sortBy } = options || {};
  let list = [...cachedProducts];

  // Category filter
  if (categorySlug && categorySlug !== 'all') {
    const normCat = categorySlug.toLowerCase().trim();
    list = list.filter((p) => (p.categorySlug || '').toLowerCase() === normCat);
  }

  // Subcategory filter
  if (subcategorySlug && subcategorySlug !== 'all') {
    const normSub = subcategorySlug.toLowerCase().trim();
    list = list.filter((p) => (p.subcategorySlug || '').toLowerCase() === normSub);
  }

  // Text search query
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter((p) => {
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const brandMatch = (p.brand || '').toLowerCase().includes(q);
      const clubMatch = (p.club || '').toLowerCase().includes(q);
      const printMatch = (p.frontPrint || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const subMatch = (p.subdivision || '').toLowerCase().includes(q);
      const hsMatch = (p.hsCode || '').toLowerCase().includes(q);
      const compMatch = (p.exportComplianceStatus || '').toLowerCase().includes(q);
      const matMatch = (p.materials || []).some((m) => m.toLowerCase().includes(q));
      return titleMatch || brandMatch || clubMatch || printMatch || descMatch || subMatch || hsMatch || compMatch || matMatch;
    });
  }

  // Sort
  if (sortBy) {
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'moq-asc') {
      list.sort((a, b) => (a.moq || 0) - (b.moq || 0));
    } else if (sortBy === 'lead-time') {
      list.sort((a, b) => (a.leadTimeDays || 0) - (b.leadTimeDays || 0));
    }
  }

  return list;
}

/**
 * Returns a single product by categorySlug and productSlug
 */
export function getCatalogProductBySlug(categorySlug: string, productSlug: string): B2bCatalogProduct | undefined {
  const normProd = (productSlug || '').toLowerCase().trim();
  const normCat = (categorySlug || '').toLowerCase().trim();

  return cachedProducts.find((p) => {
    const matchSlug = p.slug.toLowerCase() === normProd || p.id.toLowerCase() === normProd;
    if (!matchSlug) return false;
    if (normCat && normCat !== 'all') {
      return (p.categorySlug || '').toLowerCase() === normCat;
    }
    return true;
  });
}

/**
 * Allows external ingestion of products (e.g. from Firestore or custom admin panel)
 * without touching component code.
 */
export function injectCatalogProducts(newProducts: B2bCatalogProduct[]) {
  cachedProducts = [...newProducts];
}

/**
 * Allows external ingestion of categories
 */
export function injectCatalogCategories(newCategories: B2bCatalogCategory[]) {
  cachedCategories = [...newCategories];
}
