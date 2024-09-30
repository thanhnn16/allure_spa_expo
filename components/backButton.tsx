import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from 'react-native-ui-lib';

export type BackButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const BackButton = ({ onPress, title = "Quay lại", buttonStyle, titleStyle }: BackButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, styles.defaultButtonStyle, buttonStyle]}
            onPress={onPress}
        >
            <Text style={[styles.defaultTitleStyle, titleStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default BackButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 345,
        height: 50,
        borderRadius: 8,
        marginTop: 12,
    },
    defaultButtonStyle: {
        backgroundColor: 'rgba(113, 118, 88, 0.2)',
    },
    defaultTitleStyle: {
        color: Colors.primary,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
    },
});