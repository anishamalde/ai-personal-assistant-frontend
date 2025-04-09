// Main App component that sets up providers, theme and navigation
import * as React from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  MD3Theme as Theme,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";

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
      <Navigation
        onReady={() => {
          // Hide splash screen when navigation is ready
          SplashScreen.hideAsync();
        }}
      />
    </PaperProvider>
  );
}
