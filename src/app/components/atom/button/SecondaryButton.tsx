import AnimatedTouchableOpacity from "../../AnimatedTouchableOpacity";
import CRHeading from "../typography/CRHeading";
// import { Box } from 'globalComponents/layouts';
import React from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import Color from "@/app/constants/Color";
// import { Colors, Utils } from "styles";
import { scaleSize } from "@/app/lib/utils";
import { MaterialIndicator } from "react-native-indicators";

// const { scaleSize } = Utils;
const styles = StyleSheet.create({
  button: {
    borderColor: Color.base.Black,
    borderWidth: scaleSize(1),
  },
  leftIcon: {
    position: "absolute",
    left: scaleSize(16),
  },
});

const SecondaryButtonDefaultProps = {
  backgroundColor: Color.base.White,
  labelColor: Color.Gray.gray600,
  label: "",
  customStyle: {},
  // innerStyle: {},
  labelLevel: 4,
  height: scaleSize(48),
  disabled: false,
  isLoading: false,
};

type SecondaryButtonProps = {
  label?: string;
  labelColor?: string;
  customStyle?: ViewStyle;
  // innerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  labelLevel?: number;
  height?: number;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
} & typeof SecondaryButtonDefaultProps;

function SecondaryButton({
  label,
  labelColor,
  backgroundColor,
  leftIcon,
  customStyle,
  // innerStyle,
  onPress,
  height,
  disabled,
  labelLevel,
  isLoading,
}: SecondaryButtonProps): JSX.Element {
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      borderRadius={scaleSize(8)}
      height={height}
      bgColor={backgroundColor}
      shadowColor={Color.Gray.gray300}
      customStyle={{ ...customStyle }}
      // innerStyle={[styles.button, { ...innerStyle }]}
      disabled={disabled}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {!!label && (
        <CRHeading color={labelColor} label={label} level={labelLevel || 4} />
      )}
      {isLoading && (
        <View style={{ position: "absolute", right: scaleSize(24) }}>
          <MaterialIndicator
            size={scaleSize(24)}
            color={Color.base.White}
            trackWidth={2}
          />
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
}

SecondaryButton.defaultProps = SecondaryButtonDefaultProps;

export default React.memo(SecondaryButton);
