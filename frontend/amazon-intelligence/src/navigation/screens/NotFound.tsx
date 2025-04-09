import { Text, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme, MD3Theme } from "react-native-paper";

/**
 * NotFound screen component displayed when a route is not found
 * Provides a 404 error message and a button to return to the home screen
 *
 * @returns {React.JSX.Element} Rendered 404 Not Found screen
 */
export function NotFound() {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>404</Text>
      <Text style={styles.errorMessage}>Page Not Found</Text>
      <Text style={styles.errorDescription}>
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("HomeTabs")}
        style={styles.button}
      >
        Go to Home
      </Button>
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
      padding: 20,
    },
    errorCode: {
      fontSize: 72,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 16,
    },
    errorMessage: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    errorDescription: {
      fontSize: 16,
      color: theme.colors.secondary,
      textAlign: "center",
      marginBottom: 24,
    },
    button: {
      marginTop: 16,
      paddingHorizontal: 24,
    },
  });

export default NotFound;
