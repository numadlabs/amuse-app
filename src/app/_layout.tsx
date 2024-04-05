import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Platform } from "react-native";
import { width } from "./lib/utils";
import { Check } from "iconsax-react-native";
import Color from "./constants/Color";
import Tick from "./components/icons/Tick";

// import useQu
// import QueryClien
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Index",
};
const toastConfig: ToastConfig = {
  perkToast: (params: ToastConfigParams<any>) => (
    <View style={styles.toastContainer}>
      <Tick size={24} color={Color.System.systemSuccess}/>
      <Text style={styles.toastText}>{params.text1}</Text>
    </View>
  )
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
          <Stack.Screen name="PowerUp" options={{presentation: 'modal'}}/>
        </Stack>
        <Toast config={toastConfig} /> 
      </AuthProvider>
    </QueryClientProvider>
  );
}


const styles = StyleSheet.create({
  toastContainer :{
    top:4,
    gap:8,
    height: 48,
    flexDirection:'row',
    alignItems:'center', 
    alignContent: 'center',
    minWidth: width/2, 
    backgroundColor: Color.base.White, 
    padding:12 ,
    borderRadius:24,
    ...Platform.select({
      ios: {
        shadowColor: Color.Gray.gray500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 12
      },
      android: {
        elevation: 12,
      },
    }),
  },
  toastText:{
    fontSize:16,
    fontWeight: '600',
    lineHeight: 20,
  }
})