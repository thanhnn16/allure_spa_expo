import { StyleSheet, Text, View, Image, Button, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types'; // Adjust the import path according to your project structure

export const Onboard = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <ImageBackground source={require('../../../assets/images/logo/backround.png')} style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title="Get Started" onPress={() => navigation.navigate('Login')} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    centerLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});