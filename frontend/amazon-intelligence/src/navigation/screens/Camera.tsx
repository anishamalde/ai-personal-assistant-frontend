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

/**
 * Camera component for capturing and processing images
 * Allows users to take pictures, switch between front and back cameras,
 * and send captured images for analysis only when explicitly requested
 * @returns {JSX.Element} Camera interface component
 */
export function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const navigation = useNavigation();

  // Local state for storing the captured image
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  // Get context methods but don't use them until analyze is pressed
  const { setImageUri, clearImage } = useChat();

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
      const photo = await ref.current?.takePictureAsync({
        quality: 0.6,
        imageType: "jpg",
        skipProcessing: false,
      });

      if (photo?.uri) {
        // Only store the image locally
        setLocalImageUri(photo.uri);
      }
    } catch (error) {
      console.error("Error taking or storing picture:", error);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleRetake = () => {
    // Clear the local image only
    setLocalImageUri(null);
  };

  const navigateToChat = () => {
    // Only now send the image to context
    if (localImageUri) {
      setImageUri(localImageUri);
    }

    navigation.navigate("HomeTabs", {
      screen: "Chat",
    });
    setLocalImageUri(null);
  };

  const renderPicture = () => {
    return (
      <View style={styles.overlayContainer}>
        <Card style={styles.pictureContainer}>
          <Card.Cover
            style={styles.picture}
            source={{ uri: localImageUri || undefined }}
          />
          <Card.Actions style={styles.pictureActions}>
            <Button style={styles.button} onPress={handleRetake}>
              Retake
            </Button>
            <Button style={styles.button} onPress={navigateToChat}>
              Analyse
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.controlsContainer}>
          {!localImageUri && (
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
          )}
        </View>
      </CameraView>

      {/* Overlay the picture on top when we have an image */}
      {localImageUri && renderPicture()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Changed to black to avoid white flashes
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  pictureContainer: {
    height: "90%",
    width: "90%",
  },
  picture: {
    height: "85%",
  },
  pictureActions: {
    height: "15%",
  },
  button: {
    width: "48%",
  },
});
