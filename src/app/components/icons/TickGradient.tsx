import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const TickGradient = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M10.0111 17C9.73091 17 9.46478 16.8884 9.26868 16.6931L5.30465 12.7447C4.89845 12.3401 4.89845 11.6704 5.30465 11.2658C5.71085 10.8612 6.38319 10.8612 6.78939 11.2658L10.0111 14.4747L17.2106 7.30345C17.6168 6.89885 18.2891 6.89885 18.6953 7.30345C19.1015 7.70805 19.1015 8.37774 18.6953 8.78234L10.7534 16.6931C10.5573 16.8884 10.2912 17 10.0111 17Z" fill="url(#paint0_linear_7441_3985)"/>
      <Defs>
        <LinearGradient id="paint0_linear_7441_3985" x1="5" y1="12" x2="19" y2="12" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDAD32"/>
          <Stop offset="1" stopColor="#F187FB"/>
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default TickGradient;
