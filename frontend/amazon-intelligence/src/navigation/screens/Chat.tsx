import React, { useRef, useEffect } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { Text, useTheme, MD3Theme } from "react-native-paper";
import { useChat } from "../../context/ChatContext";
import { MessageBubble } from "../../components";

export function Chat() {
  const { messages, isLoading } = useChat();
  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      // Use setTimeout to ensure the render completes before scrolling
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
    >
      {/* Render all messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          isUser={message.isUser}
          message={message.imageUri ? undefined : message.content}
          imageUri={message.imageUri}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Processing your message...</Text>
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
    },
    loadingContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    loadingText: {
      marginTop: 8,
      color: theme.colors.primary,
    },
  });
