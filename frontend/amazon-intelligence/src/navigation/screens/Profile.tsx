import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Card, MD3Theme, useTheme, Button, Divider } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import PreferencesForm from "../../components/PreferencesForm";

export function Profile() {
  const { userData, signOut } = useAuth();
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Profile</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              {userData?.nickname || "User"}
            </Text>
            
            {userData?.email && (
              <Text variant="bodyMedium">Email: {userData.email}</Text>
            )}
            
            {userData?.phone_number && (
              <Text variant="bodyMedium">Phone: {userData.phone_number}</Text>
            )}
            
            {userData?.sub && (
              <Text variant="bodySmall" style={styles.subText}>
                User ID: {userData.sub}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />
        
        <Text style={styles.sectionHeader}>Preferences</Text>
        <Text style={styles.description}>
          Customize your experience with these settings.
          Changes will be applied to future conversations.
        </Text>
        
        <PreferencesForm />

        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={theme.colors.error}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.colors.primary,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.colors.primary,
    },
    description: {
      marginBottom: 16,
      color: theme.colors.onSurfaceVariant,
    },
    card: {
      marginBottom: 16,
      elevation: 2,
    },
    cardTitle: {
      marginBottom: 8,
      fontWeight: "bold",
    },
    subText: {
      marginTop: 8,
      color: theme.colors.outline,
    },
    divider: {
      marginVertical: 16,
    },
    logoutButton: {
      marginTop: 16,
      paddingVertical: 6,
    },
  });
