import React, { useRef, useEffect } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';

interface AnimatedImageProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  visible: boolean;
  onAnimationEnd: () => void;
  image?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ startX, startY, endX, endY, visible, onAnimationEnd }) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: endX,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: endY,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationEnd();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.image, { transform: [{ translateX }, { translateY }] }]}>
      <Image source={require("@/assets/images/home/product1.png")} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    position: 'absolute',
  },
});

export default AnimatedImage;