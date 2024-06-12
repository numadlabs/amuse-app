import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Color from "./constants/Color";
import Close from "./components/icons/Close";
import { router, useLocalSearchParams } from "expo-router";
import PerkGradient from "./components/icons/PerkGradient";
import Button from "./components/ui/Button";
import { purchasePerk } from "./lib/service/mutationHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./context/AuthContext";
import { restaurantKeys, userKeys } from "./lib/service/keysHelper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const PerkBuy = () => {
  const { name, id, price, restaurantId } = useLocalSearchParams();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const { authState } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: purchasePerkMutation } = useMutation({
    mutationFn: purchasePerk,
    // onError: (error) => {
    //   // console.log(error);
    // },
    // onSuccess: (data, variables) => {
    //   console.log("🚀 ~ PerkBuy ~ data:", data.data.data);

    // },
  });
  const AnimatedText = Animated.createAnimatedComponent(Text);
  const handleGetAPerk = async (id: string) => {
    console.log("🚀 ~ Purchase perk ~ aCardId:", id);
    setIsClaimLoading(true);
    setBalance("");
    if (authState.userId) {
      try {
        const data = await purchasePerkMutation({
          bonusId: id,
          restaurantId: restaurantId as string,
        });
        if (data.data.success) {
          console.log("🚀 ~ Purchase successful", data.data.data);
          queryClient.invalidateQueries({ queryKey: userKeys.cards });
          queryClient.invalidateQueries({ queryKey: userKeys.info });
          queryClient.invalidateQueries({queryKey: restaurantKeys.all,});
          setIsClaimLoading(false);
          router.back();
        } else if (data.data.success === false) {
          console.log("🚀 ~ Purchase failed");
          setIsClaimLoading(false);
        }
      } catch (error) {
        setBalance("Insufficient Bitcoin balance");
        setIsClaimLoading(false);
        console.log(error);
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: Color.Gray.gray600,
        flex: 1,
        paddingHorizontal: 16,
      }}
      key={id as string}
    >
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
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          gap: 24,
        }}
      >
        <View
          style={{
            padding: 12,
            backgroundColor: Color.Gray.gray400,
            borderRadius: 12,
            width: 56,
            height: 56,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PerkGradient />
        </View>
        <View
          style={{ flexDirection: "column", gap: 12, justifyContent: "center" }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Color.base.White,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              color: Color.Gray.gray100,
              fontSize: 14,
              lineHeight: 18,
              textAlign: "center",
            }}
          >
            Redeem with Bitcoin and use it {"\n"} on your next visit
          </Text>
          {balance && (
            <AnimatedText
              entering={FadeIn}
              exiting={FadeOut}
              style={{ color: Color.System.systemError, textAlign: "center" }}
            >
              {balance}
            </AnimatedText>
          )}
        </View>
      </View>
      <Button
        variant={isClaimLoading ? "disabled" : "primary"}
        size="large"
        onPress={isClaimLoading ? null : () => handleGetAPerk(id as string)}
      >
        {isClaimLoading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: Color.base.White }}
          >{`Redeem for ${price} Bitcoin`}</Text>
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PerkBuy;
