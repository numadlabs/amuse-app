import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import Toast from "react-native-toast-message";
import PerkGradient from "./components/icons/PerkGradient";
import PerkGradientSm from "./components/icons/PerkGradientSm";
import Tick from "./components/icons/Tick";

interface VisitCountIndicatorProps {
  visitCount: number;
}

const NotOwnedPerk: React.FC = () => {
  const { visitCount } = useLocalSearchParams();
  const visitCountNumber = visitCount ? parseInt(visitCount.toString(), 10) : 0;
  const targetCount = 3; // Define the target visit count for the next perk

  const showToast = () => {
    setTimeout(() => {
      Toast.show({
        type: "perkToast",
        text1: "Perk consumed",
      });
    }, 800);
  };

  const renderIndicators = () => {
    let indicators = [];
    for (let i = 1; i <= targetCount; i++) {
      if (i <= visitCountNumber % targetCount) {
        indicators.push(
          <View
            key={i}
            style={[styles.indicator, { backgroundColor: Color.System.systemSuccess }]}
          >
            <Tick size={20} color={Color.base.White} />
          </View>
        );
      } else if (i === (visitCountNumber % targetCount) + 1) {
        indicators.push(
          <View
            key={i}
            style={[styles.indicator, { backgroundColor: Color.System.systemSuccess }]}
          >
            <Tick size={20} color={Color.base.White} />
          </View>
        );
      } else {
        indicators.push(
          <View
            key={i}
            style={[styles.indicator, { backgroundColor: Color.Gray.gray500 }]}
          >
           <PerkGradientSm/>
          </View>
        );
      }
    }
    return indicators;
  };

  return (
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1 }}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => router.back()}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center", gap: 64 }}>
          <View style={{ flexDirection: "column", gap: 24, alignItems: "center" }}>
            <View style={styles.perkIconContainer}>
              <PerkGradient />
            </View>
            <View style={{ flexDirection: "column", gap: 12, alignItems: "center" }}>
              <Text style={styles.perkTitle}>Priority seating on Fridays</Text>
              <Text style={styles.perkDescription}>
                Enjoy a free drink on the house, every 5 visits.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {renderIndicators()}
          </View>
          <Text style={styles.checkinText}>
            {targetCount - (visitCountNumber % targetCount)} Check-ins until next perk
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotOwnedPerk;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray300,
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
    marginBottom: 64,
    gap: 64,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  perkIconContainer: {
    padding: 12,
    backgroundColor: Color.Gray.gray400,
    borderRadius: 12,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  perkTitle: {
    color: Color.base.White,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "bold",
  },
  perkDescription: {
    color: Color.Gray.gray100,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentIndicator: {
    padding: 12,
    backgroundColor: Color.Gray.gray400,
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  checkinText: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.Gray.gray100,
  },
});
