import React from "react";
import { StyleSheet, View } from "react-native";
import { MD3Theme, useTheme, Text } from "react-native-paper";
import { Microphone, PermissionsDialogBox } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../context/PermissionsContext";

export function Home() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { userData } = useAuth();

  const {
    locationPermission,
    microphonePermission,
    showPermissionsDialog,
    requestLocationPermission,
    requestMicrophonePermission,
  } = usePermissions();

  // Handle requesting both permissions
  const handleRequestPermissions = async () => {
    // Request location permission if not granted
    if (locationPermission !== "granted") {
      await requestLocationPermission();
    }

    // Request microphone permission if not granted
    if (microphonePermission !== true) {
      await requestMicrophonePermission();
    }
  };

  return (
    <View style={styles.container}>
      {userData?.nickname ? (
        <Text style={styles.welcomeText}>Welcome, {userData.nickname}!</Text>
      ) : (
        <Text style={styles.welcomeText}>Welcome!</Text>
      )}

      {showPermissionsDialog && (
        <PermissionsDialogBox
          message="This app needs to access your location & microphone. Would you like to grant access?"
          requestPermission={handleRequestPermissions}
        />
      )}

      <Microphone />
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.colors.primary,
    },
  });
