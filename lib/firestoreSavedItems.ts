import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface SavedItem {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  userId: string;
}

export class FirestoreSavedItemsService {
  private static getSavedItemsCollection(userId: string) {
    return collection(db, 'users', userId, 'savedItems');
  }

  // Load saved items for a specific user
  static async loadSavedItems(userId: string): Promise<SavedItem[]> {
    try {
      const itemsRef = this.getSavedItemsCollection(userId);
      const q = query(itemsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const items: SavedItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis(),
          userId: data.userId,
        });
      });
      
      return items;
    } catch (error: any) {
      console.error('Error loading saved items:', error);
      
      // If it's a permissions error or network error, throw error to fallback to offline
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable for saved items');
      }
      
      throw new Error('Failed to load saved items');
    }
  }

  // Add a new saved item
  static async addSavedItem(userId: string, text: string): Promise<string> {
    try {
      const itemsRef = this.getSavedItemsCollection(userId);
      const docRef = await addDoc(itemsRef, {
        text: text.trim(),
        createdAt: Timestamp.now(),
        userId: userId,
      });
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding saved item:', error);
      
      // If it's a permissions error or network error, throw error to fallback to offline
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable for adding saved item');
      }
      
      throw new Error('Failed to add saved item');
    }
  }

  // Update an existing saved item
  static async updateSavedItem(userId: string, itemId: string, text: string): Promise<void> {
    try {
      const itemRef = doc(db, 'users', userId, 'savedItems', itemId);
      await updateDoc(itemRef, {
        text: text.trim(),
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Error updating saved item:', error);
      
      // If it's a permissions error or network error, throw error to fallback to offline
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable for updating saved item');
      }
      
      throw new Error('Failed to update saved item');
    }
  }

  // Delete a saved item
  static async deleteSavedItem(userId: string, itemId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'users', userId, 'savedItems', itemId);
      await deleteDoc(itemRef);
    } catch (error: any) {
      console.error('Error deleting saved item:', error);
      
      // If it's a permissions error or network error, throw error to fallback to offline
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable for deleting saved item');
      }
      
      throw new Error('Failed to delete saved item');
    }
  }

  // Clear all saved items for a user
  static async clearAllSavedItems(userId: string): Promise<void> {
    try {
      const itemsRef = this.getSavedItemsCollection(userId);
      const querySnapshot = await getDocs(itemsRef);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error: any) {
      console.error('Error clearing saved items:', error);
      
      // If it's a permissions error or network error, throw error to fallback to offline
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable for clearing saved items');
      }
      
      throw new Error('Failed to clear saved items');
    }
  }
}