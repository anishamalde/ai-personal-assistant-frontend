import React from "react";
import { StyleSheet, View } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";
import { Microphone } from "../../components";

export function Home() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
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
  });
