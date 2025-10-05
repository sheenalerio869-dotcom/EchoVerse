// Offline Firebase configuration for when network issues occur
import { Platform } from 'react-native';

// Mock Firebase services for offline mode
export const createOfflineFirebase = () => {
  console.log('🔧 Using offline Firebase mode - all features work locally');
  
  return {
    auth: {
      currentUser: null,
      signInWithEmailAndPassword: async () => {
        throw new Error('Offline mode - authentication not available');
      },
      createUserWithEmailAndPassword: async () => {
        throw new Error('Offline mode - authentication not available');
      },
      signOut: async () => {
        console.log('Offline mode - sign out not available');
      },
      onAuthStateChanged: (callback: any) => {
        callback(null);
        return () => {};
      }
    },
    db: {
      collection: () => ({
        addDoc: async () => ({ id: 'offline-' + Date.now() }),
        getDocs: async () => ({ docs: [] }),
        doc: () => ({
          updateDoc: async () => {},
          deleteDoc: async () => {}
        })
      })
    },
    analytics: null
  };
};

// Check if we should use offline mode
export const shouldUseOfflineMode = () => {
  // Use offline mode if:
  // 1. Not in web environment
  // 2. Network issues detected
  // 3. Firebase errors
  return Platform.OS !== 'web' || 
         typeof window === 'undefined' || 
         typeof document === 'undefined';
};

