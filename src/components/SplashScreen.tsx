import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen = ({ onAnimationFinish }: SplashScreenProps) => {
  const { theme } = useTheme();

  // Fade & scale animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.play();

    // Smooth scale-in animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Fade-out after animation completes
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => onAnimationFinish());
    }, 2200); // Adjust based on Lottie animation length

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Lottie Animation */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LottieView
          ref={lottieRef}
          source={require('../../assets/animations/anchorsplash.json')} // ⭐ New animation file
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
        />
      </Animated.View>

      {/* Welcome Text */}
      <Animated.Text
        style={[
          styles.welcomeText,
          { color: theme.text, opacity: fadeAnim },
        ]}
      >
        Welcome to <Text style={styles.greenText}>A</Text>
        nchor <Text style={styles.blueText}>H</Text>
        abits
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lottieAnimation: {
    width: 220,
    height: 220,
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },

  greenText: {
    color: '#2E8B57', // Green
  },

  blueText: {
    color: '#4682B4', // Blue
  },
});

export default SplashScreen;
