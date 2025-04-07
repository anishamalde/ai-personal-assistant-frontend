import { Amplify } from 'aws-amplify';

// Configuration using Expo's environment variables with fallbacks for development

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID || 'us-west-2_yourUserPoolId',
      userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || 'yourUserPoolClientId',
      identityPoolId: process.env.EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID || 'us-west-2:yourIdentityPoolId',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-west-2',
    }
  },
  Storage: {
    S3: {
      bucket: process.env.EXPO_PUBLIC_S3_BUCKET || 'your-s3-bucket-name',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-west-2',
    }
  },
  API: {
    REST: {
      API: {
        endpoint: process.env.EXPO_PUBLIC_API_ENDPOINT || 'https://your-api-id.execute-api.region.amazonaws.com/stage/'
      }
    }
  },
  Predictions: {
    convert: {
      translateText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          sourceLanguage: 'en',
          targetLanguage: 'zh'
        }
      },
      speechGenerator: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          VoiceId: 'Ivy',
          LanguageCode: 'en-US'
        }
      },
      transcription: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          language: 'en-US'
        }
      }
    },
    }
};

// For development only - remove in production
if (__DEV__) {
  console.log('Amplify configuration loaded with:', {
    userPoolId: amplifyConfig.Auth.Cognito.userPoolId,
    userPoolClientId: amplifyConfig.Auth.Cognito.userPoolClientId?.substring(0, 5) + '...',
    region: amplifyConfig.Auth.Cognito.region,
    bucket: amplifyConfig.Storage.S3.bucket,
    hasApiEndpoint: !!amplifyConfig.API.REST.API.endpoint
  });
}

export default amplifyConfig;
