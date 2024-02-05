import "../global.css";
import { Slot, Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function Layout() {
  const { authState, onLogout } = useAuth();
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
        {authState?.authenticated ? (
          <Stack.Screen name="home"></Stack.Screen>
        ) : (
          <Stack.Screen name="login"></Stack.Screen>
        )}
      </Stack>
    </AuthProvider>
  );
}
