import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-paper";
import { Home, Profile, Chat, Camera, NotFound } from "./screens";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Home",
        tabBarIcon: () => <Icon source="home" size={20} />,
      },
    },
    Chat: {
      screen: Chat,
      options: {
        tabBarIcon: () => <Icon source="chat" size={20} />,
      },
    },
    Camera: {
      screen: Camera,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Icon source="close" size={20} />
          </HeaderButton>
        ),
        tabBarIcon: () => <Icon source="camera" size={20} />,
      }),
    },
  },
});

//The tab bar is only visible when you're in the "HomeTabs" portion of the app
const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
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
