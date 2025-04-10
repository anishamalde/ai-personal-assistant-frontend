import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";

type AnimationVariant = "dots" | "pulse";

interface RecordingAnimationProps {
  isRecording: boolean;
  size?: "small" | "large";
  variant?: AnimationVariant;
  text?: string;
}

/**
 * Component that displays animated recording indicators
 * Supports two animation styles: dots (three bouncing dots) or pulse (pulsing circle with text)
 */
const RecordingAnimation = ({
  isRecording,
  size = "large",
  variant = "dots",
  text,
}: RecordingAnimationProps) => {
  const theme = useTheme();

  const dotAnimations = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const pulseAnim = useRef(new Animated.Value(1)).current;

  /**
   * Manages dot animation lifecycle based on recording state
   */
  useEffect(() => {
    if (isRecording && variant === "dots") {
      // Start animation sequence for each dot with different delays
      dotAnimations.forEach((anim, index) => {
        createDotAnimation(anim, index);
      });
    } else if (!isRecording && variant === "dots") {
      // Reset animations when not recording
      dotAnimations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).stop();
        anim.setValue(1);
      });
    }
  }, [isRecording, variant]);

  /**
   * Manages pulse animation based on recording state
   */
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;

    if (isRecording && variant === "pulse") {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isRecording, variant]);

  /**
   * Creates the animation sequence for a single dot
   * @param anim - The Animated.Value to animate
   * @param index - Index of the dot (used for staggered animation)
   */
  const createDotAnimation = (anim: Animated.Value, index: number) => {
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

  // Determine dot size based on the size prop
  const dotSize = size === "small" ? 6 : 12;
  const marginTop = size === "small" ? 10 : 20;
  const containerHeight = size === "small" ? 10 : 20;

  if (variant === "dots") {
    return (
      <View
        style={[styles.dotsContainer, { marginTop, height: containerHeight }]}
      >
        {dotAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isRecording ? theme.colors.primary : "#CCCCCC",
                transform: [{ scale: anim }],
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                marginHorizontal: size === "small" ? 3 : 5,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.pulseContainer}>
      <Animated.View
        style={[
          styles.pulseIndicator,
          {
            backgroundColor: theme.colors.error,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      {text && <Text style={styles.pulseText}>{text}</Text>}
    </View>
  );
};

export default RecordingAnimation;

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {},
  pulseContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pulseText: {
    flex: 1,
    fontSize: 16,
  },
});
