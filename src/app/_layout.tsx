import "../global.css";
import { Slot, Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
// import useQu
// import QueryClien
const queryClient = new QueryClient();

export default function Layout() {
  const { authState, onLogout } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
          <Stack.Screen name="RestaurantMapView" />
          {authState?.authenticated ? (
            <Stack.Screen name="home"></Stack.Screen>
          ) : (
            <Stack.Screen name="Login"></Stack.Screen>
          )}
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
