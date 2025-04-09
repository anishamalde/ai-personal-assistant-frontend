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
 * and send captured images for analysis
 * @returns {JSX.Element} Camera interface component
 */
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
      <Card style={styles.pictureContainer}>
        <Card.Cover
          style={styles.picture}
          source={{ uri: imageUri || undefined }}
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
