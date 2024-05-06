import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import { Notification1, Bitcoin } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import NotificationCard from "./components/atom/cards/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationProps {
  title: string;
  description: string;
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const Notification = () => {
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    const retrieveNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(
          "restaurantCard"
        );
        if (storedNotifications !== null) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
        }
      } catch (error) {
        console.log("Error retrieving notifications:", error);
      }
    };

    retrieveNotifications();
  }, []);

  console.log("aas", notifications);

  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
      <Header title="Notifications" />
      <View style={styles.container}>
        {notifications !== null &&
          notifications.length !== 0 &&
          notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              title={notification.name}
              description={`You received $1 of BTC from ${notification.name}`}
              time={formatDate(notification.date).toString()}
            />
          ))}
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  container: {
    borderRadius: 16,
    gap: 16,
  },
});
