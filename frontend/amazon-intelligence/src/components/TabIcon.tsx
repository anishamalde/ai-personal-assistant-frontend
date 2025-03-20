import React from "react";
import { Icon, useTheme } from "react-native-paper";

interface TabIconProps {
  source: string;
  focused: boolean;
}

const TabIcon = ({ source, focused }: TabIconProps) => {
  const theme = useTheme();
  return (
    <Icon
      source={source}
      color={focused ? theme.colors.tertiary : theme.colors.iconTintColor}
      size={36}
    />
  );
};

export default TabIcon;
