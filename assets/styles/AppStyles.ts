import { StyleSheet } from "react-native";
import {Typography, Colors, Spacings} from 'react-native-ui-lib';

Colors.loadColors({
    primary: '#717658',
    secondary: '#A85A29',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
});

Typography.loadTypographies({
    h1: {fontSize: 16, fontWeight: '300', lineHeight: 18, fontFamily: 'SFProText-Regular'},
    h1_medium: {fontSize: 16, fontWeight: '500', lineHeight: 18, fontFamily: 'SFProText-Medium'},
    h1_bold: {fontSize: 16, lineHeight: 18, fontFamily: 'SFProText-Bold'},
    h1_semibold: {fontSize: 16, lineHeight: 18, fontFamily: 'SFProText-Semibold'},
    h2: {fontSize: 15, lineHeight: 16, fontFamily: 'SFProText-Regular'},
    h2_medium: {fontSize: 15, lineHeight: 16, fontFamily: 'SFProText-Medium'},
    h2_bold: {fontSize: 15, lineHeight: 16, fontFamily: 'SFProText-Bold'},
    h2_semibold: {fontSize: 15, lineHeight: 16, fontFamily: 'SFProText-Semibold'},
    h3: {fontSize: 13, lineHeight: 18, fontFamily: 'SFProText-Regular'},
    h3_medium: {fontSize: 13, lineHeight: 18, fontFamily: 'SFProText-Medium'},
    h3_bold: {fontSize: 13, lineHeight: 18, fontFamily: 'SFProText-Bold'},
    h3_semibold: {fontSize: 13, lineHeight: 18, fontFamily: 'SFProText-Semibold'},
});

export const AppStyles = StyleSheet.create({
    buttonFill: {
        backgroundColor: '#717658',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    buttonOutline: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderColor: '#717658',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
})