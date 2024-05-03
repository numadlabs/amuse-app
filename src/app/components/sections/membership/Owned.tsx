import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Color from "@/app/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import PerkGradient from "../../icons/PerkGradient";
import { router } from "expo-router";
import PowerUpCard from "../../atom/cards/PowerUpCard";
import { ActivityIndicator } from "react-native";
import DetailsSheet from "../DetailsSheet";
import { InfoCircle } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetRefProps } from "../../modals/PerkBottomSheet";
import BottomSheet from "../../ui/BottomSheet";

interface ownedProps {
  cardId: string;
  perks: any;
  isLoading: boolean;
}

const Owned: React.FC<ownedProps> = ({ perks, isLoading }) => {
  const [showPerks, setShowPerks] = useState(true);
  const ref = useRef<BottomSheetRefProps>(null);

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);
  const backgroundColor = showPerks ? Color.Gray.gray300 : Color.Gray.gray400;

  const toggleView = (view) => {
    setShowPerks(view);
  };

  return (
    <GestureHandlerRootView style={styles.attrContainer}>
      <View
        style={{
          backgroundColor: Color.Gray.gray400,
          justifyContent: "space-between",
          borderRadius: 48,
          height: 48,
          width: "100%",
          flexDirection: "row",
          padding: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleView(true)}
          style={{
            backgroundColor: backgroundColor,
            alignItems: "center",
            borderRadius: 48,
            justifyContent: "center",
            width: "50%",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: Color.base.White,
              fontWeight: "bold",
            }}
          >
            Perks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleView(false)}>
          <View
            style={{
              backgroundColor: showPerks
                ? Color.Gray.gray400
                : Color.Gray.gray300,
              flex: 1,
              flexGrow: 1,
              alignItems: "center",
              paddingHorizontal: 60,
              justifyContent: "center",
              borderRadius: 48,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: Color.base.White,
                fontWeight: "bold",
              }}
            >
              Details
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, flexGrow: 1, marginTop: 24 }}>
        {isLoading ? (
          <ActivityIndicator color={Color.Gray.gray600} />
        ) : showPerks ? (
          <View style={styles.powerUpGrid}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  lineHeight: 20,
                  color: Color.base.White,
                }}
              >
                Perks
              </Text>
              <TouchableOpacity onPress={onPress}>
                <InfoCircle size={20} color={Color.Gray.gray50} />
              </TouchableOpacity>
            </View>
            {perks && perks.length > 0 ? (
              perks.map((item, index) => (
                <PowerUpCard
                  key={index}
                  title={item.name}
                  onPress={() =>
                    router.push({
                      pathname: `/PowerUp`,
                      params: {
                        name: item.name,
                        id: item.id,
                      },
                    })
                  }
                />
              ))
            ) : (
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                style={{ borderRadius: 16 }}
              >
                <View
                  style={{
                    gap: 16,
                    padding: 24,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: Color.Gray.gray400,
                    alignItems: "center",
                    paddingVertical: 32,
                    paddingHorizontal: 24,
                  }}
                >
                  <View
                    style={{
                      padding: 12,
                      backgroundColor: Color.Gray.gray400,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 52,
                      borderRadius: 12,
                    }}
                  >
                    <PerkGradient />
                  </View>

                  <Text
                    style={{
                      textAlign: "center",
                      lineHeight: 16,
                      fontSize: 12,
                      fontWeight: "400",
                      color: Color.Gray.gray50,
                    }}
                  >
                    You haven’t got any perks yet.{"\n"} Every 10th check-in,
                    you will receive perks.
                  </Text>
                </View>
              </LinearGradient>
            )}
          </View>
        ) : (
          <View
            style={{ flex: 1, flexGrow: 1, marginBottom: 150, padding: 8 }}
          >
            <DetailsSheet
              benefits={"benefits"}
              locations={"location"}
              memberships={"membership"}
              about={"about"}
              instruction={"instruction"}
              artistInfo={"artistInfo"}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  attrContainer: {
    flex: 1,
    marginTop: 32,
    marginBottom: 40,
  },
  powerUpGrid: {
    gap: 15,
  },
});

export default Owned;