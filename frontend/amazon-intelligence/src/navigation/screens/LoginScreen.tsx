import React, { useState } from "react";
import { StyleSheet, Alert, Text } from "react-native";
import { TextInput, Button, useTheme, MD3Theme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

// Define error type
interface AuthError {
  code?: string;
  message?: string;
}

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
    // Validate inputs
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      // Attempt login
      setLoading(true);
      setErrorMessage("");
      await signIn(username, password);
    } catch (error) {
      console.log("Login error details:", JSON.stringify(error));

      // Provide specific error messages based on error type
      let message = "Authentication failed";
      const authError = error as AuthError;

      if (
        authError.code === "UserNotFoundException" ||
        authError.code === "NotAuthorizedException"
      ) {
        message = "Incorrect username or password";
      } else if (authError.code === "UserNotConfirmedException") {
        message = "Please verify your account";
      } else if (authError.message) {
        message = authError.message;
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Amazon Intelligence</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        placeholder="Enter your password"
        autoComplete="password"
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
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
      backgroundColor: theme.colors.background,
      padding: 16,
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 32,
      textAlign: "center",
      color: theme.colors.primary,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
      paddingVertical: 6,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 16,
      textAlign: "center",
    },
  });

export default LoginScreen;
