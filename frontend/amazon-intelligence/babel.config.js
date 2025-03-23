module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Using Expo's built-in environment variable handling with EXPO_PUBLIC_ prefix
    // No need for react-native-dotenv plugin
  };
};
