import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TextSFProBoldProps extends TextProps {
    fontSize?: number; // Kích thước chữ tùy chọn
    color?: string;    // Màu chữ tùy chọn
}

const TextSFProBold: React.FC<TextSFProBoldProps> = ({ fontSize, color, style, ...props }) => {
    return (
        <Text style={[styles.text, { fontSize, color }, style]} {...props} />
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SFProText-Bold', // Đặt font mặc định
    },
});

export default TextSFProBold;