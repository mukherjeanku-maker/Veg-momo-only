import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  handleFirestoreError,
  OperationType,
} from './firebase';

export interface VisitorRecord {
  visitorId: string;
  firstVisitAt: number;
  lastVisitAt: number;
  visitCount: number;
  currentPage: number;
  maxPageReached: number;
  reachedEnd: boolean;
  openedChat: boolean;
  sentMessage: boolean;
  lastActivityAt: number;
  inviteToken?: string | null;
  isOwnerAdmin?: boolean;
}

const VISITOR_ID_KEY = 'date_app_visitor_id';
const IS_ADMIN_KEY = 'date_app_is_admin';

// Get or generate a privacy-preserving first-party visitor ID
export const getVisitorId = (): string => {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const newId = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch {
    return 'vis_' + Math.random().toString(36).substring(2, 10);
  }
};

// Check if current user is browsing in admin mode
export const isOwnerAdminSession = (): boolean => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
      localStorage.setItem(IS_ADMIN_KEY, 'true');
      return true;
    }
    return localStorage.getItem(IS_ADMIN_KEY) === 'true';
  } catch {
    return false;
  }
};

// Retrieve optional invitation token from URL without recording any personal info
export const getInviteTokenFromUrl = (): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || urlParams.get('invite');
    if (token) return token.slice(0, 64);
    
    // Also support hash paths like #/invite/xyz
    const hash = window.location.hash;
    if (hash.includes('invite-') || hash.includes('invite/')) {
      const match = hash.match(/invite[-/]([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return match[1].slice(0, 64);
    }
    return null;
  } catch {
    return null;
  }
};

// Records initial visit or returns existing visitor state
export const recordVisit = async (): Promise<void> => {
  const visitorId = getVisitorId();
  const isAdmin = isOwnerAdminSession();
  const inviteToken = getInviteTokenFromUrl();
  const now = Date.now();

  try {
    const visitorDocRef = doc(db, 'visitors', visitorId);
    const snap = await getDoc(visitorDocRef);

    if (!snap.exists()) {
      // First visit for this browser
      const newRecord: VisitorRecord = {
        visitorId,
        firstVisitAt: now,
        lastVisitAt: now,
        visitCount: 1,
        currentPage: 1,
        maxPageReached: 1,
        reachedEnd: false,
        openedChat: false,
        sentMessage: false,
        lastActivityAt: now,
        inviteToken: inviteToken || null,
        isOwnerAdmin: isAdmin,
      };
      await setDoc(visitorDocRef, newRecord);
    } else {
      // Returning visitor
      const data = snap.data() as Partial<VisitorRecord>;
      const newCount = (data.visitCount || 1) + 1;
      await updateDoc(visitorDocRef, {
        lastVisitAt: now,
        lastActivityAt: now,
        visitCount: newCount,
        ...(inviteToken && !data.inviteToken ? { inviteToken } : {}),
        ...(isAdmin ? { isOwnerAdmin: true } : {}),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `visitors/${visitorId}`);
  }
};

// Track progress through pages (e.g. 01 to 07)
export const trackPageProgress = async (pageNumber: number): Promise<void> => {
  const visitorId = getVisitorId();
  const now = Date.now();

  try {
    const visitorDocRef = doc(db, 'visitors', visitorId);
    const snap = await getDoc(visitorDocRef);
    const currentMax = snap.exists() ? (snap.data()?.maxPageReached || 1) : 1;
    const reachedEnd = snap.exists() ? (snap.data()?.reachedEnd || pageNumber === 7) : pageNumber === 7;

    await updateDoc(visitorDocRef, {
      currentPage: pageNumber,
      maxPageReached: Math.max(currentMax, pageNumber),
      reachedEnd: reachedEnd || pageNumber === 7,
      lastActivityAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `visitors/${visitorId}`);
  }
};

// Track interactive chat milestones
export const trackMilestone = async (milestone: 'opened_chat' | 'sent_message'): Promise<void> => {
  const visitorId = getVisitorId();
  const now = Date.now();

  try {
    const visitorDocRef = doc(db, 'visitors', visitorId);
    if (milestone === 'opened_chat') {
      await updateDoc(visitorDocRef, {
        openedChat: true,
        lastActivityAt: now,
      });
    } else if (milestone === 'sent_message') {
      await updateDoc(visitorDocRef, {
        sentMessage: true,
        openedChat: true,
        lastActivityAt: now,
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `visitors/${visitorId}`);
  }
};

// Subscribe to all visitor activity for the Admin View
export const subscribeToVisitors = (
  onData: (visitors: VisitorRecord[]) => void,
  onError?: (error: unknown) => void
) => {
  const visitorsCol = collection(db, 'visitors');
  const q = query(visitorsCol, orderBy('lastVisitAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: VisitorRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          visitorId: docSnap.id,
          firstVisitAt: data.firstVisitAt || Date.now(),
          lastVisitAt: data.lastVisitAt || Date.now(),
          visitCount: data.visitCount || 1,
          currentPage: data.currentPage || 1,
          maxPageReached: data.maxPageReached || data.currentPage || 1,
          reachedEnd: Boolean(data.reachedEnd || (data.currentPage && data.currentPage >= 7)),
          openedChat: Boolean(data.openedChat),
          sentMessage: Boolean(data.sentMessage),
          lastActivityAt: data.lastActivityAt || data.lastVisitAt || Date.now(),
          inviteToken: data.inviteToken || null,
          isOwnerAdmin: Boolean(data.isOwnerAdmin),
        };
      });
      onData(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'visitors');
      if (onError) onError(err);
    }
  );
};
