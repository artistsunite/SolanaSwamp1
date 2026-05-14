import { initializeTestEnvironment, RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'skilled-loader-431609-e1',
      firestore: {
        rules: readFileSync('DRAFT_firestore.rules', 'utf8'),
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  const getAdminContext = () => testEnv.authenticatedContext('admin_user', { email: 'jaronwalker@gmail.com', email_verified: true });
  const getUserContext = () => testEnv.authenticatedContext('regular_user', { email: 'user@example.com', email_verified: true });
  const getUnverifiedContext = () => testEnv.authenticatedContext('unverified_user', { email: 'user@example.com', email_verified: false });
  const getAnonContext = () => testEnv.unauthenticatedContext();

  describe('Stats', () => {
    it('should allow anyone to read stats', async () => {
      const db = getAnonContext().firestore();
      await assertSucceeds(getDoc(doc(db, 'stats', 'current')));
    });

    it('should forbid non-admin from writing stats', async () => {
      const db = getUserContext().firestore();
      await assertFails(setDoc(doc(db, 'stats', 'current'), { price: 100 }));
    });

    it('should allow admin to write stats', async () => {
      const db = getAdminContext().firestore();
      await assertSucceeds(setDoc(doc(db, 'stats', 'current'), {
        price: 0.1,
        marketCap: 1000,
        liquidity: 500,
        holders: 10,
        volume24h: 100,
        burnPercent: 1.0,
        tax: '0/0',
        lpStatus: 'Locked'
      }));
    });
  });

  describe('Memes', () => {
    it('should allow verified user to create a meme', async () => {
      const db = getUserContext().firestore();
      await assertSucceeds(addDoc(collection(db, 'memes'), {
        imageUrl: 'https://example.com/meme.png',
        author: 'User',
        tips: 0,
        createdAt: new Date()
      }));
    });

    it('should forbid unverified user from creating a meme', async () => {
      const db = getUnverifiedContext().firestore();
      await assertFails(addDoc(collection(db, 'memes'), {
        imageUrl: 'https://example.com/meme.png',
        author: 'User',
        tips: 0,
        createdAt: new Date()
      }));
    });
  });

  describe('Proposals', () => {
    it('should allow anyone to read proposals', async () => {
      const db = getAnonContext().firestore();
      await assertSucceeds(getDoc(doc(db, 'proposals', 'p1')));
    });

    it('should allow specific field updates for voting', async () => {
      // Setup: Admin creates proposal
      const adminDb = getAdminContext().firestore();
      const proposalRef = doc(adminDb, 'proposals', 'p1');
      await setDoc(proposalRef, {
        title: 'Burn',
        description: 'Burn tokens',
        status: 'Active',
        endsAt: '2026-12-31T23:59:59Z',
        yesVotes: 0,
        totalVotes: 0
      });

      // Vote
      const userDb = getUserContext().firestore();
      await assertSucceeds(updateDoc(doc(userDb, 'proposals', 'p1'), {
        yesVotes: 1,
        totalVotes: 1
      }));
    });

    it('should forbid changing title by regular user', async () => {
      const userDb = getUserContext().firestore();
      await assertFails(updateDoc(doc(userDb, 'proposals', 'p1'), {
        title: 'Hacked Title'
      }));
    });
  });
});
