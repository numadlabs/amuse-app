import React from 'react';
import Svg, { Path, LinearGradient, Stop } from 'react-native-svg';

const TickCircle = () => {
  return (
    <Svg width="73" height="72" viewBox="0 0 73 72" fill="none">
      <Path d="M36.5 68.25C18.71 68.25 4.25 53.79 4.25 36C4.25 18.21 18.71 3.75 36.5 3.75C54.29 3.75 68.75 18.21 68.75 36C68.75 53.79 54.29 68.25 36.5 68.25ZM36.5 8.25C21.2 8.25 8.75 20.7 8.75 36C8.75 51.3 21.2 63.75 36.5 63.75C51.8 63.75 64.25 51.3 64.25 36C64.25 20.7 51.8 8.25 36.5 8.25Z" fill="url(#paint0_linear_6240_11194)" />
      <Path d="M32.2385 46.7448C31.6385 46.7448 31.0685 46.5048 30.6485 46.0848L22.1584 37.5948C21.2884 36.7248 21.2884 35.2848 22.1584 34.4148C23.0284 33.5448 24.4684 33.5448 25.3384 34.4148L32.2385 41.3148L47.6585 25.8947C48.5285 25.0247 49.9685 25.0247 50.8385 25.8947C51.7085 26.7647 51.7085 28.2047 50.8385 29.0747L33.8285 46.0848C33.4085 46.5048 32.8385 46.7448 32.2385 46.7448Z" fill="url(#paint1_linear_6240_11194)" />
      <LinearGradient id="paint0_linear_6240_11194" x1="4.25" y1="36" x2="68.75" y2="36" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FDAD32" />
        <Stop offset="1" stopColor="#F187FB" />
      </LinearGradient>
      <LinearGradient id="paint1_linear_6240_11194" x1="21.5059" y1="35.9935" x2="51.491" y2="35.9935" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FDAD32" />
        <Stop offset="1" stopColor="#F187FB" />
      </LinearGradient>
    </Svg>
  );
};

export default TickCircle;
