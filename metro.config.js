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
      ...config.resolver.extraNodeModules, // This is the correct way to spread existing extraNodeModules
      ...extraNodeModules,
      ...require('node-libs-expo'),
      ...require('node-libs-react-native')
    }
  }
};