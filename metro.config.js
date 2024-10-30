const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// Define extraNodeModules before using it
const extraNodeModules = {
  // Add any extra node modules you need here
};

const config = getSentryExpoConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "react-native",
  "browser",
  "require",
];

// config.transformer.getTransformOptions = async () => ({
//   transform: {
//     experimentalImportSupport: false,
//     inlineRequires: true,
//   },
// });

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {},
  },
};
