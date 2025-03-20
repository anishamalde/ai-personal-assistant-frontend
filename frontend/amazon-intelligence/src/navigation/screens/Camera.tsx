import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Card,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { PermissionsDialogBox } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useChat } from "../../context/ChatContext";

export function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const navigation = useNavigation();

  const { imageUri, setImageUri, clearImage } = useChat();

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    return (
      <>
        <PermissionsDialogBox
          message="We need your permission to access the camera"
          requestPermission={requestPermission}
        />
      </>
    );
  }
  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        setImageUri(photo.uri);
      }
    } catch (error) {
      console.error("Error taking or storing picture:", error);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleRetake = () => {
    setImageUri(null);
  };

  const navigateToChat = () => {
    navigation.navigate("HomeTabs", {
      screen: "Chat",
    });
  };

  const renderPicture = () => {
    return (
      <Card>
        <Card.Cover source={{ uri: imageUri }} />
        <Card.Actions>
          <Button onPress={handleRetake}>Retake</Button>
          <Button onPress={navigateToChat}>Looks Good</Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.controlsContainer}>
          <View style={styles.bottomControls}>
            <IconButton
              icon="camera-retake"
              iconColor="white"
              containerColor="grey"
              size={40}
              onPress={clearImage}
            />
            <IconButton
              icon="camera"
              iconColor="grey"
              containerColor="white"
              size={60}
              onPress={takePicture}
            />
            <IconButton
              icon="camera-flip"
              iconColor="white"
              containerColor="grey"
              size={40}
              onPress={toggleFacing}
            />
          </View>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {imageUri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bottomLeftPlaceholder: {
    width: 40,
  },
});
