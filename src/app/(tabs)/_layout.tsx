import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, TouchableOpacity, Modal, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from "@/components/layout/Footer";
import { Notification, User } from "iconsax-react-native";
import Logo from "@/components/icons/Logo";
import Color from "@/constants/Color";
import { useAuth } from "@/context/AuthContext";
import useLocationStore from "@/lib/store/userLocation";
import * as Updates from "expo-updates";
import SplashScreenAnimated from "../SplashScreenAnimated";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useMutation } from "@tanstack/react-query";
import { registerDeviceNotification } from "@/lib/service/mutationHelper";
import * as Location from "expo-location";
import ErrorBoundary from "../ErrorBoundary";
import * as Network from 'expo-network';
import NoInternet from "../NoInternet";
import * as Notifications from 'expo-notifications';

type LayoutProps = {
  navigation: any;
};

type LoadingStates = {
  internet: boolean;
  updates: boolean;
  pushNotification: boolean;
  location: boolean;
  fonts: boolean;
};

const PUSH_TOKEN_KEY = '@PushToken';

const Layout: React.FC<LayoutProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const { currentLocation, permissionStatus, getLocation } = useLocationStore();
  const { expoPushToken, notification } = usePushNotifications();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    internet: false,
    updates: false,
    pushNotification: false,
    location: false,
    fonts: false,
  });
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);

  const { mutateAsync: sendPushToken } = useMutation({
    mutationFn: registerDeviceNotification,
  });

  const checkInternetConnection = useCallback(async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
    return networkState.isConnected;
  }, []);

  const handlePushNotifications = useCallback(async (): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, pushNotification: true }));
    try {
      if (expoPushToken?.data) {
        const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        if (storedToken !== expoPushToken.data) {
          await sendPushToken({ pushToken: expoPushToken.data });
          await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken.data);
        }
        return true;
      } else {
        console.log('Push notification token not available');
        return new Promise((resolve) => {
          setShowPermissionModal(true);
          // The resolution of this promise is handled in the Modal's buttons
        });
      }
    } catch (error) {
      console.error("Error handling push notifications:", error);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, pushNotification: false }));
    }
  }, [expoPushToken, sendPushToken, setLoadingStates]);

  const handlePermissionResponse = async (granted: boolean) => {
    setShowPermissionModal(false);
    if (granted) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // The hook should automatically fetch the token after permissions are granted
        setPushNotificationsEnabled(true);
        return true;
      }
    }
    setPushNotificationsEnabled(false);
    return false;
  };

  const prepareApp = useCallback(async () => {
    try {
      const isOnline = await checkInternetConnection();

      if (!isOnline) {
        console.log("No internet connection. Skipping app preparation.");
        return;
      }
      setLoadingStates(prev => ({ ...prev, internet: false }));

      if (!__DEV__) {
        setLoadingStates(prev => ({ ...prev, updates: true }));
        
        try {
          const updateCheck = await Promise.race([
            Updates.checkForUpdateAsync(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Update check timed out')), 5000))
          ]);

          if (updateCheck && typeof updateCheck === 'object' && 'isAvailable' in updateCheck) {
            if (updateCheck.isAvailable) {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            }
          } else {
            console.log("Update check returned an unexpected result");
          }
        } catch (error) {
          console.error("Error checking for updates:", error);
        } finally {
          setLoadingStates(prev => ({ ...prev, updates: false }));
        }
      }

      await handlePushNotifications();

      if (currentLocation == null) {
        setLoadingStates(prev => ({ ...prev, location: true }));
        await getLocation();
        if (permissionStatus === Location.PermissionStatus.DENIED) {
          setLoadingStates(prev => ({ ...prev, location: false }));
          // Handle location permission denial if needed
        }
      }
    } catch (error) {
      console.error("Error preparing app:", error);
    }
  }, [checkInternetConnection, handlePushNotifications, currentLocation, getLocation, permissionStatus]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    if (!authState.loading && currentLocation !== null) {
      setAppIsReady(true);
    }
  }, [authState.loading, currentLocation]);

  useEffect(() => {
    const intervalId = setInterval(checkInternetConnection, 5000); 
    return () => clearInterval(intervalId);
  }, [checkInternetConnection]);

  if (!appIsReady) {
    return <SplashScreenAnimated loadingStates={loadingStates} />;
  }

  if (authState.authenticated === false) {
    return <Redirect href="/Login" />;
  }

  if (!isConnected) {
    return <NoInternet onPress={Updates.reloadAsync}/>;
  }

  return (
    <>
      <ErrorBoundary>
        <Tabs tabBar={(props) => <Footer {...props} navigation={navigation} />}>
          <Tabs.Screen
            name="index"
            options={{
              headerStyle: {
                shadowOpacity: 0,
                backgroundColor: Color.Gray.gray600,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.push("/profileSection/Profile")}
                >
                  <View style={{ paddingHorizontal: 20 }}>
                    <User color={Color.base.White} />
                  </View>
                </TouchableOpacity>
              ),
              headerTitle: () => (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Logo />
                </View>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push("/Notification")}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <Notification color={Color.base.White} />
                  </View>
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Tabs.Screen name="Acards" options={{ headerShown: false }} />
        </Tabs>
      </ErrorBoundary>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPermissionModal}
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Push notifications are important for receiving updates. Would you like to enable them?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => handlePermissionResponse(false)}
              >
                <Text style={styles.textStyle}>No, thanks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => handlePermissionResponse(true)}
              >
                <Text style={styles.textStyle}>Yes, enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonCancel: {
    backgroundColor: "#FF0000",
  },
  buttonConfirm: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Layout;