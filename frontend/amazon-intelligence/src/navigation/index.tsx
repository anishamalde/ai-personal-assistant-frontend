import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, useTheme, ActivityIndicator } from "react-native-paper";
import { Home, Profile, Chat, Camera, NotFound, LoginScreen } from "./screens";
import { TabIcon } from "../components";
import { useAuth } from "../context/AuthContext";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Define param types for each navigator. When a screen doesn't require any parameters for navigation, we use undefined to explicitly show that.

export type TabParamList = {
  Home: undefined;
  Chat: undefined;
  Camera: undefined;
};

export type RootStackParamList = {
  HomeTabs: { screen?: keyof TabParamList } | undefined;
  Profile: undefined;
  NotFound: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const CustomHeaderButton = ({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) => (
  <Pressable onPress={onPress} style={{ marginRight: 15 }}>
    {children}
  </Pressable>
);

// Tab navigator component
function HomeTabs() {
  const theme = useTheme();

  // Get root navigation for navigating outside tabs
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          height: 110,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          color: theme.colors.tertiary,
          width: 45,
          height: 45,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={() => ({
          headerRight: () => (
            <CustomHeaderButton onPress={() => navigation.navigate("Profile")}>
              <Icon
                source="account-cog"
                color={theme.colors.primary}
                size={30}
              />
            </CustomHeaderButton>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon source="home" focused={focused} />
          ),
        })}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source="chat" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={({ navigation }) => ({
          presentation: "modal",
          headerRight: () => (
            <CustomHeaderButton onPress={() => navigation.goBack()}>
              <Icon source="close" color={theme.colors.onSurface} size={30} />
            </CustomHeaderButton>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon source="camera" focused={focused} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

function RootStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Your Profile" }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFound}
        options={{ title: "404" }}
      />
    </Stack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

export function Navigation({ onReady }: { onReady?: () => void }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e3050" />
      </View>
    );
  }
  return (
    <NavigationContainer onReady={onReady}>
      {isAuthenticated ? <RootStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Extend the default RootParamList with our custom parameters
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      HomeTabs: { screen?: keyof TabParamList } | undefined;
    }
  }
}
