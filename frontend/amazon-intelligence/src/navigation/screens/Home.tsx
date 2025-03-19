import { Button } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";

export function Home() {
  return (
    <View style={styles.container}>
      <Button screen="Profile" params={{ user: "jane" }}>
        Go to Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
