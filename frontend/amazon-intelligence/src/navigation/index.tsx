import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, useTheme } from "react-native-paper";
import { Home, Profile, Chat, Camera, NotFound } from "./screens";
import { TabIcon } from "../components";

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
                navigation.navigate("Profile", { user: "jane" });
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
        height: 110,
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      tabBarIconStyle: {
        color: theme.colors.tertiary,
        width: 45,
        height: 45,
      },
    };
  },
});

//The tab bar is only visible when you're in the "HomeTabs" portion of the app
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
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
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

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
