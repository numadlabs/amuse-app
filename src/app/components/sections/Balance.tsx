import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Color from "../../constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import APassStripes from "../icons/APassStripes";
import { InfoCircle } from "iconsax-react-native";
import { useAuth } from "@/app/context/AuthContext";

interface BalanceProps {
  amount?: number;
  aed: number;
  handleToggle: () => void;
}

const Balance: React.FC<BalanceProps> = ({ amount, handleToggle, aed }) => {

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
          }}
        >
          <View
            style={styles.balanceStripesContainer}
          >
            <APassStripes />
          </View>
          <View style={styles.container1}>
            <View style={{ flexDirection: "column", gap: 4 }}>
              <Text
                style={{
                  color: Color.Gray.gray100,
                  fontSize: 12,
                  fontWeight: "400",
                  lineHeight: 16,
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
                    fontSize: 28,
                    lineHeight: 36,
                  }}
                >
                  {aed?.toFixed(2)}
                </Text>
                <Text
                  style={{
                    bottom: 3,
                    color: Color.Gray.gray100,
                    lineHeight: 20,
                  }}
                >
                  AED
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
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Text
                  style={{
                    color: Color.Gray.gray50,
                    fontSize: 12,
                    lineHeight: 16,
                    fontWeight:'400',

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
                    fontSize: 12,
                    color: Color.Gray.gray50,
                    lineHeight: 16,
                  }}
                >
                  {amount?.toFixed(8)} Bitcoin
                </Text>
              </View>
              <TouchableOpacity onPress={handleToggle}>
                <InfoCircle size={16} color={Color.Gray.gray50} />
              </TouchableOpacity>
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
    paddingHorizontal:16
  },
  container1: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  balanceInfo: {
    gap: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: Color.Gray.gray50,
    fontWeight: "600",
    lineHeight: 16,
  },
  balanceAmount: {
    fontSize: 28,
    lineHeight: 36,
    color: Color.base.White,
    fontWeight: "400",
  },
  balanceStripesContainer: {
    position:'absolute',
    top:-60, 
    right:-72, 
    transform: [{ rotate: '270deg' }]
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default Balance;
