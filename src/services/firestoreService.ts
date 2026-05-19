import { collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, increment, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Proposal, Meme, TokenStats, ProposalStatus, Ping } from '../types';

// Error handling helper as per instructions
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firestoreService = {
  // Proposals
  subscribeToProposals: (callback: (proposals: Proposal[]) => void) => {
    const q = query(collection(db, 'proposals'), orderBy('endsAt', 'desc'));
    return onSnapshot(q, 
      (snapshot) => {
        const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
        callback(proposals);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'proposals')
    );
  },

  voteOnProposal: async (proposalId: string, isYes: boolean) => {
    try {
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        yesVotes: isYes ? increment(1) : increment(0),
        totalVotes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `proposals/${proposalId}`);
    }
  },

  // Memes
  subscribeToMemes: (callback: (memes: Meme[]) => void) => {
    const q = query(collection(db, 'memes'), orderBy('createdAt', 'desc'), limit(20));
    return onSnapshot(q,
      (snapshot) => {
        const memes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meme));
        callback(memes);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'memes')
    );
  },

  uploadMeme: async (memeData: Omit<Meme, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'memes'), {
        ...memeData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'memes');
    }
  },

  // Stats
  getStats: async (): Promise<TokenStats | null> => {
    try {
      const statsSnapshot = await getDocs(collection(db, 'stats'));
      if (!statsSnapshot.empty) {
        return statsSnapshot.docs[0].data() as TokenStats;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'stats');
      return null;
    }
  },

  // Pings
  subscribeToPings: (callback: (pings: Ping[]) => void) => {
    const q = query(collection(db, 'pings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q,
      (snapshot) => {
        const pings = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            // Handle both Firestore Timestamp and potential fallback
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
          } as Ping;
        });
        callback(pings);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'pings')
    );
  },

  recordPing: async (pingData: { lat: number; lng: number; color: string }) => {
    try {
      await addDoc(collection(db, 'pings'), {
        ...pingData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pings');
    }
  }
};
