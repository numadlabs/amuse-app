import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Color from "@/constants/Color";
import PerkGradient from "../../icons/PerkGradient";
import Button from "../../ui/Button";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { BODY_2_MEDIUM, BUTTON_32 } from "@/constants/typography";

interface PowerUpCardProp {
  title: string;
  onPress: () => void;
}
const PowerUpCard: React.FC<PowerUpCardProp> = ({ title, onPress }) => {
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20).delay(200)}
      exiting={SlideOutDown.springify().damping(10).delay(200)}
    >
      <LinearGradient
        colors={[Color.Brand.card.start, Color.Brand.card.end]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <PerkGradient />
          <Text
            style={{
              ...BODY_2_MEDIUM,
              color: Color.base.White,
            }}
          >
            {title}
          </Text>
        </View>

        <Button
          variant="disabled"
          size="small"
          textStyle="primary"
          onPress={onPress}
        >
          <Text
            style={{
              ...BUTTON_32,
            }}
          >
            Use
          </Text>
        </Button>
      </LinearGradient>
    </Animated.View>
  );
};

export default PowerUpCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
  stripesContainer: {
    position: "absolute",
    right: 0,
  },
});
