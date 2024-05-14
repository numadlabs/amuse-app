import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const CustomDashedBorder = ({ style, dashLength = 10, dashGap = 5, dashThickness = 1, dashColor = 'gray' }) => {
  return (
    <View style={[style, styles.container]}>
      <Svg height="100%" width="100%" style={styles.svg}>
        <Line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke={dashColor}
          strokeWidth={dashThickness}
          strokeDasharray={`${dashLength}, ${dashGap}`}
        />
        <Line
          x1="100%"
          y1="0"
          x2="100%"
          y2="100%"
          stroke={dashColor}
          strokeWidth={dashThickness}
          strokeDasharray={`${dashLength}, ${dashGap}`}
        />
        <Line
          x1="100%"
          y1="100%"
          x2="0"
          y2="100%"
          stroke={dashColor}
          strokeWidth={dashThickness}
          strokeDasharray={`${dashLength}, ${dashGap}`}
        />
        <Line
          x1="0"
          y1="100%"
          x2="0"
          y2="0"
          stroke={dashColor}
          strokeWidth={dashThickness}
          strokeDasharray={`${dashLength}, ${dashGap}`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CustomDashedBorder;
