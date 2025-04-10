import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Location from "expo-location";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

interface PermissionsContextType {
  locationPermission: string | null;
  microphonePermission: boolean | null;
  showPermissionsDialog: boolean;
  requestLocationPermission: () => Promise<void>;
  requestMicrophonePermission: () => Promise<void>;
  requestAllPermissions: () => Promise<void>;
  checkLocationPermission: () => Promise<void>;
  checkMicrophonePermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  setLocation: (location: LocationData) => void;
  location: LocationData | null;
}

/**
 * Context for managing app permissions
 */
const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

/**
 * Provider component for managing app permissions
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Permissions provider component
 */
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

  /**
   * Check permissions on component mount
   */
  useEffect(() => {
    checkLocationPermission();
    checkMicrophonePermission();
  }, []);

  /**
   * Show permissions dialog when permissions are not granted
   */
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

  const requestMicrophonePermission = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      setMicrophonePermission(result.granted);

      if (!result.granted) {
        console.warn("Microphone permission request was denied");
      }
    } catch (error) {
      console.error("Failed to request speech permission:", error);
      setMicrophonePermission(false);
    }
  };

  const requestAllPermissions = async () => {
    // Request location permission if not granted
    if (locationPermission !== "granted") {
      await requestLocationPermission();
    }

    // Request microphone permission if not granted
    if (microphonePermission !== true) {
      await requestMicrophonePermission();
    }
  };

  const getCurrentLocation = async () => {
    try {
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log("Location Data", locationData);

      // Get the location name using reverse geocoding
      let locationName = "Unknown Location";
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });

        console.log(geocode);

        if (geocode.length > 0) {
          const { city, region, country } = geocode[0];
          const locationParts = [
            city,
            region && region.length <= 3 ? region : null,
            country,
          ].filter(Boolean);

          locationName =
            locationParts.length > 0
              ? locationParts.join(", ")
              : "Unknown Location";
        }
      } catch (error) {
        console.warn("Error getting location name:", error);
      }

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
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
    requestAllPermissions,
    location,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

/**
 * Custom hook to access the permissions context
 * @returns {PermissionsContextType} Permissions context value
 * @throws {Error} If used outside of a PermissionsProvider
 */
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
