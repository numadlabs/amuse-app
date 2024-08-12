import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Color from "@/constants/Color";
import Tick from "../../icons/Tick";
import { Location, WalletAdd } from "iconsax-react-native";
import Button from "../../ui/Button";
import PreFixPopup from "../../(feedback)/PreFixPopup";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { RestaurantType } from "@/lib/types";
import Animated, { SlideInDown } from "react-native-reanimated";
import { BODY_1_BOLD, BODY_1_REGULAR } from "@/constants/typography";

interface ownedProps {
  restaurant: RestaurantType;
}

const UnOwned: React.FC<ownedProps> = ({ restaurant }) => {
  const handleLocationPress = () => {
    if (restaurant?.latitude && restaurant?.longitude) {
      const mapURL = `https://maps.google.com/?q=${restaurant?.latitude},${restaurant?.longitude}`;
      Linking.openURL(mapURL);
    } else {
      console.warn("Latitude and longitude are not available");
    }
  };

  return (
    <>
      <View style={styles.attrContainer}>
        <View style={{ gap: 32, paddingBottom: 100 }}>
          <Animated.View
            entering={SlideInDown.springify().damping(20).delay(200)}
            style={{ gap: 16 }}
          >
            <Text
              style={{
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              Rewards
            </Text>
            <View>
              <View style={styles.attribute}>
                <Tick size={24} color={Color.Gray.gray100} />
                <Text style={styles.attributeText}>{restaurant?.benefits}</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            entering={SlideInDown.springify().damping(20).delay(200)}
            style={{ gap: 16 }}
          >
            <Text
              style={{
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              Locations
            </Text>
            <View>
              <TouchableOpacity
                style={styles.attribute}
                onPress={handleLocationPress}
              >
                <Location color={Color.Gray.gray100} />
                <Text style={styles.attributeLocText}>
                  {restaurant?.location}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View
            entering={SlideInDown.springify().damping(20).delay(200)}
            style={{ gap: 16 }}
          >
            <Text
              style={{
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              About
            </Text>
            <View>
              <Text style={styles.attributeText}>
                {restaurant?.description}
              </Text>
            </View>
          </Animated.View>
          <Animated.View
            entering={SlideInDown.springify().damping(20).delay(200)}
            style={{ gap: 16 }}
          >
            <Text
              style={{
                ...BODY_1_BOLD,
                color: Color.base.White,
              }}
            >
              How it works
            </Text>
            <View>
              <Text style={styles.attributeText}>
                {restaurant?.instruction}
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  attrContainer: {
    marginTop: 32,
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray50,
    ...BODY_1_REGULAR,
    flex: 1,
  },
  attributeLocText: {
    color: Color.System.systemInformation,
    ...BODY_1_REGULAR,
    width: "90%",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});

export default UnOwned;
