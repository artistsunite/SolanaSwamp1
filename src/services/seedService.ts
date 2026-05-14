import { collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export const seedDatabase = async () => {
  // Only attempt seeding if the authenticated user is the admin
  const user = auth.currentUser;
  if (!user || user.email !== 'jaronwalker@gmail.com') {
    return false;
  }

  try {
    // Check if stats already exist
    const statsSnapshot = await getDocs(collection(db, 'stats'));
    if (statsSnapshot.empty) {
      console.log('Seeding initial stats...');
      await setDoc(doc(db, 'stats', 'current'), {
        price: 0.00042069,
        marketCap: 6900000,
        liquidity: 420000,
        holders: 4200,
        volume24h: 1200000,
        burnedToken: 6900000000,
        burnPercent: 6.9,
        tax: '0/0',
        lpStatus: 'Locked'
      });
    }

    // Check if proposals already exist
    const proposalsSnapshot = await getDocs(collection(db, 'proposals'));
    if (proposalsSnapshot.empty) {
      console.log('Seeding initial proposals...');
      const proposals = [
        {
          title: 'Burn 5% of Liquidity Pool',
          description: 'Standard deflationary measure. Let it burn.',
          status: 'Active',
          endsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
          yesVotes: 420,
          totalVotes: 450
        },
        {
          title: 'Purple Friday Marketing Push',
          description: 'Allocate 1 ETH for influencer swamp raids.',
          status: 'Active',
          endsAt: new Date(Date.now() + 86400000 * 5).toISOString(),
          yesVotes: 120,
          totalVotes: 130
        }
      ];

      for (const p of proposals) {
        await setDoc(doc(collection(db, 'proposals')), p);
      }
    }

    // Check if memes already exist
    const memesSnapshot = await getDocs(collection(db, 'memes'));
    if (memesSnapshot.empty) {
      console.log('Seeding initial memes...');
      const memes = [
        { 
          imageUrl: 'https://images.unsplash.com/photo-1590682680375-393a5259702a?auto=format&fit=crop&q=80&w=400', 
          author: 'CrocLord420', 
          tips: 4.5, 
          createdAt: serverTimestamp() 
        },
        { 
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400', 
          author: 'MudMaster', 
          tips: 12.0, 
          createdAt: serverTimestamp() 
        }
      ];

      for (const m of memes) {
        await setDoc(doc(collection(db, 'memes')), m);
      }
    }

    // Check if settings already exist
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    if (settingsSnapshot.empty) {
      console.log('Seeding initial settings...');
      await setDoc(doc(db, 'settings', 'hero_image'), {
        key: 'hero_image',
        value: 'https://images.unsplash.com/photo-1743196924823-393c833c8a93?auto=format&fit=crop&q=80&w=800',
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
