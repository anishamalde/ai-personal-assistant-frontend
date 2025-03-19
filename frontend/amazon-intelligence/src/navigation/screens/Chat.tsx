import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Chat() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedImage = async () => {
      try {
        const savedImageUri = await AsyncStorage.getItem("lastCapturedImage");
        if (savedImageUri) {
          setImage(savedImageUri);
        }
      } catch (error) {
        console.error("Error loading saved image:", error);
      }
    };

    loadSavedImage();
  }, []);

  return (
    <View style={styles.container}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.noImageText}>No image available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
    marginBottom: 20,
  },
  pathText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  noImageText: {
    fontSize: 18,
    color: "#777",
  },
});
