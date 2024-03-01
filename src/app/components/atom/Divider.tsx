import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

function Divider() {
  return (
    <View style={styles.container}>
      <View style={styles.border}></View>
      <Text
        style={[styles.text, Platform.OS === "android" && styles.androidText]}
      >
        or
      </Text>
      <View style={styles.border}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align vertically in the center
    marginBottom: 12,
    //marginTop: 12,
  },
  border: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  text: {
    marginHorizontal: 10,
    color: "gray", // You can adjust the color as needed
  },
  androidText: {
    alignItems: "center", // Align the text vertically in the center on Android
  },
});

export default Divider;
