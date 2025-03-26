import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

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

// Get storage key for current user
const getPreferencesKey = (userId: string) => `app_preferences_${userId}`;

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
  const { userData, isAuthenticated } = useAuth();
  
  // Get user-specific storage key
  const userId = userData?.sub || 'guest';
  const storageKey = getPreferencesKey(userId);

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(storageKey);
        
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
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
  }, [storageKey, isAuthenticated]);

  // Save preferences to storage whenever they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    };

    // Don't save during initial load or if not authenticated
    if (!isLoading && isAuthenticated) {
      savePreferences();
    }
  }, [preferences, isLoading, storageKey, isAuthenticated]);

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
