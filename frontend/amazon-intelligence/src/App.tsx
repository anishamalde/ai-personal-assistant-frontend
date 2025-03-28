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
import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify-config";

Amplify.configure(amplifyConfig);

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e3050",
    tertiary: "#FFFFFF99",
    iconTintColor: "#FFFFFF",
  },
};

export function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <PermissionsProvider>
          <ChatProvider>
            <Navigation
              linking={{
                enabled: "auto",
                prefixes: [
                  "amazonintelligence://", // Match the scheme in app.json
                ],
              }}
              onReady={() => {
                SplashScreen.hideAsync();
              }}
            />
          </ChatProvider>
        </PermissionsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
