import { View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import NotificationCard from "./components/atom/cards/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

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

  const getRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  };

  return (
    <View style={styles.body}>
      <Header title="Notifications" />
      <FlatList
        style={styles.container}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.name}
            description={`You received $1 of bitcoin from ${item.name}`}
            time={getRelativeTime(item.date)}
          />
        )}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  container: {
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Color.base.White,
    fontSize: 16,
  },
});
