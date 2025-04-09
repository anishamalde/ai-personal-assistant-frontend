import React from "react";
import { Icon, useTheme } from "react-native-paper";

interface TabIconProps {
  source: string;
  focused: boolean;
}

/**
 * TabIcon component for navigation tabs
 * Displays an icon with different colors based on focus state
 */
const TabIcon = ({ source, focused }: TabIconProps) => {
  const theme = useTheme();
  return (
    <Icon
      source={source}
      color={focused ? theme.colors.surface : theme.colors.tertiary}
      size={36}
    />
  );
};

export default TabIcon;
