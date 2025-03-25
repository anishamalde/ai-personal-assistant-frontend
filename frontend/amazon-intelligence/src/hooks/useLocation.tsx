import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type LocationData = {
  latitude: number;
  longitude: number;
  name: string;
};

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        
        // Request foreground location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        // Get the current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Try to get the location name using reverse geocoding
        let locationName = "Unknown Location";
        try {
          const geocode = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

          if (geocode && geocode.length > 0) {
            const { city, region, country } = geocode[0];
            locationName = [
              city,
              region && region.length <= 3 ? region : null, // Only use region if it's an abbreviation
              country
            ]
              .filter(Boolean)
              .join(', ');
          }
        } catch (geocodeError) {
          console.warn('Error getting location name:', geocodeError);
        }

        // Set the location data
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          name: locationName,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Failed to get location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { location, errorMsg, isLoading };
}
