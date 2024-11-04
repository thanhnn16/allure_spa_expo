import { Extrapolation, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useHeaderDimensions = () => {
  const headerHeight = useHeaderHeight();
  const { top: statusBarHeight } = useSafeAreaInsets();
  const HEADER_HEIGHT = headerHeight + statusBarHeight + 80;
  const SCROLL_THRESHOLD = HEADER_HEIGHT / 2;
  const OPACITY_THRESHOLD = SCROLL_THRESHOLD / 2;

  return { HEADER_HEIGHT, SCROLL_THRESHOLD, OPACITY_THRESHOLD };
};

const ANIMATION_DURATION = 200;

export const hideStyle = (scrollOffset: any, HEADER_HEIGHT: number, SCROLL_THRESHOLD: number, OPACITY_THRESHOLD: number) => useAnimatedStyle(() => {
  const headerOpacityAnimated = interpolate(
    scrollOffset.value,
    [0, OPACITY_THRESHOLD],
    [1, 0],
    Extrapolation.CLAMP
  );

  return {
    opacity: withTiming(headerOpacityAnimated, { duration: ANIMATION_DURATION }),
    transform: [
      {
        translateY: withTiming(
          interpolate(
            scrollOffset.value,
            [0, SCROLL_THRESHOLD],
            [0, -HEADER_HEIGHT],
            Extrapolation.CLAMP
          ),
          { duration: ANIMATION_DURATION }
        ),
      },
    ],
  };
});

export const showStyle = (scrollOffset: any, HEADER_HEIGHT: number, SCROLL_THRESHOLD: number) => useAnimatedStyle(() => {
  const headerOpacityAnimated = interpolate(
    scrollOffset.value,
    [0, SCROLL_THRESHOLD],
    [0, 1],
    Extrapolation.CLAMP
  );

  return {
    opacity: withTiming(headerOpacityAnimated, { duration: ANIMATION_DURATION }),
    transform: [
      {
        translateY: withTiming(
          interpolate(
            scrollOffset.value,
            [0, SCROLL_THRESHOLD],
            [HEADER_HEIGHT, 0],
            Extrapolation.CLAMP
          ),
          { duration: ANIMATION_DURATION }
        ),
      },
    ],
  };
});
