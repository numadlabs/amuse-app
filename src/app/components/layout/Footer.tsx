import { router } from "expo-router";
import { Home2, Map, ScanBarcode } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../../constants/Color";
import { BlurView } from "expo-blur";

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
    <BlurView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTabPress({ name: "/" })}
      >
        <Home2
          size={24}
          color={isTabActive("/") ? Color.base.White : Color.Gray.gray100}
          variant={isTabActive("/") ? "Bold" : "Linear"}
        />
        <Text style={{ fontSize: 13, fontWeight: "bold",  color:Color.Gray.gray50  }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/(modals)/QrModal")}
      >
        <View style={styles.qr}>
          <ScanBarcode size={32} color={Color.base.White} />
        </View>
        <Text style={{ fontSize: 13, bottom: 20, fontWeight: "bold", color:Color.Gray.gray50 }}>
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
            isTabActive("Acards") ?  Color.base.White : Color.Gray.gray100
          }
        />
        <Text style={{ fontSize: 13, fontWeight: "bold",  color:Color.Gray.gray50  }}>Discover</Text>
      </TouchableOpacity>
    </BlurView>
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
    backgroundColor: Color.Gray.gray600,
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
