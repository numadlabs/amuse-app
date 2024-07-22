import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import Toast from "react-native-toast-message";
import PerkGradient from "./components/icons/PerkGradient";
import Tick from "./components/icons/Tick";
import { SafeAreaView } from "react-native-safe-area-context";

interface FollowingPerkParams {
  visitCount: number;
}
type ParamType = {
  name: string
  current: string;
  target: string;
}

const NotOwnedPerk: React.FC<FollowingPerkParams> = () => {
  const { current, target, name } = useLocalSearchParams<ParamType>();
  const visitCountNumber = current ? parseInt(current.toString(), 10) : 0;
  const targetCount = parseInt(target); // Define the target visit count for the next perk

  const showToast = () => {
    setTimeout(() => {
      Toast.show({
        type: "perkToast",
        text1: "Perk consumed",
      });
    }, 800);
  };

  const renderIndicators = () => {
    const indicators = [];
    if (visitCountNumber === 0) {
      for (let i = 1; i <= targetCount; i++) {
        indicators.push(
          <View
            key={i}
            style={[
              styles.indicator,
              { backgroundColor: Color.Gray.gray500 },
            ]}
          >
            <Tick size={20} color={Color.base.White} />
          </View>
        );
      }
    } else {
      for (let i = 1; i <= targetCount; i++) {
        const isCompleted = i <= visitCountNumber % targetCount;
        indicators.push(
          <View
            key={i}
            style={[
              styles.indicator,
              {
                backgroundColor: isCompleted
                  ? Color.System.systemSuccess
                  : Color.Gray.gray500,
              },
            ]}
          >
            <Tick size={20} color={Color.base.White} />
          </View>
        );
      }
    }
    return indicators;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ backgroundColor: Color.Gray.gray600, flex: 1, marginTop: Platform.OS === 'ios' ? -10 : 0  }}>
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
              <Text style={styles.perkTitle}>{name}</Text>
              <Text style={styles.perkDescription}>
                Enjoy a free perk on the house, every {targetCount} visits.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {renderIndicators()}
          </View>
          <Text style={styles.checkinText}>
            {target} Check-ins until next perk
          </Text>
        </View>
      </View>
    </View>
    </SafeAreaView>
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
  checkinText: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.Gray.gray100,
  },
});
