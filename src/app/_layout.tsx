import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../global.css";
import { AuthProvider } from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';
import { toastConfig } from "./components/(feedback)/ToasterConfig";

const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "Index",
};

export default function Layout() {
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
        <StatusBar style="dark"/>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="restaurants/[id]"
            options={{ presentation: "modal" }}
          />
            <Stack.Screen
            name="Acards/[id]"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="(modals)/QrModal"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="SuccessScreen" />
          <Stack.Screen name="MyAcards" />
          <Stack.Screen name="TermsAndCondo" />
          <Stack.Screen name="Faq" />
          <Stack.Screen name="PowerUp" options={{presentation: 'modal'}}/>
          <Stack.Screen name="(modals)/StackedCardModal" options={{presentation: 'modal'}}/>
        </Stack>
        <Toast config={toastConfig} /> 
      </AuthProvider>
    </QueryClientProvider>
  );
}