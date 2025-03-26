import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for our preferences
type TemperatureUnit = 'celsius' | 'fahrenheit';
type GeneralUnits = 'metric' | 'imperial';
type VoiceId = 'Joanna' | 'Matthew' | 'Salli' | 'Kimberly' | 'Amy' | 'Brian' | 'Emma' | 'Russell';

export interface Preferences {
  temperatureUnit: TemperatureUnit;
  generalUnits: GeneralUnits;
  aiVoice: VoiceId;
}

// Default preferences
const defaultPreferences: Preferences = {
  temperatureUnit: 'celsius',
  generalUnits: 'metric',
  aiVoice: 'Joanna'
};

// Storage key
const PREFERENCES_STORAGE_KEY = 'app_preferences';

// Context interface
interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

// Create the context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Provider component
export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage whenever they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    };

    // Don't save during initial load
    if (!isLoading) {
      savePreferences();
    }
  }, [preferences, isLoading]);

  // Update a single preference
  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider 
      value={{ 
        preferences, 
        updatePreference, 
        resetPreferences,
        isLoading 
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook to use the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  return context;
};
