import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from 'react-native-ui-lib';
import colors from '@/rn/colors';

export type SendButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const SendButton = ({ onPress, title = "Gửi mã OTP", buttonStyle, titleStyle }: SendButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, buttonStyle]}
            onPress={onPress}
        >
            <Text style={[styles.defaultTitleStyle, titleStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default SendButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 345,
        height: 50,
        borderRadius: 8,
        marginTop: 12,
        backgroundColor: colors.primary,
    },
    defaultTitleStyle: {
        color: colors.secondary,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
    },
});