import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Only run network checks in web environment
    if (Platform.OS !== 'web') {
      return;
    }

    // Check if window and navigator are available
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Simple network status check
    const checkNetwork = () => {
      setIsOnline(navigator.onLine);
    };

    // Check on mount
    checkNetwork();

    // Listen for online/offline events only if window is available
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', checkNetwork);
      window.addEventListener('offline', checkNetwork);

      return () => {
        window.removeEventListener('online', checkNetwork);
        window.removeEventListener('offline', checkNetwork);
      };
    }
  }, []);

  // Don't show anything if online or not in web environment
  if (isOnline || Platform.OS !== 'web') return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📱 Working Offline - Comments saved locally</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
