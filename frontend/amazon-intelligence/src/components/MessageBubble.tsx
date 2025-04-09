import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Surface, Avatar, useTheme, MD3Theme } from "react-native-paper";
import { Image } from "react-native";

type MessageBubbleProps = {
  isUser: boolean;
  message?: string;
  imageUri?: string;
};

/**
 * MessageBubble component displays chat messages with different styles
 * for user messages and AI assistant messages
 *
 * @param props - Component props
 * @param props.isUser - Whether the message is from the user (true) or AI (false)
 * @param props.message - Text content of the message
 * @param props.imageUri - URI of an image to display instead of text
 */
const MessageBubble = ({ isUser, message, imageUri }: MessageBubbleProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={isUser ? styles.messageContainer : styles.aiMessageContainer}>
      <Avatar.Icon
        size={40}
        icon={isUser ? "account" : "robot"}
        style={isUser ? styles.avatar : styles.aiAvatar}
      />

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Surface
          style={isUser ? styles.userMessageBubble : styles.aiMessageBubble}
        >
          <Text style={isUser ? styles.messageText : styles.aiMessageText}>
            {message}
          </Text>
        </Surface>
      )}
    </View>
  );
};

export default MessageBubble;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    messageContainer: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-end",
    },
    aiMessageContainer: {
      flexDirection: "row-reverse",
      marginBottom: 16,
      alignItems: "flex-end",
    },
    avatar: {
      backgroundColor: theme.colors.primary,
      marginRight: 8,
    },
    aiAvatar: {
      backgroundColor: theme.colors.secondary,
      marginLeft: 8,
    },
    userMessageBubble: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      padding: 12,
      maxWidth: "75%",
      elevation: 1,
    },
    aiMessageBubble: {
      backgroundColor: theme.colors.secondaryContainer,
      borderRadius: 20,
      borderBottomRightRadius: 4,
      padding: 12,
      maxWidth: "75%",
      elevation: 1,
    },
    messageText: {
      color: theme.colors.onPrimary,
    },
    aiMessageText: {
      color: theme.colors.onSecondaryContainer,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 16,
    },
  });
