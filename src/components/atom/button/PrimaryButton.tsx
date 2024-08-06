import AnimatedTouchableOpacity from "../../AnimatedTouchableOpacity";
import CRHeading from "../typography/CRHeading";
// import { Box } from "layouts";
import React from "react";
import { ViewStyle, View } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
// import { Utils } from "styles";
import Color from "../../../constants/Color";
import { scaleSize } from "../../../lib/utils";

// const { scaleSize } = Utils;

const PrimaryButtonDefaultProps = {
  disabled: false,
  onPress: () => {},
  bgColor: Color.base.Black,
  shadowColor: Color.Gray.gray100,
  labelColor: Color.base.White,
  height: scaleSize(48),
  labelLevel: 4,
  customStyle: {},
  isLoading: false,
};

type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  bgColor?: string;
  shadowColor?: string;
  height?: number;
  labelColor?: string;
  labelLevel?: number;
  customStyle?: ViewStyle;
  isLoading?: boolean;
} & typeof PrimaryButtonDefaultProps;

function PrimaryButton({
  label,
  disabled,
  onPress,
  height,
  bgColor,
  shadowColor,
  labelColor,
  labelLevel,
  customStyle,
  isLoading,
}: PrimaryButtonProps): JSX.Element {
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      borderRadius={scaleSize(8)}
      customStyle={customStyle}
      height={height}
      bgColor={bgColor}
      shadowColor={shadowColor}
      disabled={disabled}
    >
      <CRHeading label={label} level={labelLevel || 4} color={labelColor} />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            right: scaleSize(labelLevel == 5 ? 6 : 24),
          }}
        >
          <MaterialIndicator
            size={scaleSize(labelLevel == 5 ? 12 : 24)}
            color={Color.base.White}
            trackWidth={2}
          />
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
}

PrimaryButton.defaultProps = PrimaryButtonDefaultProps;

export default PrimaryButton;
