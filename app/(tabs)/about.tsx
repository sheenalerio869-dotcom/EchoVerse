import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "../../lib/AuthContext";
import { testFirebaseConnection, quickConnectionCheck } from "../../lib/testFirebaseConnection";

interface FirebaseStatus {
  quickCheck?: {
    firebaseApp: boolean;
    firestoreInitialized: boolean;
    authInitialized: boolean;
    storageInitialized: boolean;
  };
  connectionTest?: {
    success: boolean;
    message?: string;
    error?: string;
    details?: string;
  } | null;
}

export default function AboutScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Logo animations
  const rotation = useSharedValue(0);
  const waveHeight = useSharedValue(20);

  const recordStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    height: waveHeight.value,
  }));

  // ✅ Start animations inside useEffect
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1);
    waveHeight.value = withRepeat(withTiming(40, { duration: 600 }), -1, true);
    
    // Run quick Firebase check on component mount
    const quickCheck = quickConnectionCheck();
    setFirebaseStatus({ quickCheck, connectionTest: null });
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const testFirebase = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testFirebaseConnection();
      setFirebaseStatus((prev: FirebaseStatus | null) => ({ ...prev, connectionTest: result }));
    } catch (error) {
      setFirebaseStatus((prev: FirebaseStatus | null) => ({
        ...prev,
        connectionTest: {
          success: false,
          error: 'Test failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <LinearGradient colors={["#8B4513", "#8B4513"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EchoVerse</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#e2d29eff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Animated.View style={[styles.record, recordStyle]} />
            <View style={styles.musicNotes}>
              <Text style={styles.note}>♪</Text>
              <Text style={styles.note}>♫</Text>
            </View>
            <Text style={styles.logoText}>EchoVerse</Text>
            <Text style={styles.tagline}>Where music meets your soul</Text>
            <View style={styles.waveform}>
              {[1, 2, 3].map((_, i) => (
                <Animated.View key={i} style={[styles.wave, waveStyle]} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What is EchoVerse?</Text>
          <Text style={styles.description}>
            EchoVerse is your ultimate music companion, carefully designed to guide you through every emotional journey with the power of sound. More than just a music app, it becomes a trusted friend that intuitively understands the rhythms of your heart and mind. Whether you are weighed down by sadness, searching for comfort, longing for a space of quiet meditation, or yearning for a spark of inspiration, EchoVerse curates the perfect soundtrack to match your state of being. It goes beyond playlists and algorithms by creating an immersive atmosphere where every song feels handpicked for your soul. When you need healing, EchoVerse surrounds you with gentle harmonies that soothe the spirit; when you want to meditate, it offers tranquil soundscapes that quiet the noise of the world; when you seek motivation, it lifts you up with energizing beats and empowering lyrics. Each mood becomes a gateway to self-discovery, and every track serves as a reminder that music is not just entertainment—it is therapy, reflection, and inspiration all at once. With EchoVerse, you don’t just listen to songs; you experience emotions, memories, and moments through melodies that stay with you long after the music stops.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <MaterialIcons name="mood" size={20} color="#D4AF37" />
            <Text style={styles.featureText}>Mood-based music discovery</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="library-music" size={20} color="#D4AF37" />
            <Text style={styles.featureText}>Curated artist collections</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="play-circle" size={20} color="#D4AF37" />
            <Text style={styles.featureText}>Beautiful music player</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="search" size={20} color="#D4AF37" />
            <Text style={styles.featureText}>Smart search functionality</Text>
          </View>
        </View>

        {/* Firebase Connection Status */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔥 Firebase Connection</Text>
          
          {firebaseStatus?.quickCheck && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Configuration Status:</Text>
              <View style={styles.statusItem}>
                <MaterialIcons
                  name={firebaseStatus.quickCheck.firebaseApp ? "check-circle" : "error"}
                  size={16}
                  color={firebaseStatus.quickCheck.firebaseApp ? "#4CAF50" : "#F44336"}
                />
                <Text style={[styles.statusText, { color: firebaseStatus.quickCheck.firebaseApp ? "#4CAF50" : "#F44336" }]}>
                  Firebase App: {firebaseStatus.quickCheck.firebaseApp ? "✅ Ready" : "❌ Failed"}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialIcons
                  name={firebaseStatus.quickCheck.firestoreInitialized ? "check-circle" : "error"}
                  size={16}
                  color={firebaseStatus.quickCheck.firestoreInitialized ? "#4CAF50" : "#F44336"}
                />
                <Text style={[styles.statusText, { color: firebaseStatus.quickCheck.firestoreInitialized ? "#4CAF50" : "#F44336" }]}>
                  Firestore: {firebaseStatus.quickCheck.firestoreInitialized ? "✅ Ready" : "❌ Failed"}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialIcons
                  name={firebaseStatus.quickCheck.authInitialized ? "check-circle" : "error"}
                  size={16}
                  color={firebaseStatus.quickCheck.authInitialized ? "#4CAF50" : "#F44336"}
                />
                <Text style={[styles.statusText, { color: firebaseStatus.quickCheck.authInitialized ? "#4CAF50" : "#F44336" }]}>
                  Auth: {firebaseStatus.quickCheck.authInitialized ? "✅ Ready" : "❌ Failed"}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.testButton, isTestingConnection && styles.testButtonDisabled]}
            onPress={testFirebase}
            disabled={isTestingConnection}
          >
            <MaterialIcons
              name={isTestingConnection ? "hourglass-empty" : "wifi"}
              size={20}
              color="white"
            />
            <Text style={styles.testButtonText}>
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Text>
          </TouchableOpacity>

          {firebaseStatus?.connectionTest && (
            <View style={[
              styles.resultContainer,
              { backgroundColor: firebaseStatus.connectionTest.success ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)" }
            ]}>
              <Text style={[
                styles.resultTitle,
                { color: firebaseStatus.connectionTest.success ? "#4CAF50" : "#F44336" }
              ]}>
                {firebaseStatus.connectionTest.success ? "✅ Connection Successful!" : "❌ Connection Failed"}
              </Text>
              {firebaseStatus.connectionTest.success ? (
                <Text style={styles.resultMessage}>{firebaseStatus.connectionTest.message}</Text>
              ) : (
                <View>
                  <Text style={styles.errorText}>Error: {firebaseStatus.connectionTest.error}</Text>
                  <Text style={styles.errorDetails}>{firebaseStatus.connectionTest.details}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
          © 2025 EchoVerse. All rights reserved.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#8B4513",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37",
  },
  logoutButton: {
    backgroundColor: "#622e08ff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  logoCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#5C3317",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  record: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#000",
    borderWidth: 5,
    borderColor: "#D4AF37",
    position: "absolute",
    top: 25,
    left: 25,
  },
  musicNotes: {
    position: "absolute",
    top: 20,
    right: 25,
    flexDirection: "row",
  },
  note: {
    fontSize: 24,
    color: "#FFD700",
    marginHorizontal: 3,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 25,
  },
  tagline: {
    fontSize: 14,
    color: "#FFDAB9",
    marginTop: 5,
    fontStyle: "italic",
  },
  waveform: {
    flexDirection: "row",
    marginTop: 12,
  },
  wave: {
    width: 5,
    backgroundColor: "#FFD700",
    marginHorizontal: 3,
    borderRadius: 3,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(236, 191, 42, 0.79)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#e5d6b5ff",
    textAlign: "center",
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#FFDAB9",
    marginLeft: 10,
  },
  version: {
    fontSize: 14,
    color: "#D2B48C",
    textAlign: "center",
    marginBottom: 10,
  },
  copyright: {
    fontSize: 12,
    color: "#D2B48C",
    textAlign: "center",
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AF37",
    marginBottom: 8,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  testButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  testButtonDisabled: {
    backgroundColor: "#999",
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  resultContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  resultMessage: {
    fontSize: 14,
    color: "#4CAF50",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F44336",
    marginBottom: 4,
  },
  errorDetails: {
    fontSize: 12,
    color: "#FFDAB9",
    fontStyle: "italic",
  },
});
