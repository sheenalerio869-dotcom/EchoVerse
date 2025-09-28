import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      // Show alert before redirecting
      Alert.alert(
        'Authentication Required',
        'Please log in to access this feature.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/welcome');
            }
          }
        ]
      );
    }
  }, [user, loading, router, isRedirecting]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Verifying authentication...</Text>
      </View>
    );
  }

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Redirecting to login...</Text>
      </View>
    );
  }

  // Block access if no user
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Access Denied</Text>
        <Text style={styles.errorSubText}>Please log in to continue</Text>
      </View>
    );
  }

  // Only render children if user is authenticated
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B4513',
  },
  loadingText: {
    color: '#D4AF37',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    color: '#FFDAB9',
    fontSize: 16,
    textAlign: 'center',
  },
});
