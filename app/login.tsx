import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    // Enhanced validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    bounce.value = withSpring(0.9, { damping: 5 }, () => {
      bounce.value = withSpring(1);
    });

    try {
      // Attempt Firebase authentication
      const userCredential = await signIn(email, password);
      
      // Verify the user credential is valid
      if (!userCredential || !userCredential.user) {
        throw new Error('Invalid authentication response');
      }

      // Verify the user is properly authenticated
      if (!userCredential.user.emailVerified && userCredential.user.email) {
        // Optional: You can require email verification here
        // For now, we'll allow login but you can uncomment below to require verification
        // Alert.alert('Email Verification Required', 'Please verify your email before logging in');
        // return;
      }

      // Show success message only after successful authentication
      Alert.alert(
        'Welcome!', 
        'Login successful! Welcome to EchoVerse.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Clear the form
              setEmail('');
              setPassword('');
              // Navigate to main app ONLY after successful authentication
              router.push('/(tabs)' as any);
            }
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Firebase auth errors with more detailed messages
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please check your password and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format. Please enter a valid email.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Clear form on error to prevent retry with same credentials
      setEmail('');
      setPassword('');
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.tagline}>Welcome! Let's Log In!
            
          </Text>

          {/* Waveform */}
          <View style={styles.waveform}>
            {[1, 2, 3].map((_, i) => (
              <Animated.View key={i} style={[styles.wave, waveStyle]} />
            ))}
          </View>
        </View>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#FFDAB9"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFDAB9"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.loginButton, loading && { opacity: 0.6 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup' as any)}>
          <Text style={styles.signUpLink}>Don’t have an account? Sign Up</Text>
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
    marginBottom: 50,
  },
  logoCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    borderWidth: 5,
    borderColor: '#D4AF37',
    position: 'absolute',
    top: 25,
    left: 25,
  },
  musicNotes: {
    position: 'absolute',
    top: 20,
    right: 25,
    flexDirection: 'row',
  },
  note: {
    fontSize: 24,
    color: '#FFD700',
    marginHorizontal: 3,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 25,
  },
  tagline: {
    fontSize: 14,
    color: '#FFDAB9',
    marginTop: 5,
    fontStyle: 'italic',
  },
  waveform: {
    flexDirection: 'row',
    marginTop: 12,
  },
  wave: {
    width: 5,
    backgroundColor: '#FFD700',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  formContainer: {
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    gap: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButton: {
    backgroundColor: '#FFDAB9',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    elevation: 3,
    width: '100%',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  signUpLink: {
    fontSize: 14,
    color: '#FFDAB9',
    marginTop: 10,
  },
});
