import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, useTheme } from "react-native-paper";
import { Home, Profile, Chat, Camera, NotFound, LoginScreen } from "./screens";
import { TabIcon } from "../components";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: ({ navigation }) => {
        const theme = useTheme();
        return {
          headerRight: () => (
            <HeaderButton
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <Icon
                source="account-cog"
                color={theme.colors.primary}
                size={30}
              />
            </HeaderButton>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon source="home" focused={focused} />
          ),
        };
      },
    },
    Chat: {
      screen: Chat,
      options: () => {
        return {
          tabBarIcon: ({ focused }) => (
            <TabIcon source="chat" focused={focused} />
          ),
        };
      },
    },
    Camera: {
      screen: Camera,
      options: ({ navigation }) => {
        const theme = useTheme();
        return {
          presentation: "modal",
          headerRight: () => (
            <HeaderButton onPress={navigation.goBack}>
              <Icon source="close" color={theme.colors.onSurface} size={30} />
            </HeaderButton>
          ),
          tabBarIcon: ({ focused }) => (
            <TabIcon source="camera" focused={focused} />
          ),
        };
      },
    },
  },
  screenOptions: () => {
    const theme = useTheme();
    return {
      tabBarStyle: {
        backgroundColor: theme.colors.primary,
        height: 70,
        borderTopWidth: 0,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarShowLabel: false,
      tabBarIconStyle: {
        color: theme.colors.tertiary,
        width: 40,
        height: 40,
      },
    };
  },
});

// Auth stack navigator for login screen
const AuthStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

// Main stack navigator - unchanged from your original
const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: "Your Profile",
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

// Navigation container that decides which stack to show based on auth state
const NavigationRoot = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e3050" />
      </View>
    );
  }

  // Use RootStack if authenticated, otherwise use AuthStack
  const Navigation = createStaticNavigation(
    isAuthenticated ? RootStack : AuthStack
  );

  return <Navigation />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { NavigationRoot as Navigation };

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
