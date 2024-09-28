import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import ScreenNavigations from './navigation/ScreenNavigations';

export default function Index() {

    return (
        <View style={styles.container}>
            <ScreenNavigations />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});