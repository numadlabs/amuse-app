// import { Utils } from "styles";
// import Utils
import { styledScaleSize } from "../lib/utils";
import { isPlatformIOS } from "./layouts";
// import { isPlatformIOS } from "appConstants/layouts";

// const { styledScaleSize } = Utils;
// FONT FAMILY
const FONT_FAMILY_SF_REGULAR = "Manrope-Regular";
const FONT_FAMILY_CR_BOLD = "CeraRoundPro-Bold";

// FONT WEIGHT
const FONT_WEIGHT_BOLD = isPlatformIOS ? "700" : "800";
const FONT_WEIGHT_REGULAR = "400";
const CR_FONT_WEIGHT = isPlatformIOS ? "bold" : "400";

// FONT SIZE
const FONT_SIZE_28 = styledScaleSize(28);
const FONT_SIZE_24 = styledScaleSize(24);
const FONT_SIZE_20 = styledScaleSize(20);
const FONT_SIZE_18 = styledScaleSize(18);
const FONT_SIZE_16 = styledScaleSize(16);
const FONT_SIZE_14 = styledScaleSize(14);
const FONT_SIZE_12 = styledScaleSize(12);
const FONT_SIZE_10 = styledScaleSize(10);
// LINE HEIGHT
const LINE_HEIGHT_32 = styledScaleSize(32);
const LINE_HEIGHT_30 = styledScaleSize(30);
const LINE_HEIGHT_26 = styledScaleSize(26);
const LINE_HEIGHT_24 = styledScaleSize(24);
const LINE_HEIGHT_22 = styledScaleSize(22);
const LINE_HEIGHT_20 = styledScaleSize(20);
const LINE_HEIGHT_18 = styledScaleSize(18);
const LINE_HEIGHT_16 = styledScaleSize(16);

const FONT_STYLE_NORMAL = "normal";
const LETTER_SPACING = 0;
const CR_LETTER_SPACING = -0.48;

type FontProps = {
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  fontStyle: string;
  letterSpacing: number;
};

// FONT REGULAR STYLE
const SF_REGULAR_1: FontProps = {
  fontFamily: FONT_FAMILY_SF_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: FONT_SIZE_16,
  lineHeight: LINE_HEIGHT_24,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: LETTER_SPACING,
};

const SF_REGULAR_2: FontProps = {
  fontFamily: FONT_FAMILY_SF_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: FONT_SIZE_14,
  lineHeight: LINE_HEIGHT_22,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: LETTER_SPACING,
};

const SF_REGULAR_3: FontProps = {
  fontFamily: FONT_FAMILY_SF_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: FONT_SIZE_12,
  lineHeight: LINE_HEIGHT_20,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: LETTER_SPACING,
};

const SF_REGULAR_4: FontProps = {
  fontFamily: FONT_FAMILY_SF_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: FONT_SIZE_10,
  lineHeight: LINE_HEIGHT_16,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: LETTER_SPACING,
};

const SF_REGULAR_HERO: FontProps = {
  fontFamily: FONT_FAMILY_SF_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: FONT_SIZE_18,
  lineHeight: LINE_HEIGHT_26,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: LETTER_SPACING,
};

// Cera Round Pro
const CR_BOLD_HERO: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_28,
  lineHeight: LINE_HEIGHT_32,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};
const CR_BOLD_1: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_24,
  lineHeight: LINE_HEIGHT_30,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};
const CR_BOLD_2: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_20,
  lineHeight: LINE_HEIGHT_26,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};
const CR_BOLD_3: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_18,
  lineHeight: LINE_HEIGHT_24,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};

const CR_BOLD_4: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_16,
  lineHeight: LINE_HEIGHT_22,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};

const CR_BOLD_5: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_14,
  lineHeight: LINE_HEIGHT_20,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};
const CR_BOLD_6: FontProps = {
  fontFamily: FONT_FAMILY_CR_BOLD,
  fontWeight: CR_FONT_WEIGHT,
  fontSize: FONT_SIZE_12,
  lineHeight: LINE_HEIGHT_18,
  fontStyle: FONT_STYLE_NORMAL,
  letterSpacing: CR_LETTER_SPACING,
};

export {
  FONT_FAMILY_SF_REGULAR,
  FONT_FAMILY_CR_BOLD,
  FONT_WEIGHT_REGULAR,
  FONT_WEIGHT_BOLD,
  FONT_STYLE_NORMAL,
  SF_REGULAR_1,
  SF_REGULAR_2,
  SF_REGULAR_3,
  SF_REGULAR_4,
  SF_REGULAR_HERO,
  CR_BOLD_1,
  CR_BOLD_2,
  CR_BOLD_3,
  CR_BOLD_4,
  CR_BOLD_5,
  CR_BOLD_6,
  CR_BOLD_HERO,
  CR_FONT_WEIGHT,
};
