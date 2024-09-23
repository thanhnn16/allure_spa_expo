import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TextSFProMedium extends TextProps {
    fontSize?: number; // Thêm thuộc tính tùy chọn cho kích thước chữ
    color?: string;    // Thêm thuộc tính tùy chọn cho màu chữ
}

const TextSFProMedium: React.FC<TextSFProMedium> = ({ fontSize, color, style, ...props }) => {
    return (
        <Text style={[styles.text, { fontSize, color }, style]} {...props} />
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'SFProText-Regular', // Đặt font mặc định
    },
});

export default TextSFProMedium;