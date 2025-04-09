import { useState, useEffect, useCallback, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { usePreferences } from "../context/PreferencesContext";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

/**
 * Custom hook for text-to-speech conversion using AWS Polly
 * @returns {Object} Methods and state for controlling speech playback
 * @property {(text: string) => Promise<void>} speak - Function to convert text to speech and play it
 * @property {boolean} isPlaying - Whether audio is currently playing
 * @property {boolean} isLoading - Whether audio is currently being prepared
 * @property {() => Promise<void>} stop - Function to stop audio playback
 */
const usePollyVoice = () => {
  const { preferences } = usePreferences();
  const voiceId = preferences?.aiVoice;

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);

  /**
   * Cleanup audio resources on component unmount
   */
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  /**
   * Converts text to speech using AWS Polly and plays the audio
   * @param {string} text - The text to convert to speech
   * @returns {Promise<void>}
   */
  const speak = useCallback(
    async (text: string) => {
      if (!text || isProcessingRef.current) return;

      isProcessingRef.current = true;
      setIsLoading(true);

      try {
        // Unload previous sound
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        // Initialize audio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        const { credentials } = await fetchAuthSession();
        const region =
          Amplify.getConfig().Predictions?.convert?.translateText?.region ||
          "us-east-1";

        const pollyClient = new PollyClient({ region, credentials });

        const result = await pollyClient.send(
          new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: text,
            VoiceId: voiceId,
            TextType: "text",
            Engine: "neural",
          })
        );

        if (!result.AudioStream) throw new Error("No audio stream received");

        // Process audio data - manual conversion
        const uint8Array = await result.AudioStream.transformToByteArray();

        const base64 = btoa(
          Array.from(uint8Array)
            .map((byte) => String.fromCharCode(byte))
            .join("")
        );

        // Save to temporary file
        const audioPath = `${FileSystem.cacheDirectory}polly_${Date.now()}.mp3`;
        await FileSystem.writeAsStringAsync(audioPath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Play the audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);

        // Monitor playback status
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
              // Clean up the file after playback
              FileSystem.deleteAsync(audioPath, { idempotent: true }).catch(
                () => {}
              );
            }
          }
        });
      } catch (error) {
        console.error("Error playing Polly voice:", error);
      } finally {
        setIsLoading(false);
        isProcessingRef.current = false;
      }
    },
    [sound, voiceId]
  );

  const stop = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }, [sound]);

  return { speak, isPlaying, isLoading, stop };
};

export default usePollyVoice;
