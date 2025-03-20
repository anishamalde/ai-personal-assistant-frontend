import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface RecordingAnimationProps {
  isRecording: boolean;
}

const RecordingAnimation = ({ isRecording }: RecordingAnimationProps) => {
  const theme = useTheme();
  const animations = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  useEffect(() => {
    if (isRecording) {
      // Start animation sequence for each dot with different delays
      animations.forEach((anim, index) => {
        createAnimation(anim, index);
      });
    } else {
      // Reset animations when not recording
      animations.forEach((anim) => {
        Animated.timing(anim).stop();
        anim.setValue(1);
      });
    }
  }, [isRecording]);

  const createAnimation = (
    anim: Animated.Value | Animated.ValueXY,
    index: number
  ) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.5,
          duration: 300,
          delay: index * 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <View style={styles.dotsContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: isRecording ? theme.colors.primary : "#CCCCCC",
              transform: [{ scale: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default RecordingAnimation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    margin: 0,
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    height: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});
