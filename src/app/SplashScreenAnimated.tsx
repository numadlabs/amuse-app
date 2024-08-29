import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Color from "@/constants/Color";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { height, width } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AmuseBoucheLogo from "@/components/icons/A";

const BALL_SIZE = 120;
const ANIMATION_DURATION = 1800;

const SplashScreenAnimated: React.FC = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = withRepeat(
      withSequence(
        withTiming(-width / 8, { duration: 0 }),
        withTiming(width / 2.8, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    const translateY = withRepeat(
      withSequence(
        withTiming(height / 32, { duration: 0 }),
        withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(height / 4.3, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    return {
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Animated.View style={[styles.animatedView, animatedStyle]}>
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={[Color.Brand.main.start, Color.Brand.main.end]}
            style={styles.gradientBall}
          />
        </Animated.View>
        <BlurView
          intensity={Platform.OS === "ios" ? 70 : 24}
          experimentalBlurMethod="dimezisBlurView"
          style={styles.blurView}
        >
          <AmuseBoucheLogo />
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.Gray.gray600,
  },
  animationContainer: {
    width: width / 4,
    height: height / 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 32,
    backgroundColor: Color.Gray.gray500,
  },
  animatedView: {
    position: "absolute",
  },
  gradientBall: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "rgba(27, 35, 40, 0.1)" : "rgba(27, 35, 40, 0.1)",
  },
});

export default SplashScreenAnimated;