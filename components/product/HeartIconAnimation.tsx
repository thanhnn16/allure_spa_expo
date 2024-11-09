import React, { useState, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';

// @ts-ignore
const HeartIconWithFireworks = ({ onPress }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [scaleValue] = useState(new Animated.Value(1));
    const lottieRef: any = useRef(null);

    const handleFavoritePress = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.5,
                duration: 200,
                easing: Easing.bounce,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 200,
                easing: Easing.bounce,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (!isFavorite && lottieRef.current) {
                lottieRef.current.play();
            }
            setIsFavorite(!isFavorite);
            if (onPress) {
                onPress();
            }
        });
    };

    return (
        <TouchableOpacity onPress={handleFavoritePress}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <AntDesign name={isFavorite ? "heart" : "hearto"} size={24} color={isFavorite ? "red" : "black"} />
            </Animated.View>
            <LottieView
                ref={lottieRef}
                source={require('../../assets/animations/fireworks.json')}
                autoPlay={false}
                loop={false}
                style={{ width: 100, height: 100, position: 'absolute', top: -40, right: -40 }}
            />
        </TouchableOpacity>
    );
};


export default HeartIconWithFireworks;
