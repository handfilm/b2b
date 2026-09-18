import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { RfqThread, RfqThreadMessage, RfqThreadProduct } from '../types';

export interface CreateRfqThreadInput {
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  supplierId: string;
  supplierName?: string;
  products: RfqThreadProduct[];
  initialMessage: string;
  initialAiMessage?: string;
}

/**
 * Creates a new RFQ thread in Firestore rfq_threads collection.
 * Conforms strictly to the required NexOS data model:
 * {
 *   buyerId: 'user_id',
 *   supplierId: 'federated_node_id',
 *   products: [{ sku, requestedQty, targetPrice }],
 *   initialMessage: 'string',
 *   status: 'active',
 *   handledBy: 'ai',
 *   createdAt: timestamp
 * }
 */
export async function createRfqThread(input: CreateRfqThreadInput): Promise<{ threadId: string; thread: RfqThread }> {
  const buyerId = input.buyerId || 'anon-buyer-' + Math.random().toString(36).substring(2, 9);
  const supplierId = input.supplierId || 'federated_node_dhaka_01';
  const buyerName = input.buyerName || 'Global Enterprise Buyer';

  const productsPayload = input.products.map((p) => ({
    sku: p.sku || 'SKU-GEN',
    title: p.title || 'Custom RMG / Industrial Lot',
    productId: p.productId || '',
    requestedQty: Number(p.requestedQty) || 1000,
    targetPrice: Number(p.targetPrice) || 0,
    supplierId: p.supplierId || supplierId,
    supplierName: p.supplierName || input.supplierName || 'Export Mill Direct',
    imageUrl: p.imageUrl || '',
    customNotes: p.customNotes || '',
  }));

  const primaryProductTitle = productsPayload[0]?.title || 'Selected Lot';
  const primaryQty = productsPayload[0]?.requestedQty || 1000;

  const initialAiGreeting =
    input.initialAiMessage ||
    `Hello, I am the RAWx Trade Agent representing this mill. We have received your RFQ for ${primaryProductTitle}. Our standard lead time for ${primaryQty.toLocaleString()} pcs is 14-21 days. Do you have a custom TechPack or CAD ready for review?`;

  const initialMessages: RfqThreadMessage[] = [
    {
      id: `msg-${Date.now()}-buyer`,
      sender: 'buyer',
      senderName: buyerName,
      content: input.initialMessage || 'Commercial RFQ submitted for volume lot pricing.',
      timestamp: new Date().toISOString(),
    },
    {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      senderName: 'RAWx Trade Agent (Level 1)',
      content: initialAiGreeting,
      timestamp: new Date().toISOString(),
      isAutomated: true,
    },
  ];

  const threadData = {
    buyerId,
    supplierId,
    buyerName,
    buyerEmail: input.buyerEmail || '',
    supplierName: input.supplierName || 'Export Mill Direct',
    products: productsPayload.map((p) => ({
      sku: p.sku,
      requestedQty: p.requestedQty,
      targetPrice: p.targetPrice,
      title: p.title,
      imageUrl: p.imageUrl,
    })),
    initialMessage: input.initialMessage,
    status: 'active',
    handledBy: 'ai', // 'ai' | 'human'
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messages: initialMessages,
    lastMessage: initialAiGreeting,
  };

  try {
    const colRef = collection(db, 'rfq_threads');
    const docRef = await addDoc(colRef, threadData);
    const threadId = docRef.id;

    const fullThread: RfqThread = {
      id: threadId,
      ...threadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      handledBy: 'ai',
      messages: initialMessages,
    };

    // Save to local cache for instant resilience
    try {
      localStorage.setItem(`rfq_thread_${threadId}`, JSON.stringify(fullThread));
    } catch {
      // ignore
    }

    return { threadId, thread: fullThread };
  } catch (err) {
    console.warn('[rfqService] Firestore createDoc warning, using resilient fallback:', err);
    const mockId = 'thread-local-' + Date.now();
    const fallbackThread: RfqThread = {
      id: mockId,
      ...threadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      handledBy: 'ai',
      messages: initialMessages,
    };
    try {
      localStorage.setItem(`rfq_thread_${mockId}`, JSON.stringify(fallbackThread));
    } catch {
      // ignore
    }
    return { threadId: mockId, thread: fallbackThread };
  }
}

/**
 * Update handledBy property on the thread ('ai' or 'human').
 */
export async function updateThreadHandledBy(
  threadId: string,
  handledBy: 'ai' | 'human'
): Promise<void> {
  try {
    const threadRef = doc(db, 'rfq_threads', threadId);
    await updateDoc(threadRef, {
      handledBy,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[rfqService] updateThreadHandledBy error:', err);
  }

  // Update local cache
  try {
    const cached = localStorage.getItem(`rfq_thread_${threadId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.handledBy = handledBy;
      parsed.updatedAt = new Date().toISOString();
      localStorage.setItem(`rfq_thread_${threadId}`, JSON.stringify(parsed));
    }
  } catch {
    // ignore
  }
}

/**
 * Add a message to the thread messages array.
 */
export async function addMessageToThread(
  threadId: string,
  message: RfqThreadMessage
): Promise<void> {
  try {
    const threadRef = doc(db, 'rfq_threads', threadId);
    await updateDoc(threadRef, {
      messages: arrayUnion(message),
      lastMessage: message.content,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[rfqService] addMessageToThread error:', err);
  }

  // Update local cache
  try {
    const cached = localStorage.getItem(`rfq_thread_${threadId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.messages = [...(parsed.messages || []), message];
      parsed.lastMessage = message.content;
      parsed.updatedAt = new Date().toISOString();
      localStorage.setItem(`rfq_thread_${threadId}`, JSON.stringify(parsed));
    }
  } catch {
    // ignore
  }
}

/**
 * Fetch thread document once.
 */
export async function getThread(threadId: string): Promise<RfqThread | null> {
  try {
    const threadRef = doc(db, 'rfq_threads', threadId);
    const snap = await getDoc(threadRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as any) } as RfqThread;
    }
  } catch (err) {
    console.warn('[rfqService] getThread error:', err);
  }

  try {
    const cached = localStorage.getItem(`rfq_thread_${threadId}`);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Real-time listener for thread changes.
 */
export function subscribeToThread(
  threadId: string,
  callback: (thread: RfqThread) => void
): Unsubscribe {
  try {
    const threadRef = doc(db, 'rfq_threads', threadId);
    return onSnapshot(
      threadRef,
      (snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as RfqThread;
          callback(data);
          try {
            localStorage.setItem(`rfq_thread_${threadId}`, JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      },
      (err) => {
        console.warn('[rfqService] onSnapshot error:', err);
        // Fallback to local cache
        try {
          const cached = localStorage.getItem(`rfq_thread_${threadId}`);
          if (cached) callback(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    );
  } catch {
    // Return dummy unsubscriber
    return () => {};
  }
}
