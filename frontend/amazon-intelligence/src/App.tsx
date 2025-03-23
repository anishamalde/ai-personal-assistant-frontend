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
          <Navigation
            linking={{
              enabled: "auto",
              prefixes: [
                // Change the scheme to match your app's scheme defined in app.json
                "helloworld://",
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
