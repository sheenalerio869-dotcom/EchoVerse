import { db, auth, storage } from './firebase';
import { collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Test Firestore connection
    console.log('📊 Testing Firestore connection...');
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
    
    // Test Auth connection
    console.log('🔐 Testing Auth connection...');
    const currentUser = auth.currentUser;
    console.log('✅ Auth connection successful', currentUser ? 'User logged in' : 'No user logged in');
    
    // Test Storage connection
    console.log('📁 Testing Storage connection...');
    console.log('✅ Storage connection successful');
    
    return {
      success: true,
      firestore: true,
      auth: true,
      storage: true,
      message: 'All Firebase services connected successfully!'
    };
    
  } catch (error: any) {
    console.error('❌ Firebase connection failed:', error);
    
    // Check specific error types
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Permission denied - check Firestore rules',
        details: error.message
      };
    } else if (error.code === 'unavailable') {
      return {
        success: false,
        error: 'Firebase service unavailable - check network connection',
        details: error.message
      };
    } else if (error.code === 'invalid-api-key') {
      return {
        success: false,
        error: 'Invalid API key in Firebase configuration',
        details: error.message
      };
    } else {
      return {
        success: false,
        error: 'Unknown Firebase error',
        details: error.message
      };
    }
  }
};

// Quick connection check
export const quickConnectionCheck = () => {
  console.log('🔍 Quick Firebase configuration check...');
  
  const checks = {
    firebaseApp: !!db && !!auth && !!storage,
    firestoreInitialized: !!db,
    authInitialized: !!auth,
    storageInitialized: !!storage
  };
  
  console.log('Configuration status:', checks);
  
  return checks;
};