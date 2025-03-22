import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme, MD3Theme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("Moments25!");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      await signIn(username, password);
    } catch (error) {
      let errorMessage = "Authentication failed";

      if (
        error.code === "UserNotFoundException" ||
        error.code === "NotAuthorizedException"
      ) {
        errorMessage = "Incorrect username or password";
      } else if (error.code === "UserNotConfirmedException") {
        errorMessage = "Please verify your account";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Sign In
      </Button>
    </SafeAreaView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "theme.colors.background",
      margin: 16,
      justifyContent: "center",
    },
    input: {
      marginBottom: 16,
    },
  });

export default LoginScreen;
