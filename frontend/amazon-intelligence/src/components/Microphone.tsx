import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme, MD3Theme } from "react-native-paper";
import RecordingAnimation from "./RecordingAnimation";
import { useChat } from "../context/ChatContext";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface MicrophoneProps {
  mode?: "main" | "chat";
}

/**
 * Microphone component for voice input
 *
 * This component handles speech recognition functionality for the app,
 * allowing users to input text via voice.
 *
 * @param props - Component props
 * @param props.mode - Display mode of the microphone ('main' or 'chat')
 */
const Microphone = ({ mode = "main" }: MicrophoneProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    interimTranscription,
    setInterimTranscription,
    setFinalTranscription,
    clearTranscriptions,
    setHasFinishedRecording,
  } = useChat();

  const [recording, setRecording] = useState<boolean>(false);

  const [microphonePermission, setMicrophonePermission] = useState<
    boolean | null
  >(null);

  /**
   * Check permissions on component mount
   */
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
      setMicrophonePermission(result.granted);
    } catch (error) {
      console.error("Failed to check speech permission:", error);
      setMicrophonePermission(false);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      setMicrophonePermission(result.granted);

      console.log(result);

      if (!result.granted) {
        console.warn("Microphone permission request was denied");
      }
    } catch (error) {
      console.error("Failed to request speech permission:", error);
      setMicrophonePermission(false);
    }
  };

  useSpeechRecognitionEvent("start", () => {
    setRecording(true);
  });

  useSpeechRecognitionEvent("result", (event) => {
    // Update the interim transcription as the user speaks
    const transcription = event.results[0]?.transcript;
    setInterimTranscription(transcription || "");
    if (event.isFinal) {
      setFinalTranscription(transcription || "");
      setHasFinishedRecording(true);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setRecording(false);
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error(
      "Speech recognition error:",
      event.error,
      "message:",
      event.message
    );
  });
  
  const startSpeechRecognition = async (): Promise<void> => {
    try {
      clearTranscriptions();
      await ExpoSpeechRecognitionModule.start({
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

  /**
   * Stops the speech recognition process
   */
  const stopSpeechRecognition = async (): Promise<void> => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  };

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

  // Render the main microphone UI for the home screen
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
  }

  // Render the chat input microphone UI
  return (
    <View style={styles.chatContainer}>
      <View style={styles.inputContainer}>
        <IconButton
          icon="microphone"
          size={30}
          onPress={handleMicPress}
          iconColor={theme.colors.background}
          containerColor={recording ? theme.colors.error : theme.colors.primary}
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
};

export default Microphone;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    mainContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
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
