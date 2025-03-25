import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import { useChat } from '../context/ChatContext';

export default function LocationPermission() {
  const [visible, setVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const theme = useTheme();
  const { setLocation } = useChat();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionStatus(status);
    
    if (status !== 'granted') {
      setVisible(true);
    } else {
      getCurrentLocation();
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    
    if (status === 'granted') {
      getCurrentLocation();
      setVisible(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // Try to get the location name using reverse geocoding
      let locationName = "Unknown Location";
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const { city, region, country } = geocode[0];
          locationName = [
            city,
            region && region.length <= 3 ? region : null,
            country
          ]
            .filter(Boolean)
            .join(', ');
        }
      } catch (error) {
        console.warn('Error getting location name:', error);
      }

      // Update location in ChatContext
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: locationName,
      });
      
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose}>
        <Dialog.Title>Location Access</Dialog.Title>
        <Dialog.Content>
          <Text>
            This app uses your location to provide more relevant responses. 
            Would you like to grant location access?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleClose}>Not Now</Button>
          <Button onPress={requestPermission} mode="contained">
            Allow
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
