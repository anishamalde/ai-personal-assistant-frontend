import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useChat } from "../../context/ChatContext";

export function Chat() {
  const { imageUri } = useChat();
  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
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
  },
  noImageText: {
    fontSize: 18,
    color: "#777",
  },
});
