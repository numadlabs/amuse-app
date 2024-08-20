import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import Header from "@/components/layout/Header";
import Color from "@/constants/Color";
import NotificationCard from "@/components/atom/cards/NotificationCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import NotificationIcon from "@/components/icons/NotificationIcon";
import { height } from "@/lib/utils";
import { BODY_1_MEDIUM, CAPTION_1_REGULAR } from "@/constants/typography";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import { getUserNotification } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";

const Notification = () => {
  const { authState } = useAuth();
  const { data: userNotifications = [], isLoading } = useQuery({
    queryKey: userKeys.notifications,
    queryFn: getUserNotification,
    enabled: !!authState.userId,
  });

  const reversedNotifications = useMemo(() => {
    return [...userNotifications].reverse();
  }, [userNotifications]);


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
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <View style={styles.body}>
        <Header title="Notifications" />
        {isLoading ? (
          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator />
          </View>
        ) : userNotifications.length > 0 ? (
          <FlatList
            style={styles.container}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            data={reversedNotifications}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <NotificationCard
                title={item?.message}
                description={item?.message}
                type={item?.type}
                time={getRelativeTime(item.createdAt)}
              />
            )}
          />
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center", height: height / 1.5, gap: 64 }}>
            <View style={{ flexDirection: "column", gap: 24, alignItems: "center" }}>
              <View style={styles.IconContainer}>
                <NotificationIcon />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text style={styles.Title}>No notification yet</Text>
                <Text style={styles.Description}>We will notify you when something arrives</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
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
  IconContainer: {
    padding: 12,
    backgroundColor: Color.Gray.gray400,
    borderRadius: 12,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  Title: {
    color: Color.base.White,
    ...BODY_1_MEDIUM,
  },
  Description: {
    color: Color.Gray.gray100,
    ...CAPTION_1_REGULAR,
    textAlign: "center",
  },
});