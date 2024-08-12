import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import TierStar from "@/app/components/icons/TierStar";
import Tick from "../../icons/Tick";
import Animated from "react-native-reanimated";
import ProgressBar from "../../sections/ProgressBar";
import { BODY_2_REGULAR, CAPTION_1_MEDIUM, H6 } from "@/constants/typography";

interface TierCardProps {
  isActive: boolean;
  title: string;
  perks: string[]; // Perks as an array of strings
  target: number;
  current: number;
}

const TierCard: React.FC<TierCardProps> = ({
  isActive,
  title,
  target,
  current,
  perks,
}) => {
  const progress = current / target;

  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <TierStar variant={isActive ? "Active" : "Inactive"} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {perks.map((perk, index) => (
        <View key={index} style={styles.perkContainer}>
          <Tick
            size={18}
            color={isActive ? Color.base.White : Color.Gray.gray100}
          />
          <Text
            style={[
              styles.perkText,
              { color: isActive ? Color.base.White : Color.Gray.gray100 },
            ]}
          >
            {perk}
          </Text>
        </View>
      ))}

      <Animated.View style={styles.progressContainer}>
        <ProgressBar
          isActive={isActive}
          progress={progress}
          width={"100%"}
          height={8}
        />
        <Text style={styles.progressText}>
          {current}/{target}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: Color.Gray.gray300,
  },
  header: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    ...H6,
    color: Color.base.White,
  },
  perkContainer: {
    flexDirection: "row",
    gap: 12,
  },
  perkText: {
    ...BODY_2_REGULAR,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: Color.base.White,
    ...CAPTION_1_MEDIUM,
    textAlign: "right",
  },
});

export default TierCard;
