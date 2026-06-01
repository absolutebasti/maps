module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 56) automatically includes the
    // react-native-worklets / Reanimated 4 babel plugin when the
    // package is installed, so we don't add it manually here.
    presets: ['babel-preset-expo'],
  };
};
