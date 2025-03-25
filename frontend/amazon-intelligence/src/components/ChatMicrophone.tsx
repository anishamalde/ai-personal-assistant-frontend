import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { IconButton, useTheme, Text, MD3Theme } from "react-native-paper";
import { PermissionsDialogBox } from "./index";
import { useChat } from "../context/ChatContext";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

const ChatMicrophone = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    interimTranscription,
    setInterimTranscription,
    setFinalTranscription,
    clearTranscriptions,
  } = useChat();

  const [recording, setRecording] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Set up the pulsing animation for the recording indicator
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    
    if (recording) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [recording, pulseAnim]);

  useSpeechRecognitionEvent("start", () => {
    setRecording(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setRecording(false);
    // When recording stops, set the final transcription
    if (interimTranscription && interimTranscription.trim()) {
      setFinalTranscription(interimTranscription);
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    // Update the interim transcription as the user speaks
    setInterimTranscription(event.results[0]?.transcript || "");
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log(
      "Speech recognition error:",
      event.error,
      "message:",
      event.message
    );
  });

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async (): Promise<void> => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      setPermission(result.granted);
    } catch (error) {
      console.error("Failed to check speech permission:", error);
      setPermission(false);
    }
  };

  const handleMicPress = async (): Promise<void> => {
    if (permission === true) {
      if (!recording) {
        await startSpeechRecognition();
      } else {
        await stopSpeechRecognition();
      }
    } else {
      await checkPermission();
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

  return (
    <View style={styles.container}>
      {permission === false && (
        <PermissionsDialogBox
          message="We need your permission to access the microphone for speech recognition"
          requestPermission={checkPermission}
        />
      )}
      
      <View style={styles.inputContainer}>
        {recording && (
          <View style={styles.recordingContainer}>
            <Animated.View
              style={[
                styles.recordingIndicator,
                { transform: [{ scale: pulseAnim }] }
              ]}
            />
            <Text style={styles.recordingText}>
              {interimTranscription || "Listening..."}
            </Text>
          </View>
        )}
        
        <IconButton
          icon="microphone"
          size={30}
          onPress={handleMicPress}
          iconColor={theme.colors.background}
          containerColor={recording ? theme.colors.error : theme.colors.primary}
          style={styles.micButton}
        />
      </View>
    </View>
  );
};

export default ChatMicrophone;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
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
      marginRight: 8,
    },
    recordingIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.error,
      marginRight: 8,
    },
    recordingText: {
      flex: 1,
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
    },
    micButton: {
      margin: 0,
    },
  });
