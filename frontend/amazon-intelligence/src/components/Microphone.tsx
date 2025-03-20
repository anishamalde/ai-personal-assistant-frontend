import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { Audio } from "expo-av";
import { RecordingAnimation, PermissionsDialogBox } from "./index";
import { useChat } from "../context/ChatContext";

const Microphone: React.FC = () => {
  const theme = useTheme();
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const { setAudioUri } = useChat();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    checkPermission();
  }, [permissionResponse]);

  const checkPermission = async (): Promise<void> => {
    if (permissionResponse) {
      setPermission(permissionResponse.status === "granted");
    }
  };

  const handleMicPress = async (): Promise<void> => {
    if (permission === true) {
      if (!isRecording) {
        await startRecording();
      } else {
        await stopRecording();
      }
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      // Configure audio mode for Android
      await Audio.setAudioModeAsync({
        // Android-only settings can go here if needed
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async (): Promise<void> => {
    try {
      console.log("Stopping recording...");
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        // Android-only settings can go here if needed
      });

      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(undefined);
      console.log("Recording stopped and stored at", uri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  return (
    <View style={styles.container}>
      {permission === false && (
        <PermissionsDialogBox
          message="We need your permission to access the microphone"
          requestPermission={() => {
            requestPermission();
            // Dialog will hide itself after the request
          }}
        />
      )}

      <IconButton
        icon="microphone"
        size={80}
        onPress={handleMicPress}
        style={styles.micButton}
        iconColor={theme.colors.background}
        containerColor={isRecording ? theme.colors.error : theme.colors.primary}
      />
      <RecordingAnimation isRecording={isRecording} />
    </View>
  );
};

export default Microphone;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    margin: 0,
    borderRadius: 50,
  },
});
