import { StyleSheet } from "react-native";
import styled from "styled-components/native";
// import Typ
// import { Typography } from "appConstants";
import * as Typography from "../../../constants/typography";
// import { Utils } from "styles";
import { scaleSize } from "@/lib/utils";
// Button types
// import StyledText
import { StyledTextProps } from "../../atom/typography/Typography.types";

// const { scaleSize } = Utils;

// Helper functions
const paragraphLevel = (level: number) => {
  switch (level) {
    case 1:
      return { ...Typography.SF_REGULAR_1 };
    case 2:
      return { ...Typography.SF_REGULAR_2 };
    case 3:
      return { ...Typography.SF_REGULAR_3 };
    case 4:
      return { ...Typography.SF_REGULAR_4 };
    case 7:
      return { ...Typography.SF_REGULAR_HERO };
    default:
      return { ...Typography.SF_REGULAR_1 };
  }
};

const crHeadingLevel = (level: number) => {
  switch (level) {
    case 1:
      return { ...Typography.CR_BOLD_1 };
    case 2:
      return { ...Typography.CR_BOLD_2 };
    case 3:
      return { ...Typography.CR_BOLD_3 };
    case 4:
      return { ...Typography.CR_BOLD_4 };
    case 5:
      return { ...Typography.CR_BOLD_5 };
    case 6:
      return { ...Typography.CR_BOLD_6 };
    case 7:
      return { ...Typography.CR_BOLD_HERO };
    default:
      return { ...Typography.CR_BOLD_1 };
  }
};

// Styled components
const ParagraphText = styled.Text<StyledTextProps>`
  color: ${({ color }) => color};
  ${({ level }) => level && paragraphLevel(level)};
`;

const CRHeadingText = styled.Text<StyledTextProps>`
  color: ${({ color }) => color};
  ${({ level }) => level && crHeadingLevel(level)};
`;

// Stylesheets
const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleSize(8),
    padding: scaleSize(1),
  },
  headingStyle: {
    paddingHorizontal: scaleSize(24),
  },
});

export { styles, ParagraphText, CRHeadingText };
