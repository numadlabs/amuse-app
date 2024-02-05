import React, { FC } from 'react';
import { CRHeadingText } from './Typography.styles';
import { TypographyDefaultProps, TypographyProps } from './Typography.types';

const CRHeading:FC<TypographyProps> = ({
  color, label, level, customStyle, numberOfLines,
}) => {
  return (
    <CRHeadingText
      level={level}
      color={color}
      numberOfLines={numberOfLines}
      style={customStyle}
    >
      {label}
    </CRHeadingText>
  );
};

CRHeading.defaultProps = TypographyDefaultProps;

export default CRHeading;
