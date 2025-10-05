import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useAuth } from '../lib/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Animation values
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(1);
  const waveHeight = useSharedValue(20);

  // Spin animation for record
  const recordStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Bounce animation for waveform
  const waveStyle = useAnimatedStyle(() => ({
    height: waveHeight.value,
  }));

  // Start animations
  rotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1);
  waveHeight.value = withRepeat(withTiming(40, { duration: 600 }), -1, true);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)' as any);
    }
  }, [user, loading, router]);

  const handleLogin = () => {
    bounce.value = withSpring(0.9, { damping: 5 }, () => {
      bounce.value = withSpring(1);
    });
    router.push('/login' as any);
  };

  const handleSignUp = () => {
    bounce.value = withSpring(0.9, { damping: 5 }, () => {
      bounce.value = withSpring(1);
    });
    router.push('/signup' as any);
  };

  const handleGuest = () => {
    bounce.value = withSpring(0.9, { damping: 5 }, () => {
      bounce.value = withSpring(1);
    });
    router.push('/(tabs)' as any);
  };

  return (
    <LinearGradient colors={['#A0522D', '#8B4513']} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          {/* Animated Vinyl */}
          <Animated.View style={[styles.record, recordStyle]} />

          {/* Notes */}
          <View style={styles.musicNotes}>
            <Text style={styles.note}>♪</Text>
            <Text style={styles.note}>♫</Text>
          </View>

          {/* Title */}
          <Text style={styles.logoText}>EchoVerse</Text>
          <Text style={styles.tagline}>Where music meets your soul</Text>

          {/* Waveform */}
          <View style={styles.waveform}>
            {[1, 2, 3].map((_, i) => (
              <Animated.View key={i} style={[styles.wave, waveStyle]} />
            ))}
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  logoCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#5C3317',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  record: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    borderWidth: 6,
    borderColor: '#D4AF37',
    position: 'absolute',
    top: 30,
    left: 30,
  },
  musicNotes: {
    position: 'absolute',
    top: 20,
    right: 25,
    flexDirection: 'row',
  },
  note: {
    fontSize: 26,
    color: '#FFD700',
    marginHorizontal: 3,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
  tagline: {
    fontSize: 14,
    color: '#FFDAB9',
    marginTop: 5,
    fontStyle: 'italic',
  },
  waveform: {
    flexDirection: 'row',
    marginTop: 15,
  },
  wave: {
    width: 5,
    backgroundColor: '#FFD700',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  loginButton: {
    backgroundColor: '#8B4513',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: '#FFDAB9',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    elevation: 3,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
    elevation: 3,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
});
