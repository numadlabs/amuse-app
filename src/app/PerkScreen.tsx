import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRestaurantId } from "@/lib/service/queryHelper";
import Button from "@/components/ui/Button";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import Animated, { SlideInDown } from "react-native-reanimated";
import { height } from "@/lib/utils";
import PowerUpCard from "@/components/atom/cards/PowerUpCard";
import { LinearGradient } from "expo-linear-gradient";
import Color from "@/constants/Color";
import moment from "moment";
import { BODY_2_REGULAR, H5 } from "@/constants/typography";

const PerkScreen = () => {
  const { restaurantId, powerUp, btcAmount } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  const { data: card = [], isLoading } = useQuery({
    queryKey: [restaurantKeys.detail(restaurantId as string)],
    queryFn: () => {
      return getRestaurantId(restaurantId as string, currentTime, currentDayOfWeek);
    },
    enabled: !!restaurantId,
  });

  const handleNavigation = async () => {
    router.back();
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    queryClient.invalidateQueries({ queryKey: userKeys.cards });
    queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
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

      {!isLoading && (
        <>
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
                padding: 16,
              }}
            >
              <Text
                style={{
                  ...BODY_2_REGULAR,
                  color: Color.Gray.gray50,
                  textAlign: 'center',
                }}
              >
                Check-in successful.
              </Text>
              {Number(btcAmount) === 0 ? (
                <Text
                  style={{
                    ...H5,
                    color: Color.base.White,
                    textAlign: 'center',
                  }}
                >
                  No bitcoin awarded, contact our Help desk if necessary
                </Text>
              ) : (
                <Text
                  style={{
                    ...H5,
                    color: Color.base.White,
                    textAlign: 'center',
                  }}
                >
                  +{Number(btcAmount).toFixed(2)} EUR of Bitcoin
                </Text>
              )}
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
            ) : null}
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