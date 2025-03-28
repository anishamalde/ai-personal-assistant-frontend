import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme, MD3Theme } from "react-native-paper";
import RecordingAnimation from "../components/RecordingAnimation";
import { useChat } from "../context/ChatContext";
import { usePermissions } from "../context/PermissionsContext";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface MicrophoneProps {
  mode?: "main" | "chat";
  onRecordingFinished?: (transcription: string) => void;
}

const Microphone = ({
  mode = "main",
  onRecordingFinished,
}: MicrophoneProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    interimTranscription,
    setInterimTranscription,
    setFinalTranscription,
    clearTranscriptions,
  } = useChat();

  const { microphonePermission, requestMicrophonePermission } =
    usePermissions();

  const [recording, setRecording] = useState<boolean>(false);

  // Speech recognition event handlers
  useSpeechRecognitionEvent("start", () => {
    setRecording(true);
  });

  useSpeechRecognitionEvent("result", (event) => {
    // Update the interim transcription as the user speaks
    setInterimTranscription(event.results[0]?.transcript || "");
  });

  useSpeechRecognitionEvent("end", () => {
    setRecording(false);
    // When recording stops, set the final transcription
    if (interimTranscription && interimTranscription.trim()) {
      if (onRecordingFinished) {
        // Use callback for main mode
        onRecordingFinished(interimTranscription);
      } else {
        // Set directly for chat mode

        setFinalTranscription(interimTranscription);
        console.log(interimTranscription);
      }
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log(
      "Speech recognition error:",
      event.error,
      "message:",
      event.message
    );
  });

  const handleMicPress = async (): Promise<void> => {
    if (microphonePermission === true) {
      if (!recording) {
        await startSpeechRecognition();
      } else {
        await stopSpeechRecognition();
      }
    } else {
      await requestMicrophonePermission();
    }
  };

  const startSpeechRecognition = async (): Promise<void> => {
    try {
      clearTranscriptions();
      ExpoSpeechRecognitionModule.start({
        lang: "en-UK",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
      });
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
    }
  };

  const stopSpeechRecognition = async (): Promise<void> => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  };

  // Render the microphone UI based on mode
  if (mode === "main") {
    return (
      <View style={styles.mainContainer}>
        <IconButton
          icon="microphone"
          size={80}
          onPress={handleMicPress}
          iconColor={theme.colors.background}
          containerColor={recording ? theme.colors.error : theme.colors.primary}
        />
        <RecordingAnimation
          isRecording={recording}
          size="large"
          variant="dots"
        />
      </View>
    );
  } else if (mode === "chat") {
    return (
      <View style={styles.chatContainer}>
        <View style={styles.inputContainer}>
          <IconButton
            icon="microphone"
            size={30}
            onPress={handleMicPress}
            iconColor={theme.colors.background}
            containerColor={
              recording ? theme.colors.error : theme.colors.primary
            }
            style={styles.micButton}
          />
          {recording && (
            <View style={styles.recordingContainer}>
              <RecordingAnimation
                isRecording={recording}
                size="small"
                variant="pulse"
                text={interimTranscription || "Listening..."}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
};

export default Microphone;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    // Main mode styles
    mainContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },

    // Chat mode styles
    chatContainer: {
      width: "100%",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.background,
    },
    recordingContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginLeft: 8,
    },
    micButton: {
      margin: 0,
    },
  });
