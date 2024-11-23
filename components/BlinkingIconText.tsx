import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

const BlinkingIconText = () => {
    const blinkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [blinkAnim]);

    const blinkStyle = {
        opacity: blinkAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.5],
        }),
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={blinkStyle}>
                <Ionicons name="information-circle" size={32} color={Colors.primary} />
            </Animated.View>
            <Animated.Text style={[blinkStyle, { color: Colors.primary, fontSize: 16 }]}>
                {t("service.propose")}
            </Animated.Text>
        </View>
    );
};

export default BlinkingIconText;
