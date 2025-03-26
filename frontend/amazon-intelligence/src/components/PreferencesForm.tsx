import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, RadioButton, Divider, MD3Theme, useTheme, Menu, Button } from 'react-native-paper';

type TemperatureUnit = 'celsius' | 'fahrenheit';
type GeneralUnits = 'metric' | 'imperial';
type VoiceId = 'Joanna' | 'Matthew' | 'Salli' | 'Kimberly' | 'Amy' | 'Brian' | 'Emma' | 'Russell';

interface Preferences {
  temperatureUnit: TemperatureUnit;
  generalUnits: GeneralUnits;
  aiVoice: VoiceId;
}

// List of common Amazon Polly voices with their display names
const voiceOptions = [
  { label: 'Joanna (Female, US)', value: 'Joanna' },
  { label: 'Matthew (Male, US)', value: 'Matthew' },
  { label: 'Salli (Female, US)', value: 'Salli' },
  { label: 'Kimberly (Female, US)', value: 'Kimberly' },
  { label: 'Amy (Female, British)', value: 'Amy' },
  { label: 'Brian (Male, British)', value: 'Brian' },
  { label: 'Emma (Female, British)', value: 'Emma' },
  { label: 'Russell (Male, Australian)', value: 'Russell' },
];

const PreferencesForm = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Local state for form values
  const [preferences, setPreferences] = useState<Preferences>({
    temperatureUnit: 'celsius',
    generalUnits: 'metric',
    aiVoice: 'Joanna'
  });
  
  // State for menu visibility
  const [menuVisible, setMenuVisible] = useState(false);

  // Update a single preference field
  const updatePreference = (field: keyof Preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get the label for the currently selected voice
  const getSelectedVoiceLabel = () => {
    const selectedVoice = voiceOptions.find(option => option.value === preferences.aiVoice);
    return selectedVoice ? selectedVoice.label : 'Select a voice';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Assistant Settings" />
        <Card.Content>
          <Text style={styles.label}>AI Assistant Voice</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setMenuVisible(true)}
                style={styles.dropdown}
              >
                {getSelectedVoiceLabel()}
              </Button>
            }
          >
            {voiceOptions.map((option) => (
              <Menu.Item
                key={option.value}
                title={option.label}
                onPress={() => {
                  updatePreference('aiVoice', option.value);
                  setMenuVisible(false);
                }}
              />
            ))}
          </Menu>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Units" />
        <Card.Content>
          <Text style={styles.sectionTitle}>Temperature</Text>
          <RadioButton.Group
            value={preferences.temperatureUnit}
            onValueChange={(value) => 
              updatePreference('temperatureUnit', value as TemperatureUnit)
            }
          >
            <View style={styles.radioOption}>
              <RadioButton value="celsius" />
              <Text>Celsius (°C)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="fahrenheit" />
              <Text>Fahrenheit (°F)</Text>
            </View>
          </RadioButton.Group>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Measurement System</Text>
          <RadioButton.Group
            value={preferences.generalUnits}
            onValueChange={(value) => 
              updatePreference('generalUnits', value as GeneralUnits)
            }
          >
            <View style={styles.radioOption}>
              <RadioButton value="metric" />
              <Text>Metric (km, kg, etc.)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="imperial" />
              <Text>Imperial (miles, pounds, etc.)</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    card: {
      marginBottom: 16,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    dropdown: {
      marginBottom: 16,
      width: '100%',
    },
    divider: {
      marginVertical: 16,
    }
  });

export default PreferencesForm;
