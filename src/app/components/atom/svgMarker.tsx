import { View, Text } from "react-native";
import React from "react";
import Svg, {
  Circle,
  Defs,
  Path,
  Pattern,
  Rect,
  Use,
  // Image,
} from "react-native-svg";
import { Image } from "react-native";
// import SvgImage from " react-native-svg/lib/typescript/elements/Image";

interface SvgMarkerProps {
  imageUrl: string;
}

const SvgMarker: React.FC<SvgMarkerProps> = ({ imageUrl }) => {
  return (
    <Svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      {/* Other SVG shapes */}

      <Path
        d="M10 32H22C20.4858 32 19.1681 32.8413 18.4889 34.0821C17.9586 35.051 17.1046 36 16 36C14.8954 36 14.0414 35.051 13.5111 34.0821C12.8319 32.8413 11.5142 32 10 32Z"
        fill="#141414"
      />
      <Path
        d="M10 32H22C20.4858 32 19.1681 32.8413 18.4889 34.0821C17.9586 35.051 17.1046 36 16 36C14.8954 36 14.0414 35.051 13.5111 34.0821C12.8319 32.8413 11.5142 32 10 32Z"
        fill="#141414"
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
      <Rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7.5"
        fill="url(#pattern1)"
        stroke="#141414"
      />
      <Circle cx="16" cy="44" r="4" fill="#141414" />
      <Circle cx="16" cy="44" r="4" fill="#141414" />
      {/* Other SVG shapes */}
      <Circle cx="16" cy="44" r="4" fill="#141414" />
      <Defs>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#image0_4120_10521" transform="scale(0.00195312)" />
        </Pattern>
        <Pattern
          id="pattern1"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#image0_4120_10521" transform="scale(0.00195312)" />
        </Pattern>
        <Image
          // x="0.5"
          // y="0.5"
          width={32}
          height={32}
          source={{
            uri: imageUrl,
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
          }}
          // href
        />
      </Defs>
    </Svg>
  );
};

export default SvgMarker;
