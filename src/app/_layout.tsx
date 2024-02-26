import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
// import useQu
// import QueryClien
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Index",
};
export default function Layout() {
  const { authState, onLogout } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RestaurantMapView" />
          {authState?.authenticated ? (
            <Stack.Screen name="(tabs)/index" />
          ) : (
            <Stack.Screen name="Login" />
          )}
          <Stack.Screen name="(modals)/QrModal" options={{ presentation: "modal" }} />
          <Stack.Screen name="profileSection/Profile"/>
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
