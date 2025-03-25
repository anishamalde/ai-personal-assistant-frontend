import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { IconButton, useTheme, Text, MD3Theme } from "react-native-paper";
import { PermissionsDialogBox, RecordingAnimation } from "./index";
import { useChat } from "../context/ChatContext";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useNavigation } from "@react-navigation/native";

const Microphone = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const {
    interimTranscription,
    setInterimTranscription,
    setFinalTranscription,
    clearTranscriptions,
  } = useChat();

  const [recording, setRecording] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [hasFinishedRecording, setHasFinishedRecording] = useState<boolean>(false);

  useSpeechRecognitionEvent("start", () => {
    setRecording(true);
    setHasFinishedRecording(false);
  });

  useSpeechRecognitionEvent("end", () => {
    setRecording(false);
    // When recording stops, set the final transcription
    if (interimTranscription && interimTranscription.trim()) {
      setFinalTranscription(interimTranscription);
      setHasFinishedRecording(true);
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

  // Navigate to Chat screen after recording is finished and transcription is set
  useEffect(() => {
    if (hasFinishedRecording && interimTranscription && interimTranscription.trim()) {
      // Short delay to ensure the transcription is processed before navigation
      const timer = setTimeout(() => {
        navigation.navigate('Chat');
        setHasFinishedRecording(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [hasFinishedRecording, interimTranscription, navigation]);

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
      <IconButton
        icon="microphone"
        size={80}
        onPress={handleMicPress}
        iconColor={theme.colors.background}
        containerColor={recording ? theme.colors.error : theme.colors.primary}
      />
      <RecordingAnimation isRecording={recording} />
      {interimTranscription && (
        <ScrollView style={styles.transcriptContainer}>
          <Text variant="bodyMedium">{interimTranscription}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default Microphone;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    transcriptContainer: {
      maxHeight: 100,
      width: "90%",
      margin: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
    },
    statusText: {
      color: theme.colors.error,
    },
  });
