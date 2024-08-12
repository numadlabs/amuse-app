import { router } from "expo-router";
import { Home2, Map, ScanBarcode } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../../constants/Color";
import { BlurView } from "expo-blur";
import { height } from "@/lib/utils";
import { BUTTON_40 } from "@/constants/typography";

const Footer = ({ navigation }) => {
  const [isActive, setIsActive] = useState("/");
  const handleTabPress = (route) => {
    if (route.name === "/") {
      scrollToTop();
    }
    router.push(route.name);
    setIsActive(route.name);
  };
  const isTabActive = (route) => {
    return isActive === route;
  };
  let scrollViewRef = null;

  const scrollToTop = () => {
    if (scrollViewRef) {
      scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button1, styles.qrButton]}
        onPress={() => router.navigate("/(modals)/MyQrModal")}
      >
        <View style={styles.qr}>
          <ScanBarcode size={32} color={Color.base.White} />
        </View>
        <Text
          style={{
            ...BUTTON_40,
            color: Color.Gray.gray50,
            marginTop: 70,
          }}
        >
          Check-in
        </Text>
      </TouchableOpacity>
      <View style={[styles.container]}>
        {/* <LinearGradient
        colors={[Color.Brand.navbar.start, Color.Brand.navbar.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container]}
      > */}
        <BlurView
          intensity={0}
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            height: "100%",
            paddingHorizontal: 44,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleTabPress({ name: "/" })}
          >
            <Home2
              size={24}
              color={isTabActive("/") ? Color.base.White : Color.Gray.gray100}
              variant={isTabActive("/") ? "Bold" : "Linear"}
            />
            <Text
              style={{
                ...BUTTON_40,
                color: Color.Gray.gray50,
              }}
            >
              Home
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
                isTabActive("Acards") ? Color.base.White : Color.Gray.gray100
              }
            />
            <Text
              style={{
                ...BUTTON_40,
                color: Color.Gray.gray50,
              }}
            >
              Discover
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>
      {/* </LinearGradient> */}
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  qrButton: {
    position: "absolute",
    bottom: height / 34,
    alignSelf: "center",
  },
  container: {
    backgroundColor: Color.Gray.gray500,
    borderTopWidth: 1,
    borderColor: Color.Gray.gray400,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    height: height / 10.15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    gap: 4,
    zIndex: 10,
    padding: 12,
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    width: 74,
    columnGap: 4,
    height: 98,
    zIndex: 10,
  },

  qr: {
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 32,
    bottom: 25,
    alignSelf: "center",
    position: "absolute",
  },

  // Style for the blurred red vie
  redBlur: {
    position: "absolute",
    borderRadius: 40,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  redView: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
});
