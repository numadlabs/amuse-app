import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Color from "../constants/Color";
// import { Colors, Utils } from 'styles';
import { scaleSize } from "../lib/utils";
// const { scaleSize } = Utils;

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: scaleSize(28),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  innerContainer: {
    position: "absolute",
    backgroundColor: Color.System.systemSuccess,
    zIndex: 999,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleSize(28),
  },
  shadow: {
    position: "absolute",
    width: "99.6%",
    height: "100%",
    backgroundColor: Color.System.systemSuccess,
    borderRadius: scaleSize(28),
    zIndex: -1,
  },
});

const AnimatedTouchableOpacityDefaultProps = {
  disabled: false,
  onPress: () => {},
  bgColor: Color.base.Black,
  shadowColor: Color.Gray.gray200,
  labelColor: Color.base.White,
  height: scaleSize(56),
  width: "100%",
  customStyle: {},
  innerStyle: {},
  hasShadow: true,
};

type AnimatedTouchableOpacityProps = {
  disabled?: boolean;
  onPress?: () => void;
  bgColor?: string;
  shadowColor?: string;
  height?: number;
  width?: any;
  hasShadow?: boolean;
  borderRadius?: number;
  customStyle?: ViewStyle;
  innerStyle?: ViewStyle;
  children: React.ReactNode;
} & typeof AnimatedTouchableOpacityDefaultProps;

function AnimatedTouchableOpacity({
  disabled,
  onPress,
  height,
  width,
  bgColor,
  shadowColor,
  customStyle,
  innerStyle,
  borderRadius,
  hasShadow,
  children,
}: AnimatedTouchableOpacityProps): JSX.Element {
  const offset = useSharedValue(0);
  const customSpringStyles = useAnimatedStyle(() => {
    const translate = interpolate(offset.value, [0, 0.5], [0, 3]);
    return { transform: [{ translateY: translate }] };
  });

  const shadowStyles = useAnimatedStyle(() => {
    const bottomTranslate = interpolate(offset.value, [1, 0, 1], [0, -3, 0]);
    return { bottom: bottomTranslate };
  });
  return (
    <Animated.View
      style={[
        styles.buttonStyle,
        customSpringStyles,
        { width },
        { height },
        { borderRadius },
        customStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          offset.value = withRepeat(withTiming(1), 2, true);
          setTimeout(() => {
            onPress();
          }, 200);
        }}
        disabled={disabled}
        style={[
          styles.innerContainer,
          { borderRadius },
          { backgroundColor: bgColor },
          innerStyle,
        ]}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
      {hasShadow && (
        <Animated.View
          style={[
            styles.shadow,
            shadowStyles,
            { borderRadius },
            { backgroundColor: shadowColor },
          ]}
        />
      )}
    </Animated.View>
  );
}

AnimatedTouchableOpacity.defaultProps = AnimatedTouchableOpacityDefaultProps;

export default AnimatedTouchableOpacity;
