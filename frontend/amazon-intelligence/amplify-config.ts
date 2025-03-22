import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};

const requiredVars = [
  'COGNITO_USER_POOL_ID', 
  'COGNITO_USER_POOL_CLIENT_ID',
  'AWS_REGION'
];

const missingVars = requiredVars.filter(varName => !env[varName]);
if (missingVars.length > 0) {
  console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.COGNITO_USER_POOL_ID,
      userPoolClientId: env.COGNITO_USER_POOL_CLIENT_ID,
      identityPoolId: env.COGNITO_IDENTITY_POOL_ID,
      region: env.AWS_REGION || 'us-west-2',
    }
  },
  Storage: env.S3_BUCKET ? {
    S3: {
      bucket: env.S3_BUCKET,
      region: env.COGNITO_REGION || 'us-west-2',
    }
  } : undefined,
  API: env.API_ENDPOINT ? {
    REST: {
      API: {
        endpoint: env.API_ENDPOINT
      }
    }
  } : undefined
};

try {
  Amplify.configure(amplifyConfig);
  console.log('Amplify configuration successful');
} catch (error) {
  console.error('Amplify configuration error:', error);
}

export default amplifyConfig;