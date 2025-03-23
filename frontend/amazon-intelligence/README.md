# Amazon Intelligence Frontend

This is a React Native app using Expo and React Navigation with AWS Amplify for authentication.

## Features

- Authentication with AWS Cognito
- React Navigation with Native Stack and Bottom Tab navigation
- Web support with React Native for Web
- TypeScript support
- Automatic deep link and URL handling
- Expo Development Build with Continuous Native Generation
- Edge-to-edge configured on Android

## Getting Started

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd amazon-intelligence
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env` and fill in your AWS credentials:

   ```sh
   cp .env.example .env
   ```

   Then edit the `.env` file with your AWS configuration values.

4. Start the development server:

   ```sh
   npm start
   ```

5. Build and run iOS and Android development builds:

   ```sh
   npm run ios
   # or
   npm run android
   ```

## Environment Configuration

The app uses Expo's built-in environment variable system. Make sure to set these in your `.env` file:

- `EXPO_PUBLIC_AWS_REGION`: Your AWS region (e.g., us-west-2)
- `EXPO_PUBLIC_COGNITO_USER_POOL_ID`: Your Cognito User Pool ID
- `EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: Your Cognito User Pool Client ID
- `EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID`: Your Cognito Identity Pool ID (optional)
- `EXPO_PUBLIC_S3_BUCKET`: Your S3 bucket name (optional)
- `EXPO_PUBLIC_API_ENDPOINT`: Your API Gateway endpoint (optional)

Note: All environment variables must use the `EXPO_PUBLIC_` prefix to be accessible in the client code. These variables are automatically inlined during the build process.

## Production Deployment

For production deployments with EAS (Expo Application Services):

1. Set up secrets in EAS:
   ```sh
   eas secret:create --scope project --name EXPO_PUBLIC_COGNITO_USER_POOL_ID --value us-west-2_yourUserPoolId
   ```

2. Or define them in your `eas.json` build profiles:
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_AWS_REGION": "us-west-2"
         }
       }
     }
   }
   ```

## Notes

This project uses a [development build](https://docs.expo.dev/develop/development-builds/introduction/) and cannot be run with [Expo Go](https://expo.dev/go). To run the app with Expo Go, edit the `package.json` file, remove the `expo-dev-client` package and `--dev-client` flag from the `start` script. However, Edge-to-edge won't work on Expo Go.

We highly recommend using the development builds for normal development and testing.

## Security Considerations

- Variables with the `EXPO_PUBLIC_` prefix are embedded in your app bundle and visible to users
- For sensitive operations, consider using a backend service or AWS IAM roles
- Use Amazon Cognito Identity Pools with IAM roles for secure AWS service access
- Implement token-based authentication for sensitive API calls

## Resources

- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)
- [AWS Amplify documentation](https://docs.amplify.aws/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

Demo assets are from [lucide.dev](https://lucide.dev/)
