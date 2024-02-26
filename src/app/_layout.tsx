import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Index",
};
export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <Stack screenOptions={{ headerShown: false }}>
          {authState?.loading ? (
            <Text>Loading</Text>
          ) : authState?.authenticated ? (
            <Stack.Screen name="(tabs)/index" />
          ) : (
            <Stack.Screen name="Login" />
          ) : (
            <Stack.Screen name="(tabs)/index" />
          )}
        </Stack> */}
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
