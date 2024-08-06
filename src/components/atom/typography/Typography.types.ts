import Color from "@/constants/Color";
import { TextStyle } from "react-native";

export type TypographyProps = {
  color?: string;
  label?: string;
  level?: number;
  numberOfLines?: number;
  customStyle?: TextStyle;
};

export type StyledTextProps = {
  color?: string;
  level?: number;
};

export type FontProps = {
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  fontStyle: string;
  letterSpacing?: number;
};

export const TypographyDefaultProps = {
  color: Color.Gray.gray600,
  level: 1,
};
