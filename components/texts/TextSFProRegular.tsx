import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import { StyleSheet } from 'react-native';

const TextSFProRegular: React.FC<TextProps> = ({ style, ...props }) => {
    return (
        <Text style={[styles.text, style]} {...props} />
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SFProText-Regular', // Đặt font SFProText-Regular
    },
});

export default TextSFProRegular;