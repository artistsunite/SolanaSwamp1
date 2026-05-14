import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getSetting(key: string): Promise<string | null> {
  try {
    const docRef = doc(db, 'settings', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().value;
    }
    return null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    const docRef = doc(db, 'settings', key);
    await setDoc(docRef, {
      key,
      value,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating setting:', error);
  }
}
