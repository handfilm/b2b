import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, InquiryCartItem } from '../types';

interface InquiryCartContextType {
  cartItems: InquiryCartItem[];
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, overrides?: Partial<InquiryCartItem>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<InquiryCartItem>) => void;
  clearCart: () => void;
  // RAWx Bot Chat integration
  isRawxBotOpen: boolean;
  activeThreadId: string | null;
  activeThreadProduct?: Product | null;
  openRawxBot: (threadId?: string, product?: Product) => void;
  closeRawxBot: () => void;
  toggleRawxBot: () => void;
}

const InquiryCartContext = createContext<InquiryCartContextType | undefined>(undefined);

const STORAGE_KEY = 'nexos_b2b_inquiry_cart_v1';
const ACTIVE_THREAD_KEY = 'nexos_active_rfq_thread_id';

export const InquiryCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<InquiryCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRawxBotOpen, setIsRawxBotOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_THREAD_KEY) || null;
    } catch {
      return null;
    }
  });
  const [activeThreadProduct, setActiveThreadProduct] = useState<Product | null>(null);

  // Sync cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Sync active thread ID to localStorage
  useEffect(() => {
    try {
      if (activeThreadId) {
        localStorage.setItem(ACTIVE_THREAD_KEY, activeThreadId);
      }
    } catch {
      // ignore
    }
  }, [activeThreadId]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const openRawxBot = useCallback((threadId?: string, product?: Product) => {
    if (threadId) {
      setActiveThreadId(threadId);
    }
    if (product) {
      setActiveThreadProduct(product);
    }
    setIsRawxBotOpen(true);
  }, []);

  const closeRawxBot = useCallback(() => setIsRawxBotOpen(false), []);
  const toggleRawxBot = useCallback(() => setIsRawxBotOpen((prev) => !prev), []);

  const addToCart = useCallback((product: Product, overrides?: Partial<InquiryCartItem>) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      // Best volume price default
      const defaultPrice =
        product.priceTiers && product.priceTiers.length > 0
          ? product.priceTiers[product.priceTiers.length - 1].priceUSD
          : 4.5;

      const defaultQty = product.moq || 1000;

      if (existingIndex >= 0) {
        // Increment quantity or update
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          requestedQty: overrides?.requestedQty ?? existing.requestedQty + defaultQty,
          targetPrice: overrides?.targetPrice ?? existing.targetPrice,
          itemMessage: overrides?.itemMessage ?? existing.itemMessage,
        };
        return updated;
      }

      const newItem: InquiryCartItem = {
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product,
        sku: product.sku || `SKU-${product.id.substring(0, 8).toUpperCase()}`,
        requestedQty: overrides?.requestedQty ?? defaultQty,
        targetPrice: overrides?.targetPrice ?? defaultPrice,
        itemMessage: overrides?.itemMessage ?? `RFQ for ${product.title}. Requesting formal price breakdown and lab dip timeline.`,
        selectedColor: overrides?.selectedColor || product.colorVariants?.[0]?.name,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      };

      return [newItem, ...prev];
    });

    // Auto open cart drawer to give immediate visual feedback
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateCartItem = useCallback((itemId: string, updates: Partial<InquiryCartItem>) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const totalItems = cartItems.length;

  return (
    <InquiryCartContext.Provider
      value={{
        cartItems,
        totalItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        isRawxBotOpen,
        activeThreadId,
        activeThreadProduct,
        openRawxBot,
        closeRawxBot,
        toggleRawxBot,
      }}
    >
      {children}
    </InquiryCartContext.Provider>
  );
};

export function useInquiryCart() {
  const ctx = useContext(InquiryCartContext);
  if (!ctx) {
    throw new Error('useInquiryCart must be used within an InquiryCartProvider');
  }
  return ctx;
}
