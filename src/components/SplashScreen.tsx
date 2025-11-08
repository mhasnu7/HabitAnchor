import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/constants';

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen = ({ onAnimationFinish }: SplashScreenProps) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Start Lottie animation
    lottieRef.current?.play();

    // Fade out animation after 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out duration
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => onAnimationFinish());
    }, 2000); // 2 seconds for the splash screen

    return () => clearTimeout(timer);
  }, [fadeAnim, onAnimationFinish]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim }]}>
      <LottieView
        ref={lottieRef}
        source={require('../../assets/lottie/AnimationForAnchor.json')}
        autoPlay
        loop={false}
        style={styles.lottieAnimation}
      />
      <Text style={[styles.welcomeText, { color: theme.text }]}>
        Welcome to <Text style={styles.greenText}>A</Text>nchor <Text style={styles.blueText}>H</Text>abits
      </Text>
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
    width: 200,
    height: 200,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  greenText: {
    color: '#2E8B57', // A shade of green
  },
  blueText: {
    color: '#4682B4', // A shade of blue
  },
});

export default SplashScreen;