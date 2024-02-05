import AnimatedTouchableOpacity from 'globalComponents/AnimatedTouchableOpacity';
import { CRHeading } from 'globalComponents/atoms';
import { Box } from 'globalComponents/layouts';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Colors, Utils } from 'styles';
import { MaterialIndicator } from 'react-native-indicators';

const { scaleSize } = Utils;
const styles = StyleSheet.create({
  button: {
    borderColor: Colors.DARK_200,
    borderWidth: scaleSize(1),
  },
  leftIcon: {
    position: 'absolute',
    left: scaleSize(16),
  },
});

const SecondaryButtonDefaultProps = {
  backgroundColor: Colors.WHITE,
  labelColor: Colors.DARK_800,
  label: '',
  customStyle: {},
  innerStyle: {},
  labelLevel: 4,
  height: scaleSize(48),
  disabled: false,
  isLoading: false,
};

type SecondaryButtonProps = {
  label?: string;
  labelColor?: string;
  customStyle?: ViewStyle;
  innerStyle?: ViewStyle;
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
  innerStyle,
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
      shadowColor={Colors.DARK_200}
      customStyle={{ ...customStyle }}
      innerStyle={[styles.button, { ...innerStyle }]}
      disabled={disabled}
    >
      {leftIcon && <Box style={styles.leftIcon}>{leftIcon}</Box>}
      {!!label && (
        <CRHeading color={labelColor} label={label} level={labelLevel || 4} />
      )}
      {isLoading && (
        <Box style={{ position: 'absolute', right: scaleSize(24) }}>
          <MaterialIndicator
            size={scaleSize(24)}
            color={Colors.WHITE}
            trackWidth={2}
          />
        </Box>
      )}
    </AnimatedTouchableOpacity>
  );
}

SecondaryButton.defaultProps = SecondaryButtonDefaultProps;

export default React.memo(SecondaryButton);
