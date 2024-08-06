import { Dimensions, Platform } from "react-native";

// screen dimensiosn
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

// platforms
const isPlatformIOS = Platform.OS === "ios";

// iphone device dimensions
const isSmallDevice = 568;
const isMediumDevice = 667;
const isLargeDevice = 736;
const isXLargeDevice = 812;

const iphoneDimensions = {
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isXLargeDevice,
};

export { screenWidth, screenHeight, isPlatformIOS, iphoneDimensions };
