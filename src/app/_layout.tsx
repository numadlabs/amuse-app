import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import useQu
// import QueryClien
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Index",
};
export default function Layout() {
  const { authState, onLogout } = useAuth();
  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("../public/fonts/Sora-Regular.ttf"),
    "Sora-Bold": require("../public/fonts/Sora-Regular.ttf"),
    // Add more fonts if needed
  });
  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="restaurants/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="restaurants/details/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="restaurants/Mock" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/QrModal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="SuccessScreen" />
        </Stack>

      </AuthProvider>
    </QueryClientProvider>
  );
}
