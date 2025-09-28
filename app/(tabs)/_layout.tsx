import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#712d08ff",
          headerStyle: { backgroundColor: "#f7c036ff" },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: { backgroundColor: "#f7c036ff" },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // ✅ hide header if your home has a custom header
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "information-circle"
                  : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cloud-done" : "cloud-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      </Tabs>
    </ProtectedRoute>
  );
}
