import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Color from "@/app/constants/Color";
import Tick from "../../icons/Tick";
import { Location, WalletAdd } from "iconsax-react-native";
import Button from "../../ui/Button";
import Popup from "../../(feedback)/Popup";
import { router } from "expo-router";
import { RestaurantType } from "@/app/lib/types";

interface ownedProps {
  restaurant: RestaurantType;
  isClaimLoading: boolean;
  onPress: (id: string) => void;
}

const UnOwned: React.FC<ownedProps> = ({ restaurant, isClaimLoading, onPress }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    router.back();
  };

  return (
    <>
      <View style={styles.attrContainer}>
        <View style={{ gap: 32 }}>
          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Color.base.White,
              }}
            >
              Rewards
            </Text>
            <View>
              <View style={styles.attribute}>
                <Tick size={8} color={Color.Gray.gray100} />
                <Text style={styles.attributeText}>
                  {restaurant?.benefits}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: Color.base.White,
              }}
            >
              Locations
            </Text>
            <View>
              <View style={styles.attribute}>
                <Location color={Color.Gray.gray100} />
                <Text style={styles.attributeLocText}>
                  {restaurant?.location}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: Color.base.White,
            }}
          >
            How it works
          </Text>
          <Text style={{ marginBottom: 100, color: Color.Gray.gray50 }}>
            Open your app to the homepage, scan the QR code from your waiter or
            hostess, and earn rewards for checking in. Activate power-ups for
            extra rewards.
          </Text>
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
    fontSize: 16,
    width: "90%",
  },
  attributeLocText: {
    color: Color.Gray.gray50,
    fontSize: 16,
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
