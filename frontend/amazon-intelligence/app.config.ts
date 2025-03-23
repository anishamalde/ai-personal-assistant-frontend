import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

export default ({ config }: { config: ExpoConfig }) => {
  return {
    ...config,
    // These values are available in app.json/app.config.js via Constants.expoConfig.extra
    // They are not directly accessible in your JavaScript code
    extra: {
      // You can access these in your code via Constants.expoConfig.extra
      // For AWS configuration, use process.env.EXPO_PUBLIC_* variables directly in your code
    },
  };
};
