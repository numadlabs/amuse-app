import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import { Notification1, Bitcoin } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import NotificationCard from "./components/atom/cards/NotificationCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notification = () => {
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    // Retrieve stored card information from AsyncStorage
    const retrieveCardInformation = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('restaurantCards');
        if (storedCards !== null) {
          // Parse the stored JSON data
          const parsedCards = JSON.parse(storedCards);
          // Set the notification data
          setNotificationData(parsedCards);
        }
        console.log('Stored cards:', storedCards);
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
        {notificationData.map((card, index) => (
          <NotificationCard
            key={index}
            title={card.name}
            description={`You received $1 of BTC from ${card.name}`}
          />
        ))}
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    gap: 16,
  },
});
