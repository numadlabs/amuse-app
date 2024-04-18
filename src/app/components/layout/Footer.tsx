import { router } from "expo-router";
import { Home2, Map, ScanBarcode } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../../constants/Color";

const Footer = ({ navigation }) => {
  const [isActive, setIsActive] = useState("/");
  const handleTabPress = (route) => {
    router.navigate(route.name);
    setIsActive(route.name);
  };
  const isTabActive = (route) => {
    return isActive === route;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTabPress({ name: "/" })}
      >
        <Home2
          size={24}
          color={isTabActive("/") ? Color.Gray.gray600 : Color.Gray.gray400}
          variant={isTabActive("/") ? "Bold" : "Linear"}
        />
        <Text style={{ fontSize: 13, fontWeight: "bold" }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/(modals)/QrModal")}
      >
        <View style={styles.qr}>
          <ScanBarcode size={32} color={Color.base.White} />
        </View>
        <Text style={{ fontSize: 13, bottom: 20, fontWeight: "bold" }}>
          Check-in
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTabPress({ name: "Acards" })}
      >
        <Map
          variant={isTabActive("Acards") ? "Bold" : "Linear"}
          size={24}
          color={
            isTabActive("Acards") ? Color.Gray.gray600 : Color.Gray.gray400
          }
        />
        <Text style={{ fontSize: 13, fontWeight: "bold" }}>Discover</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    flexDirection: "row",
    backgroundColor: Color.base.White,
    paddingHorizontal: 44,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    width: 68,
    columnGap: 4,
    height: 68,
  },

  qr: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 32,
    bottom: 20,
    position: "relative",
    alignSelf: "center",
  },
});
