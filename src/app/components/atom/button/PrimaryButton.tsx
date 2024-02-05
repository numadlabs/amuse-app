import AnimatedTouchableOpacity from 'globalComponents/AnimatedTouchableOpacity';
import { CRHeading } from 'globalComponents/atoms';
import { Box } from 'layouts';
import React from 'react';
import { ViewStyle } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { Colors, Utils } from 'styles';

const { scaleSize } = Utils;

const PrimaryButtonDefaultProps = {
  disabled: false,
  onPress: () => {},
  bgColor: Colors.SECONDARY,
  shadowColor: Colors.PRIMARY,
  labelColor: Colors.WHITE,
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
        <Box
          style={{
            position: 'absolute',
            right: scaleSize(labelLevel == 5 ? 6 : 24),
          }}
        >
          <MaterialIndicator
            size={scaleSize(labelLevel == 5 ? 12 : 24)}
            color={Colors.WHITE}
            trackWidth={2}
          />
        </Box>
      )}
    </AnimatedTouchableOpacity>
  );
}

PrimaryButton.defaultProps = PrimaryButtonDefaultProps;

export default PrimaryButton;
