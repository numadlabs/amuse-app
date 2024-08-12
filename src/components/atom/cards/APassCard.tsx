import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import Color from "@/constants/Color";
import { width } from "@/lib/utils";
import { TicketStar } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import APassStripes from "../../icons/APassStripes";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { BODY_1_BOLD, BODY_2_BOLD, CAPTION_1_MEDIUM, CAPTION_1_REGULAR, H3, STYLIZED_UPPERCASE_REGULAR } from "@/constants/typography";

// In the APassCard component
interface ApassProp {
  name: string;
  image: string;
  nftImage: string;
  onPress: () => void;
  category: string;
  hasBonus: boolean;
  visitCount: number;
  target: number;
}

const APassCard: React.FC<ApassProp> = ({
  name,
  category,
  image,
  onPress,
  hasBonus,
  visitCount,
  nftImage,
  target,
}) => {
  const pressed = useSharedValue(false);

  const AnimatedText = Animated.createAnimatedComponent(Text);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
          <Animated.View style={[animatedStyles]}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={[styles.aCardContainer]}
            >
              <View style={styles.blurContainer}>
                <View
                  style={{
                    position: "absolute",
                    top: 25,
                    right: -120,
                    transform: [{ rotate: "270deg" }],
                  }}
                >
                  <APassStripes />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    gap: 12,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `${SERVER_SETTING.CDN_LINK}${image}`,
                      }}
                    />
                    <View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.titleText}
                      >
                        {name}
                      </Text>
                      <Text style={[styles.buttonText, { bottom: 5 }]}>
                        {category?.replace(/_/g, " ")}
                      </Text>
                    </View>
                  </View>
                  {hasBonus ? (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Color.Gray.gray400,
                        padding: 8,
                        borderRadius: 12,
                      }}
                    >
                      <TicketStar size={24} color={Color.base.White} />
                    </View>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20,
                    gap: 16,
                    paddingHorizontal: 20,
                  }}
                >
                  <Image
                    style={{
                      minWidth: width / 2.1,
                      aspectRatio: 1,
                      borderRadius: 12,
                    }}
                    source={{
                      uri: `${SERVER_SETTING.CDN_LINK}${nftImage}`,
                    }}
                  />
                  <View
                    style={{
                      borderWidth: 1,
                      backgroundColor: Color.Gray.gray500,
                      borderColor: Color.Gray.gray400,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    {/* <LinearGradient
                      colors={[Color.Brand.main.start, Color.Brand.main.end]}
                      style={{ borderRadius: 0, padding: 1 }}> */}
                    <BlurView>
                      <LinearGradient
                        colors={[Color.Brand.card.start, Color.Brand.card.end]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 2, y: 1 }}
                        style={{
                          borderTopStartRadius: 12,
                          borderTopEndRadius: 12,
                        }}
                      >
                        <View
                          style={{
                            padding: 33,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AnimatedText
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={{
                              ...H3,
                              color: Color.base.White,
                            }}
                          >
                            {visitCount < 10 ? `0${visitCount}` : visitCount}
                          </AnimatedText>
                          <Text
                            style={{
                              ...CAPTION_1_MEDIUM,
                              color: Color.base.White,
                            }}
                          >
                            Check-ins
                          </Text>
                        </View>
                      </LinearGradient>
                    </BlurView>
                    {/* </LinearGradient> */}
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 6,
                        borderTopWidth: 1,
                        borderColor: Color.Gray.gray400,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          gap: 6,
                          paddingVertical: 10,
                        }}
                      >
                        <AnimatedText
                          entering={FadeIn}
                          exiting={FadeOut}
                          style={[
                            {
                              ...BODY_2_BOLD,
                              color: Color.base.White,
                            },
                            animatedStyles,
                          ]}
                        >
                          {target}
                        </AnimatedText>

                        <Text
                          style={{
                            ...CAPTION_1_REGULAR,
                            color: Color.base.White,
                          }}
                        >
                          Until next perk
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default APassCard;

const styles = StyleSheet.create({
  aCardContainer: {
    borderWidth: 1,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    alignItems: "center",
    borderColor: Color.Gray.gray400,
    height: "auto",
  },
  blurContainer: {
    backgroundColor: Color.Gray.gray500,
    columnGap: 20,
    width: "100%",
    flex: 1,
    padding: 20,
    borderRadius: 28,
    overflow: "hidden",
    height:"auto",
  },
  titleText: {
    color: Color.base.White,
    marginBottom: 10,
    ...BODY_1_BOLD,
    width: 210,
  },
  buttonText: {
    color: Color.Gray.gray50,
    ...STYLIZED_UPPERCASE_REGULAR,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
