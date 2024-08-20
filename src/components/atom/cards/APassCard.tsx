import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import Color from "@/constants/Color";
import { width } from "@/lib/utils";
import { TicketStar } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import APassStripes from "../../icons/APassStripes";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { BODY_1_BOLD, BODY_2_BOLD, CAPTION_1_MEDIUM, CAPTION_1_REGULAR, H3, STYLIZED_UPPERCASE_REGULAR } from "@/constants/typography";

interface ApassProp {
  name: string;
  image: string;
  nftImage: string;
  onPress: () => void;
  category: string;
  hasBonus: boolean;
  visitCount: number | undefined;
  target: number | undefined;
  isLoading: boolean;
}


const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SkeletonLoader: React.FC = () => {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={styles.skeletonContainer}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
        />
      </Animated.View>
      <Animated.View style={styles.skeletonHeader}>
        <Animated.View style={styles.skeletonLogo} />
        <Animated.View>
          <Animated.View style={styles.skeletonTitle} />
          <Animated.View style={styles.skeletonSubtitle} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.skeletonContent}>
        <Animated.View style={styles.skeletonImage} />
        <Animated.View style={styles.skeletonStats}/>
      </Animated.View>
    </Animated.View>
  );
};





const APassCard: React.FC<ApassProp> = ({
  name,
  category,
  image,
  onPress,
  hasBonus,
  visitCount,
  nftImage,
  target,
  isLoading = false,
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

  if (isLoading) {
    return <SkeletonLoader />;
  }

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
                  
                    {hasBonus && (
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
                    )}
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
    height: "auto",
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
  skeletonContainer: {
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    padding: 20,
    height: 'auto',
    overflow: 'hidden',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Color.Gray.gray400,
    marginRight: 12,
  },
  skeletonTitle: {
    width: 150,
    height: 20,
    backgroundColor: Color.Gray.gray400,
    marginBottom: 5,
  },
  skeletonSubtitle: {
    width: 100,
    height: 16,
    backgroundColor: Color.Gray.gray400,
  },
  skeletonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonImage: {
    width: width / 2.1,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Color.Gray.gray400,
  },
  skeletonStats: {
    width: "38%",
    borderRadius: 12,
    backgroundColor: Color.Gray.gray400,
  },
});

export default APassCard;