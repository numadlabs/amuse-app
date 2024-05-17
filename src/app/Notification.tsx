import { View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import NotificationCard from "./components/atom/cards/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const retrieveNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem("restaurantCard");
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

  return (
    <View style={styles.body}>
      <Header title="Notifications" />
      <FlatList
      style={styles.container}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.name}
            description={`You received $1 of bitcoin from ${item.name}`}
            time={formatDate(item.date)}
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
    gap:16
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
