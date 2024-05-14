import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Color from "@/app/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import PerkGradient from "../../icons/PerkGradient";
import { router } from "expo-router";
import PowerUpCard from "../../atom/cards/PowerUpCard";
import { ActivityIndicator } from "react-native";
import DetailsSheet from "../DetailsSheet";
import { Add, InfoCircle, TicketStar } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetRefProps } from "../../modals/PerkBottomSheet";
import BottomSheet from "../../ui/BottomSheet";
import Animated from "react-native-reanimated";
import { RestaurantType } from "@/app/lib/types";
import Button from "../../ui/Button";




interface ownedProps {
  id: string | string[];
  cardId: string;
  perks: any[];
  benefits: string;
  visitCount: number;
  location: string;
  instruction: string;
  latitude: string;
  descriptions: string;
  longitude: string;
  followingPerk: string;
  isLoading: boolean;
  onPress: () => void;
  marker: RestaurantType
}

const Owned: React.FC<ownedProps> = ({ perks, id, isLoading, visitCount, onPress, descriptions, followingPerk, benefits, location, instruction, longitude, latitude, marker }) => {
  const [showPerks, setShowPerks] = useState(true);
  console.log(id)

  const handleNavigation = () => {
    router.push({
      pathname: '/PerkMarket',
      params: {
        id: id,
      }
    })
  }

  const backgroundColor = showPerks ? Color.Gray.gray300 : Color.Gray.gray400;

  const toggleView = (view) => {
    setShowPerks(view);
  };

  return (
    <GestureHandlerRootView style={styles.attrContainer}>
      <View>
        <Animated.View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showPerks && styles.activeButton,
            ]}
            onPress={() => toggleView(true)}
          >
            <Text
              style={[styles.buttonText, !showPerks && styles.activeText]}
            >
              Perks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showPerks && styles.activeButton,
            ]}
            onPress={() => toggleView(false)}
          >
            <Text
              style={[styles.buttonText, showPerks && styles.activeText]}
            >
              Details
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
              <>
                {perks.map((item, index) => (
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
                ))}
                <TouchableOpacity
                  style={styles.container} onPress={() => router.navigate('/NotOwnedPerk')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TicketStar size={28} color={Color.base.White} />
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: Color.base.White, }}>{followingPerk}</Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 18,
                        color: Color.base.White,
                        fontWeight: '600',
                      }}
                    >
                      {3 - (visitCount % 3)}/3
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <Button onPress={handleNavigation} textStyle='primary' variant='disabled' size="large">
                  <Add color={Color.base.White} size={24} />
                  <Text>Add Perk</Text>
                </Button>
              </>

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
                    You don't have any perks yet. Check-in to unlock new perks.
                  </Text>
                </View>
              </LinearGradient>
            )}
          </View>
        ) : (
          <View
            style={{ flex: 1, flexGrow: 1, marginBottom: 450, paddingHorizontal: 8 }}
          >
            <DetailsSheet
              benefits={benefits}
              locations={location}
              description={descriptions}
              memberships={"membership"}
              latitude={latitude}
              longitude={longitude}
              about={"about"}
              instruction={instruction}
              artistInfo={"artistInfo"}
              marker={marker}
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
  toggleButton: {
    paddingVertical: 12,
    alignItems: "center",
    width: "48%",
  },
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 23,
    paddingRight: 30,
    paddingLeft: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Color.Gray.gray500,
    paddingVertical: 4,
    borderRadius: 48,
  },
  activeText: {
    color: Color.base.White,
  },
  activeButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "bold",
    color: Color.base.White,
  },
  powerUpGrid: {
    gap: 15,
  },
});

export default Owned;