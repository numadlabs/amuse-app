import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Color from "@/app/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import PerkGradient from "../../icons/PerkGradient";
import { router } from "expo-router";
import PowerUpCard from "../../atom/cards/PowerUpCard";
import DetailsSheet from "../DetailsSheet";
import { Add, InfoCircle, TicketStar } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInDown } from "react-native-reanimated";
import { RestaurantType } from "@/app/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getPerksByRestaurant, getUserPowerUps } from "@/app/lib/service/queryHelper";
import { restaurantKeys, userKeys } from "@/app/lib/service/keysHelper";
import useLocationStore from "@/app/lib/store/userLocation";

interface OwnedProps {
  // userCardId: string;
  data: RestaurantType;
  cardId: string;
  // perks: any[];
  // followingPerk: string;
  isLoading: boolean;
  onPress: () => void;
  marker: RestaurantType;
}

const Owned: React.FC<OwnedProps> = ({ data, isLoading, onPress, marker }) => {
  const [showPerks, setShowPerks] = useState(true);
  const currentLocation = useLocationStore()

  const { data: perks = [] } = useQuery({
    queryKey: restaurantKeys.perks(data?.id as string),
    queryFn: () => getPerksByRestaurant(data.id),
    enabled: !!currentLocation,
  });

  const handleNavigation = () => {
    router.push({
      pathname: '/PerkMarket',
      params: {
        id: data.id,
      }
    });
  };

  const notOwnedNavigation = () => {
    router.push({
      pathname: '/NotOwnedPerk',
      params: { visitCount: data.visitCount }
    });
  };

  const toggleView = (view: boolean) => {
    setShowPerks(view);
  };

  const renderPerks = () => (
    <View style={styles.powerUpGrid}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perks</Text>
        <TouchableOpacity onPress={onPress}>
          <InfoCircle size={20} color={Color.Gray.gray50} />
        </TouchableOpacity>
      </View>
      {perks && perks?.userBonuses?.length > 0 ? (
        <>
          {perks?.userBonuses?.map((item, index) => (
            <PowerUpCard
              key={index}
              title={item.name}
              onPress={() => router.push({ pathname: `/PowerUp`, params: { name: item.name, id: item.id, restaurantId: data?.id } })}
            />
          ))}
          <TouchableOpacity style={styles.container} onPress={notOwnedNavigation}>
            <View style={styles.perkDetails}>
              <TicketStar size={28} color={Color.base.White} />
              <Text style={styles.perkText}>{perks?.followingBonus.name}</Text>
            </View>
            <View>
              <Text style={styles.perkCount}>{(data.visitCount % 3) + 1}/3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigation}>
            <View style={styles.addPerkButton}>
              <Add color={Color.base.White} size={24} />
              <Text style={styles.addPerkText}>Add Perk</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <Animated.View entering={SlideInDown.springify().damping(20).delay(200)}>
          <LinearGradient colors={[Color.Brand.card.start, Color.Brand.card.end]} style={styles.gradientContainer}>
            <View style={styles.noPerksContainer}>
              <View style={styles.noPerksIcon}>
                <PerkGradient />
              </View>
              <Text style={styles.noPerksText}>You don't have any perks yet. Check-in to unlock new perks.</Text>
            </View>
          </LinearGradient>
          <TouchableOpacity onPress={handleNavigation}>
            <View style={styles.addPerkButton}>
              <Add color={Color.base.White} size={24} />
              <Text style={styles.addPerkText}>Add Perk</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <DetailsSheet data={data} />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.attrContainer}>
      <View>
        <Animated.View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.toggleButton, showPerks && styles.activeButton]} onPress={() => toggleView(true)}>
            <Text style={[styles.buttonText, !showPerks && styles.activeText]}>Perks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton, !showPerks && styles.activeButton]} onPress={() => toggleView(false)}>
            <Text style={[styles.buttonText, showPerks && styles.activeText]}>Details</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator color={Color.Gray.gray600} />
        ) : showPerks ? renderPerks() : renderDetails()}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Color.Gray.gray500,
    paddingVertical: 4,
    borderRadius: 48,
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: "center",
    width: "48%",
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
  activeText: {
    color: Color.base.White,
  },
  contentContainer: {
    flex: 1,
    flexGrow: 1,
    marginTop: 24,
  },
  powerUpGrid: {
    gap: 15,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 20,
    color: Color.base.White,
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
  perkDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  perkText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Color.base.White,
  },
  perkCount: {
    fontSize: 14,
    lineHeight: 18,
    color: Color.base.White,
    fontWeight: '600',
  },
  addPerkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    marginTop:20,
    backgroundColor: Color.Gray.gray400,
    height: 48,
    borderRadius: 48,
  },
  addPerkText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    color: Color.base.White,
  },
  gradientContainer: {
    borderRadius: 16,
  },
  noPerksContainer: {
    gap: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  noPerksIcon: {
    padding: 12,
    backgroundColor: Color.Gray.gray400,
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    borderRadius: 12,
  },
  noPerksText: {
    textAlign: "center",
    lineHeight: 16,
    fontSize: 12,
    fontWeight: "400",
    color: Color.Gray.gray50,
  },
  detailsContainer: {
    flex: 1,
    flexGrow: 1,
    marginBottom: 450,
    paddingHorizontal: 8,
  },
});

export default Owned;
