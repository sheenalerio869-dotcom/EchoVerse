import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommentsMigration } from '../lib/migrateComments';

interface MigrationHelperProps {
  onComplete?: () => void;
}

export default function MigrationHelper({ onComplete }: MigrationHelperProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{ [mood: string]: { local: number; firestore: number } } | null>(null);

  const checkStatus = async () => {
    try {
      const status = await CommentsMigration.checkMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      Alert.alert('Error', 'Failed to check migration status');
    }
  };

  const startMigration = async () => {
    try {
      setIsMigrating(true);
      await CommentsMigration.migrateAllComments();
      Alert.alert('Success', 'Comments migrated successfully!');
      await checkStatus(); // Refresh status
      onComplete?.();
    } catch (error) {
      Alert.alert('Error', 'Migration failed. Please try again.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments Migration</Text>
      <Text style={styles.subtitle}>Migrate your local comments to Firestore</Text>
      
      <TouchableOpacity style={styles.button} onPress={checkStatus}>
        <Text style={styles.buttonText}>Check Status</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.migrateButton, isMigrating && styles.disabledButton]} 
        onPress={startMigration}
        disabled={isMigrating}
      >
        <Text style={styles.buttonText}>
          {isMigrating ? 'Migrating...' : 'Start Migration'}
        </Text>
      </TouchableOpacity>

      {migrationStatus && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Migration Status:</Text>
          {Object.entries(migrationStatus).map(([mood, counts]) => (
            <Text key={mood} style={styles.statusText}>
              {mood}: {counts.local} local → {counts.firestore} Firestore
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#8B4513',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFDAB9',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#A0522D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  migrateButton: {
    backgroundColor: '#2E8B57',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#5C3317',
    borderRadius: 8,
  },
  statusTitle: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    color: '#FFDAB9',
    fontSize: 12,
    marginBottom: 2,
  },
});

