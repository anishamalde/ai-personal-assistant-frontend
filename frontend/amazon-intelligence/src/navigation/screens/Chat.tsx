import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, useTheme, MD3Theme, Button } from "react-native-paper";
import { useChat } from "../../context/ChatContext";
import { MessageBubble, Microphone } from "../../components";
/**
 * Chat screen component displaying conversation messages and voice input
 * @returns {JSX.Element} Chat interface component
 */
export function Chat() {
  const { messages, isLoading, clearMessages, conversationId } = useChat();
  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const prevMessageCountRef = useRef<number>(0);

  /**
   * Effect to handle automatic scrolling and text-to-speech for new messages
   */
  useEffect(() => {
    // Handle scrolling
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleClearMessages = () => {
    clearMessages();
    prevMessageCountRef.current = 0;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.conversationId}>
          Conversation ID: {conversationId.substring(0, 8)}...
        </Text>
        <Button mode="text" onPress={handleClearMessages} compact icon="delete">
          Clear
        </Button>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Start a conversation by speaking or taking a photo
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <MessageBubble
                isUser={message.isUser}
                message={message.imageUri ? undefined : message.content}
                imageUri={message.imageUri}
              />
            </View>
          ))
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.loadingText}>Processing your message...</Text>
          </View>
        )}
      </ScrollView>
      <Microphone mode="chat" />
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    conversationId: {
      fontSize: 12,
      color: theme.colors.outline,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexGrow: 1,
    },
    messageContainer: {
      position: "relative",
      marginBottom: 8,
    },
    playButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      zIndex: 1,
    },
    loadingContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    loadingText: {
      marginTop: 8,
      color: theme.colors.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      opacity: 0.6,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.outline,
    },
  });
