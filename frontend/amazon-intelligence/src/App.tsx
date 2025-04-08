// Main App component that sets up providers, theme and navigation
import * as React from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { ChatProvider } from "./context/ChatContext";
import { PermissionsProvider } from "./context/PermissionsContext";
import { AuthProvider } from "./context/AuthContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { Amplify } from "aws-amplify";
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
    iconTintColor: "#FFFFFF", // Icon color
  },
};

// Deep linking configuration
const linkingConfig = {
  enabled: "auto",
  prefixes: [
    "amazonintelligence://", // Matches scheme in app.json
  ],
};

export function App(): React.ReactElement {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <PreferencesProvider>
          <PermissionsProvider>
            <ChatProvider>
              <Navigation
                linking={linkingConfig}
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
