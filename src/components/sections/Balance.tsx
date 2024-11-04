import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Color from "../../constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import APassStripes from "../icons/APassStripes";
import { InfoCircle } from "iconsax-react-native";
import { BODY_1_REGULAR, CAPTION_1_REGULAR, H4 } from "@/constants/typography";

interface BalanceProps {
  amount?: number;
  convertedAmount: number;
  currencyName: string;
  // handleToggle: () => void;
}

const Balance: React.FC<BalanceProps> = ({
  amount,
  // handleToggle,
  convertedAmount,
  currencyName,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          borderWidth: 1,
          borderColor: Color.Gray.gray400,
          overflow: "hidden",
        }}
      >
        <View style={styles.balanceStripesContainer}>
          <APassStripes />
        </View>
        <View style={styles.container1}>
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text
              style={{
                ...CAPTION_1_REGULAR,
                color: Color.Gray.gray100,
              }}
            >
              Total balance
            </Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
            >
              <Text
                style={{
                  color: Color.base.White,
                  ...H4,
                }}
              >
                {amount == 0 ? "0.0000" : convertedAmount?.toFixed(2)}
              </Text>
              <Text
                style={{
                  bottom: 3,
                  color: Color.Gray.gray100,
                  ...BODY_1_REGULAR,
                }}
              >
                {currencyName}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            {/* <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Text
                style={{
                  color: Color.Gray.gray50,
                  ...CAPTION_1_REGULAR,
                }}
              >
                ≈
              </Text>
              <Image
                style={{ width: 12, height: 12 }}
                source={require("@/public/images/Bitcoin.png")}
              />
              <Text
                style={{
                  color: Color.Gray.gray50,
                  ...CAPTION_1_REGULAR,
                }}
              >
                {amount?.toFixed(8)} points
              </Text>
            </View> */}
            {/* <TouchableOpacity onPress={handleToggle}>
              <InfoCircle size={16} color={Color.Gray.gray50} />
            </TouchableOpacity> */}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  container1: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  balanceStripesContainer: {
    position: "absolute",
    top: -60,
    right: -72,
    transform: [{ rotate: "270deg" }],
  },
});

export default Balance;
