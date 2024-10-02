import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import { EmojiSad } from "iconsax-react-native";
import {
  BODY_2_REGULAR,
  BUTTON_32,
  BUTTON_48,
  H6,
} from "@/constants/typography";
import Button from "@/components/ui/Button";
import { router, useLocalSearchParams } from "expo-router";

const AlreadyCheckedIn = () => {
  const { tappedAt } = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tappedTime = new Date(tappedAt);
      const timeDiff = 24 * 60 * 60 * 1000 - (now - tappedTime);

      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (60 * 60 * 1000));
        const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
        setTimeLeft({ hours, minutes });
      } else {
        setTimeLeft({ hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [tappedAt]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 32,
            borderWidth: 1,
            borderColor: Color.Gray.gray400,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              paddingVertical: 24,
            }}
          >
            <EmojiSad size={72} color={Color.System.systemError} />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  ...H6,
                  color: Color.base.White,
                }}
              >
                Oops!
              </Text>
              <Text
                style={{
                  ...BODY_2_REGULAR,
                  color: Color.Gray.gray100,
                  textAlign: "center",
                }}
              >
                You have already checked in this restaurant {"\n"} within the
                last 24 hours.
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              color: Color.Gray.gray100,
              ...BODY_2_REGULAR,
            }}
          >
            Please try again in {timeLeft.hours} hours {timeLeft.minutes}{" "}
            minutes.
          </Text>
        </View>
      </View>
      <View style={{ width: "100%", paddingHorizontal: 16, paddingBottom: 16 }}>
        <Button variant="disabled" onPress={() => router.back()}>
          <Text style={{ color: Color.base.White, ...BUTTON_48 }}>Got it!</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AlreadyCheckedIn;
