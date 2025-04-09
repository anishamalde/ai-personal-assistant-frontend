import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

export default ({ config }: { config: ExpoConfig }) => {
  return {
    ...config,
  };
};
