/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dimensions } from "react-native";
import { createRef } from "react";
import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const guidlineBaseWith = 375;

const scaleSize = (size: number): number => (width / guidlineBaseWith) * size;
const styledScaleSize = (size: number): string => `${scaleSize(size)}px`;

type DimensionProperty = "margin" | "padding";

type DimensionType = {
  [x: string]: string | number;
};

function dimensions(
  top: number | string,
  right: number | string,
  bottom: number | string,
  left: number | string,
  property: DimensionProperty
) {
  const styles = {
    [`${property}Top`]: top,
    [`${property}Right`]: right,
    [`${property}Bottom`]: bottom,
    [`${property}Left`]: left,
  };

  return styles;
}

function margin(
  top: number,
  right: number,
  bottom: number,
  left: number
): DimensionType {
  return dimensions(
    scaleSize(top),
    scaleSize(right),
    scaleSize(bottom),
    scaleSize(left),
    "margin"
  );
}

function padding(
  top: number,
  right: number,
  bottom: number,
  left: number
): DimensionType {
  return dimensions(
    scaleSize(top),
    scaleSize(right),
    scaleSize(bottom),
    scaleSize(left),
    "padding"
  );
}

function styledMargin(
  top: number,
  right: number,
  bottom: number,
  left: number
): DimensionType {
  return dimensions(
    styledScaleSize(top),
    styledScaleSize(right),
    styledScaleSize(bottom),
    styledScaleSize(left),
    "margin"
  );
}

function styledPadding(
  top: number,
  right: number,
  bottom: number,
  left: number
): DimensionType {
  return dimensions(
    styledScaleSize(top),
    styledScaleSize(right),
    styledScaleSize(bottom),
    styledScaleSize(left),
    "padding"
  );
}

function priceT(number: number): string {
  if (!number) {
    return "0";
  }
  return Number(number)
    .toFixed()
    .replace(/./g, (c, i, a) => {
      const sep = ",";
      return i && c !== "." && (a.length - i) % 3 === 0 ? sep + c : c;
    });
}

type TResize = {
  uri?: string;
  width: number;
  height: number;
  type?: string;
  quality?: number;
  isProfile?: boolean;
};

function resize({
  uri,
  width,
  height,
  type = "cover",
  quality = 100,
}: TResize): string {
  if (!uri) {
    // return defaultUser;
    return null;
  }
  return `${uri}?s=${width}x${height}&t=${type}&q=${quality}`;
}

function beautifyContent(content: string): string {
  return content.replace(/&laquo;/g, "&#8220;");
}

function htmlEntityDecode(content: string): string {
  return content
    ?.replace(/&#8221;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8230;/g, "...");
}

const navigationRef = createRef();

// function navigate(name, params) {
//   navigationRef.current?.navigate(name, params);
// }

// const goBack = () => navigationRef.current?.goBack();

// const resetStack = (name, params) => navigationRef.current?.dispatch(
//   CommonActions.reset({
//     index: 0,
//     routes: [{ name, params }],
//   }),
// );

function mmss(secs: number) {
  if (!secs) {
    return "00:00";
  }
  const minutes = Math.floor(secs / 60);
  const remainginSecs = secs % 60;
  return `${`0${minutes}`.slice(-2)}:${`0${remainginSecs}`.slice(-2)}`;
}

function calculateStarRatingFromPercentage(percentage: number) {
  if (!percentage) {
    return 0;
  }
  if (percentage > 0 && percentage < 5) {
    return 0;
  }
  if (percentage >= 5 && percentage < 50) {
    return 1;
  }
  if (percentage >= 50 && percentage < 90) {
    return 2;
  }
  if (percentage >= 90) {
    return 3;
  }
}

function validatePassword(password: string) {
  if (password.length === 0) {
    return false;
  }
  const passwordFormat = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;
  return passwordFormat.test(password);
}

function validateCode(code: string) {
  if (code.length === 0) {
    return false;
  }
  const codeFormat = /^(?=[0-9]).{6}$/;
  return codeFormat.test(code);
}

function validatePhoneNumber(phoneNumber: string) {
  if (phoneNumber.length === 0) {
    return false;
  }
  const codeFormat = /^(?=[0-9]).{8}$/;
  return codeFormat.test(phoneNumber);
}

export {
  width,
  height,
  // deviceHasNotch,
  scaleSize,
  styledScaleSize,
  resize,
  margin,
  padding,
  styledMargin,
  styledPadding,
  priceT,
  beautifyContent,
  htmlEntityDecode,
  navigationRef,
  // navigate,
  // goBack,
  // resetStack,
  mmss,
  calculateStarRatingFromPercentage,
  validatePassword,
  validateCode,
  validatePhoneNumber,
};
