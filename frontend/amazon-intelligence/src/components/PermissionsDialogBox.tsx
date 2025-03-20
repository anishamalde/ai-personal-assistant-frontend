import * as React from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

interface PermissionsDialogBoxProps {
  message?: string;
  requestPermission: () => void;
}

const PermissionsDialogBox = ({
  message,
  requestPermission,
}: PermissionsDialogBoxProps) => {
  const [visible, setVisible] = React.useState(true);

  const hideDialog = () => setVisible(false);

  const handlePermissionRequest = () => {
    requestPermission();
    hideDialog();
  };

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Camera Permission</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handlePermissionRequest}>Grant Permission</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default PermissionsDialogBox;
