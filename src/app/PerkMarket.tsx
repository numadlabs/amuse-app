import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import Color from "@/constants/Color";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseablePerkKeys } from "@/lib/service/keysHelper";
import { getPurchaseablePerks } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Close from "@/components/icons/Close";
import { router } from "expo-router";
import PerkGradientSm from "@/components/icons/PerkGradientSm";
import { SafeAreaView } from "react-native-safe-area-context";
import { width } from "@/lib/utils";
import { BUTTON_32, CAPTION_1_MEDIUM } from "@/constants/typography";

const PerkMarket = () => {
  const { id } = useLocalSearchParams();
  const { currentLocation } = useLocationStore();

  const {
    data: perks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: purchaseablePerkKeys.all,
    queryFn: () => {
      return getPurchaseablePerks(id);
    },
    enabled: !!currentLocation,
  });

  const handleNavigation = (perkId, perkName, perkPrice) => {
    router.push({
      pathname: "/PerkBuy",
      params: {
        name: perkName,
        id: perkId,
        price: perkPrice,
        restaurantId: id,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => {
              router.back();
            }}
          >
            <Close />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : isError ? (
          <Text>Error fetching data</Text>
        ) : (
          <FlatList
            style={{ width: "100%", marginTop: 20 }}
            data={perks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <LinearGradient
                colors={[Color.Brand.card.start, Color.Brand.card.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.content}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                  }}
                  onPress={() =>
                    handleNavigation(item.id, item.name, item.price)
                  }
                >
                  <View
                    style={{
                      borderRadius: 8,
                      backgroundColor: Color.Gray.gray400,
                      height: 40,
                      width: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PerkGradientSm />
                  </View>
                  <Text style={styles.perkName}>{item.name}</Text>
                  <View
                    style={{
                      backgroundColor: Color.Gray.gray400,
                      borderRadius: 48,
                      paddingVertical: 8,
                      width: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.perkPrice}>{`Redeem`}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            )}
            numColumns={2}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: Platform.OS === "ios" ? -10 : 0,
  },
  content: {
    width: width / 2.4,
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 24,
    gap: 12,
    margin: 8,
  },
  perkName: {
    ...CAPTION_1_MEDIUM,
    fontWeight: "bold",
    textAlign: "center",
    color: Color.Gray.gray50,
  },
  perkPrice: {
    color: Color.base.White,
    ...BUTTON_32,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
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
});
export default PerkMarket;
