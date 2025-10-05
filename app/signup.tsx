import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useAuth } from '../lib/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation values (match login)
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(1);
  const waveHeight = useSharedValue(20);

  const recordStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    height: waveHeight.value,
  }));

  // Start animations
  rotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1);
  waveHeight.value = withRepeat(withTiming(40, { duration: 600 }), -1, true);

  const handleSignUp = async () => {
    if (!username.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    bounce.value = withSpring(0.9, { damping: 5 }, () => {
      bounce.value = withSpring(1);
    });

    try {
      await signUp(email, password);
      // Sign out the user immediately after account creation
      // This prevents automatic login and forces them to use the login screen
      await signOut(auth);
      
      Alert.alert(
        'Success',
        'Account created successfully! Please login with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear the form
              setUsername('');
              setLastname('');
              setEmail('');
              setPassword('');
              // Navigate to login
              router.push('/login' as any);
            }
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign up';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login' as any);
  };

  return (
    <LinearGradient colors={['#A0522D', '#8B4513']} style={styles.container}>
      {/* Logo (match login) */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Animated.View style={[styles.record, recordStyle]} />
          <View style={styles.musicNotes}>
            <Text style={styles.note}>♪</Text>
            <Text style={styles.note}>♫</Text>
          </View>
          <Text style={styles.logoText}>EchoVerse</Text>
          <Text style={styles.tagline}>Create your account</Text>
          <View style={styles.waveform}>
            {[1, 2, 3].map((_, i) => (
              <Animated.View key={i} style={[styles.wave, waveStyle]} />
            ))}
          </View>
        </View>
      </View>

      {/* Sign Up Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#FFDAB9"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          value={lastname}
          onChangeText={setLastname}
          placeholder="Lastname"
          placeholderTextColor="#FFDAB9"
        />

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#FFDAB9"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#FFDAB9"
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.signUpButton, loading && { opacity: 0.6 }]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login' as any)}>
          <Text style={styles.signUpLink}>Already have an account? Log In</Text>
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
  signUpButton: {
    backgroundColor: '#FFDAB9',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    elevation: 3,
    width: '100%',
  },
  signUpButtonText: {
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
