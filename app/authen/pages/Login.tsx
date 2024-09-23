import { StyleSheet, Text, View, Image, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// export type LoginProps = {
//     navigation: any
// }

export const Login = () => {
    const navigation = useNavigation();

    const handleRegisterNavigation = () => {
        navigation.navigate('Register');
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.iconallure}>
                <Image source={require('../../../assets/images/logo/nameAllure.png')} style={styles.centerLogo} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Go to Register" onPress={handleRegisterNavigation} />
                <Button title="Back" onPress={handleGoBack} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonTitle: {
        color: 'black',
    },
    iconallure: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerLogo: {
        width: 237,
        height: 175,
    },
    buttonContainer: {
        marginBottom: 100,// Adjust this value to move the buttons up
    },
});