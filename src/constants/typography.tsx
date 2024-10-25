// import { Utils } from "styles";
// import Utils
// import { isPlatformIOS } from "appConstants/layouts";

// const { styledScaleSize } = Utils;
// FONT FAMILY
const FONT_FAMILY_SORA_REGULAR = "Sora";
const FONT_FAMILY_SORA_BOLD = "SoraBold";
const FONT_FAMILY_SORA_MEDIUM = "SoraMedium";
const FONT_FAMILY_SORA_SEMI_BOLD = "SoraSemiBold";

const FONT_STYLE_NORMAL = "normal";
const LETTER_SPACING = 0;
const CR_LETTER_SPACING = -0.48;

type FontProps = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

// FONT REGULAR STYLE
const DISPLAY_1: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 64,
  lineHeight: 78,
  letterSpacing: LETTER_SPACING,
};

const DISPLAY_2: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 56,
  lineHeight: 68,
  letterSpacing: LETTER_SPACING,
};
const H1: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 40,
  lineHeight: 48,
  letterSpacing: LETTER_SPACING,
};
const H2: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 36,
  lineHeight: 44,
  letterSpacing: LETTER_SPACING,
};
const H3: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 32,
  lineHeight: 40,
  letterSpacing: LETTER_SPACING,
};

const H4: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 28,
  lineHeight: 36,
  letterSpacing: LETTER_SPACING,
};
const H5: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 24,
  lineHeight: 32,
  letterSpacing: LETTER_SPACING,
};
const H6: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 20,
  lineHeight: 24,
  letterSpacing: LETTER_SPACING,
};
const BODY_1_BOLD: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 16,
  lineHeight: 20,
  letterSpacing: LETTER_SPACING,
};
const BODY_1_MEDIUM: FontProps = {
  fontFamily: FONT_FAMILY_SORA_MEDIUM,
  fontSize: 16,
  lineHeight: 20,
  letterSpacing: LETTER_SPACING,
};
const BODY_1_REGULAR: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 16,
  lineHeight: 20,
  letterSpacing: LETTER_SPACING,
};
const BODY_2_BOLD: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 14,
  lineHeight: 18,
  letterSpacing: LETTER_SPACING,
};
const BODY_2_MEDIUM: FontProps = {
  fontFamily: FONT_FAMILY_SORA_MEDIUM,
  fontSize: 14,
  lineHeight: 18,
  letterSpacing: LETTER_SPACING,
};
const BODY_2_REGULAR: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 14,
  lineHeight: 18,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_1_BOLD: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_1_MEDIUM: FontProps = {
  fontFamily: FONT_FAMILY_SORA_MEDIUM,
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_1_REGULAR: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_2_BOLD: FontProps = {
  fontFamily: FONT_FAMILY_SORA_BOLD,
  fontSize: 10,
  lineHeight: 12,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_2_MEDIUM: FontProps = {
  fontFamily: FONT_FAMILY_SORA_MEDIUM,
  fontSize: 10,
  lineHeight: 12,
  letterSpacing: LETTER_SPACING,
};
const CAPTION_2_REGULAR: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 10,
  lineHeight: 12,
  letterSpacing: LETTER_SPACING,
};
const BUTTON_48: FontProps = {
  fontFamily: FONT_FAMILY_SORA_SEMI_BOLD,
  fontSize: 15,
  lineHeight: 24,
  letterSpacing: LETTER_SPACING,
};
const BUTTON_40: FontProps = {
  fontFamily: FONT_FAMILY_SORA_SEMI_BOLD,
  fontSize: 13,
  lineHeight: 16,
  letterSpacing: LETTER_SPACING,
};
const BUTTON_32: FontProps = {
  fontFamily: FONT_FAMILY_SORA_SEMI_BOLD,
  fontSize: 11,
  lineHeight: 20,
  letterSpacing: LETTER_SPACING,
};
const STYLIZED_UPPERCASE_MEDIUM: FontProps = {
  fontFamily: FONT_FAMILY_SORA_MEDIUM,
  fontSize: 16,
  lineHeight: 20,
  letterSpacing: LETTER_SPACING,
};
const STYLIZED_UPPERCASE_REGULAR: FontProps = {
  fontFamily: FONT_FAMILY_SORA_REGULAR,
  fontSize: 12,
  lineHeight: 16,
  letterSpacing: LETTER_SPACING,
};

export {
  DISPLAY_1,
  DISPLAY_2,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BODY_1_BOLD,
  BODY_1_MEDIUM,
  BODY_1_REGULAR,
  BODY_2_BOLD,
  BODY_2_MEDIUM,
  BODY_2_REGULAR,
  CAPTION_1_BOLD,
  CAPTION_1_MEDIUM,
  CAPTION_1_REGULAR,
  CAPTION_2_BOLD,
  CAPTION_2_MEDIUM,
  CAPTION_2_REGULAR,
  BUTTON_48,
  BUTTON_40,
  BUTTON_32,
  STYLIZED_UPPERCASE_MEDIUM,
  STYLIZED_UPPERCASE_REGULAR,
};
