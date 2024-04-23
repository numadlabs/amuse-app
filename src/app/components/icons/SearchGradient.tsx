import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import Color from '@/app/constants/Color'

const SearchGradient = () => {
  return (
    <Svg width="41" height="40" viewBox="0 0 41 40" fill="none">
      <Defs>
        <LinearGradient id="paint0_linear_6202_8434" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={Color.Brand.main.start} />
          <Stop offset="1" stopColor={Color.Brand.main.end} />
        </LinearGradient>
        <LinearGradient id="paint1_linear_6202_8434" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={Color.Brand.main.start} />
          <Stop offset="1" stopColor={Color.Brand.main.end} />
        </LinearGradient>
      </Defs>
      <Path
        d="M19.6667 36.2497C10.25 36.2497 2.58333 28.583 2.58333 19.1663C2.58333 9.74967 10.25 2.08301 19.6667 2.08301C29.0833 2.08301 36.75 9.74967 36.75 19.1663C36.75 28.583 29.0833 36.2497 19.6667 36.2497ZM19.6667 4.58301C11.6167 4.58301 5.08333 11.133 5.08333 19.1663C5.08333 27.1997 11.6167 33.7497 19.6667 33.7497C27.7167 33.7497 34.25 27.1997 34.25 19.1663C34.25 11.133 27.7167 4.58301 19.6667 4.58301Z"
        fill="url(#paint0_linear_6202_8434)"
      />
      <Path
        d="M37.1658 37.919C36.8492 37.919 36.5325 37.8023 36.2825 37.5523L32.9492 34.219C32.4658 33.7357 32.4658 32.9357 32.9492 32.4523C33.4325 31.969 34.2325 31.969 34.7158 32.4523L38.0492 35.7857C38.5325 36.269 38.5325 37.069 38.0492 37.5523C37.7992 37.8023 37.4825 37.919 37.1658 37.919Z"
        fill="url(#paint1_linear_6202_8434)"
      />
    </Svg>
  );
};

export default SearchGradient;

