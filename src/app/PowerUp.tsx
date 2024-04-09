import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Location, TicketExpired, User, WalletAdd } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";

import Color from "./constants/Color";
import Close from "./components/icons/Close";
import AmuseBlackLogo from "./components/icons/AmuseBlackLogo";
import Popup from "./components/(feedback)/Popup";
import Toast from "react-native-toast-message";

const PowerUp = () => {

  const showToast = () => {
    setTimeout(() => {
      Toast.show({
        type: "perkToast",
        text1: "Perk consumed"
      })
    }, 800)
  }
  const { id, name } = useLocalSearchParams();
  const [isPopupVisible, setPopupVisible] = useState(false);
  console.log(id)

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleNavigation = () => {

    showToast()
    router.back()
  }



  return (
    <View style={{ backgroundColor: Color.base.White, flex: 1 }}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            router.back();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <View style={styles.container} key={id as string}>
        <TouchableOpacity onPress={togglePopup}>
          <Image
            style={{ width: 247, height: 247 }}
            source={require("@/public/images/pqr.png")}
          />
        </TouchableOpacity>

        <Popup
          title="Power-up consumed."
          isVisible={isPopupVisible}
          onClose={handleNavigation}
        />
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 32 }}
        >
          <AmuseBlackLogo />
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: Color.Gray.gray600,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: Color.Gray.gray400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Show this to your waiter to redeem.{"\n"} Don't worry, they are
              pros.

            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PowerUp;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 12,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  container: {
    gap: 80,
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  powerUpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
