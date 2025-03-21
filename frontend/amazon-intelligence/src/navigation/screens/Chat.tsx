import React from "react";
import { Image, StyleSheet, ScrollView, View } from "react-native";
import { Text, Surface, useTheme, MD3Theme, Avatar } from "react-native-paper";
import { useChat } from "../../context/ChatContext";

export function Chat() {
  const { imageUri, audioTranscription } = useChat();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {imageUri && (
        <View style={styles.messageContainer}>
          <Avatar.Icon size={40} icon="account" style={styles.avatar} />
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {audioTranscription && (
        <View style={styles.messageContainer}>
          <Avatar.Icon size={40} icon="account" style={styles.avatar} />
          <Surface style={styles.userMessageBubble}>
            <Text style={styles.messageText}>{audioTranscription}</Text>
          </Surface>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollViewContent: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexGrow: 1,
      justifyContent: "flex-end",
    },
    messageContainer: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-end",
    },
    avatar: {
      backgroundColor: theme.colors.primary,
      marginRight: 8,
    },
    userMessageBubble: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      padding: 12,
      maxWidth: "75%",
      elevation: 1,
    },
    userImageBubble: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      overflow: "hidden",
      maxWidth: "75%",
      elevation: 1,
    },
    messageText: {
      color: theme.colors.onPrimary,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 16,
    },
  });
