import * as React from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

interface PermissionsDialogBoxProps {
  message?: string;
  requestPermission: () => void;
}

/**
 * Dialog component that requests user permission for app features
 *
 * Displays a modal dialog explaining why permissions are needed
 * and provides options to grant or deny the permission request.
 *
 * @param props - Component props
 * @param props.message - Custom message to display in the dialog
 * @param props.requestPermission - Function to call when user grants permission
 */
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
          <Dialog.Title>Requesting Permissions</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} mode="outlined">
              Cancel
            </Button>
            <Button onPress={handlePermissionRequest} mode="contained">
              Grant Permission
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default PermissionsDialogBox;
