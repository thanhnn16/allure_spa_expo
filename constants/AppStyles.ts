import { StyleSheet } from "react-native";
import {Typography, Colors, Spacings, Button} from 'react-native-ui-lib';

Colors.loadColors({
    primary: '#717658',
    secondary: '#a85a29',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#F9FAFB',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
});

Typography.loadTypographies({
    h0: {fontSize: 24, fontWeight: '300', lineHeight: 30, fontFamily: 'SFProText-Regular'},
    h0_medium: {fontSize: 24, fontWeight: '500', lineHeight: 30, fontFamily: 'SFProText-Medium'},
    h0_bold: {fontSize: 24, fontWeight: '700', lineHeight: 30, fontFamily: 'SFProText-Bold'},
    h0_semibold: {fontSize: 24, fontWeight: '600', lineHeight: 30, fontFamily: 'SFProText-Semibold'},
    h1: {fontSize: 18, fontWeight: '300', lineHeight: 24, fontFamily: 'SFProText-Regular'},
    h1_medium: {fontSize: 18, fontWeight: '500', lineHeight: 24, fontFamily: 'SFProText-Medium'},
    h1_bold: {fontSize: 18, lineHeight: 24, fontFamily: 'SFProText-Bold'},
    h1_semibold: {fontSize: 18, lineHeight: 18, fontFamily: 'SFProText-Semibold'},
    h2: {fontSize: 15, lineHeight: 20, fontFamily: 'SFProText-Regular'},
    h2_medium: {fontSize: 15, lineHeight: 20, fontFamily: 'SFProText-Medium'},
    h2_bold: {fontSize: 15, lineHeight: 20, fontFamily: 'SFProText-Bold'},
    h2_semibold: {fontSize: 15, lineHeight: 20, fontFamily: 'SFProText-Semibold'},
    h3: {fontSize: 13, lineHeight: 22, fontFamily: 'SFProText-Regular'},
    h3_medium: {fontSize: 13, lineHeight: 22, fontFamily: 'SFProText-Medium'},
    h3_bold: {fontSize: 13, lineHeight: 22, fontFamily: 'SFProText-Bold'},
    h3_semibold: {fontSize: 13, lineHeight: 22, fontFamily: 'SFProText-Semibold'},
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
    },
    shadowItem: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: "#ffffff",
    }
})