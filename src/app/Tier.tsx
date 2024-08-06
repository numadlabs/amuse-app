import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import Header from "@/components/layout/Header";
import TierCard from "@/components/atom/cards/TierCard";
import Color from "@/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import {
  getUserById,
  getUserTaps,
  getUserTiers,
} from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";

const Tier = () => {
  const { authState } = useAuth();

  const { data: userTier = [], isLoading: isUserTierLoading } = useQuery({
    queryKey: userKeys.tier,
    queryFn: getUserTiers,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
    enabled: !!authState.userId,
  });

  const { data: taps = [] } = useQuery({
    queryKey: userKeys.taps,
    queryFn: () => {
      return getUserTaps();
    },
  });

  // Define the order of tiers
  const tierOrder = ["Bronze", "Silver", "Gold", "Platinum"];

  // Sort userTier array to follow the predefined order
  const orderedUserTier = [...userTier].sort((a, b) => {
    return tierOrder.indexOf(a.name) - tierOrder.indexOf(b.name);
  });

  // Find the active tier and move it to the top
  const activeTierIndex = orderedUserTier.findIndex(
    (tier) => tier.id === user?.user.userTierId
  );
  if (activeTierIndex > -1) {
    const [activeTier] = orderedUserTier.splice(activeTierIndex, 1);
    orderedUserTier.unshift(activeTier);
  }

  if (isUserTierLoading || isUserLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Color.Gray.gray600,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
        <Header title="Tier" />
        <View
          style={{
            padding: 16,
            gap: 16,
            flex: 1,
            backgroundColor: Color.Gray.gray600,
          }}
        >
          <FlatList
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            data={orderedUserTier}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <TierCard
                isActive={user?.user.userTierId === item.id}
                title={item?.name}
                perks={[
                  `${item?.rewardMultiplier}X more Bitcoin for every check-in`,
                ]}
                current={
                  taps?.data?.taps.length === 0 ? "0" : taps?.data?.taps.length
                }
                target={item.requiredNo}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Tier;
