const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Define extraNodeModules before using it
const extraNodeModules = {
  // Add any extra node modules you need here
};

const config = getSentryExpoConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});


module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {
    }
  }
};