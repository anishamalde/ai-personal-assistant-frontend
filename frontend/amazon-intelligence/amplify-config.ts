// Configuration using Expo's environment variables

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      identityPoolId: process.env.EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID,
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-west-2',
    }
  },
  Storage: {
    S3: {
      bucket: process.env.EXPO_PUBLIC_S3_BUCKET,
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-west-2',
    }
  },
  API: {
    REST: {
      API: {
        endpoint: process.env.EXPO_PUBLIC_API_ENDPOINT 
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
      },
      interpret: {
        region: 'us-east-1',
        proxy: false
      },
      identify: {
        region: 'us-east-1',
        proxy: false
      }
    },
    }
};

export default amplifyConfig;
