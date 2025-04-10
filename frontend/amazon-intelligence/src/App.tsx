// Main App component that sets up providers, theme and navigation
import * as React from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  MD3Theme as Theme,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { Amplify } from "aws-amplify";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { PermissionsProvider } from "./context/PermissionsContext";
import amplifyConfig from "../amplify-config";

// Configure AWS Amplify
Amplify.configure(amplifyConfig);

// Prevent splash screen from hiding until we're ready
SplashScreen.preventAutoHideAsync();

// Custom theme with brand colors
const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e3050", // Primary brand color
    tertiary: "#FFFFFF99", // Semi-transparent white
  },
};

export function App(): React.ReactElement {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <PreferencesProvider>
          <PermissionsProvider>
            <ChatProvider>
              <Navigation
                onReady={() => {
                  // Hide splash screen when navigation is ready
                  SplashScreen.hideAsync();
                }}
              />
            </ChatProvider>
          </PermissionsProvider>
        </PreferencesProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
