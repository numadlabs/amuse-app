import React from "react";
import Svg, {
  Circle,
  Defs,
  Path,
  Pattern,
  Rect,
  LinearGradient,
  Use,
  Stop,
  Image,
} from "react-native-svg";
import Color from "@/constants/Color";

interface SvgMarkerProps {
  imageUrl: string;
}

const SvgMarker: React.FC<SvgMarkerProps> = ({ imageUrl }) => {
  return (
    <Svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      <Defs>
        <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={Color.Brand.main.start} />
          <Stop offset="1" stopColor={Color.Brand.main.end} />
        </LinearGradient>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use href="#image0" transform="scale(0.03125)" />
        </Pattern>
        <Image
          id="image0"
          href={imageUrl}
          x="0"
          y="0"
          width="32"
          height="32"
          preserveAspectRatio="xMidYMid slice"
        />
      </Defs>
      <Path
        d="M10 32H22C20.4858 32 19.1681 32.8413 18.4889 34.0821C17.9586 35.051 17.1046 36 16 36C14.8954 36 14.0414 35.051 13.5111 34.0821C12.8319 32.8413 11.5142 32 10 32Z"
        fill="url(#gradient)"
      />
      <Rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7.5"
        fill="url(#pattern0)"
        stroke="#141414"
      />
      <Circle cx="16" cy="44" r="4" fill="#141414" />
    </Svg>
  );
};

export default SvgMarker;
