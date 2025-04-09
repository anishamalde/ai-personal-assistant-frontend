import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

type TemperatureUnit = "celsius" | "fahrenheit";
type GeneralUnits = "metric" | "imperial";
type VoiceId =
  | "Joanna"
  | "Matthew"
  | "Salli"
  | "Kimberly"
  | "Amy"
  | "Brian"
  | "Emma"
  | "Russell";

export interface Preferences {
  temperatureUnit: TemperatureUnit;
  generalUnits: GeneralUnits;
  aiVoice: VoiceId;
}

const defaultPreferences: Preferences = {
  temperatureUnit: "celsius",
  generalUnits: "metric",
  aiVoice: "Joanna",
};

/**
 * Generate a storage key for the current user
 * @param userId - The user's unique identifier
 * @returns A unique storage key for the user's preferences
 */
const getPreferencesKey = (userId: string) => `app_preferences_${userId}`;

interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { userData, isAuthenticated } = useAuth();
  const isSavingRef = useRef(false);

  // Get user-specific storage key
  const userId = userData?.sub || "guest";
  const storageKey = getPreferencesKey(userId);

  /**
   * Load preferences from storage on mount or when user authentication changes
   */
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(storageKey);

        if (storedPreferences) {
          const parsedPreferences = JSON.parse(storedPreferences);
          setPreferences(parsedPreferences);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadPreferences();
    } else {
      setPreferences(defaultPreferences);
      setIsLoading(false);
    }
  }, [storageKey, isAuthenticated, userId]);

  /**
   * Save preferences to storage whenever they change
   */
  useEffect(() => {
    const savePreferences = async () => {
      // Prevent multiple simultaneous save operations
      if (isSavingRef.current) return;

      try {
        isSavingRef.current = true;
        await AsyncStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error("Failed to save preferences:", error);
      } finally {
        isSavingRef.current = false;
      }
    };

    // Don't save during initial load or if not authenticated
    if (!isLoading && isAuthenticated) {
      savePreferences();
    }
  }, [preferences, isLoading, storageKey, isAuthenticated, userId]);

  /**
   * Update a single preference
   * @param key - The preference key to update
   * @param value - The new value
   */
  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Reset all preferences to default values
   */
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Create the context value object
  const preferencesContextValue: PreferencesContextType = {
    preferences,
    updatePreference,
    resetPreferences,
    isLoading,
  };

  return (
    <PreferencesContext.Provider value={preferencesContextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
};
