import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

export default ({ config }: { config: ExpoConfig }) => {

  return {
    ...config,
    extra: {
      AWS_REGION: process.env.AWS_REGION,
      COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
      COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
      COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
      S3_BUCKET: process.env.S3_BUCKET,
      API_ENDPOINT: process.env.API_ENDPOINT,
    },
  };
};