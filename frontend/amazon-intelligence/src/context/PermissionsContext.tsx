import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Location from "expo-location";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

type LocationData = {
  latitude: number;
  longitude: number;
  name: string;
};

type PermissionsContextType = {
  locationPermission: string | null;
  microphonePermission: boolean | null;
  showPermissionsDialog: boolean;
  requestLocationPermission: () => Promise<void>;
  requestMicrophonePermission: () => Promise<void>;
  checkLocationPermission: () => Promise<void>;
  checkMicrophonePermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  setLocation: (location: LocationData) => void;
  location: LocationData | null;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const [locationPermission, setLocationPermission] = useState<string | null>(
    null
  );
  const [microphonePermission, setMicrophonePermission] = useState<
    boolean | null
  >(null);
  const [showPermissionsDialog, setShowPermissionsDialog] =
    useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    checkLocationPermission();
    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    // Show dialog if either permission is not granted
    if (
      (locationPermission !== null && locationPermission !== "granted") ||
      (microphonePermission !== null && microphonePermission !== true)
    ) {
      setShowPermissionsDialog(true);
    } else {
      setShowPermissionsDialog(false);
    }
  }, [locationPermission, microphonePermission]);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);

      // Get location if permission is already granted
      if (status === "granted") {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Failed to check location permission:", error);
      setLocationPermission("denied");
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.getPermissionsAsync();
      setMicrophonePermission(result.granted);
    } catch (error) {
      console.error("Failed to check speech permission:", error);
      setMicrophonePermission(false);
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status === "granted") {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Failed to request location permission:", error);
      setLocationPermission("denied");
    }
  };

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        console.warn("Microphone permission not granted", result);
        setMicrophonePermission(false);
        return;
      }
      setMicrophonePermission(result.granted);
    } catch (error) {
      console.error("Failed to request speech permission:", error);
      setMicrophonePermission(false);
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
            country,
          ]
            .filter(Boolean)
            .join(", ");
        }
      } catch (error) {
        console.warn("Error getting location name:", error);
      }

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: locationName,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const value = {
    locationPermission,
    microphonePermission,
    showPermissionsDialog,
    requestLocationPermission,
    requestMicrophonePermission,
    checkLocationPermission,
    checkMicrophonePermission,
    getCurrentLocation,
    setLocation,
    location,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Custom hook to use the permissions context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
