import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  FirestoreError,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use named database if specified in config, otherwise default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'me' | 'sudipta';
  text: string;
  createdAt: number;
  reactions?: Record<string, string[]>; // e.g. { '❤️': ['uid1'], '😂': ['uid2'] }
  status?: 'sending' | 'sent' | 'failed';
}

export interface ConversationMeta {
  firstMessageBySudiptaSent?: boolean;
  lastActivity?: number;
  initialized?: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

// Generates or retrieves a persistent local user identifier for friction-free chat
export const getLocalUserId = (): string => {
  const STORAGE_KEY = 'date_app_user_uid';
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const newId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  } catch {
    return 'guest_' + Math.random().toString(36).substring(2, 10);
  }
};

// Safe auth helper that attempts anonymous sign in without throwing unhandled admin errors
export const ensureAuthUser = async (): Promise<{ uid: string; isAuth: boolean }> => {
  if (auth.currentUser) {
    return { uid: auth.currentUser.uid, isAuth: true };
  }

  try {
    const credential = await signInAnonymously(auth);
    return { uid: credential.user.uid, isAuth: true };
  } catch (err: unknown) {
    // If anonymous auth is disabled or restricted in Firebase console, smoothly fall back to local ID
    const localId = getLocalUserId();
    return { uid: localId, isAuth: false };
  }
};

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  onAuthStateChanged,
};

