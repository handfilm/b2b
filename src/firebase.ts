import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AuthUser, RfqSubmission, SampleInquiry } from './types';

// Initialize Firebase App instance safely
const defaultApp = getApps().find((a) => a.name === '[DEFAULT]');
export const app = defaultApp || initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Google Workspace & Drive OAuth Scopes
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
];

GOOGLE_DRIVE_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});

// In-memory access token cache (required: do NOT store in localStorage)
let cachedAccessToken: string | null = null;

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Clear token on sign out
onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
  }
});

// Initialize Firestore (supporting specific databaseId if configured)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Google Sign-In with Workspace OAuth
export async function signInWithGooglePopup(): Promise<{ user: AuthUser; accessToken: string } | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user) return null;

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    const authUser: AuthUser = {
      id: user.uid,
      name: user.displayName || 'International Trader',
      email: user.email || '',
      phone: user.phoneNumber || '',
      countryCode: '+1',
      country: 'Global Partner',
      companyName: user.displayName ? `${user.displayName} Sourcing` : 'Global Trading Corp',
      role: 'buyer',
      verified: true,
      memberSince: new Date().getFullYear().toString(),
      loginMethod: 'google',
      avatarUrl: user.photoURL || undefined,
    };

    // Save/merge profile in Firestore
    await saveUserToFirestore(authUser);
    return { user: authUser, accessToken: cachedAccessToken || '' };
  } catch (err: any) {
    console.error('Firebase Google Sign-In error:', err);
    throw err;
  }
}

/**
 * Ensures an active Google Drive OAuth access token is available.
 * If not already in memory, prompts user through the standard Google auth popup.
 */
export async function ensureGoogleDriveToken(): Promise<string> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }
  const res = await signInWithGooglePopup();
  if (!res?.accessToken) {
    throw new Error('Google Drive authorization was not completed. Please grant Google Drive access.');
  }
  return res.accessToken;
}

// Sign Out
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

// Save User Profile to Firestore
export async function saveUserToFirestore(user: AuthUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }
}

// Save RFQ to Firestore
export async function saveRfqToFirestore(rfq: RfqSubmission): Promise<void> {
  try {
    const rfqRef = doc(db, 'rfqs', rfq.id);
    await setDoc(rfqRef, {
      ...rfq,
      persistedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not persist RFQ to Firestore:', err);
  }
}

// Subscribe to RFQs from Firestore
export function subscribeToRfqs(callback: (rfqs: RfqSubmission[]) => void) {
  try {
    const rfqsCol = collection(db, 'rfqs');
    const q = query(rfqsCol, limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: RfqSubmission[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as RfqSubmission);
        });
        if (items.length > 0) {
          callback(items);
        }
      },
      (err) => {
        console.warn('Firestore RFQ subscription listener notice:', err.message);
      }
    );
  } catch (err) {
    console.warn('Failed to attach RFQ listener:', err);
    return () => {};
  }
}

// Save Sample to Firestore
export async function saveSampleToFirestore(sample: SampleInquiry): Promise<void> {
  try {
    const sampleRef = doc(db, 'samples', sample.id);
    await setDoc(sampleRef, {
      ...sample,
      persistedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not persist sample order to Firestore:', err);
  }
}

// Subscribe to Samples from Firestore
export function subscribeToSamples(callback: (samples: SampleInquiry[]) => void) {
  try {
    const samplesCol = collection(db, 'samples');
    const q = query(samplesCol, limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: SampleInquiry[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SampleInquiry);
        });
        if (items.length > 0) {
          callback(items);
        }
      },
      (err) => {
        console.warn('Firestore Sample subscription listener notice:', err.message);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Samples listener:', err);
    return () => {};
  }
}

// Save AI Inquiry Log
export async function saveAiInquiryToFirestore(inquiry: {
  userId?: string;
  query: string;
  response: string;
  contextType?: string;
  contextTitle?: string;
}): Promise<void> {
  try {
    const id = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const inquiryRef = doc(db, 'ai_inquiries', id);
    await setDoc(inquiryRef, {
      ...inquiry,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not save AI inquiry log to Firestore:', err);
  }
}
