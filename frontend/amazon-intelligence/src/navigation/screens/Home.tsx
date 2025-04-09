import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { MD3Theme, useTheme, Text } from "react-native-paper";
import { Microphone, PermissionsDialogBox } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../context/PermissionsContext";
import { useChat } from "../../context/ChatContext";
import { useNavigation } from "@react-navigation/native";

/**
 * Home screen component for the application
 * Handles user welcome, permissions, and microphone recording
 *
 * @returns {React.JSX.Element} Rendered Home screen component
 */
export function Home() {
  // Theme and navigation hooks
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  // Context hooks for user data, chat, and permissions
  const { userData } = useAuth();
  const {
    interimTranscription,
    hasFinishedRecording,
    setHasFinishedRecording,
  } = useChat();

  const { requestAllPermissions, showPermissionsDialog } = usePermissions();

  /**
   * Effect to navigate to Chat screen after recording is finished
   * Adds a short delay to ensure transcription is processed
   */
  useEffect(() => {
    if (hasFinishedRecording) {
      // Short delay to ensure the transcription is processed before navigation
      const timer = setTimeout(() => {
        navigation.navigate("HomeTabs", {
          screen: "Chat",
        });
        setHasFinishedRecording(false);
      }, 500);

      // Cleanup function to clear timeout
      return () => clearTimeout(timer);
    }
  }, [hasFinishedRecording, navigation, setHasFinishedRecording]);

  return (
    <View style={styles.container}>
      {userData?.nickname ? (
        <Text style={styles.welcomeText}>Welcome, {userData.nickname}!</Text>
      ) : (
        <Text style={styles.welcomeText}>Welcome!</Text>
      )}
      {showPermissionsDialog && (
        <PermissionsDialogBox
          message="To provide you with personalized responses, we'd like to use your location and microphone. Is that okay?"
          requestPermission={requestAllPermissions}
        />
      )}
      <Microphone mode="main" />
      {interimTranscription && (
        <ScrollView style={styles.transcriptContainer}>
          <Text variant="bodyMedium">{interimTranscription}</Text>
        </ScrollView>
      )}
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
    transcriptContainer: {
      maxHeight: 60,
      width: "90%",
      margin: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
    },
  });
