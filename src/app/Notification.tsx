import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./components/layout/Header";
import Color from "./constants/Color";
import { Notification1 } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface notProps {
  title: string;
  description: string;
}

const Notification = () => {
  return (
    <>
      <Header title="Notifications" />
      <View style={styles.body}>
      <LinearGradient
            colors={[Color.Brand.card.start, Color.Brand.card.end]}
            style={{ borderRadius: 16 }}>
        <View style={styles.container}>
          <View
            style={{
              marginHorizontal: 12,
              marginVertical: 16,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                backgroundColor: Color.Gray.gray300,
                width: 36,
                height: 36,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
              }}
            >
              <Notification1 size={20} color="#fff" />
            </View>
            <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
              <Text
                style={{
                  color: Color.Gray.gray50,
                  fontSize: 14,
                  fontFamily: "Rubik-Medium",
                }}
              >
                {"Help"}
              </Text>
              <Text
                style={{
                  color: Color.Gray.gray100,
                  fontSize: 12,
                  fontFamily: "Rubik-Regular",
                }}
              >
                {"description"}
              </Text>
            </View>
          </View>
        </View>
        </LinearGradient>
      </View>
    </>
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
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
});
