import { Extrapolation, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";


export const hideStyle = (scrollOffset: any) => useAnimatedStyle(() => {
    const headerHeightAnimated = interpolate(
        scrollOffset.value,
        [0, 50],
        [48, 0],
        Extrapolation.CLAMP
    );

    const headerOpacityAnimated = interpolate(
        scrollOffset.value,
        [0, 30],
        [1, 0],
        Extrapolation.CLAMP
    );

    return {
        height: withTiming(headerHeightAnimated, { duration: 200 }),
        opacity: withTiming(headerOpacityAnimated, { duration: 200 }),
    };
});

export const showStyle = (scrollOffset: any) => useAnimatedStyle(() => {
    const headerHeightAnimated = interpolate(
        scrollOffset.value,
        [0, 50],
        [0, 48],
        Extrapolation.CLAMP
    );

    const headerOpacityAnimated = interpolate(
        scrollOffset.value,
        [0, 50],
        [0, 1],
        Extrapolation.CLAMP
    );

    return {
        height: withTiming(headerHeightAnimated, { duration: 200 }),
        opacity: withTiming(headerOpacityAnimated, { duration: 200 }),
    };
});