import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

export default ({ config }: { config: ExpoConfig }) => {
  return {
    ...config,
    // These values are available in app.json/app.config.js via Constants.expoConfig.extra
    // They are not directly accessible in your JavaScript code
    extra: {},
  };
};