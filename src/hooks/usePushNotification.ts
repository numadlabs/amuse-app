import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { PermissionStatus } from "expo-modules-core";
import { useMutation } from "@tanstack/react-query";
import { updatePushToken } from "@/lib/service/mutationHelper";
import { useAuth } from "@/context/AuthContext";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  permissionStatus: PermissionStatus;
}

export const usePushNotifications = (): PushNotificationState => {
  const { authState } = useAuth();
  const { mutateAsync: updatePushTokenMutation } = useMutation({
    mutationFn: updatePushToken,
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      console.log("Must be using a physical device for Push notifications");
      setPermissionStatus(PermissionStatus.DENIED);
      return;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);

      if (finalStatus !== PermissionStatus.GRANTED) {
        console.log("Push notification permissions denied");
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      setExpoPushToken(token);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (
        authState.authenticated === true &&
        finalStatus === PermissionStatus.GRANTED
      ) {
        await updatePushTokenMutation({
          userId: authState.userId,
          token: expoPushToken.data,
        });
      }
    } catch (error) {
      console.error("Error in registerForPushNotificationsAsync:", error);
      setPermissionStatus(PermissionStatus.DENIED);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Handle token updates when auth state changes and permission is granted
  useEffect(() => {
    if (
      authState.authenticated &&
      expoPushToken &&
      permissionStatus === PermissionStatus.GRANTED
    ) {
      updatePushTokenMutation({ token: expoPushToken.data });
    }
  }, [authState.authenticated, expoPushToken, permissionStatus]);

  return {
    expoPushToken,
    notification,
    permissionStatus,
  };
};
