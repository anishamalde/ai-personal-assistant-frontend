/**
 * TypeScript declarations for Expo environment variables
 * 
 * This file defines the types for environment variables used in the application.
 * It extends the NodeJS.ProcessEnv interface to include our custom Expo public variables.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_COGNITO_USER_POOL_ID: string;
    EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: string;
    EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID: string;
    EXPO_PUBLIC_AWS_REGION: string;
    EXPO_PUBLIC_S3_BUCKET: string;
    EXPO_PUBLIC_API_ENDPOINT: string;
  }
}