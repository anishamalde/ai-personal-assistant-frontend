import React from "react";
import { StyleSheet, View } from "react-native";
import { MD3Theme, useTheme, Text } from "react-native-paper";
import { Microphone } from "../../components";
import { useAuth } from "../../context/AuthContext";

export function Home() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { userData } = useAuth();

  return (
    <View style={styles.container}>
      {userData?.nickname ? (
        <Text style={styles.welcomeText}>Welcome, {userData.nickname}!</Text>
      ) : (
        <Text style={styles.welcomeText}>Welcome!</Text>
      )}
      <Microphone />
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.colors.primary,
    },
  });
