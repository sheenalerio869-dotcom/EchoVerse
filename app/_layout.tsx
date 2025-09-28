import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/AuthContext";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../lib/AuthContext";
import NetworkStatus from "../components/NetworkStatus";

// Component to handle authentication routing
function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || 
                       segments[0] === 'artists' || 
                       segments[0] === 'songs' || 
                       segments[0] === 'player';

    if (!user && inAuthGroup) {
      // User is not authenticated but trying to access protected route
      router.replace('/welcome');
    } else if (user && !inAuthGroup) {
      // User is authenticated but on auth screens, redirect to main app
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
      <NetworkStatus />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* Tabs (main app) */}
        <Stack.Screen name="(tabs)" />

        {/* Nested routes for dynamic navigation */}
        <Stack.Screen name="artists/[mood]" />
        <Stack.Screen name="songs/[artist]" />
        <Stack.Screen name="player/[artist]/[song]" />
      </Stack>

      <StatusBar style="light" />
    </AuthProvider>
  );
}
