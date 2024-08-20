import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRestaurantById } from "@/lib/service/queryHelper";
import Button from "@/components/ui/Button";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import Animated, { SlideInDown } from "react-native-reanimated";
import { height } from "@/lib/utils";
import PowerUpCard from "@/components/atom/cards/PowerUpCard";
import { LinearGradient } from "expo-linear-gradient";
import Color from "@/constants/Color";
import moment from "moment";
import APassCard from "@/components/atom/cards/APassCard";
import { BODY_2_REGULAR, H5 } from "@/constants/typography";
const PerkScreen = () => {
  const { restaurantId, powerUp, btcAmount } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const currentTime = moment().format("HH:mm:ss");

  const { data: card = [], isLoading } = useQuery({
    queryKey: [restaurantKeys.detail],
    queryFn: () => {
      return getRestaurantById(restaurantId as string, currentTime);
    },
    enabled:!!restaurantId,
  });

  const handleNavigation = async () => {
    router.back();
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    queryClient.invalidateQueries({ queryKey: userKeys.cards });
    queryClient.invalidateQueries({ queryKey: userKeys.notifications });
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20)}
      style={styles.container}
    >
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      )}

      {!isLoading && card && (
        <>
          {/* <View style={{ marginBottom: 300, marginTop: 20 }}>
            <APassCard
              name={card.name}
              image={card.logo}
              nftImage={card.nftImageUrl}
              onPress={() => ""}
              category={card.category}
              hasBonus={card.hasBonus}
              visitCount={card.visitCount}
              target={card.target}
            />
          </View> */}
          <Animated.View
            style={{ marginBottom: 80, gap: 16 }}
            entering={SlideInDown.springify().damping(20).delay(200)}
          >
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                justifyContent: "center",
                height: height / 6.5,
                gap: 12,
                alignContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: Color.Gray.gray400,
              }}
            >
              <Text
                style={{
                  ...H5,
                  color: Color.base.White,
                }}
              >
                +{Number(btcAmount).toFixed(2)} EUR of Bitcoin
              </Text>
              <Text
                style={{
                  ...BODY_2_REGULAR,
                  color: Color.Gray.gray50,
                }}
              >
                Check-in successful.
              </Text>
            </LinearGradient>
            {powerUp ? (
              <Animated.View
                entering={SlideInDown.springify().damping(20).delay(250)}
                style={{ height: height / 8 }}
              >
                <PowerUpCard
                  title={powerUp as string}
                  onPress={() => router.navigate("/PowerUp")}
                />
              </Animated.View>
            ) : (
              ""
            )}
          </Animated.View>
          <Button
            variant="primary"
            size="default"
            textStyle="primary"
            onPress={handleNavigation}
            style={{
              bottom: 20,
              width: "100%",
              position: "absolute",
              marginHorizontal: "5%",
            }}
          >
            <Text>Confirm</Text>
          </Button>
        </>
      )}
    </Animated.View>
  );
};

export default PerkScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
    flex: 1,
    gap: 16,
  },
  cardContainer: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 30,
  },
});
