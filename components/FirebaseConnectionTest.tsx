import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { testFirebaseConnection, quickConnectionCheck } from '../lib/testFirebaseConnection';

export default function FirebaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickCheck, setQuickCheck] = useState<any>(null);

  useEffect(() => {
    // Run quick check on component mount
    const quickResult = quickConnectionCheck();
    setQuickCheck(quickResult);
  }, []);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testFirebaseConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: 'Test failed to run',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: boolean) => status ? '#4CAF50' : '#F44336';
  const getStatusText = (status: boolean) => status ? '✅ Connected' : '❌ Failed';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 Firebase Connection Test</Text>
      
      {/* Quick Configuration Check */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration Status</Text>
        {quickCheck && (
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, { color: getStatusColor(quickCheck.firebaseApp) }]}>
                Firebase App: {getStatusText(quickCheck.firebaseApp)}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, { color: getStatusColor(quickCheck.firestoreInitialized) }]}>
                Firestore: {getStatusText(quickCheck.firestoreInitialized)}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, { color: getStatusColor(quickCheck.authInitialized) }]}>
                Auth: {getStatusText(quickCheck.authInitialized)}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusText, { color: getStatusColor(quickCheck.storageInitialized) }]}>
                Storage: {getStatusText(quickCheck.storageInitialized)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Connection Test Button */}
      <TouchableOpacity 
        style={[styles.testButton, isLoading && styles.testButtonDisabled]} 
        onPress={runConnectionTest}
        disabled={isLoading}
      >
        <Text style={styles.testButtonText}>
          {isLoading ? '🔄 Testing Connection...' : '🧪 Test Firebase Connection'}
        </Text>
      </TouchableOpacity>

      {/* Connection Test Results */}
      {connectionStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Test Results</Text>
          <View style={[
            styles.resultContainer, 
            { backgroundColor: connectionStatus.success ? '#E8F5E8' : '#FFEBEE' }
          ]}>
            <Text style={[
              styles.resultTitle,
              { color: connectionStatus.success ? '#2E7D32' : '#C62828' }
            ]}>
              {connectionStatus.success ? '✅ Connection Successful!' : '❌ Connection Failed'}
            </Text>
            
            {connectionStatus.success ? (
              <Text style={styles.resultMessage}>{connectionStatus.message}</Text>
            ) : (
              <View>
                <Text style={styles.errorTitle}>Error: {connectionStatus.error}</Text>
                <Text style={styles.errorDetails}>{connectionStatus.details}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Firebase Configuration Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firebase Configuration</Text>
        <View style={styles.configContainer}>
          <Text style={styles.configText}>Project ID: finalapp-9df8e</Text>
          <Text style={styles.configText}>Auth Domain: finalapp-9df8e.firebaseapp.com</Text>
          <Text style={styles.configText}>Storage Bucket: finalapp-9df8e.firebasestorage.app</Text>
          <Text style={styles.configText}>Region: Default (us-central1)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  statusItem: {
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: '#2E7D32',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  configContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  configText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});