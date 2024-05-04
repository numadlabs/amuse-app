import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Color from "../../constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";

interface BalanceProps {
  amount?: number;
}

const Balance: React.FC<BalanceProps> = ({ amount }) => {
  const truncatedAmount =
    amount !== 0 ? amount?.toString().substring(0, 9) : "0.0000";
  let coinAmount = parseFloat(truncatedAmount) * 70193;


  const AnimatedText = Animated.createAnimatedComponent(Text)

  return (
    <View style={styles.container}>
      <BlurView style={styles.blurContainer} intensity={100}>
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Color.Gray.gray400,
          }}
        >
          <View style={styles.container1}>
            <View
              style={{ flexDirection: "column", gap: 8, alignItems: "center" }}
            >
              <Text style={styles.balanceLabel}>Total balance</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Image
                  style={{ width: 28, height: 28 }}
                  source={require("@/public/images/Bitcoin.png")}
                />
                <AnimatedText entering={FadeIn} style={styles.balanceAmount}>{truncatedAmount} BTC</AnimatedText>
              </View>
            </View>
            <Text
              style={{
                color: Color.base.White,
                fontSize: 12,
                lineHeight: 16,
                fontWeight: "400",
              }}
            >
              Estimated USD balance: ${coinAmount.toFixed(2)}
            </Text>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginTop: 32,
  },
  container1: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 12,
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
    position: "absolute",
    right: 0,
    overflow: "hidden",
  },
  blurContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default Balance;
