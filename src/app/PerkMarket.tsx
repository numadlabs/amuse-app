// PerkMarket.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import Color from "@/constants/Color";
import { useQuery } from "@tanstack/react-query";
import { purchaseablePerkKeys } from "@/lib/service/keysHelper";
import { getPurchaseablePerks } from "@/lib/service/queryHelper";
import useLocationStore from "@/lib/store/userLocation";
import { useLocalSearchParams } from "expo-router";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Close from "@/components/icons/Close";
import { router } from "expo-router";
import PerkCard from "@/components/atom/cards/PerkCard";

const { width } = Dimensions.get('window');
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (width - 48 - ITEM_MARGIN) / 2; // 48 for container padding, ITEM_MARGIN for gap between items

const PerkMarket = () => {
  const { id } = useLocalSearchParams();
  const { currentLocation } = useLocationStore();

  const {
    data: perks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: purchaseablePerkKeys.all,
    queryFn: () => getPurchaseablePerks(id),
    enabled: !! id,
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

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.itemContainer,
      index % 2 === 0 ? { marginRight: ITEM_MARGIN / 2 } : { marginLeft: ITEM_MARGIN / 2 }
    ]}>
      <PerkCard 
        name={item.name} 
        onPress={() => handleNavigation(item.id, item.name, item.price)}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => router.back()}
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
          contentContainerStyle={styles.listContent}
          data={perks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 24,
    marginTop: Platform.OS === "ios" ? -10 : 0,
  },
  listContent: {
    paddingTop: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginBottom: 16,
  },
  closeButtonContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 12,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Color.Gray.gray300,
  },
  closeButton: {
    marginTop: 12,
  },
});

export default PerkMarket;
