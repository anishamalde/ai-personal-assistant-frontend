import * as React from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify-config";
import { LogBox } from "react-native";
import LocationPermission from "./components/LocationPermission";

// Ignore specific warnings that might be coming from dependencies
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native",
  "Setting a timer for a long period of time",
]);

// Configure Amplify at the app root level
Amplify.configure(amplifyConfig);

// Only log in development
if (__DEV__) {
  console.log("Amplify configured in App.tsx");
}

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
        <ChatProvider>
          <LocationPermission />
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
      </AuthProvider>
    </PaperProvider>
  );
}
