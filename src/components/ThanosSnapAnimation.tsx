import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ThanosSnapAnimationProps {
  isVisible: boolean;
  onAnimationEnd: () => void;
  children: React.ReactNode;
}

const ThanosSnapAnimation: React.FC<ThanosSnapAnimationProps> = ({
  isVisible,
  onAnimationEnd,
  children,
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = 1;
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;

      opacity.value = withSequence(
        withDelay(
          500,
          withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) })
        )
      );
      scale.value = withSequence(
        withDelay(
          500,
          withTiming(0.5, { duration: 1500, easing: Easing.out(Easing.ease) })
        )
      );
      translateX.value = withSequence(
        withDelay(
          500,
          withTiming(Math.random() * width - width / 2, {
            duration: 1500,
            easing: Easing.out(Easing.ease),
          })
        )
      );
      translateY.value = withSequence(
        withDelay(
          500,
          withTiming(
            Math.random() * height - height / 2,
            { duration: 1500, easing: Easing.out(Easing.ease) },
            (isFinished?: boolean) => {
              if (isFinished) {
                runOnJS(onAnimationEnd)();
              }
            }
          )
        )
      );
    }
  }, [isVisible, onAnimationEnd]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (!isVisible && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThanosSnapAnimation;