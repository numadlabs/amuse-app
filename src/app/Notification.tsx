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


const Notification = () => {

  const [notifications, setNotifcations] = useState(null)
  useEffect(() => {
    // Retrieve stored card information from AsyncStorage
    const retrieveCardInformation = async () => {
      try {
        const storedCard = await AsyncStorage.getItem('restaurantCard');
        if (storedCard !== null) {
          // Parse the stored JSON data
          const parsedCard = JSON.parse(storedCard);
          // Set the notification data
          setNotifcations(parsedCard);
        }
      } catch (error) {
        console.log('Error retrieving card information:', error);
      }
    };

    retrieveCardInformation();
  }, []);

  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
      <Header title="Notifications" />
      <View style={styles.container}>
        {notifications && (
          <NotificationCard
            title={notifications.name}
            description={`You received $1 of BTC from ${notifications.name}`}
          />
        )}
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
    gap:16
  },
});
