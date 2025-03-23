import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, useTheme } from "react-native-paper";
import { Home, Profile, Chat, Camera, NotFound, LoginScreen } from "./screens";
import { TabIcon } from "../components";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, StyleSheet, Pressable } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

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

function HomeTabs() {
  const theme = useTheme();

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
        options={({ navigation }) => ({
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

export function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e3050" />
      </View>
    );
  }

  return (
    <NavigationContainer>
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

type RootStackParamList = {
  HomeTabs: undefined;
  Profile: undefined;
  NotFound: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
