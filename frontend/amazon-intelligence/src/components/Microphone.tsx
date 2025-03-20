import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { useAudioRecorder, RecordingPresets, AudioModule } from "expo-audio";
import { RecordingAnimation, PermissionsDialogBox } from "./index";
import { useChat } from "../context/ChatContext";

enum PermissionStatus {
  DENIED = "denied",
  GRANTED = "granted",
  UNDETERMINED = "undetermined",
}

interface PermissionResponse {
  granted: boolean;
  status: PermissionStatus;
}

const Microphone: React.FC = () => {
  const theme = useTheme();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const { audioUri, setAudioUri } = useChat();

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async (): Promise<void> => {
    const permissionResponse: PermissionResponse =
      await AudioModule.getRecordingPermissionsAsync();
    setPermission(permissionResponse.status === PermissionStatus.GRANTED);
  };

  const requestPermission = async (): Promise<void> => {
    const permissionResponse: PermissionResponse =
      await AudioModule.requestRecordingPermissionsAsync();

    const isGranted = permissionResponse.status === PermissionStatus.GRANTED;
    setPermission(isGranted);
  };

  const handleMicPress = async (): Promise<void> => {
    if (permission === true) {
      if (!isRecording) {
        await startRecording();
        setIsRecording(true);
      } else {
        await stopRecording();
        setIsRecording(false);
      }
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      console.log("status", audioRecorder.isRecording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async (): Promise<void> => {
    try {
      await audioRecorder.stop();
      setAudioUri(audioRecorder.uri);
      console.log(audioUri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  return (
    <View style={styles.container}>
      {permission === false && (
        <PermissionsDialogBox
          message="We need your permission to access the microphone"
          requestPermission={requestPermission}
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
