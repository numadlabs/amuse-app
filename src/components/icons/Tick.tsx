import React from 'react';
import Svg, { Path } from 'react-native-svg';


interface tickProps {
  size: number;
  color: string;
}
const Tick:React.FC<tickProps> = ({size, color}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M8.34238 14.1668C8.10893 14.1668 7.88715 14.0738 7.72374 13.911L4.42038 10.6207C4.08188 10.2836 4.08188 9.72551 4.42038 9.38834C4.75888 9.05117 5.31916 9.05117 5.65766 9.38834L8.34238 12.0624L14.342 6.08637C14.6805 5.7492 15.2408 5.7492 15.5793 6.08637C15.9178 6.42354 15.9178 6.98161 15.5793 7.31878L8.96102 13.911C8.7976 14.0738 8.57583 14.1668 8.34238 14.1668Z"
        fill={color}
      />
    </Svg>
  );
};

export default Tick;
